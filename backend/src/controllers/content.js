const model=require('../models/content');
exports.publicContent=async(req,res)=>res.json(await model.getPublic());
exports.list=async(req,res)=>res.json(await model.list(req.params.entity));
exports.create=async(req,res)=>res.status(201).json(await model.save(req.params.entity,null,req.body));
exports.update=async(req,res)=>res.json(await model.save(req.params.entity,Number(req.params.id),req.body));
exports.remove=async(req,res)=>res.json(await model.remove(req.params.entity,Number(req.params.id)));
