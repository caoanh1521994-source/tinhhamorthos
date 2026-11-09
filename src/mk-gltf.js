// Sinh src/gltf.js: GLTFLoader + DRACOLoader của three r150 dạng script thường (dùng THREE toàn cục),
// để ship3d.js đọc được file .glb xuất từ Blender. Chỉ cần chạy lại khi đổi phiên bản three.
//   cd t3 && npm i three@0.150.1 esbuild && cd .. && node src/mk-gltf.js
const fs = require('fs');
const J = __dirname + '/../t3/node_modules/three/examples/jsm/';
const fromThree = s => s.replace(/import\s*\{([^}]*)\}\s*from\s*'three';/, (_, names) => `const {${names}} = THREE;`);

let g = fromThree(fs.readFileSync(J + 'loaders/GLTFLoader.js', 'utf8'));
let u = fs.readFileSync(J + 'utils/BufferGeometryUtils.js', 'utf8');
const a = u.indexOf('function toTrianglesDrawMode'), b = u.indexOf('\nfunction ', a + 10);
g = g.replace(/import\s*\{\s*toTrianglesDrawMode\s*\}\s*from\s*'[^']*';/, u.slice(a, b))
     .replace(/export\s*\{\s*GLTFLoader\s*\};?/, 'THREE.GLTFLoader = GLTFLoader;');
let d = fromThree(fs.readFileSync(J + 'loaders/DRACOLoader.js', 'utf8'))
     .replace(/export\s*\{\s*DRACOLoader\s*\};?/, 'THREE.DRACOLoader = DRACOLoader;');
// toTrianglesDrawMode dùng các hằng của three
const src = `(function(){if(!window.THREE)return;\nconst {TrianglesDrawMode,TriangleFanDrawMode,TriangleStripDrawMode} = THREE;\n${g.replace(/const \{([^}]*)\} = THREE;/, (m, n) => 'const {' + n.split(',').map(s => s.trim()).filter(s => s && !/^Triangle(s|Fan|Strip)DrawMode$/.test(s)).join(',') + '} = THREE;')}\n})();\n(function(){if(!window.THREE)return;\n${d}\n})();\n`;
const out = require(__dirname + '/../t3/node_modules/esbuild').transformSync(src, { minify: true, target: 'es2019' }).code;
fs.writeFileSync(__dirname + '/gltf.js', '// GLTFLoader + DRACOLoader (three r150, MIT) – sinh bằng src/mk-gltf.js\n' + out);
console.log('gltf.js', out.length);
