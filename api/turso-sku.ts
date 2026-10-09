import { createClient } from '@libsql/client';

function json(res:any,status:number,payload:any){return res.status(status).json(payload)}
function categoryCode(value:any){
  const raw=String(value||'GEN').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  const rules:[RegExp,string][]=[
    [/BUJIA|BUJIAS|SPARK/, 'BUJ'],[/FILTRO|FILTER/,'FIL'],[/LUBRIC|ACEITE|OIL/,'LUB'],
    [/FRENO|BRAKE/,'FRE'],[/SUSPENSION|SUSPEN/,'SUS'],[/DIRECCION|STEERING/,'DIR'],
    [/ENCENDIDO|IGNITION/,'ENC'],[/ELECTRIC|ELECTRICO|SENSOR|BOMBA/,'ELE'],
    [/MOTOR|ENGINE/,'MOT'],[/DISTRIBUCION|CORREA/,'DIS'],[/RODAMIENTO|BEARING/,'ROD'],
    [/BATERIA|BATTERY/,'BAT'],[/REFRIGER|RADIADOR/,'REF'],[/TRANSMISION|CLUTCH|CLOCHE/,'TRA']
  ];
  for(const [re,code] of rules)if(re.test(raw))return code;
  return raw.replace(/[^A-Z0-9]+/g,'').slice(0,3)||'GEN';
}

export default async function handler(req:any,res:any){
  if(req.method!=='POST')return json(res,405,{ok:false,error:'Method not allowed'});
  const url=process.env.TURSO_DATABASE_URL,authToken=process.env.TURSO_AUTH_TOKEN;
  if(!url||!authToken)return json(res,503,{ok:false,configured:false,error:'Turso no configurado'});
  const category=categoryCode(req.body?.category);
  try{
    const db=createClient({url,authToken});
    await db.execute({sql:`CREATE TABLE IF NOT EXISTS sifer_sku_sequences(category_code TEXT PRIMARY KEY,next_number INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL)`,args:[]});
    let seed=1;
    try{
      const r=await db.execute({sql:'SELECT codigo,detalles_json FROM sifer_products',args:[]});
      for(const row of r.rows||[]){
        const candidates=[String(row.codigo||'')];
        try{const d=JSON.parse(String(row.detalles_json||'{}'));candidates.push(String(d.sku||''));}catch(e){}
        for(const value of candidates){const m=value.match(/^SKU-([A-Z0-9]+)-(\d+)$/i);if(m&&m[1].toUpperCase()===category)seed=Math.max(seed,Number(m[2])+1);}
      }
    }catch(e){}
    const now=new Date().toISOString();
    await db.execute({sql:'INSERT OR IGNORE INTO sifer_sku_sequences(category_code,next_number,updated_at) VALUES(?,?,?)',args:[category,seed,now]});
    // UPDATE RETURNING reserva números únicos incluso con varios usuarios simultáneos.
    const reserved=await db.execute({sql:'UPDATE sifer_sku_sequences SET next_number=next_number+1,updated_at=? WHERE category_code=? RETURNING next_number-1 AS number',args:[now,category]});
    const number=Number(reserved.rows?.[0]?.number||0);
    if(number<1)throw new Error('No se pudo reservar el correlativo de SKU');
    const sku='SKU-'+category+'-'+String(number).padStart(5,'0');
    return json(res,200,{ok:true,category,number,sku});
  }catch(error:any){return json(res,503,{ok:false,configured:true,error:String(error?.message||error)});}
}
