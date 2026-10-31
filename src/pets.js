// Pet tri thức – mỗi thẻ là một pet (thiết kế gốc, vẽ bằng SVG thủ tục)
window.PETS = (function () {
  const SP = {
    G: { loai: 'Cáo', he: 'Hoả', c: '#ff7a85' }, V: { loai: 'Rùa', he: 'Thổ', c: '#3fd6c2' }, N: { loai: 'Mochi', he: 'Thuỷ', c: '#6aa8ff' },
    T: { loai: 'Chim', he: 'Phong', c: '#ff9b57' }, S: { loai: 'Thỏ', he: 'Quang', c: '#ffc04d' }, P: { loai: 'Tắc kè', he: 'Mộc', c: '#7ee08a' },
    Q: { loai: 'Cú', he: 'Băng', c: '#4fd2e6' }, K: { loai: 'Kỳ nhông', he: 'Ảo', c: '#a98bff' }, B: { loai: 'Thần long', he: 'Tinh tú', c: '#ffd27a' },
  };
  const TAG = {
    G1: 'Nội Tiếp', G2: 'Nửa Tròn', G3: 'Tiếp Dây', G4: 'Phụ Bù', G5: 'So Le', G6: 'Cân Cân', G7: 'Tổng Ba', G8: 'Phân Giác',
    V1: 'Hệ Thức', V2: 'Huyền Tâm', V3: 'Sin Cos', V4: 'Pytago', V5: 'Chữ Nhật',
    N1: 'Nhìn Vuông', N2: 'Đọc Thêm', N3: 'Bù Đối', N4: 'Kính Dây', N5: 'Trung Trực',
    T1: 'Bán Kính', T2: 'Cắt Nhau', T3: 'Hai Đầu',
    S1: 'Đồng Dạng', S2: 'Tích Chéo', S3: 'Vuông Dạng', S4: 'Bằng Nhau',
    P1: 'Thales', P2: 'Trung Bình', P3: 'Cùng Vuông', P4: 'Bình Hành', P5: 'Phân Giác',
    Q1: 'Trực Tâm', Q2: 'Ngoại Tâm',
    K1: 'Thẳng Hàng', K2: 'Trung Điểm', K3: 'Vuông Góc', K4: 'Song Song', K5: 'Đồng Quy', K6: 'Cân Đối',
    B1: 'Hình Thang', B2: 'Chia Đôi', B3: 'Hai Chéo', B4: 'Ba Tiếp', B5: 'Đường Kính', B6: 'Trung Tuyến', B7: 'Chung Đỉnh',
  };
  const ACC = ['#fff3a0', '#ff9bd2', '#9be7ff', '#c6ff9b', '#ffd1a1', '#d9c2ff', '#ffffff', '#ffb3b3'];
  const STAGE = ['', 'Bé', 'Lớn', 'Tiến hoá'];
  const XP = [0, 0, 3, 8]; // mốc kinh nghiệm để lên dạng 2, 3
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  const OL = '#1d2a5c';
  const info = id => { const g = id[0], s = SP[g], i = +id.slice(1) - 1; return { id, g, i, loai: s.loai, he: s.he, name: s.loai + ' ' + (TAG[id] || id), c: s.c, acc: ACC[i % ACC.length] }; };

  function eyes(x1, x2, y, r, sil) {
    if (sil) return '';
    const e = x => `<ellipse cx="${x}" cy="${y}" rx="${r * 0.8}" ry="${r}" fill="${OL}"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.38}" r="${r * 0.36}" fill="#fff"/><circle cx="${x + r * 0.3}" cy="${y + r * 0.35}" r="${r * 0.16}" fill="#fff"/>`;
    return e(x1) + e(x2);
  }
  const cheeks = (x1, x2, y, sil) => sil ? '' : `<ellipse cx="${x1}" cy="${y}" rx="5" ry="3" fill="#ff8fb1" opacity=".75"/><ellipse cx="${x2}" cy="${y}" rx="5" ry="3" fill="#ff8fb1" opacity=".75"/>`;
  const mouth = (x, y, sil) => sil ? '' : `<path d="M${x - 4} ${y} q4 4 8 0" stroke="${OL}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const sparkle = (x, y, r, c) => `<path class="pt-tw" d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z" fill="${c}"/>`;

  // từng loài: (P = bảng màu, st = dạng 1..3, v = biến thể) → svg ruột
  const BODY = {
    G(P, st, v, sil) { // cáo tai tam giác
      const ear = (x, s) => `<path d="M${x} 50 L${x + s * 6} ${st > 1 ? 18 : 26} L${x + s * 22} 44 Z" fill="${P.m}" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${x + s * 5} 46 L${x + s * 7} ${st > 1 ? 27 : 33} L${x + s * 16} 44 Z" fill="${P.l}"/>`;
      return `<path d="M84 86 C${st > 1 ? 112 : 104} 84 ${st > 1 ? 116 : 106} 56 ${st > 1 ? 100 : 94} 52 C102 66 96 76 82 76 Z" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/><path d="M${st > 1 ? 100 : 94} 52 C${st > 1 ? 108 : 100} 58 ${st > 1 ? 108 : 100} 66 104 68 C100 60 98 56 ${st > 1 ? 100 : 94} 52 Z" fill="#fff"/>
        <ellipse cx="60" cy="84" rx="26" ry="20" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/><ellipse cx="60" cy="90" rx="13" ry="11" fill="${P.l}"/>
        ${ear(36, 1)}${ear(84, -1)}<circle cx="60" cy="58" r="25" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/>
        <path d="M44 66 Q60 82 76 66 Q70 60 60 62 Q50 60 44 66 Z" fill="#fff"/>${v.pat === 1 ? `<path d="M52 36 L60 46 L68 36" fill="${P.a}" stroke="${OL}" stroke-width="1.5"/>` : ''}
        ${eyes(50, 70, 56, 5.5, sil)}<ellipse cx="60" cy="66" rx="3.2" ry="2.4" fill="${OL}"/>${cheeks(42, 78, 64, sil)}`;
    },
    V(P, st, v, sil) { // rùa mai tam giác vuông
      return `<ellipse cx="34" cy="96" rx="8" ry="6" fill="${P.l}" stroke="${OL}" stroke-width="2.5"/><ellipse cx="84" cy="96" rx="8" ry="6" fill="${P.l}" stroke="${OL}" stroke-width="2.5"/>
        <circle cx="26" cy="68" r="${st > 1 ? 19 : 17}" fill="${P.l}" stroke="${OL}" stroke-width="2.5"/>
        <path d="M44 92 L${st > 1 ? 104 : 98} 92 Q${st > 1 ? 104 : 98} 92 44 ${st > 2 ? 36 : 44} Z" fill="${P.m}" stroke="${OL}" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M44 80 h12 v12" fill="none" stroke="${OL}" stroke-width="2"/><path d="M50 ${st > 2 ? 54 : 60} L70 78 L86 86" stroke="${P.d}" stroke-width="2" fill="none"/>
        ${v.pat ? `<circle cx="58" cy="${st > 2 ? 66 : 70}" r="4" fill="${P.a}"/><circle cx="72" cy="84" r="3" fill="${P.a}"/>` : ''}
        ${eyes(20, 34, 64, 4.6, sil)}${cheeks(16, 38, 74, sil)}${mouth(27, 76, sil)}`;
    },
    N(P, st, v, sil) { // mochi tròn có vòng quỹ đạo
      return `<ellipse cx="60" cy="72" rx="${st > 1 ? 50 : 44}" ry="${st > 1 ? 16 : 12}" fill="none" stroke="${P.a}" stroke-width="3" transform="rotate(-12 60 72)"/>
        <path d="M60 30 q-2 -10 6 -14" stroke="${OL}" stroke-width="2.5" fill="none"/><circle cx="67" cy="15" r="4" fill="${P.a}" stroke="${OL}" stroke-width="2"/>
        <path d="M24 82 C20 46 40 30 60 30 C80 30 100 46 96 82 C94 98 26 98 24 82 Z" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/>
        <path d="M36 50 Q44 38 58 38" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M30 86 C40 96 80 96 90 86" stroke="${P.d}" stroke-width="2" fill="none"/>
        ${eyes(48, 72, 64, 6, sil)}${cheeks(38, 82, 74, sil)}${mouth(60, 76, sil)}`;
    },
    T(P, st, v, sil) { // chim cánh tiếp tuyến
      return `<path d="M60 26 l-6 -10 M60 26 l2 -12 M60 26 l8 -9" stroke="${OL}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="58" cy="66" r="${st > 1 ? 32 : 29}" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/><ellipse cx="58" cy="78" rx="17" ry="13" fill="${P.l}"/>
        <path d="M${st > 1 ? 74 : 76} 44 L${st > 1 ? 118 : 108} ${st > 1 ? 30 : 40} L${st > 1 ? 112 : 104} ${st > 1 ? 50 : 54} L82 66 Z" fill="${P.a}" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M30 70 L14 64 L22 80 Z" fill="${P.d}" stroke="${OL}" stroke-width="2"/>
        <path d="M55 63 L67 63 L61 71 Z" fill="#ffc04d" stroke="${OL}" stroke-width="2" stroke-linejoin="round"/>
        ${eyes(52, 70, 56, 5, sil)}${cheeks(44, 78, 66, sil)}<path d="M50 96 v8 M66 96 v8" stroke="${OL}" stroke-width="2.5" stroke-linecap="round"/>`;
    },
    S(P, st, v, sil) { // thỏ có bản sao đồng dạng
      const bun = (sc, tx, ty, main) => `<g transform="translate(${tx} ${ty}) scale(${sc})"><path d="M48 40 C40 4 50 -2 54 36 M72 40 C80 4 70 -2 66 36" fill="${P.m}" stroke="${OL}" stroke-width="${2.5 / sc}"/><path d="M48 38 C42 10 50 6 53 36 Z M72 38 C78 10 70 6 67 36 Z" fill="${P.l}"/>
        <ellipse cx="60" cy="86" rx="24" ry="18" fill="${P.m}" stroke="${OL}" stroke-width="${2.5 / sc}"/><circle cx="60" cy="60" r="23" fill="${P.m}" stroke="${OL}" stroke-width="${2.5 / sc}"/>
        ${main ? eyes(51, 69, 58, 5, sil) + cheeks(44, 76, 66, sil) + mouth(60, 67, sil) : (sil ? '' : `<circle cx="52" cy="58" r="4" fill="${OL}"/><circle cx="68" cy="58" r="4" fill="${OL}"/>`)}</g>`;
      return bun(1, 0, 4, true) + (st > 1 ? bun(0.42, 70, 46, false) : '') + (st > 2 ? bun(0.3, 10, 62, false) : '') + (v.pat ? `<circle cx="60" cy="96" r="4" fill="${P.a}"/>` : '');
    },
    P(P, st, v, sil) { // tắc kè sọc song song
      return `<path d="M88 84 C108 84 112 64 100 60 C92 58 92 70 100 70" fill="none" stroke="${P.m}" stroke-width="9" stroke-linecap="round"/><path d="M88 84 C108 84 112 64 100 60 C92 58 92 70 100 70" fill="none" stroke="${OL}" stroke-width="2"/>
        <path d="M22 66 C22 48 46 44 62 52 C80 58 92 70 90 84 C88 98 40 100 26 90 C20 84 22 76 22 66 Z" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/>
        ${[0, 1, st > 1 ? 2 : -1].filter(k => k >= 0).map(k => `<path d="M${50 + k * 12} 56 L${46 + k * 12} 92" stroke="${P.a}" stroke-width="4" stroke-linecap="round"/>`).join('')}
        <path d="M28 96 l-6 6 M48 98 l-2 7 M70 96 l4 6" stroke="${OL}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="30" cy="54" r="10" fill="${P.l}" stroke="${OL}" stroke-width="2.5"/><circle cx="48" cy="50" r="10" fill="${P.l}" stroke="${OL}" stroke-width="2.5"/>
        ${eyes(30, 48, 54, 5, sil)}${cheeks(24, 52, 70, sil)}${mouth(36, 70, sil)}`;
    },
    Q(P, st, v, sil) { // cú – ba đường đồng quy trên trán
      return `<path d="M34 40 L28 ${st > 1 ? 16 : 24} L46 32 Z M86 40 L92 ${st > 1 ? 16 : 24} L74 32 Z" fill="${P.d}" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M24 70 C22 40 40 28 60 28 C80 28 98 40 96 70 C94 98 80 106 60 106 C40 106 26 98 24 70 Z" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/>
        <path d="M40 80 Q60 104 80 80 Q72 96 60 98 Q48 96 40 80 Z" fill="${P.l}"/>
        <circle cx="46" cy="60" r="13" fill="#fff" stroke="${OL}" stroke-width="2"/><circle cx="74" cy="60" r="13" fill="#fff" stroke="${OL}" stroke-width="2"/>
        <path d="M60 40 L46 60 M60 40 L74 60 M60 40 L60 70" stroke="${P.a}" stroke-width="2" opacity=".9"/><circle cx="60" cy="40" r="4.5" fill="${P.a}" stroke="${OL}" stroke-width="1.8"/>
        ${eyes(46, 74, 60, 6, sil)}<path d="M56 70 L64 70 L60 77 Z" fill="#ffc04d" stroke="${OL}" stroke-width="1.8"/>`;
    },
    K(P, st, v, sil) { // kỳ nhông mang lông vũ
      const gill = (x, s) => [0, 1, 2].map(k => `<path d="M${x} ${48 + k * 10} q${s * (st > 1 ? 18 : 13)} ${-6 + k * 3} ${s * (st > 1 ? 24 : 18)} ${-2 + k * 6}" stroke="${P.a}" stroke-width="${st > 2 ? 6 : 5}" stroke-linecap="round" fill="none"/>`).join('');
      return `<path d="M76 92 C96 96 108 86 106 76 C100 84 90 86 78 82 Z" fill="${P.l}" stroke="${OL}" stroke-width="2.2"/>
        <ellipse cx="58" cy="88" rx="22" ry="14" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/>
        ${gill(30, -1)}${gill(90, 1)}<ellipse cx="60" cy="60" rx="32" ry="24" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/>
        <ellipse cx="60" cy="68" rx="18" ry="9" fill="${P.l}" opacity=".8"/>${v.pat ? `<circle cx="44" cy="46" r="3" fill="${P.a}"/><circle cx="78" cy="48" r="2.5" fill="${P.a}"/>` : ''}
        ${eyes(46, 74, 58, 5.2, sil)}${cheeks(38, 82, 68, sil)}<path d="M52 70 q8 6 16 0" stroke="${OL}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    },
    B(P, st, v, sil) { // thần long cánh sao (huyền thoại)
      const wing = s => `<path d="M${60 + s * 18} 64 C${60 + s * 40} 30 ${60 + s * 56} 36 ${60 + s * 58} 26 C${60 + s * 62} 46 ${60 + s * 52} 60 ${60 + s * 56} 70 C${60 + s * 44} 66 ${60 + s * 36} 74 ${60 + s * 22} 78 Z" fill="${P.a}" stroke="${OL}" stroke-width="2.4" stroke-linejoin="round"/>`;
      return `${sil ? '' : `<circle cx="60" cy="64" r="50" fill="url(#pg-${v.id})" opacity=".55"/>`}${wing(1)}${wing(-1)}
        <path d="M74 96 C96 102 104 90 100 82 C94 92 86 92 76 88 Z" fill="${P.m}" stroke="${OL}" stroke-width="2.2"/>
        <ellipse cx="60" cy="88" rx="20" ry="15" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/><ellipse cx="60" cy="92" rx="10" ry="9" fill="${P.l}"/>
        <path d="M46 40 L40 20 L54 34 Z M74 40 L80 20 L66 34 Z" fill="#fff8d0" stroke="${OL}" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="60" cy="56" r="24" fill="${P.m}" stroke="${OL}" stroke-width="2.5"/>
        <path d="M60 34 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1 Z" fill="#fff" stroke="${OL}" stroke-width="1.5"/>
        ${eyes(50, 70, 58, 5.5, sil)}${cheeks(42, 78, 66, sil)}${mouth(60, 67, sil)}`;
    },
  };

  function svg(id, stage, opt) {
    opt = opt || {}; const I = info(id), st = I.g === 'B' ? 3 : Math.max(1, Math.min(3, stage || 1)), sil = !!opt.sil;
    const P = sil ? { m: '#141a33', l: '#141a33', d: '#141a33', a: '#141a33' } : { m: I.c, l: mix(I.c, '#ffffff', 0.55), d: mix(I.c, '#1d2a5c', 0.35), a: I.acc };
    const v = { pat: I.i % 2, id };
    let inner = BODY[I.g](P, st, v, sil);
    if (sil) inner = inner.replace(/fill="#[0-9a-fA-F]{3,6}"/g, 'fill="#141a33"').replace(/stroke="(?!#1d2a5c)#[0-9a-fA-F]{3,6}"/g, 'stroke="#141a33"');
    // trang sức theo biến thể (dạng 2+)
    if (!sil && st >= 2 && I.g !== 'B') {
      const k = I.i % 4;
      inner += k === 0 ? `<path d="M74 34 q6 -10 14 -6 q-4 8 -14 6 Z" fill="#7ee08a" stroke="${OL}" stroke-width="1.8"/>`
        : k === 1 ? `<path d="M52 28 l-10 -6 l0 12 Z M52 28 l10 -6 l0 12 Z" fill="#ff8fb1" stroke="${OL}" stroke-width="1.8" stroke-linejoin="round" transform="translate(16 2)"/>`
          : k === 2 ? `<path d="M40 84 Q60 92 80 84 L78 90 Q60 98 42 90 Z" fill="${P.a}" stroke="${OL}" stroke-width="1.8"/>`
            : `<path d="M60 22 l4 8 l-4 6 l-4 -6 Z" fill="#9be7ff" stroke="${OL}" stroke-width="1.8"/>`;
    }
    // dạng tiến hoá: vương miện + hào quang
    let back = '', front = '';
    if (!sil && st === 3) {
      back = `<circle cx="60" cy="66" r="52" fill="url(#pg-${id})" opacity=".45"/>`;
      if (I.g !== 'B') front = `<path d="M50 ${I.g === 'V' ? 44 : 24} l3 -9 l7 6 l7 -6 l3 9 Z" fill="#ffd27a" stroke="${OL}" stroke-width="1.8" stroke-linejoin="round" transform="${I.g === 'V' ? 'translate(-34 0)' : ''}"/>`;
      front += sparkle(16, 24, 6, '#fff3a0') + sparkle(104, 100, 5, '#fff');
    }
    const sc = st === 1 ? 0.9 : 1;
    return `<svg viewBox="0 0 120 120" class="petsvg st${st}" aria-hidden="true"><defs><radialGradient id="pg-${id}"><stop offset="0" stop-color="${I.c}"/><stop offset="1" stop-color="${I.c}" stop-opacity="0"/></radialGradient></defs>
      ${back}<ellipse cx="60" cy="110" rx="${30 * sc}" ry="5" fill="#000" opacity=".25"/><g class="petbody" transform="translate(${60 - 60 * sc} ${110 - 110 * sc}) scale(${sc})">${inner}</g>${front}</svg>`;
  }
  const stageOf = (id, xp) => id[0] === 'B' ? 3 : xp >= XP[3] ? 3 : xp >= XP[2] ? 2 : 1;
  return { info, svg, stageOf, STAGE, XP, SP };
})();
