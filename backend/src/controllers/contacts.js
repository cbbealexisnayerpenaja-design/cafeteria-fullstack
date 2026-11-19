const contacts=require('../models/contacts');
exports.send=async(req,res)=>{
 const {name,email,phone,message}=req.body||{};
 if(typeof name!=='string'||name.trim().length<2||name.length>120||typeof email!=='string'||email.length>180||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof message!=='string'||message.trim().length<5||message.length>2000||phone!=null&&(typeof phone!=='string'||phone.length>40))return res.status(400).json({error:'Verifica nombre, correo y mensaje'});
 const id=await contacts.create({name:name.trim(),email:email.trim(),phone,message:message.trim()});res.status(201).json({id,message:'Tu mensaje fue recibido. ¡Gracias!'});
};
exports.list=async(req,res)=>res.json(await contacts.list());
