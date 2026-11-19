const test=require('node:test');const assert=require('node:assert/strict');
const {createPrompt}=require('../src/controllers/chatbot');
test('el chatbot recibe precios y datos reales del contenido',()=>{
 const prompt=createPrompt({site:{site_name:'Aroma',currency:'Bs'},about:{address:'Calle 1',hours:'08 a 20',phone:'77777777'},services:[{title:'WiFi',description:'Gratis'}],products:[{name:'Capuchino',price:18,description:'Café con leche'}]});
 for(const value of ['Aroma','Calle 1','08 a 20','77777777','WiFi','Capuchino: 18 Bs'])assert.ok(prompt.includes(value));
});
