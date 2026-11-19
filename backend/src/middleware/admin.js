const crypto=require('node:crypto');
module.exports=(req,res,next)=>{
 const expected=process.env.ADMIN_API_KEY||'';const supplied=req.get('x-admin-key')||'';
 if(!expected||expected==='reemplaza_por_una_clave_larga_y_aleatoria')return res.status(503).json({error:'Configure ADMIN_API_KEY segura en el servidor'});
 const a=Buffer.from(expected),b=Buffer.from(supplied);
 if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(401).json({error:'Acceso no autorizado'});
 next();
};
