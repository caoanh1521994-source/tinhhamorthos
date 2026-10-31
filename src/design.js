// Xưởng Thiết Kế – dữ liệu dựng hình lấy từ trang "Hướng dẫn vẽ hình" (Vehinhdong9)
window.TK = (function(){
// ---------------- hình học
const P=(x,y)=>({x,y});
const add=(a,b)=>P(a.x+b.x,a.y+b.y), sub=(a,b)=>P(a.x-b.x,a.y-b.y), mul=(a,k)=>P(a.x*k,a.y*k);
const dot=(a,b)=>a.x*b.x+a.y*b.y, cross=(a,b)=>a.x*b.y-a.y*b.x, len=a=>Math.hypot(a.x,a.y);
const mid=(a,b)=>mul(add(a,b),.5);
const unit=a=>{const l=len(a);return l?mul(a,1/l):P(0,0)};
const foot=(p,a,b)=>{const d=sub(b,a);return add(a,mul(d,dot(sub(p,a),d)/dot(d,d)))};
const inter=(p1,p2,p3,p4)=>{const d1=sub(p2,p1),d2=sub(p4,p3),den=cross(d1,d2);if(Math.abs(den)<1e-9)return null;const t=cross(sub(p3,p1),d2)/den;return add(p1,mul(d1,t))};
const onc=(c,r,deg)=>P(c.x+r*Math.cos(deg*Math.PI/180),c.y+r*Math.sin(deg*Math.PI/180));
const lineAng=(a,b,c,d)=>{const u=sub(b,a),v=sub(d,c);let g=Math.acos(Math.min(1,Math.abs(dot(u,v))/(len(u)*len(v))))*180/Math.PI;return g};
const dev=(a,b,c)=>{const g=Math.acos(Math.max(-1,Math.min(1,dot(sub(a,b),sub(c,b))/(len(sub(a,b))*len(sub(c,b))))))*180/Math.PI;return Math.min(g,180-g)};
const tangentPts=(O,R,A)=>{const d=len(sub(A,O)),a=Math.acos(R/d),b=Math.atan2(A.y-O.y,A.x-O.x);return [P(O.x+R*Math.cos(b+a),O.y+R*Math.sin(b+a)),P(O.x+R*Math.cos(b-a),O.y+R*Math.sin(b-a))]};
const area=(a,b,c)=>Math.abs(cross(sub(b,a),sub(c,a)))/2;
const fmt=(x,d=2)=>x.toFixed(d).replace('.',',');

// ---------------- dữ liệu bốn bài
const M=(t)=>`<span class="menu">${t}</span>`;
const T=(t)=>`<span class="tool">${t}</span>`;
const PROB=[
{ id:'1.1', ten:'Trưng Vương', sk:'Dựng đúng, kéo và kiểm tra', view:[-3.6,10.6,-1.9,6.2],
  de:`<p>Cho ∆ABC vuông tại A (AB &lt; AC), đường cao AH. M, N là chân đường vuông góc hạ từ H xuống AB, AC. MN cắt BC tại I. Trên tia đối của tia NH lấy K sao cho NK = BM. Chứng minh AI ⊥ CK.</p><p class="src">Bài 1.1 – Trường THCS Trưng Vương, giữa HKI</p>`,
  init:{th:116},
  drag:{A:{kind:'arc',c:P(4,0),r:4,key:'th',min:12,max:168}},
  compute(p){const B=P(0,0),C=P(8,0),E=P(4,0),A=onc(E,4,p.th),H=foot(A,B,C),Mm=foot(H,A,B),N=foot(H,A,C);
    let I=inter(Mm,N,B,C); if(I&&len(I)>60) I=null;
    const K=add(N,mul(unit(sub(N,H)),len(sub(B,Mm)))),O=mid(A,H);
    return {A,B,C,E,H,M:Mm,N,I,K,O};},
  objs:[
    {t:'circle',c:'E',r:4,s:1,st:'aux'},{t:'seg',a:'B',b:'C',s:1},{t:'pt',id:'B',s:1,off:[-14,10]},{t:'pt',id:'C',s:1,off:[14,10]},
    {t:'seg',a:'A',b:'B',s:2},{t:'seg',a:'A',b:'C',s:2},{t:'pt',id:'A',s:2,off:[0,-16]},
    {t:'seg',a:'A',b:'H',s:3},{t:'ra',v:'H',p:'A',q:'C',s:3},{t:'pt',id:'H',s:3,off:[0,18]},
    {t:'seg',a:'H',b:'M',s:4},{t:'seg',a:'H',b:'N',s:4},{t:'seg',a:'M',b:'N',s:4},{t:'ra',v:'M',p:'H',q:'A',s:4},{t:'ra',v:'N',p:'H',q:'A',s:4},{t:'pt',id:'M',s:4},{t:'pt',id:'N',s:4},
    {t:'line',a:'M',b:'N',s:5,st:'aux'},{t:'line',a:'B',b:'C',s:5,st:'aux'},{t:'pt',id:'I',s:5,off:[0,18]},
    {t:'ray',a:'H',b:'N',s:6,st:'aux'},{t:'seg',a:'N',b:'K',s:6,st:'acc'},{t:'pt',id:'K',s:6},
    {t:'segx',a:'A',b:'I',s:7},{t:'segx',a:'C',b:'K',s:7},
    {t:'seg',a:'O',b:'E',s:8,st:'amb'},{t:'pt',id:'O',s:8,off:[-14,-6]},{t:'pt',id:'E',s:8,off:[0,18]},
  ],
  steps:[
    {ti:'Dựng BC và đường tròn đường kính BC', why:'Điểm A nhìn BC dưới góc vuông nên A nằm trên đường tròn đường kính BC. Dựng đường tròn trước để A kéo được mà tam giác vẫn vuông.',
     ggm:[`Chọn ${T('Segment')} (nhóm đường thẳng), bấm hai chỗ trên màn hình: được hai điểm và đoạn thẳng. Đổi tên hai điểm thành B, C.`,`Chọn ${T('Midpoint or Center')} (nhóm điểm), bấm vào đoạn BC: được trung điểm E.`,`Chọn ${T('Circle with Center through Point')} (nhóm đường tròn), bấm E rồi bấm B.`],
     gg:['B = (0, 0)','C = (8, 0)','Segment(B, C)','k = Circle(Midpoint(B, C), B)'],
     gsp:[`Chọn công cụ Thước, vẽ đoạn BC.`,`Chọn đoạn BC → ${M('Construct')} → ${M('Midpoint')} được trung điểm E.`,`Chọn E rồi B → ${M('Construct')} → ${M('Circle By Center+Point')}.`]},
    {ti:'Lấy A trên đường tròn: tam giác vuông tại A', why:'A là điểm tự do duy nhất của bài. Thử kéo A trên hình bên trái.',
     ggm:[`Chọn ${T('Point')} (nhóm điểm), bấm lên đường tròn: điểm dính vào đường tròn. Đổi tên thành A.`,`Chọn ${T('Segment')}, nối A với B, A với C.`,`Chọn ${T('Move')} (mũi tên) rồi kéo A: A chỉ chạy trên đường tròn, góc A luôn vuông.`],
     gg:['A = Point(k)','Polygon(A, B, C)'],
     gsp:[`Chọn đường tròn → ${M('Construct')} → ${M('Point On Object')}, đổi tên thành A.`,`Dùng Thước nối AB, AC.`,`Có thể ẩn đường tròn: chọn nó → ${M('Display')} → ${M('Hide')}.`]},
    {ti:'Đường cao AH', why:'Chân đường cao là điểm phụ thuộc: dựng bằng đường vuông góc rồi lấy giao điểm.',
     ggm:[`Chọn ${T('Perpendicular Line')} (nhóm đường vuông góc), bấm A rồi bấm đoạn BC.`,`Chọn ${T('Intersect')} (nhóm điểm), bấm đường vừa dựng rồi bấm BC: được H.`,`Ẩn đường vuông góc: chuột phải vào nó, bỏ dấu ở Show Object. Dùng ${T('Segment')} nối AH.`],
     gg:['H = ClosestPoint(Line(B, C), A)','Segment(A, H)'],
     gsp:[`Chọn A và đoạn BC → ${M('Construct')} → ${M('Perpendicular Line')}.`,`Chọn đường vừa dựng và BC → ${M('Construct')} → ${M('Intersection')}, đổi tên H.`,`Ẩn đường vuông góc, nối AH.`]},
    {ti:'Hình chiếu M, N của H trên AB, AC', why:'Làm giống bước 3, hai lần.',
     ggm:[`${T('Perpendicular Line')}: bấm H rồi AB. ${T('Intersect')}: bấm đường đó và AB, được M.`,`Làm lại với AC, được N.`,`Ẩn hai đường vuông góc, dùng ${T('Segment')} nối HM, HN, MN.`],
     gg:['M = ClosestPoint(Line(A, B), H)','N = ClosestPoint(Line(A, C), H)','Segment(H, M)','Segment(H, N)','Segment(M, N)'],
     gsp:[`Chọn H và AB → ${M('Perpendicular Line')} → lấy giao điểm M.`,`Chọn H và AC → ${M('Perpendicular Line')} → lấy giao điểm N.`,`Ẩn hai đường vuông góc, nối HM, HN, MN.`]},
    {ti:'Giao điểm I của MN và BC', why:'MN và BC là hai đường thẳng, không phải hai đoạn, nên phải kéo dài trước khi lấy giao điểm.',
     ggm:[`Chọn ${T('Line')} (nhóm đường thẳng), bấm M rồi N; bấm B rồi C: được hai đường thẳng.`,`${T('Intersect')}: bấm lần lượt hai đường thẳng vừa vẽ, được I.`],
     gg:['I = Intersect(Line(M, N), Line(B, C))'],
     gsp:[`Giữ chuột vào công cụ Thước, chọn kiểu Đường thẳng; vẽ đường thẳng MN và đường thẳng BC.`,`Chọn hai đường thẳng → ${M('Construct')} → ${M('Intersection')}, đổi tên I.`],
     note:'Kéo A tới gần điểm chính giữa cung: I chạy rất xa. Khi AB = AC thì MN // BC và I biến mất – vì thế đề cho AB < AC.'},
    {ti:'Điểm K: NK = BM trên tia đối của tia NH', why:'Dựng đoạn bằng đoạn cho trước bằng đường tròn, không đo rồi đặt.',
     ggm:[`Chọn ${T('Ray')} (nhóm đường thẳng), bấm H rồi N: được tia HN.`,`Chọn ${T('Compass')} (nhóm đường tròn), bấm B rồi M để lấy bán kính BM, sau đó bấm N làm tâm.`,`${T('Intersect')}: bấm đường tròn rồi bấm tia. Giữ giao điểm nằm ngoài đoạn HN, đặt tên K; ẩn đường tròn.`],
     gg:['K = N + Distance(B, M) * UnitVector(Vector(H, N))'],
     gsp:[`Vẽ tia HN (Thước, kiểu Tia).`,`Chọn N và đoạn BM → ${M('Construct')} → ${M('Circle By Center+Radius')}.`,`Lấy giao điểm của đường tròn với tia ở phía ngoài đoạn HN, đổi tên K; ẩn đường tròn.`]},
    {ti:'Kiểm tra AI ⊥ CK', why:'Đo góc giữa hai đường thẳng rồi kéo A. Số đo phải luôn là 90°.',
     ggm:[`${T('Line')}: vẽ đường thẳng AI và đường thẳng CK.`,`Chọn ${T('Angle')} (nhóm góc), bấm đường thẳng AI rồi đường thẳng CK: hiện số đo góc.`,`Hoặc chọn ${T('Relation')} (nhóm chữ ABC), bấm hai đường thẳng: GeoGebra trả lời chúng có vuông góc không.`,`Chọn ${T('Move')}, kéo A và nhìn số đo.`],
     gg:['ArePerpendicular(Line(A, I), Line(C, K))','Angle(Line(A, I), Line(C, K))'],
     gsp:[`Vẽ đường thẳng AI và CK, lấy giao điểm J.`,`Chọn A, J, C (J ở giữa) → ${M('Measure')} → ${M('Angle')}.`,`Kéo A và nhìn số đo.`]},
    {ti:'Tìm điểm “nhiều vai”', why:'Trung điểm O của AH vừa nằm trên MN, vừa là trung điểm BK. Nối O với trung điểm E của BC: OE song song với CK.',
     ggm:[`${T('Midpoint or Center')}: bấm A rồi H, được O; bấm B rồi C, được E.`,`${T('Relation')}: bấm O rồi bấm đường thẳng MN: GeoGebra báo O nằm trên đường thẳng.`,`${T('Segment')} nối OE; ${T('Relation')}: bấm OE rồi CK, GeoGebra báo hai đường song song.`],
     gg:['O = Midpoint(A, H)','E = Midpoint(B, C)','AreCollinear(M, O, N)','AreParallel(Line(O, E), Line(C, K))'],
     gsp:[`Chọn đoạn AH → ${M('Midpoint')}, đổi tên O.`,`Nối OE; đo góc giữa OE và CK bằng cách vẽ đường thẳng qua chúng.`]},
  ],
  read(q,step){const r=[];
    if(step>=5) r.push(q.I?{k:'I',v:'tồn tại'}:{k:'MN // BC',v:'I không tồn tại',c:'warn'});
    if(step>=2) r.push({k:'AB < AC',v:len(sub(q.A,q.B))<len(sub(q.A,q.C))?'đúng':'sai'});
    if(step>=7&&q.I){const g=lineAng(q.A,q.I,q.C,q.K);r.push({k:'Góc (AI, CK)',v:fmt(g,1)+'°',c:Math.abs(g-90)<.05?'ok':''});}
    if(step>=8){r.push({k:'O trên MN, lệch',v:fmt(dev(q.M,q.O,q.N),1)+'°',c:'ok'});if(q.I){const g=lineAng(q.O,q.E,q.C,q.K);r.push({k:'Góc (OE, CK)',v:fmt(g,1)+'°',c:g<.05?'ok':''});}}
    return r;},
  obs:[['Kéo A sang phía bên kia để AB > AC. AI còn vuông góc với CK không?','Còn. Điều kiện AB < AC chỉ để vẽ hình; thật ra chỉ cần AB ≠ AC để điểm I tồn tại.'],
       ['Kéo A tới điểm chính giữa cung BC. Chuyện gì xảy ra với I?','I chạy ra xa vô cùng rồi biến mất: khi AB = AC thì MN // BC.'],
       ['Ở bước 8, O đóng những vai nào?','O là trung điểm của AH, của MN, của BK; OE là đường trung bình của ∆BKC nên OE // CK; O còn là trực tâm của ∆AIE.']]},

{ id:'2.6', ten:'Mỹ Đình 2', sk:'Khái quát bằng thanh trượt', view:[-1.4,5.6,-0.8,5.8],
  de:`<p>Cho ∆ABC vuông tại A, O là trung điểm AC. Đường tròn đường kính AC cắt BC tại D. Kẻ AE ⊥ OB tại E. Tiếp tuyến tại C cắt tia AD, AE lần lượt ở H, K. Chứng minh K là trung điểm của HC.</p><p class="src">Bài 2.6 – Trường THCS Mỹ Đình 2, giữa HKII. Ở đây ta thay trung điểm O bằng điểm chia AC theo tỉ số t.</p>`,
  init:{b:4,c:3.6,t:.5},
  drag:{B:{kind:'y',key:'b',min:3.6,max:5},C:{kind:'x',key:'c',min:2.8,max:4.2},O:{kind:'seg',a:'A',b:'C',key:'t',min:.08,max:.92}},
  slider:{key:'t',label:'t = AO/AC',min:.08,max:.92,step:.01},
  compute(p){const A=P(0,0),B=P(0,p.b),C=P(p.c,0),O=add(A,mul(sub(C,A),p.t)),D=foot(A,B,C),Cu=P(p.c,1),H=inter(A,D,C,Cu),E=foot(A,B,O),K=inter(A,E,C,Cu);return {A,B,C,O,D,H,E,K,Cu};},
  objs:[
    {t:'line',a:'A',b:'C',s:1,st:'aux'},{t:'line',a:'A',b:'B',s:1,st:'aux'},
    {t:'seg',a:'A',b:'B',s:1},{t:'seg',a:'A',b:'C',s:1},{t:'seg',a:'B',b:'C',s:1},{t:'ra',v:'A',p:'B',q:'C',s:1},
    {t:'pt',id:'A',s:1,off:[-14,12]},{t:'pt',id:'B',s:1,off:[-16,0]},{t:'pt',id:'C',s:1,off:[14,14]},
    {t:'seg',a:'A',b:'O',s:2,st:'acc'},{t:'pt',id:'O',s:2,off:[0,18]},
    {t:'line',a:'C',b:'Cu',s:3},{t:'seg',a:'A',b:'D',s:3},{t:'ra',v:'D',p:'A',q:'C',s:3},{t:'ra',v:'C',p:'A',q:'Cu',s:3},{t:'pt',id:'D',s:3,off:[12,-10]},
    {t:'seg',a:'B',b:'O',s:4},{t:'seg',a:'D',b:'H',s:4},{t:'seg',a:'A',b:'K',s:4},{t:'ra',v:'E',p:'A',q:'B',s:4},{t:'pt',id:'E',s:4,off:[-14,-8]},{t:'pt',id:'H',s:4,off:[16,0]},{t:'pt',id:'K',s:4,off:[16,0]},
    {t:'seg',a:'C',b:'K',s:5,st:'amb'},
  ],
  steps:[
    {ti:'Tam giác vuông tại A kéo được', why:'Đặt B trên trục tung, C trên trục hoành: kéo B, C bao nhiêu thì góc A vẫn vuông.',
     ggm:[`Hiện trục toạ độ: chuột phải vào chỗ trống → Axes (Trục).`,`Chọn ${T('Point')}: bấm vào gốc toạ độ được A; bấm lên trục tung được B; bấm lên trục hoành được C. B, C dính vào trục.`,`Chọn ${T('Polygon')} (nhóm đa giác), bấm A, B, C rồi bấm lại A.`],
     gg:['A = (0, 0)','B = Point(yAxis)','C = Point(xAxis)','Polygon(A, B, C)'],
     gsp:[`Vẽ một đường thẳng qua A, chọn A và đường đó → ${M('Construct')} → ${M('Perpendicular Line')}.`,`Trên mỗi đường lấy một điểm bằng ${M('Point On Object')}: B và C.`,`Nối AB, BC, CA.`]},
    {ti:'Điểm O chia AC theo tỉ số t', why:'Đề gốc là t = 0,5 (trung điểm). Dùng thanh trượt để thử các tỉ số khác. Có thể kéo O ngay trên đoạn AC.',
     ggm:[`Chọn ${T('Point')}, bấm lên cạnh AC: được điểm dính vào AC, đổi tên O. Kéo được O trên AC.`,`Chọn ${T('Distance or Length')} (nhóm góc), bấm A rồi O, bấm A rồi C: hiện độ dài AO, AC.`,`Muốn GeoGebra tính sẵn tỉ số, gõ một dòng: t = Distance(A, O) / Distance(A, C).`],
     gg:['t = Slider(0.05, 0.95, 0.01)','O = A + t*(C - A)'],
     gsp:[`Chọn đoạn AC → ${M('Construct')} → ${M('Point On Object')}, đổi tên O.`,`Chọn đoạn AO rồi đoạn AC → ${M('Measure')} → ${M('Ratio')} để có t.`]},
    {ti:'AD ⊥ BC và đường thẳng d vuông góc với AC tại C', why:'D là chân đường cao từ A (ở đề gốc, D nằm trên đường tròn đường kính AC). d chính là tiếp tuyến tại C.',
     ggm:[`${T('Perpendicular Line')}: bấm A rồi BC. ${T('Intersect')} với BC được D.`,`${T('Perpendicular Line')}: bấm C rồi AC: được đường thẳng d.`],
     gg:['D = ClosestPoint(Line(B, C), A)','d = PerpendicularLine(C, Line(A, C))'],
     gsp:[`Chọn A và BC → ${M('Perpendicular Line')} → lấy giao điểm D.`,`Chọn C và AC → ${M('Perpendicular Line')}, đây là d.`]},
    {ti:'AE ⊥ OB, rồi lấy H và K trên d', why:'H là giao của AD với d, K là giao của AE với d.',
     ggm:[`${T('Segment')} nối O với B. ${T('Perpendicular Line')}: bấm A rồi OB; ${T('Intersect')} với OB được E.`,`Chọn ${T('Ray')}: bấm A rồi D; bấm A rồi E.`,`${T('Intersect')}: tia AD với d được H; tia AE với d được K.`],
     gg:['E = ClosestPoint(Line(O, B), A)','H = Intersect(Line(A, D), d)','K = Intersect(Line(A, E), d)'],
     gsp:[`Nối OB; chọn A và OB → ${M('Perpendicular Line')} → giao điểm E.`,`Vẽ tia AD, tia AE; lấy giao điểm với d được H và K.`]},
    {ti:'Đo CK/CH và kéo thanh trượt', why:'So sánh tỉ số CK/CH với t ở từng vị trí.',
     ggm:[`${T('Distance or Length')}: bấm C rồi K, bấm C rồi H.`,`Chọn ${T('Move')}, kéo O trên AC. Lấy CK chia CH rồi so với AO chia AC.`,`Gõ thêm r = Distance(C, K) / Distance(C, H) nếu muốn GeoGebra tính sẵn tỉ số.`],
     gg:['r = Distance(C, K) / Distance(C, H)'],
     gsp:[`Nối CK, CH. Chọn đoạn CK rồi CH → ${M('Measure')} → ${M('Ratio')}.`,`Kéo O trên AC, kéo B, C, và ghi lại hai tỉ số.`],
     note:'Kéo thanh trượt bên dưới hình: r luôn bằng t. Đó là phát biểu khái quát của bài.'},
  ],
  read(q,step,p){const r=[];
    if(step>=2) r.push({k:'t = AO/AC',v:fmt(p.t)});
    if(step>=5){const v=len(sub(q.C,q.K))/len(sub(q.C,q.H));r.push({k:'r = CK/CH',v:fmt(v),c:Math.abs(v-p.t)<.005?'ok':''});}
    return r;},
  obs:[['Kéo thanh trượt t. So sánh r = CK/CH với t.','Luôn bằng nhau. Khái quát: nếu AO/AC = t thì CK/CH = t. Trung điểm chỉ là trường hợp t = 1/2.'],
       ['Kéo B và C. Quy luật có thay đổi không?','Không: r vẫn bằng t với mọi tam giác vuông.'],
       ['Bài toán phụ nào giải thích quy luật này?','Bài toán phụ 6 mở rộng: hai điểm chia hai cạnh tương ứng của ∆BAC ∽ ∆ACH theo cùng một tỉ số.']]},

{ id:'3.3', ten:'Cầu Diễn → Đại Áng', sk:'Nhìn tương tự: đổi vai B, C', view:[-4.4,4.6,-4,4.2],
  de:`<p>Cho ∆ABC nhọn nội tiếp (O), đường cao AD, BE. Kẻ đường kính AK. F là hình chiếu của B trên AK, M là trung điểm BC. Chứng minh E, F, M thẳng hàng.</p><p class="src">Bài 3.3 – Trường THCS Cầu Diễn, giữa HKII. Bước 5 đổi vai B và C để được Bài 3.7 (Đại Áng).</p>`,
  init:{th:108},
  drag:{A:{kind:'arc',c:P(0,0),r:3,key:'th',min:38,max:144}},
  compute(p){const O=P(0,0),A=onc(O,3,p.th),B=onc(O,3,212),C=onc(O,3,-30),D=foot(A,B,C),E=foot(B,A,C),K=mul(A,-1),F=foot(B,A,K),Mm=mid(B,C),F2=foot(C,A,B),I=foot(C,A,K);return {O,A,B,C,D,E,K,F,M:Mm,F2,I};},
  objs:[
    {t:'circle',c:'O',r:3,s:1,st:'aux'},{t:'seg',a:'A',b:'B',s:1},{t:'seg',a:'B',b:'C',s:1},{t:'seg',a:'C',b:'A',s:1},
    {t:'pt',id:'O',s:1,off:[12,-8]},{t:'pt',id:'A',s:1,off:[0,-16]},{t:'pt',id:'B',s:1,off:[-14,10]},{t:'pt',id:'C',s:1,off:[14,10]},
    {t:'seg',a:'A',b:'D',s:2},{t:'seg',a:'B',b:'E',s:2},{t:'ra',v:'D',p:'A',q:'C',s:2},{t:'ra',v:'E',p:'B',q:'C',s:2},{t:'pt',id:'D',s:2,off:[-8,16]},{t:'pt',id:'E',s:2,off:[14,-6]},
    {t:'seg',a:'A',b:'K',s:3},{t:'seg',a:'B',b:'F',s:3},{t:'ra',v:'F',p:'B',q:'K',s:3},{t:'pt',id:'K',s:3,off:[6,16]},{t:'pt',id:'F',s:3,off:[-14,-6]},
    {t:'segx',a:'E',b:'M',s:4,st:'acc'},{t:'pt',id:'M',s:4,off:[8,16]},
    {t:'seg',a:'C',b:'F2',s:5},{t:'seg',a:'C',b:'I',s:5},{t:'segx',a:'F2',b:'M',s:5,st:'amb'},{t:'pt',id:'F2',lab:"F'",s:5,off:[-16,-4]},{t:'pt',id:'I',s:5,off:[14,6]},
  ],
  steps:[
    {ti:'Đường tròn (O), tam giác ABC nội tiếp', why:'A là điểm tự do trên cung lớn BC. B, C cũng có thể là điểm tự do trên đường tròn.',
     ggm:[`Chọn ${T('Circle with Center and Radius')} (nhóm đường tròn), bấm một chỗ làm tâm, gõ bán kính 3 → OK. Đổi tên tâm thành O.`,`Chọn ${T('Point')}, bấm ba lần lên đường tròn: A, B, C.`,`${T('Polygon')}: bấm A, B, C rồi bấm lại A.`],
     gg:['O = (0, 0)','c = Circle(O, 3)','B = Point(c)','C = Point(c)','A = Point(c)','Polygon(A, B, C)'],
     gsp:[`Dùng công cụ Compa vẽ đường tròn tâm O.`,`Chọn đường tròn → ${M('Point On Object')} ba lần, đổi tên A, B, C.`,`Nối ba cạnh.`]},
    {ti:'Hai đường cao AD, BE', why:'Chân đường cao dựng bằng đường vuông góc và giao điểm.',
     ggm:[`${T('Perpendicular Line')}: bấm A rồi BC; ${T('Intersect')} được D. Nối AD.`,`${T('Perpendicular Line')}: bấm B rồi AC; ${T('Intersect')} được E. Nối BE.`],
     gg:['D = ClosestPoint(Line(B, C), A)','E = ClosestPoint(Line(A, C), B)','Segment(A, D)','Segment(B, E)'],
     gsp:[`Chọn A và BC → ${M('Perpendicular Line')} → giao điểm D.`,`Chọn B và AC → ${M('Perpendicular Line')} → giao điểm E.`]},
    {ti:'Đường kính AK và hình chiếu F', why:'K đối xứng với A qua O. F là chân đường vuông góc từ B xuống AK.',
     ggm:[`Chọn ${T('Reflect about Point')} (nhóm biến hình), bấm A rồi bấm O: được K.`,`${T('Segment')} nối AK.`,`${T('Perpendicular Line')}: bấm B rồi AK; ${T('Intersect')} được F.`],
     gg:['K = Reflect(A, O)','Segment(A, K)','F = ClosestPoint(Line(A, K), B)'],
     gsp:[`Chọn O → ${M('Transform')} → ${M('Mark Center')}; chọn A → ${M('Transform')} → ${M('Rotate')}, nhập 180°, đổi tên K.`,`Nối AK; chọn B và AK → ${M('Perpendicular Line')} → giao điểm F.`]},
    {ti:'Trung điểm M và kiểm tra E, F, M', why:'Kéo A: ba điểm luôn thẳng hàng. Đo thêm MD và MF.',
     ggm:[`${T('Midpoint or Center')}: bấm B rồi C, được M.`,`${T('Line')}: vẽ đường thẳng EM.`,`${T('Relation')}: bấm F rồi bấm đường thẳng EM: GeoGebra báo F nằm trên đường thẳng.`,`${T('Distance or Length')}: đo MD và MF, rồi kéo A.`],
     gg:['M = Midpoint(B, C)','AreCollinear(E, F, M)','Distance(M, D)','Distance(M, F)'],
     gsp:[`Chọn BC → ${M('Midpoint')}, đổi tên M.`,`Chọn E, F, M → ${M('Construct')} → ${M('Triangle Interior')} → ${M('Measure')} → ${M('Area')}: diện tích bằng 0.`]},
    {ti:'Đổi vai B và C: được Bài 3.7', why:'Làm lại bước 2 – 4 với C thay cho B: F′ là chân đường cao từ C, I là hình chiếu của C trên AK. Ba điểm F′, I, M thẳng hàng (đường màu cam).',
     ggm:[`${T('Perpendicular Line')}: bấm C rồi AB; ${T('Intersect')} được F′.`,`${T('Perpendicular Line')}: bấm C rồi AK; ${T('Intersect')} được I.`,`${T('Line')} qua F′ và M, rồi ${T('Relation')}: bấm I và đường thẳng đó.`],
     gg:["F' = ClosestPoint(Line(A, B), C)",'I = ClosestPoint(Line(A, K), C)',"AreCollinear(F', I, M)"],
     gsp:[`Chọn C và AB → ${M('Perpendicular Line')} → giao điểm F′.`,`Chọn C và AK → ${M('Perpendicular Line')} → giao điểm I.`,`Đo diện tích tam giác F′IM.`],
     note:'Trong đề Đại Áng, hai điểm này tên là F và I. Một file hình động chứa được cả ba đề 3.3, 3.6, 3.7.'},
  ],
  read(q,step){const r=[];
    if(step>=4){r.push({k:'E, F, M lệch',v:fmt(dev(q.E,q.F,q.M),1)+'°',c:'ok'});r.push({k:'MD',v:fmt(len(sub(q.M,q.D)))});r.push({k:'MF',v:fmt(len(sub(q.M,q.F)))});}
    if(step>=5) r.push({k:"F', I, M lệch",v:fmt(dev(q.F2,q.I,q.M),1)+'°',c:'ok'});
    return r;},
  obs:[['Kéo A trên cung lớn. E, F, M có luôn thẳng hàng không? So sánh MD và MF.','Luôn thẳng hàng, và luôn có MD = MF. Gợi ý: đường thẳng qua M và trung điểm của AB là trục đối xứng chung của hai dây DF, BE.'],
       ['Đường màu cam ở bước 5 là kết luận của bài nào?','Bài 3.7 (Đại Áng): F, I, M thẳng hàng. Đổi vai B và C trong Bài 3.3 là ra đề này.']]},

{ id:'4.6', ten:'Đức Giang', sk:'Bật vết và quỹ tích', view:[-5.4,3.4,-3,5.6],
  de:`<p>Cho (O) đường kính AB = 2R. H trên tia đối của tia AB, d ⊥ AB tại H; E trên d, kẻ tiếp tuyến EM, EN. Dây MN cắt OH, OE tại K, I. Chứng minh MN² = 4.OI.IE và tìm vị trí E để diện tích ∆OIK lớn nhất.</p><p class="src">Bài 4.6 – Trường THCS Đức Giang, cuối HKI. Ở đây R = 2.</p>`,
  init:{h:-3.2,e:3.1},
  drag:{H:{kind:'x',key:'h',min:-4.4,max:-2.4},E:{kind:'y',key:'e',min:2.1,max:5.2}},
  compute(p){const O=P(0,0),A=P(-2,0),B=P(2,0),H=P(p.h,0),E=P(p.h,p.e),Du=P(p.h,1),[t1,t2]=tangentPts(O,2,E),Mm=t1.y>t2.y?t1:t2,N=t1.y>t2.y?t2:t1,I=mid(Mm,N),K=inter(Mm,N,O,B),C2=mid(O,E),Xa=P(1,0);
    return {O,A,B,H,E,Du,M:Mm,N,I,K,C2,Xa,Lc:K?mid(O,K):O};},
  objs:[
    {t:'line',a:'A',b:'Xa',s:1,st:'aux'},{t:'circle',c:'O',r:2,s:1},{t:'line',a:'H',b:'Du',s:1},
    {t:'pt',id:'O',s:1,off:[10,16]},{t:'pt',id:'A',s:1,off:[10,16]},{t:'pt',id:'B',s:1,off:[10,16]},{t:'pt',id:'H',s:1,off:[-14,16]},{t:'pt',id:'E',s:1,off:[-16,-4]},
    {t:'circle',c:'C2',thr:'O',s:2,st:'aux'},{t:'seg',a:'E',b:'M',s:2},{t:'seg',a:'E',b:'N',s:2},{t:'pt',id:'M',s:2,off:[4,-14]},{t:'pt',id:'N',s:2,off:[10,14]},
    {t:'segx',a:'M',b:'N',s:3,st:'acc'},{t:'seg',a:'O',b:'E',s:3},{t:'pt',id:'K',s:3,off:[-6,18]},{t:'pt',id:'I',s:3,off:[14,-4]},
    {t:'circle',c:'Lc',thr:'O',s:5,st:'amb'},{t:'poly',pts:['O','I','K'],s:5},
  ],
  steps:[
    {ti:'Đường tròn, điểm H, đường thẳng d và điểm E', why:'Có hai điểm tự do: H chạy trên tia đối của tia AB, E chạy trên d. Thử kéo cả hai.',
     ggm:[`Hiện trục toạ độ. ${T('Circle with Center and Radius')}: bấm gốc toạ độ, bán kính 2. ${T('Intersect')} đường tròn với trục hoành được A, B.`,`${T('Point')}: bấm lên trục hoành, bên trái A: điểm H.`,`${T('Perpendicular Line')}: bấm H rồi trục hoành: được d. ${T('Point')}: bấm lên d được E.`],
     gg:['O = (0, 0)','c = Circle(O, 2)','H = (-3.2, 0)','d = PerpendicularLine(H, xAxis)','E = Point(d)'],
     gsp:[`Vẽ đường tròn tâm O, đường kính AB nằm ngang (dựng A, B là giao của đường tròn với đường thẳng qua O).`,`Lấy H trên đường thẳng AB, phía ngoài A; chọn H và AB → ${M('Perpendicular Line')} được d.`,`Chọn d → ${M('Point On Object')}, đổi tên E.`]},
    {ti:'Hai tiếp điểm M, N', why:'Tiếp điểm nhìn OE dưới góc vuông, nên là giao của (O) với đường tròn đường kính OE.',
     ggm:[`Chọn ${T('Tangents')} (nhóm đường vuông góc), bấm E rồi bấm đường tròn: được hai tiếp tuyến.`,`${T('Intersect')}: bấm từng tiếp tuyến với đường tròn để có tiếp điểm M, N.`,`Ẩn hai tiếp tuyến, dùng ${T('Segment')} nối EM, EN.`],
     gg:['g = Circle(Midpoint(O, E), O)','M = Intersect(c, g, 1)','N = Intersect(c, g, 2)','Segment(E, M)','Segment(E, N)'],
     gsp:[`Dựng trung điểm của OE, đường tròn tâm đó qua O.`,`Chọn hai đường tròn → ${M('Construct')} → ${M('Intersection')} được M, N; nối EM, EN.`],
     note:'GeoGebra có thể cho M, N đổi chỗ so với hình. Chỉ cần đổi tên lại cho khớp.'},
    {ti:'Dây MN, điểm K và I', why:'K là giao của MN với đường thẳng AB, I là giao của MN với OE.',
     ggm:[`${T('Line')}: bấm M rồi N. ${T('Segment')}: nối O với E.`,`${T('Intersect')}: MN với trục hoành được K; MN với OE được I.`],
     gg:['s = Line(M, N)','K = Intersect(s, xAxis)','I = Intersect(s, Line(O, E))'],
     gsp:[`Vẽ đường thẳng MN, nối OE.`,`Lấy giao điểm K (với đường thẳng AB) và I (với OE).`]},
    {ti:'Bật vết dây MN rồi kéo E', why:'Bấm “Bật vết” bên dưới hình rồi kéo E (hoặc cho E tự chạy). Mọi vị trí của MN đi qua cùng một điểm.',
     ggm:[`Chuột phải vào đường thẳng MN → Show Trace (Bật vết).`,`Kéo E bằng ${T('Move')}, hoặc chuột phải vào E → Animation (Hoạt hình) để E tự chạy.`,`${T('Distance or Length')}: đo OK và OH.`],
     gg:['SetTrace(s, true)'],
     gsp:[`Chọn đường thẳng MN → ${M('Display')} → ${M('Trace Line')}.`,`Chọn E → ${M('Display')} → ${M('Animate Point')}, hoặc kéo tay.`],
     note:'Đo OK và OH: tích OK.OH luôn bằng R² = 4, nên K là điểm cố định.'},
    {ti:'Quỹ tích của I và diện tích ∆OIK', why:'I chạy trên đường tròn đường kính OK (màu cam). Diện tích ∆OIK lớn nhất khi IO = IK.',
     ggm:[`Chọn ${T('Locus')} (nhóm đường vuông góc), bấm I rồi bấm E: hiện quỹ tích của I.`,`${T('Polygon')}: bấm O, I, K rồi bấm lại O. Chọn ${T('Area')} (nhóm góc) rồi bấm vào tam giác.`],
     gg:['Locus(I, E)','Area(Polygon(O, I, K))'],
     gsp:[`Chọn I và E → ${M('Construct')} → ${M('Locus')}.`,`Dựng miền tam giác OIK → ${M('Measure')} → ${M('Area')}; kéo E tìm lúc lớn nhất.`]},
  ],
  read(q,step){const r=[];
    if(step>=3&&q.K){r.push({k:'OK',v:fmt(len(q.K))});r.push({k:'OK.OH',v:fmt(len(q.K)*Math.abs(q.H.x)),c:'ok'});}
    if(step>=5&&q.K){r.push({k:'S(OIK)',v:fmt(area(q.O,q.I,q.K),3)});r.push({k:'IO',v:fmt(len(q.I))});r.push({k:'IK',v:fmt(len(sub(q.I,q.K)))});r.push({k:'HE',v:fmt(len(sub(q.E,q.H)))});r.push({k:'OH',v:fmt(Math.abs(q.H.x))});}
    return r;},
  trace:true,
  obs:[['Bật vết rồi kéo E. Các dây MN có điểm chung nào?','Tất cả đi qua K trên OH, với OK.OH = R² = 4. K cố định khi E chạy (nhưng đổi khi H đổi).'],
       ['I chạy trên đường nào? Vì sao?','Trên đường tròn đường kính OK, vì OE ⊥ MN tại I nên ∠OIK = 90°.'],
       ['Diện tích ∆OIK lớn nhất khi nào?','Khi IO = IK (∆OIK vuông cân tại I), tương ứng HE = OH. Kéo E tới lúc hai chip IO, IK bằng nhau để kiểm tra.']]},
];


const NS='http://www.w3.org/2000/svg';
function clipLine(a,b,v){ const [x0,x1,y0,y1]=v,d=sub(b,a),ts=[],pad=1;
  if(Math.abs(d.x)>1e-12){for(const X of [x0-pad,x1+pad]){const t=(X-a.x)/d.x,y=a.y+t*d.y;if(y>=y0-pad-1e-9&&y<=y1+pad+1e-9)ts.push(t);}}
  if(Math.abs(d.y)>1e-12){for(const Y of [y0-pad,y1+pad]){const t=(Y-a.y)/d.y,x=a.x+t*d.x;if(x>=x0-pad-1e-9&&x<=x1+pad+1e-9)ts.push(t);}}
  if(ts.length<2)return null;return [Math.min(...ts),Math.max(...ts)]; }
// vẽ bản thiết kế lên svg; trả về danh sách số đo
function draw(svg,pb,p,step,tr,onDown,onKey){
  const q=pb.compute(p),v=pb.view,[x0,x1,y0,y1]=v,W=x1-x0,H=y1-y0,u=W/640;
  const el=(tag,at)=>{const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);svg.appendChild(e);return e;};
  svg.setAttribute('viewBox',`${x0} ${-y1} ${W} ${H}`); svg.style.aspectRatio=(W/H).toFixed(3); svg.innerHTML='';
  for(let x=Math.ceil(x0);x<=x1;x++) el('line',{x1:x,y1:-y1,x2:x,y2:-y0,class:'g'});
  for(let y=Math.ceil(y0);y<=y1;y++) el('line',{x1:x0,y1:-y,x2:x1,y2:-y,class:'g'});
  if(pb.trace&&step>=4) for(const [a,b] of tr) el('line',{x1:a.x,y1:-a.y,x2:b.x,y2:-b.y,class:'trace'});
  const S=o=>(o.s===step?' new':''), cls=o=>'o'+(o.st?' '+o.st:'')+S(o);
  for(const o of pb.objs){ if(o.s>step||o.t==='pt') continue;
    if(o.t==='seg'){const a=q[o.a],b=q[o.b];if(!a||!b)continue;el('line',{x1:a.x,y1:-a.y,x2:b.x,y2:-b.y,class:cls(o)});}
    else if(o.t==='segx'){const a=q[o.a],b=q[o.b];if(!a||!b)continue;const d=sub(b,a),A=add(a,mul(d,-.18)),B=add(b,mul(d,.18));el('line',{x1:A.x,y1:-A.y,x2:B.x,y2:-B.y,class:cls(o)});}
    else if(o.t==='line'||o.t==='ray'){const a=q[o.a],b=q[o.b];if(!a||!b)continue;const r=clipLine(a,b,v);if(!r)continue;let [t0,t1]=r;if(o.t==='ray')t0=Math.max(t0,0);if(t1<=t0)continue;const d=sub(b,a),A=add(a,mul(d,t0)),B=add(a,mul(d,t1));el('line',{x1:A.x,y1:-A.y,x2:B.x,y2:-B.y,class:cls(o)});}
    else if(o.t==='circle'){const c=q[o.c];if(!c)continue;const r=o.thr?len(sub(q[o.thr],c)):o.r;el('circle',{cx:c.x,cy:-c.y,r,class:cls(o)});}
    else if(o.t==='poly'){const ps=o.pts.map(k=>q[k]);if(ps.some(x=>!x))continue;el('polygon',{points:ps.map(z=>`${z.x},${-z.y}`).join(' '),class:'fill'});}
    else if(o.t==='ra'){const V=q[o.v],a=q[o.p],b=q[o.q];if(!V||!a||!b)continue;const sz=14*u,e1=mul(unit(sub(a,V)),sz),e2=mul(unit(sub(b,V)),sz),p1=add(V,e1),p2=add(add(V,e1),e2),p3=add(V,e2);el('polyline',{points:`${p1.x},${-p1.y} ${p2.x},${-p2.y} ${p3.x},${-p3.y}`,class:'o'+S(o),style:'stroke-width:1.1'});}
  }
  const cx=(x0+x1)/2,cy=(y0+y1)/2;
  for(const o of pb.objs){ if(o.t!=='pt'||o.s>step) continue; const z=q[o.id]; if(!z) continue;
    if(z.x<x0-.5||z.x>x1+.5||z.y<y0-.5||z.y>y1+.5) continue;
    if(pb.drag[o.id]){ const h=el('circle',{cx:z.x,cy:-z.y,r:16*u,class:'halo','data-id':o.id}); h.addEventListener('pointerdown',onDown);
      const c=el('circle',{cx:z.x,cy:-z.y,r:6.5*u,class:'drag','data-id':o.id,tabindex:0,role:'slider','aria-label':'Kéo điểm '+o.id}); c.addEventListener('pointerdown',onDown); c.addEventListener('keydown',onKey); }
    else el('circle',{cx:z.x,cy:-z.y,r:3.6*u,class:'pt'+S(o)});
    let off=o.off; if(!off){const d=unit(sub(z,P(cx,cy)));off=[d.x*16,-d.y*16];}
    const t=el('text',{x:z.x+off[0]*u,y:-z.y+off[1]*u+5*u,'font-size':17*u,'stroke-width':3*u,'text-anchor':'middle',class:S(o).trim()}); t.textContent=o.lab||o.id;
  }
  return pb.read(q,step,p);
}
// đổi toạ độ chuột → toạ độ hình, áp vào tham số kéo
function dragTo(svg,pb,p,id,ev){ const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const r=pt.matrixTransform(svg.getScreenCTM().inverse()),z=P(r.x,-r.y);
  const d=pb.drag[id],q=pb.compute(p),cl=(x,a,b)=>Math.max(a,Math.min(b,x));
  if(d.kind==='arc'){let a=Math.atan2(z.y-d.c.y,z.x-d.c.x)*180/Math.PI;if(a<-90)a+=360;p[d.key]=cl(a,d.min,d.max);}
  else if(d.kind==='x')p[d.key]=cl(z.x,d.min,d.max);
  else if(d.kind==='y')p[d.key]=cl(z.y,d.min,d.max);
  else if(d.kind==='seg'){const A=q[d.a],B=q[d.b],t=dot(sub(z,A),sub(B,A))/dot(sub(B,A),sub(B,A));p[d.key]=cl(t,d.min,d.max);} }
function traceSeg(pb,p){ const q=pb.compute(p),r=clipLine(q.M,q.N,pb.view); if(!r) return null; const d=sub(q.N,q.M); return [add(q.M,mul(d,r[0])),add(q.M,mul(d,r[1]))]; }
return { PROB, draw, dragTo, traceSeg, fmt };
})();
