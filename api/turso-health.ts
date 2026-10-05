import { createClient } from '@libsql/client';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'Method not allowed' });
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) return res.status(503).json({ ok:false, configured:false, error:'Turso no configurado' });
  try {
    const db=createClient({url,authToken});
    const result=await db.execute('SELECT 1 AS ok');
    return res.status(200).json({ok:true,configured:true,turso:result.rows[0]?.ok===1});
  } catch (error:any) {
    return res.status(503).json({ok:false,configured:true,error:String(error?.message||error)});
  }
}
