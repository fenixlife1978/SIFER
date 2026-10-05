import { createClient } from '@libsql/client';

function json(res:any,status:number,payload:any){return res.status(status).json(payload)}

export default async function handler(req:any,res:any){
  if(req.method!=='POST') return json(res,405,{ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL,authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken)return json(res,503,{ok:false,configured:false,error:'Turso no configurado'});
  const {cajaId,tipo}=req.body||{};
  const caja=String(cajaId||''),kind=String(tipo||'');
  if(!caja||!['VTA','DEV','Z'].includes(kind))return json(res,400,{ok:false,error:'cajaId y tipo válidos son obligatorios'});
  try{
    const db=createClient({url,authToken});
    const now=new Date().toISOString();
    await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_document_sequences(
      caja_id TEXT NOT NULL,tipo TEXT NOT NULL,next_number INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL,
      PRIMARY KEY(caja_id,tipo)
    )`,args:[]});
    await db.execute({sql:`INSERT OR IGNORE INTO sifer_document_sequences(caja_id,tipo,next_number,updated_at) VALUES(?,?,1,?)`,args:[caja,kind,now]});
    const r=await db.execute({sql:`UPDATE sifer_document_sequences SET next_number=next_number+1,updated_at=? WHERE caja_id=? AND tipo=? RETURNING next_number-1 AS reserved_number`,args:[now,caja,kind]});
    const n=Number(r.rows?.[0]?.reserved_number||0);
    if(!n)throw new Error('No se pudo reservar la numeración');
    return json(res,200,{ok:true,cajaId:caja,tipo:kind,number:n,documento:`${kind}-${String(n).padStart(5,'0')}`});
  }catch(error:any){
    return json(res,503,{ok:false,configured:true,error:String(error?.message||error)});
  }
}