// Xuất dữ liệu từ sách "Tư duy hình học 9" sang dữ liệu game
const fs = require('fs');
const path = require('path');
const BK = path.join(__dirname, '..', 'book');
const B2 = path.join(__dirname, '..', 'book2');
const { CHUONG, BAI } = require(path.join(BK, 'data'));
const GVD = require(path.join(BK, 'gv'));
const PT = require(path.join(BK, 'pt'));
const THE = require(path.join(B2, 'the'));
const VD = require(path.join(B2, 'vd'));
const RG = Object.assign({}, require(path.join(B2, 'rg1')), require(path.join(B2, 'rg2')));

const sup = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const clean = t => String(t).replace(/\$/g, '').replace(/\^(\d)/g, (_, d) => sup[d]).replace(/\{\{sys:(.*?)\}\}/g, (_, x) => x.split(';').map(s => s.trim()).join(' và '));
const codesIn = t => { const out = []; (String(t).match(/\[([A-Z]\d(?:\s*,\s*[A-Z]\d)*)\]/g) || []).forEach(m => m.slice(1, -1).split(/\s*,\s*/).forEach(c => out.push(c))); return out; };
const stripCodes = t => clean(String(t).replace(/\s*\[([A-Z]\d(?:\s*,\s*[A-Z]\d)*)\]/g, '')).replace(/\s+([;.,])/g, '$1').trim();
const stripTail = t => t.replace(/\s*–\s*(bỏ|không cần|để dành|cách khác|dài hơn|để dành)$/i, '').replace(/^ý b \(tích\)$/, 'ý b (tích)');

// ---- thẻ
const RAR = { G: 1, V: 1, K: 2, P: 2, N: 3, T: 3, S: 3, Q: 3, B: 4 };
const cards = [];
THE.NHOM.forEach(g => g.the.forEach(t => cards.push({ id: t[0], nhom: g.ma, nhomTen: g.ten.replace(/^Thẻ /, ''), ten: t[1], khi: clean(t[2]), ra: stripCodes(t[3]), mau: '#' + g.mau, rar: RAR[g.ma], doc: t[0] === 'N2' })));
THE.BTP.forEach(t => cards.push({ id: t[0], nhom: 'B', nhomTen: 'BÀI TOÁN PHỤ', ten: t[1], khi: clean(t[2]), ra: clean(t[3]), mau: '#134E4A', rar: 4 }));

// ---- nhiệm vụ
const ylab = b => { const m = /^([a-d1-4])\)/.exec(b.de[b.de.length - 1]); return m ? m[1] : b.yl; };
function deep(id) {
  const x = PT[id]; if (!x) return null;
  return { huong: x.huong.map(h => ({ ten: clean(h.ten.replace(/^Hướng \d+ – /, '')), kq: h.kq, y: h.y.map(clean) })), binh: (x.binh || []).map(clean) };
}
function steps(cm) { return cm.map(([a, l]) => ({ cm: clean(a), ld: stripCodes(l), codes: codesIn(l) })); }
const VDORDER = ['4.9', '1.2', '4.5', '5.5', '4.4', '3.10', '1.7', '3.2'];
const VDBTP = { '4.9': [1], '1.2': [2, 3], '4.5': [5], '5.5': [4], '4.4': [6], '3.10': [], '1.7': [7], '3.2': [] };
const missions = [];
function base(b) {
  const g = GVD.G[b.id];
  return { boost: (b.b || []).map(n => 'B' + n), id: b.id, ch: b.ch, truong: b.truong, ky: b.ky, de: b.de.map(clean), yl: ylab(b), yc: clean(b.yc), kl: clean(b.ycs), hinh: 'img/b' + b.id + '.png', huong: clean(g.huong), giu: clean(g.giu), noi: clean(g.noi), nhin: clean(b.nhin), nhinDap: clean(g.nhin), deep: deep(b.id) };
}
// huấn luyện: Bài 2.4 (ví dụ hoàn chỉnh của Phần mở đầu)
{
  const b = BAI.find(x => x.id === '2.4');
  const m = base(b);
  Object.assign(m, { loai: 'train', gt: ['∆ABC vuông tại A', 'BD là tia phân giác của ∠ABC (D ∈ AC)', 'CM ⊥ BD tại M', 'MI ⊥ AC (I ∈ BC)'],
    inputs: [
      { code: 'P3', text: 'MI ⊥ AC và AB ⊥ AC → MI // AB', keep: 1 },
      { code: 'G5', text: 'MI // AB → ∠IMB = ∠ABM (so le trong)', keep: 1 },
      { code: 'G8', text: 'BD là tia phân giác → ∠ABM = ∠MBI', keep: 1 },
      { code: 'P5', text: 'BD là phân giác, K = BD ∩ AH → KH/KA = BH/BA', keep: 0, why: 'Đó là ý c; ý d không có điểm K.' },
      { code: 'G7', text: '∆BMC vuông tại M → ∠IMB + ∠IMC = 90°, ∠IBM + ∠ICM = 90°', keep: 1 },
      { code: 'V2', text: '∆BMC vuông, I ∈ BC → nếu I là trung điểm thì IM = IB = IC', keep: 0, why: 'Dùng chính điều phải chứng minh.' },
      { code: '', text: 'Ý b: BC = AB.cos∠ABC + AC.cos∠ACB', keep: 0, why: 'Không nói gì về điểm I.' },
      { code: 'K2', text: 'Kết luận “I là trung điểm BC” → đổi thành IB = IM và IM = IC', keep: 1 },
    ],
    steps: steps([
      ['MI // AB', 'MI ⊥ AC, AB ⊥ AC [P3]'],
      ['∠IMB = ∠ABM', 'So le trong, MI // AB [G5]'],
      ['∠ABM = ∠IBM', 'BD là tia phân giác của ∠ABC [G8]'],
      ['∠IMB = ∠IBM ⇒ ∆IBM cân tại I ⇒ IB = IM', 'Từ 2 và 3; tam giác có hai góc bằng nhau [G6]'],
      ['∠IMC = 90° − ∠IMB; ∠ICM = 90° − ∠IBM', '∆BMC vuông tại M (CM ⊥ BD) [G7]'],
      ['∠IMC = ∠ICM ⇒ ∆IMC cân tại I ⇒ IM = IC', 'Từ 4 và 5: phụ với hai góc bằng nhau [G4, G6]'],
      ['IB = IC, mà I ∈ BC ⇒ I là trung điểm của BC', 'Từ 4 và 6 [K2]'],
    ]) });
  missions.push(m);
}
VDORDER.forEach((id, k) => {
  const b = BAI.find(x => x.id === id), v = VD[id];
  const m = base(b);
  Object.assign(m, { loai: 'lab', so: k + 1, gt: v.gt.map(clean), dg: clean(v.dg),
    inputs: v.the.map(r => ({ code: r[1], text: clean(r[0]) + ' → ' + clean(r[2]), keep: r[3] === 0 ? 0 : 1, why: r[4] ? clean(r[4]) : '' })),
    hoi: v.hoi.map(r => ({ lab: r[0], q: stripCodes(r[1]), a: stripCodes(r[2]) })),
    steps: steps(v.cm).map(s => Object.assign(s, { codes: s.codes.filter(c => !VDBTP[id].map(n => 'B' + n).includes(c)) })), btp: VDBTP[id], layer: { fig: 'img/' + v.lop.fig, cap: clean(v.lop.cap), rut: clean(v.lop.rut) } });
  missions.push(m);
});
BAI.forEach(b => {
  if (b.id === '2.4' || VD[b.id]) return;
  const x = RG[b.id];
  const m = base(b);
  Object.assign(m, { loai: 'sector', gt: x.gt.map(clean),
    inputs: x.the.map(r => ({ code: r[0], text: stripTail(clean(r[1])), keep: r[2] === 0 ? 0 : 1, why: r[2] === 0 ? (/không cần|bỏ|để dành|cách khác|dài hơn/.test(r[1]) ? 'Không phục vụ điều đang cần ở ý ' + ylab(b) + '.' : '') : '' })),
    steps: steps(x.cm) });
  missions.push(m);
});
// ví dụ mẫu xuất hiện lại trong khu vực: tham chiếu
const sectors = CHUONG.map(c => ({ so: c.so, ten: c.ten, mota: clean(c.moHinh.mota), y: c.moHinh.y.map(clean), bai: BAI.filter(b => b.ch === c.so).map(b => b.id) }));
const data = { cards, missions, sectors, vdOrder: VDORDER };
// kiểm tra: mọi mã thẻ được dùng đều có trong bộ thẻ
const ids = new Set(cards.map(c => c.id)); const bad = new Set();
missions.forEach(m => { m.steps.forEach(s => s.codes.forEach(c => { if (!ids.has(c)) bad.add(c); })); m.inputs.forEach(i => (i.code || '').split(/\s*,\s*/).filter(Boolean).forEach(c => { if (!ids.has(c)) bad.add(c); })); });
console.log('cards', cards.length, 'missions', missions.length, 'unknown codes', [...bad]);
fs.writeFileSync(path.join(__dirname, 'data.js'), 'window.GAME = ' + JSON.stringify(data) + ';\n');
console.log('bytes', fs.statSync(path.join(__dirname, 'data.js')).size);
