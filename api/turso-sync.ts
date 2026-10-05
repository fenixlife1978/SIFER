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
    await db.batch([
      {sql:`CREATE TABLE IF NOT EXISTS sifer_sync_operations (
        operation_id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        received_at TEXT NOT NULL
      )`,args:[]},
      {sql:`INSERT OR IGNORE INTO sifer_sync_operations(operation_id,type,payload_json,created_at,received_at)
        VALUES(?,?,?,?,?)`,args:[operationId,type,JSON.stringify(body.payload??null),String(body.createdAt||new Date().toISOString()),new Date().toISOString()]}
    ],'write');
    return res.status(200).json({ok:true,operationId});
  }catch(error:any){
    return res.status(503).json({ok:false,configured:true,error:String(error?.message||error)});
  }
}
