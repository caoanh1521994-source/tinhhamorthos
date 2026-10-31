const fs=require('fs');
const d=fs.readFileSync(__dirname+'/data.js','utf8');
const art=fs.readFileSync(__dirname+'/art.js','utf8');
const three=fs.readFileSync(__dirname+'/../t3/node_modules/three/build/three.min.js','utf8');
const s3=fs.readFileSync(__dirname+'/ship3d.js','utf8');
const tk=fs.readFileSync(__dirname+'/design.js','utf8');
const pets=fs.readFileSync(__dirname+'/pets.js','utf8');
const s=fs.readFileSync(__dirname+'/src.html','utf8').replace('/*DATA*/', ()=>d).replace('/*THREE*/', ()=>three).replace('/*SHIP3D*/', ()=>s3).replace('/*ART*/', ()=>art).replace('/*TK*/', ()=>tk).replace('/*PETS*/', ()=>pets);
fs.mkdirSync(__dirname+'/dist',{recursive:true});
fs.writeFileSync(__dirname+'/dist/orthos.html', s);
// bản cho Vercel: có doctype + head
fs.writeFileSync(__dirname+'/dist/index.html', '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+s+'</body></html>');
console.log('ok', s.length);
