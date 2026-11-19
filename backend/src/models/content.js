const db = require('../config/database');
const tables = {
  site: {table:'site_settings',fields:['site_name','tagline','hero_title','hero_subtitle','hero_video_url','hero_poster_url','logo_url','primary_color','currency']},
  about: {table:'about',fields:['title','history','mission','address','city','phone','email','hours','map_url']},
  services: {table:'services',fields:['title','description','icon','sort_order','active']},
  categories: {table:'categories',fields:['name','description','sort_order','active']},
  products: {table:'products',fields:['category_id','name','description','price','image_url','featured','available','sort_order']},
  gallery: {table:'gallery',fields:['image_url','alt_text','sort_order','active']},
  socials: {table:'social_links',fields:['platform','url','sort_order']}
};
async function getPublic(){
  const [settings]=await db.query('SELECT * FROM site_settings WHERE id=1');
  const [about]=await db.query('SELECT * FROM about WHERE id=1');
  const [services]=await db.query('SELECT * FROM services WHERE active=1 ORDER BY sort_order,id');
  const [categories]=await db.query('SELECT * FROM categories WHERE active=1 ORDER BY sort_order,id');
  const [products]=await db.query('SELECT p.*, c.name AS category_name FROM products p JOIN categories c ON c.id=p.category_id WHERE p.available=1 AND c.active=1 ORDER BY p.sort_order,p.id');
  const [gallery]=await db.query('SELECT * FROM gallery WHERE active=1 ORDER BY sort_order,id');
  const [socials]=await db.query('SELECT * FROM social_links ORDER BY sort_order,id');
  return {site:settings[0]||{},about:about[0]||{},services,categories,products,gallery,socials};
}
async function list(entity){const t=tables[entity];if(!t)throw Object.assign(new Error('Recurso desconocido'),{status:404});const [rows]=await db.query(`SELECT * FROM ${t.table} ORDER BY id`);return rows;}
async function save(entity,id,body){
  const t=tables[entity];if(!t)throw Object.assign(new Error('Recurso desconocido'),{status:404});
  const fields=t.fields.filter(k=>Object.prototype.hasOwnProperty.call(body,k));
  if(!fields.length)throw Object.assign(new Error('No se enviaron campos válidos'),{status:400});
  if(fields.some(k=>body[k]===undefined||typeof body[k]==='object'))throw Object.assign(new Error('Valor inválido'),{status:400});
  const vals=fields.map(k=>body[k]);
  if(id){const [r]=await db.query(`UPDATE ${t.table} SET ${fields.map(k=>`${k}=?`).join(',')} WHERE id=?`,[...vals,id]);if(!r.affectedRows)throw Object.assign(new Error('Registro inexistente'),{status:404});return {id:Number(id),updated:true};}
  if(entity==='site'||entity==='about')throw Object.assign(new Error('Use PUT /:id para este recurso'),{status:400});
  const [r]=await db.query(`INSERT INTO ${t.table} (${fields.join(',')}) VALUES (${fields.map(()=>'?').join(',')})`,vals);return {id:r.insertId,created:true};
}
async function remove(entity,id){if(!tables[entity]||entity==='site'||entity==='about')throw Object.assign(new Error('Recurso no eliminable'),{status:400});const [r]=await db.query(`DELETE FROM ${tables[entity].table} WHERE id=?`,[id]);return {deleted:Boolean(r.affectedRows)};}
module.exports={getPublic,list,save,remove,tables};
