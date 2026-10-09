import { createClient } from '@libsql/client';

async function cleanupKnownDemoData(db:any){
  await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_demo_migrations(id TEXT PRIMARY KEY,applied_at TEXT NOT NULL)`,args:[]});
  const applied=await db.execute({sql:`SELECT id FROM sifer_demo_migrations WHERE id='demo-cleanup-2026-10-08-v1' LIMIT 1`,args:[]});
  if(applied.rows?.length)return;
  await db.batch([
    {sql:`CREATE TABLE IF NOT EXISTS sifer_sales(numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,total REAL NOT NULL,subtotal REAL NOT NULL DEFAULT 0,impuesto REAL NOT NULL DEFAULT 0,pagado REAL NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,tipo TEXT,documento_origen TEXT,caja_id TEXT,operador_id TEXT,created_at TEXT NOT NULL)`,args:[]},
    {sql:`CREATE TABLE IF NOT EXISTS sifer_sale_lines(sale_number TEXT NOT NULL,product_id TEXT NOT NULL,qty REAL NOT NULL,price REAL NOT NULL,discount REAL NOT NULL DEFAULT 0,PRIMARY KEY(sale_number,product_id))`,args:[]},
    {sql:`CREATE TABLE IF NOT EXISTS sifer_purchases(numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,proveedor_id TEXT,proveedor TEXT,total REAL NOT NULL DEFAULT 0,pagado REAL NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,tipo TEXT,created_at TEXT NOT NULL)`,args:[]},
    {sql:`CREATE TABLE IF NOT EXISTS sifer_purchase_lines(purchase_number TEXT NOT NULL,product_id TEXT NOT NULL,qty REAL NOT NULL,cost REAL NOT NULL,PRIMARY KEY(purchase_number,product_id))`,args:[]},
    {sql:`CREATE TABLE IF NOT EXISTS sifer_accounts_payable(id TEXT PRIMARY KEY,documento TEXT UNIQUE NOT NULL,proveedor_id TEXT,proveedor TEXT,total REAL NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,fecha TEXT NOT NULL,estado TEXT NOT NULL DEFAULT 'Pendiente',created_at TEXT NOT NULL)`,args:[]},
    {sql:`CREATE TABLE IF NOT EXISTS sifer_inventory(product_id TEXT PRIMARY KEY,stock REAL NOT NULL DEFAULT 0,min_stock REAL NOT NULL DEFAULT 0,updated_at TEXT NOT NULL)`,args:[]},
    {sql:`CREATE TABLE IF NOT EXISTS sifer_inventory_ledger(operation_id TEXT NOT NULL,documento TEXT NOT NULL,product_id TEXT NOT NULL,qty_delta REAL NOT NULL,reason TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(operation_id,product_id))`,args:[]},
    {sql:`CREATE TABLE IF NOT EXISTS sifer_sync_operations(operation_id TEXT PRIMARY KEY,type TEXT NOT NULL,payload_json TEXT NOT NULL,created_at TEXT NOT NULL,received_at TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'processing')`,args:[]}
  ],'write');
  // The known test run contained exactly two sales totaling $75.97. Only remove that exact fingerprint.
  const sales=await db.execute({sql:`SELECT numero,total FROM sifer_sales ORDER BY created_at`,args:[]});
  const salesTotal=(sales.rows||[]).reduce((sum:any,x:any)=>sum+Number(x.total||0),0);
  if(sales.rows?.length===2&&Math.abs(salesTotal-75.97)<0.02){
    const nums=sales.rows.map((x:any)=>String(x.numero));
    const marks=nums.map(()=>'?').join(',');
    const ledger=await db.execute({sql:`SELECT product_id,SUM(qty_delta) AS qty FROM sifer_inventory_ledger WHERE documento IN (${marks}) AND reason IN ('sale','return') GROUP BY product_id`,args:nums});
    for(const row of ledger.rows||[]){await db.execute({sql:`UPDATE sifer_inventory SET stock=MAX(0,stock-?),updated_at=? WHERE product_id=?`,args:[Number(row.qty||0),new Date().toISOString(),String(row.product_id)]});}
    await db.execute({sql:`DELETE FROM sifer_inventory_ledger WHERE documento IN (${marks})`,args:nums});
    await db.execute({sql:`DELETE FROM sifer_sale_lines WHERE sale_number IN (${marks})`,args:nums});
    await db.execute({sql:`DELETE FROM sifer_sales WHERE numero IN (${marks})`,args:nums});
  }
  // Remove the two explicitly recorded test purchases and reverse only their purchase-ledger deltas.
  const docs=['CMP-00001','CMP-00002'];
  const ledger=await db.execute({sql:`SELECT product_id,SUM(qty_delta) AS qty FROM sifer_inventory_ledger WHERE documento IN (?,?) AND reason='purchase' GROUP BY product_id`,args:docs});
  for(const row of ledger.rows||[]){await db.execute({sql:`UPDATE sifer_inventory SET stock=MAX(0,stock-?),updated_at=? WHERE product_id=?`,args:[Number(row.qty||0),new Date().toISOString(),String(row.product_id)]});}
  await db.execute({sql:`DELETE FROM sifer_inventory_ledger WHERE documento IN (?,?) AND reason='purchase'`,args:docs});
  await db.execute({sql:`DELETE FROM sifer_purchase_lines WHERE purchase_number IN (?,?)`,args:docs});
  await db.execute({sql:`DELETE FROM sifer_purchases WHERE numero IN (?,?)`,args:docs});
  await db.execute({sql:`DELETE FROM sifer_accounts_payable WHERE documento IN (?,?)`,args:docs});
  await db.execute({sql:`DELETE FROM sifer_sync_operations WHERE payload_json LIKE '%CMP-00001%' OR payload_json LIKE '%CMP-00002%'`,args:[]});
  await db.execute({sql:`INSERT OR IGNORE INTO sifer_demo_migrations(id,applied_at) VALUES('demo-cleanup-2026-10-08-v1',?)`,args:[new Date().toISOString()]});
}

export default async function handler(req:any,res:any){
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL, authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken) return res.status(503).json({ok:false,error:'Turso no configurado'});
  const db=createClient({url,authToken});
  const query=String(req.query?.query||'').toLowerCase();
  try{
    await cleanupKnownDemoData(db);
    if(query==='today-sales'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sales (
        numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,total REAL NOT NULL,
        subtotal REAL NOT NULL DEFAULT 0,impuesto REAL NOT NULL DEFAULT 0,pagado REAL NOT NULL DEFAULT 0,
        saldo REAL NOT NULL DEFAULT 0,tipo TEXT,documento_origen TEXT,caja_id TEXT,operador_id TEXT,created_at TEXT NOT NULL
      )`,args:[]});
      const r=await db.execute({sql:`SELECT numero,fecha,total,pagado,saldo,tipo FROM sifer_sales
        WHERE date(substr(fecha,1,10),'localtime')=date('now','localtime')
        ORDER BY created_at DESC`,args:[]});
      const sales=r.rows.filter((x:any)=>String(x.tipo||'').toLowerCase()!=='anulada');
      return res.status(200).json({ok:true,query:'today-sales',count:sales.length,total:sales.reduce((s:any,x:any)=>s+Number(x.total)||0,0),sales});
    }
    if(query==='cxc'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sales (
        numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,cliente_id TEXT,cliente TEXT,total REAL NOT NULL,
        subtotal REAL NOT NULL DEFAULT 0,impuesto REAL NOT NULL DEFAULT 0,pagado REAL NOT NULL DEFAULT 0,
        saldo REAL NOT NULL DEFAULT 0,tipo TEXT,documento_origen TEXT,caja_id TEXT,operador_id TEXT,created_at TEXT NOT NULL
      )`,args:[]});
      const r=await db.execute({sql:`SELECT numero,fecha,cliente_id,cliente,total,pagado,saldo,tipo FROM sifer_sales
        WHERE saldo>0 AND lower(coalesce(tipo,'')) NOT IN ('anulada','cancelada')
        ORDER BY fecha ASC,created_at ASC`,args:[]});
      const items=r.rows.map((x:any)=>({...x,total:Number(x.total||0),pagado:Number(x.pagado||0),saldo:Number(x.saldo||0)}));
      return res.status(200).json({ok:true,query:'cxc',count:items.length,total:items.reduce((s:any,x:any)=>s+x.total,0),pagado:items.reduce((s:any,x:any)=>s+x.pagado,0),saldo:items.reduce((s:any,x:any)=>s+x.saldo,0),items});
    }
    if(query==='cxp'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_accounts_payable (
        id TEXT PRIMARY KEY,documento TEXT UNIQUE NOT NULL,proveedor_id TEXT,proveedor TEXT,
        total REAL NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,fecha TEXT NOT NULL,vencimiento TEXT,
        estado TEXT NOT NULL DEFAULT 'Pendiente',created_at TEXT NOT NULL
      )`,args:[]});
      try{await db.execute({sql:'ALTER TABLE sifer_accounts_payable ADD COLUMN vencimiento TEXT',args:[]})}catch(e){}
      const r=await db.execute({sql:`SELECT documento,proveedor_id AS proveedorId,proveedor,total,saldo,fecha,vencimiento,estado FROM sifer_accounts_payable
        WHERE saldo>0 AND lower(coalesce(estado,'')) NOT IN ('pagado','anulada','cancelada') ORDER BY fecha ASC,created_at ASC`,args:[]});
      const items=r.rows.map((x:any)=>({...x,total:Number(x.total||0),saldo:Number(x.saldo||0)}));
      return res.status(200).json({ok:true,query:'cxp',count:items.length,total:items.reduce((s:any,x:any)=>s+x.total,0),saldo:items.reduce((s:any,x:any)=>s+x.saldo,0),items});
    }
    if(query==='purchases'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_purchases(
        numero TEXT PRIMARY KEY,fecha TEXT NOT NULL,proveedor_id TEXT,proveedor TEXT,total REAL NOT NULL DEFAULT 0,
        pagado REAL NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,tipo TEXT,created_at TEXT NOT NULL,payload_json TEXT NOT NULL DEFAULT '{}'
      )`,args:[]});
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_purchase_lines(
        purchase_number TEXT NOT NULL,product_id TEXT NOT NULL,qty REAL NOT NULL,cost REAL NOT NULL,details_json TEXT NOT NULL DEFAULT '{}',
        PRIMARY KEY(purchase_number,product_id)
      )`,args:[]});
      try{await db.execute({sql:"ALTER TABLE sifer_purchases ADD COLUMN payload_json TEXT NOT NULL DEFAULT '{}'",args:[]})}catch(e){}
      try{await db.execute({sql:"ALTER TABLE sifer_purchase_lines ADD COLUMN details_json TEXT NOT NULL DEFAULT '{}'",args:[]})}catch(e){}
      const rows=await db.execute({sql:`SELECT numero,fecha,proveedor_id AS proveedorId,proveedor,total,pagado,saldo,tipo,created_at,payload_json
        FROM sifer_purchases ORDER BY fecha DESC,created_at DESC`,args:[]});
      const items:any[]=[];
      for(const row of rows.rows||[]){
        let p:any={};try{p=JSON.parse(String(row.payload_json||'{}'))||{}}catch(e){}
        if(!p.numero){
          const lines=await db.execute({sql:`SELECT l.product_id AS id,l.qty AS qty,l.cost AS costo,p.codigo,p.nombre AS descripcion,l.details_json
            FROM sifer_purchase_lines l LEFT JOIN sifer_products p ON p.id=l.product_id WHERE l.purchase_number=?`,args:[String(row.numero)]});
          p={numero:String(row.numero),fecha:String(row.fecha||''),proveedorId:row.proveedorId??null,proveedor:String(row.proveedor||''),
            total:Number(row.total||0),pagado:Number(row.pagado||0),saldo:Number(row.saldo||0),tipo:String(row.tipo||'Contado'),
            lineas:(lines.rows||[]).map((line:any)=>{let detail:any={};try{detail=JSON.parse(String(line.details_json||'{}'))||{}}catch(e){};return {...detail,id:String(line.id),qty:Number(line.qty||0),cantidad:Number(line.qty||0),costo:Number(line.costo||0),codigo:detail.codigo||line.codigo||'',descripcion:detail.descripcion||line.descripcion||''}})};
        }
        items.push({...p,numero:String(p.numero||row.numero),fecha:String(p.fecha||row.fecha||''),proveedor:String(p.proveedor||row.proveedor||''),
          proveedorId:p.proveedorId??row.proveedorId??null,total:Number(p.total??row.total)||0,pagado:Number(p.pagado??row.pagado)||0,
          saldo:Number(p.saldo??row.saldo)||0,tipo:p.tipo||row.tipo||'Contado'});
      }
      return res.status(200).json({ok:true,query:'purchases',count:items.length,items});
    }
    if(query==='cash'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_cash_registers(
        id TEXT PRIMARY KEY,nombre TEXT NOT NULL,abierta INTEGER NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,
        apertura TEXT,ultimo_corte_at TEXT,seq_venta INTEGER NOT NULL DEFAULT 1,seq_devolucion INTEGER NOT NULL DEFAULT 1,
        seq_z INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL
      )`,args:[]});
      const bad=await db.execute({sql:`SELECT id FROM sifer_cash_registers WHERE id='CAJA-NaN' LIMIT 1`,args:[]});
      const valid=await db.execute({sql:`SELECT id FROM sifer_cash_registers WHERE id='CAJA-02' LIMIT 1`,args:[]});
      if(bad.rows?.length && !valid.rows?.length){
        await db.execute({sql:`UPDATE sifer_cash_registers SET id='CAJA-02',nombre=CASE WHEN trim(nombre)='' THEN 'Caja 2' ELSE nombre END WHERE id='CAJA-NaN'`,args:[]});
        for(const table of ['sifer_sales','sifer_customer_orders']){try{await db.execute({sql:`UPDATE ${table} SET caja_id='CAJA-02' WHERE caja_id='CAJA-NaN'`,args:[]})}catch(e){}}
      }
      const r=await db.execute({sql:`SELECT id,nombre,abierta,saldo,apertura,ultimo_corte_at,seq_venta,seq_devolucion,seq_z,updated_at
        FROM sifer_cash_registers ORDER BY nombre,id`,args:[]});
      const items=r.rows.map((x:any)=>({...x,abierta:Number(x.abierta||0)===1,saldo:Number(x.saldo||0),seq_venta:Number(x.seq_venta||1),seq_devolucion:Number(x.seq_devolucion||1),seq_z:Number(x.seq_z||1)}));
      return res.status(200).json({ok:true,query:'cash',count:items.length,open:items.filter((x:any)=>x.abierta),items});
    }
    if(query==='last-z'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_cash_registers(
        id TEXT PRIMARY KEY,nombre TEXT NOT NULL,abierta INTEGER NOT NULL DEFAULT 0,saldo REAL NOT NULL DEFAULT 0,
        apertura TEXT,ultimo_corte_at TEXT,seq_venta INTEGER NOT NULL DEFAULT 1,seq_devolucion INTEGER NOT NULL DEFAULT 1,
        seq_z INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL
      )`,args:[]});
      const r=await db.execute({sql:`SELECT id,nombre,abierta,saldo,apertura,ultimo_corte_at,seq_z
        FROM sifer_cash_registers WHERE ultimo_corte_at IS NOT NULL ORDER BY ultimo_corte_at DESC LIMIT 1`,args:[]});
      const x=r.rows?.[0];
      return res.status(200).json({ok:true,query:'last-z',found:!!x,item:x?{...x,abierta:Number(x.abierta||0)===1,saldo:Number(x.saldo||0),seq_z:Number(x.seq_z||1)}:null});
    }
    if(query==='inventory'){
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_inventory (
        product_id TEXT PRIMARY KEY,stock REAL NOT NULL DEFAULT 0,min_stock REAL NOT NULL DEFAULT 0,updated_at TEXT NOT NULL
      )`,args:[]});
      await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_products (
        id TEXT PRIMARY KEY,codigo TEXT,nombre TEXT NOT NULL,categoria TEXT,marca TEXT,unidad TEXT,
        costo REAL NOT NULL DEFAULT 0,precio REAL NOT NULL DEFAULT 0,imagen TEXT,fuente_url TEXT,estado_verificacion TEXT,updated_at TEXT NOT NULL
      )`,args:[]});
      try{await db.execute({sql:'ALTER TABLE sifer_products ADD COLUMN fuente_url TEXT',args:[]})}catch(e){}
      try{await db.execute({sql:'ALTER TABLE sifer_products ADD COLUMN estado_verificacion TEXT',args:[]})}catch(e){}
      const r=await db.execute({sql:`SELECT p.id,p.codigo,p.nombre,p.categoria,p.marca,p.unidad,p.costo,p.precio,p.fuente_url AS fuenteUrl,p.estado_verificacion AS estadoVerificacion,
        i.stock,i.min_stock AS min FROM sifer_products p LEFT JOIN sifer_inventory i ON i.product_id=p.id
        ORDER BY p.nombre`,args:[]});
      const items=r.rows.map((x:any)=>({...x,stock:Number(x.stock||0),min:Number(x.min||0)}));
      return res.status(200).json({ok:true,query:'inventory',count:items.length,available:items.filter((x:any)=>x.stock>0).length,units:items.reduce((s:any,x:any)=>s+x.stock,0),items});
    }
    return res.status(400).json({ok:false,error:'Consulta no soportada'});
  }catch(error:any){
    return res.status(503).json({ok:false,error:String(error?.message||error)});
  }
}