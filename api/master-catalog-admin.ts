import crypto from 'node:crypto';

function secret(){ return String(process.env.CRON_SECRET||'').trim(); }
function sign(value:string){ return crypto.createHmac('sha256',secret()).update(value).digest('base64url'); }
function makeToken(exp:number){ const value='admin:'+String(exp); return value+'.'+sign(value); }
function verifyToken(token:string){
  if(!secret()||!token) return false;
  const [value,sig]=String(token).split('.');
  if(!value||!sig||!value.startsWith('admin:')) return false;
  const exp=Number(value.slice(6));
  if(!Number.isFinite(exp)||exp<Date.now()) return false;
  const expected=sign(value);
  try{return crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected));}catch{return false;}
}
function bearer(req:any){ return String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'').trim(); }

export default async function handler(req:any,res:any){
  const s=secret();
  if(!s) return res.status(503).json({ok:false,error:'CRON_SECRET no configurado en Vercel.'});
  if(req.method==='POST'){
    const body=req.body||{};
    if(String(body.action||'')!=='unlock') return res.status(400).json({ok:false,error:'Acción no válida'});
    const provided=bearer(req)||String(body.secret||'').trim();
    if(provided!==s) return res.status(401).json({ok:false,error:'Credencial administrativa inválida'});
    const exp=Date.now()+60*60*1000;
    res.setHeader('Set-Cookie',`sifer_admin_session=${makeToken(exp)}; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax`);
    return res.status(200).json({ok:true,expiresAt:new Date(exp).toISOString()});
  }
  if(req.method==='GET'){
    const token=String(req.cookies?.sifer_admin_session||'');
    return res.status(200).json({ok:verifyToken(token)});
  }
  return res.status(405).json({ok:false,error:'Method not allowed'});
}
