const db=require('../config/database');
async function create({name,email,phone,message}){const [r]=await db.execute('INSERT INTO contact_messages (name,email,phone,message) VALUES (?,?,?,?)',[name,email,phone||null,message]);return r.insertId;}
async function list(){const [r]=await db.query('SELECT id,name,email,phone,message,created_at FROM contact_messages ORDER BY created_at DESC LIMIT 200');return r;}
module.exports={create,list};
