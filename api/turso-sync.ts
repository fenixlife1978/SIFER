import { createClient } from '@libsql/client';

export default async function handler(req:any,res:any){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL, authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken) return res.status(503).json({ok:false,configured:false,error:'Turso no configurado'});
  const body=req.body||{};
  // La primera etapa solo registra operaciones de forma idempotente. La aplicación de
  // cada dominio (ventas, inventario, caja) se habilitará después de definir su esquema. 
  const operationId=String(body.operationId||'');
  const type=String(body.type||'');
  if(!operationId||!type) return res.status(400).json({ok:false,error:'operationId y type son obligatorios'});
  try{
    const db=createClient({url,authToken});
    await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sync_operations (
      operation_id TEXT PRIMARY KEY,type TEXT NOT NULL,payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,received_at TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'processing'
    )`,args:[]});
    try{await db.execute({sql:"ALTER TABLE sifer_sync_operations ADD COLUMN status TEXT NOT NULL DEFAULT 'processing'",args:[]})}catch(e){}
    const claim=await db.execute({sql:`INSERT OR IGNORE INTO sifer_sync_operations(operation_id,type,payload_json,created_at,received_at,status)
      VALUES(?,?,?,?,?,'processing')`,args:[operationId,type,JSON.stringify(body.payload??null),String(body.createdAt||new Date().toISOString()),new Date().toISOString()]});
    if(!claim.rowsAffected){
      const existing=await db.execute({sql:'SELECT status FROM sifer_sync_operations WHERE operation_id=? LIMIT 1',args:[operationId]});
      const status=String(existing.rows?.[0]?.status||'processing');
      if(status==='applied')return res.status(200).json({ok:true,duplicate:true,operationId});
      if(status==='processing')return res.status(409).json({ok:false,duplicate:true,inProgress:true,error:'La operación ya está siendo procesada',operationId});
      await db.execute({sql:"UPDATE sifer_sync_operations SET status='processing',received_at=? WHERE operation_id=?",args:[new Date().toISOString(),operationId]});
    }
    await db.batch([
      {sql:`CREATE TABLE IF NOT EXISTS sifer_products (
        id TEXT PRIMARY KEY,codigo TEXT,nombre TEXT NOT NULL,categoria TEXT,marca TEXT,unidad TEXT,
        costo REAL NOT NULL DEFAULT 0,precio REAL NOT NULL DEFAULT 0,imagen TEXT,updated_at TEXT NOT NULL,detalles_json TEXT NOT NULL DEFAULT '{}'
      )`,args:[]},
      {sql:`CREATE TABLE IF NOT EXISTS sifer_inventory (
        product_id TEXT PRIMARY KEY,stock REAL NOT NULL DEFAULT 0,min_stock REAL NOT NULL DEFAULT 0,updated_at TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES sifer_products(id)
      )`,args:[]}
    ],'write');
    try{await db.execute({sql:'ALTER TABLE sifer_products ADD COLUMN fuente_url TEXT',args:[]})}catch(e){}
    try{await db.execute({sql:'ALTER TABLE sifer_products ADD COLUMN estado_verificacion TEXT',args:[]})}catch(e){}
    try{await db.execute({sql:"ALTER TABLE sifer_products ADD COLUMN detalles_json TEXT NOT NULL DEFAULT '{}'",args:[]})}catch(e){}
    if(type==='sale-created'){
      const sale=body.payload?.sale;
      if(sale?.numero){
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sales (
          numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,total REAL NOT NULL,
          subtotal REAL NOT NULL DEFAULT 0,impuesto REAL NOT NULL DEFAULT 0,pagado REAL NOT NULL DEFAULT 0,
          saldo REAL NOT NULL DEFAULT 0,tipo TEXT,documento_origen TEXT,caja_id TEXT,operador_id TEXT,created_at TEXT NOT NULL
        )`,args:[]});
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sale_lines (
          sale_number TEXT NOT NULL,product_id TEXT NOT NULL,qty REAL NOT NULL,price REAL NOT NULL,discount REAL NOT NULL DEFAULT 0,
          PRIMARY KEY(sale_number,product_id),FOREIGN KEY(sale_number) REFERENCES sifer_sales(numero)
        )`,args:[]});
        await db.execute({sql:`INSERT OR IGNORE INTO sifer_sales(numero,fecha,cliente_id,cliente,total,subtotal,impuesto,pagado,saldo,tipo,documento_origen,caja_id,operador_id,created_at)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,args:[
            String(sale.numero),String(sale.fecha||''),sale.clienteId??null,sale.cliente??'Cliente general',
            Number(sale.total)||0,Number(sale.subtotal)||0,Number(sale.impuesto)||0,Number(sale.pagado)||0,
            Number(sale.saldo)||0,sale.tipo??'',sale.documentoOrigen??null,sale.cajaId??null,sale.operadorId??null,new Date().toISOString()
        ]});
        const lines=Array.isArray(sale.lineas)?sale.lineas:[];
        const stmts=lines.filter((l:any)=>l?.id).map((l:any)=>({sql:`INSERT OR IGNORE INTO sifer_sale_lines(sale_number,product_id,qty,price,discount) VALUES(?,?,?,?,?)`,args:[
          String(sale.numero),String(l.id),Number(l.qty)||0,Number(l.price)||0,Number(l.disc)||0
        ]}));
        if(stmts.length)await db.batch(stmts,'write');
      }
    }
    if(type==='order-created'){
      const order=body.payload?.order;
      if(order?.id){
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_customer_orders(
          id TEXT PRIMARY KEY,numero TEXT UNIQUE NOT NULL,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,
          operador_id TEXT,operador TEXT,estado TEXT NOT NULL,total REAL NOT NULL,payload_json TEXT NOT NULL,
          caja_id TEXT,created_at TEXT NOT NULL
        )`,args:[]});
        await db.execute({sql:`INSERT OR IGNORE INTO sifer_customer_orders
          (id,numero,fecha,cliente_id,cliente,operador_id,operador,estado,total,payload_json,caja_id,created_at)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`,args:[
          String(order.id),String(order.numero),String(order.fecha||''),order.clienteId??null,order.cliente??'Cliente general',
          order.operadorId??null,order.operador??'',order.estado??'Pendiente',Number(order.total)||0,
          JSON.stringify(order),order.cajaId??null,new Date().toISOString()
        ]});
      }
    }
    if(type==='cash-register-upsert'){
      const box=body.payload?.caja;
      if(box?.id){
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_cash_registers(
          id TEXT PRIMARY KEY,nombre TEXT NOT NULL,abierta INTEGER NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,
          apertura TEXT,ultimo_corte_at TEXT,seq_venta INTEGER NOT NULL DEFAULT 1,seq_devolucion INTEGER NOT NULL DEFAULT 1,
          seq_z INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL
        )`,args:[]});
        await db.execute({sql:`INSERT INTO sifer_cash_registers(id,nombre,abierta,saldo,apertura,ultimo_corte_at,seq_venta,seq_devolucion,seq_z,updated_at)
          VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET nombre=excluded.nombre,abierta=excluded.abierta,
          saldo=excluded.saldo,apertura=excluded.apertura,ultimo_corte_at=excluded.ultimo_corte_at,
          seq_venta=excluded.seq_venta,seq_devolucion=excluded.seq_devolucion,seq_z=excluded.seq_z,updated_at=excluded.updated_at`,
          args:[String(box.id),String(box.nombre||box.id),box.abierta?1:0,Number(box.saldo)||0,box.apertura??null,box.ultimoCorteAt??null,
          Number(box.seqVenta)||1,Number(box.seqDevolucion)||1,Number(box.seqZ)||1,new Date().toISOString()]});
      }
    }
    if(type==='purchase-created'){
      const purchase=body.payload?.purchase;
      const lines=Array.isArray(purchase?.lineas)?purchase.lineas:[];
      if(purchase?.numero){
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_purchases (
          numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,proveedor_id TEXT,proveedor TEXT,total REAL NOT NULL DEFAULT 0,
          pagado REAL NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,tipo TEXT,created_at TEXT NOT NULL
        )`,args:[]});
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_purchase_lines (
          purchase_number TEXT NOT NULL,product_id TEXT NOT NULL,qty REAL NOT NULL,cost REAL NOT NULL,
          PRIMARY KEY(purchase_number,product_id),FOREIGN KEY(purchase_number) REFERENCES sifer_purchases(numero)
        )`,args:[]});
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_accounts_payable (
          id TEXT PRIMARY KEY,documento TEXT UNIQUE NOT NULL,proveedor_id TEXT,proveedor TEXT,
          total REAL NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,fecha TEXT NOT NULL,
          estado TEXT NOT NULL DEFAULT 'Pendiente',created_at TEXT NOT NULL
        )`,args:[]});
        await db.execute({sql:`INSERT OR IGNORE INTO sifer_purchases(numero,fecha,proveedor_id,proveedor,total,pagado,saldo,tipo,created_at)
          VALUES(?,?,?,?,?,?,?,?,?)`,args:[
          String(purchase.numero),String(purchase.fecha||''),purchase.proveedorId??null,purchase.proveedor??'',
          Number(purchase.total)||0,Number(purchase.pagado)||0,Number(purchase.saldo)||0,purchase.tipo??'',new Date().toISOString()
        ]});
        const stmts=lines.filter((l:any)=>l?.id).map((l:any)=>({sql:`INSERT OR IGNORE INTO sifer_purchase_lines(purchase_number,product_id,qty,cost)
          VALUES(?,?,?,?)`,args:[String(purchase.numero),String(l.id),Number(l.qty)||0,Number(l.costo)||0]}));
        if(stmts.length)await db.batch(stmts,'write');

        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_inventory_ledger (
          operation_id TEXT NOT NULL,documento TEXT NOT NULL,product_id TEXT NOT NULL,qty_delta REAL NOT NULL,
          reason TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(operation_id,product_id)
        )`,args:[]});
        const now=new Date().toISOString();
        for(const l of lines.filter((x:any)=>x?.id)){
          const pid=String(l.id),delta=Math.max(0,Number(l.qty)||0);
          const inserted=await db.execute({sql:`INSERT OR IGNORE INTO sifer_inventory_ledger(operation_id,documento,product_id,qty_delta,reason,created_at)
            VALUES(?,?,?,?,?,?)`,args:[operationId,String(purchase.numero),pid,delta,'purchase',now]});
          if(!inserted.rowsAffected)continue;
          await db.execute({sql:`INSERT INTO sifer_inventory(product_id,stock,min_stock,updated_at)
            VALUES(?,?,0,?) ON CONFLICT(product_id) DO UPDATE SET stock=stock+excluded.stock,updated_at=excluded.updated_at`,
            args:[pid,delta,now]});
        }
        if(Number(purchase.saldo)>0){
          await db.execute({sql:`INSERT OR IGNORE INTO sifer_accounts_payable(id,documento,proveedor_id,proveedor,total,saldo,fecha,estado,created_at)
            VALUES(?,?,?,?,?,?,?,?,?)`,args:[
            'CXP-'+String(purchase.numero),String(purchase.numero),purchase.proveedorId??null,purchase.proveedor??'',
            Number(purchase.total)||0,Number(purchase.saldo)||0,String(purchase.fecha||''),'Pendiente',now
          ]});
        }
      }
    }
    if(type==='sale-created'){
      const sale=body.payload?.sale;
      const lines=Array.isArray(sale?.lineas)?sale.lineas:[];
      if(sale?.numero){
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_inventory_ledger (
          operation_id TEXT NOT NULL,documento TEXT NOT NULL,product_id TEXT NOT NULL,qty_delta REAL NOT NULL,
          reason TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(operation_id,product_id)
        )`,args:[]});
        const now=new Date().toISOString();
        await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_order_reservations(
          order_id TEXT NOT NULL,product_id TEXT NOT NULL,qty REAL NOT NULL,reserved_at TEXT NOT NULL,
          PRIMARY KEY(order_id,product_id)
        )`,args:[]});
        // Cada fila del ledger es la unidad idempotente de inventario. Solo aplicamos
        // el delta cuando esta solicitud logró insertar la fila; un reintento después
        // de un fallo parcial no vuelve a descontar/abonar el inventario.
        for(const l of lines.filter((x:any)=>x?.id)){
          const pid=String(l.id),delta=-(Number(l.qty)||0);
          const inserted=await db.execute({sql:`INSERT OR IGNORE INTO sifer_inventory_ledger(operation_id,documento,product_id,qty_delta,reason,created_at) VALUES(?,?,?,?,?,?)`,
            args:[operationId,String(sale.numero),pid,delta,String(sale.total<0?'return':'sale'),now]});
          if(!inserted.rowsAffected) continue;
          const reservation=await db.execute({sql:`SELECT r.order_id,r.qty FROM sifer_order_reservations r
            JOIN sifer_customer_orders o ON o.id=r.order_id
            WHERE r.product_id=? AND json_extract(o.payload_json,'$.saleNumber')=? LIMIT 1`,args:[pid,String(sale.numero)]});
          if(!reservation.rows.length){
            await db.execute({sql:`INSERT INTO sifer_inventory(product_id,stock,min_stock,updated_at)
              VALUES(?,?,0,?) ON CONFLICT(product_id) DO UPDATE SET stock=stock+excluded.stock,updated_at=excluded.updated_at`,
              args:[pid,delta,now]});
          }
        }
        if(sale.documentoOrigen){
          // Devoluciones de una venta reservada no son una liberación de reserva.
        }
      }
    }
    if(type==='product-upsert'){
      const p=body.payload?.product;
      if(!p?.id||!p?.nombre||!String(p.codigo||'').trim())throw new Error('La sincronización del producto requiere ID, código y descripción.');
      const now=new Date().toISOString();
      await db.execute({sql:\`INSERT INTO sifer_products(id,codigo,nombre,categoria,marca,unidad,costo,precio,imagen,fuente_url,estado_verificacion,detalles_json,updated_at)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET codigo=excluded.codigo,nombre=excluded.nombre,categoria=excluded.categoria,marca=excluded.marca,
        unidad=excluded.unidad,costo=excluded.costo,precio=excluded.precio,imagen=excluded.imagen,fuente_url=excluded.fuente_url,
        estado_verificacion=excluded.estado_verificacion,detalles_json=excluded.detalles_json,updated_at=excluded.updated_at\`,
        args:[String(p.id),String(p.codigo),String(p.nombre),p.categoria??'',p.marca??'',p.unidad??'',Number(p.costo)||0,Number(p.precio)||0,p.imagen??'',p.fuenteUrl??'',p.estadoVerificacion??'',JSON.stringify(p.detalles||{}),now]});
      const current=await db.execute({sql:'SELECT stock FROM sifer_inventory WHERE product_id=? LIMIT 1',args:[String(p.id)]});
      if(current.rows.length)await db.execute({sql:'UPDATE sifer_inventory SET min_stock=?,updated_at=? WHERE product_id=?',args:[Math.max(0,Number(p.min)||0),now,String(p.id)]});
      else await db.execute({sql:'INSERT INTO sifer_inventory(product_id,stock,min_stock,updated_at) VALUES(?,?,?,?)',args:[String(p.id),Math.max(0,Number(body.payload?.initialStock)||0),Math.max(0,Number(p.min)||0),now]});
    }
    if(type==='products-inventory-snapshot'){
      const products=Array.isArray(body.payload?.products)?body.payload.products:[];
      if(products.length){
        const now=new Date().toISOString();
        const stmts:any[]=[];
        for(const p of products){
          if(!p?.id||!p?.nombre) continue;
          stmts.push(
            {sql:`INSERT INTO sifer_products(id,codigo,nombre,categoria,marca,unidad,costo,precio,imagen,fuente_url,estado_verificacion,detalles_json,updated_at)
              VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
              ON CONFLICT(id) DO UPDATE SET
                fuente_url=CASE WHEN coalesce(sifer_products.fuente_url,'')='' THEN excluded.fuente_url ELSE sifer_products.fuente_url END,
                estado_verificacion=CASE WHEN coalesce(sifer_products.estado_verificacion,'')='' THEN excluded.estado_verificacion ELSE sifer_products.estado_verificacion END`,
             args:[String(p.id),p.codigo??'',p.nombre,p.categoria??'',p.marca??'',p.unidad??'',Number(p.costo)||0,Number(p.precio)||0,p.imagen??'',p.fuenteUrl??'',p.estadoVerificacion??'',JSON.stringify(p.detalles||{}),now]},
            {sql:`INSERT OR IGNORE INTO sifer_inventory(product_id,stock,min_stock,updated_at)
              VALUES(?,?,?,?)`,
             args:[String(p.id),Number(p.stock)||0,Number(p.min)||0,now]}
          );
        }
        if(stmts.length) await db.batch(stmts,'write');
      }
    }
    await db.execute({sql:"UPDATE sifer_sync_operations SET status='applied',received_at=? WHERE operation_id=?",args:[new Date().toISOString(),operationId]});
    return res.status(200).json({ok:true,operationId});
  }catch(error:any){
    try{
      const db=createClient({url,authToken});
      await db.execute({sql:"UPDATE sifer_sync_operations SET status='failed',received_at=? WHERE operation_id=?",args:[new Date().toISOString(),operationId]});
    }catch(e){}
    return res.status(503).json({ok:false,configured:true,error:String(error?.message||error),operationId});
  }
}
