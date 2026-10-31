// ======== MINH HOẠ VŨ TRỤ (SVG + canvas, tự vẽ) ========
// bầu trời sao chuyển động
function sky(){
  const c=document.getElementById('sky'); if(!c) return; const g=c.getContext('2d');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W,H,stars=[],neb=[],shoot=null,t=0;
  function size(){ const r=devicePixelRatio||1; W=innerWidth; H=innerHeight; c.width=W*r; c.height=H*r; c.style.width=W+'px'; c.style.height=H+'px'; g.setTransform(r,0,0,r,0,0);
    stars=Array.from({length:Math.round(W*H/2600)},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random()*0.9+0.1,p:Math.random()*6.28}));
    neb=[{x:W*.15,y:H*.25,r:Math.max(W,H)*.45,c:'rgba(120,70,200,0.10)'},{x:W*.85,y:H*.7,r:Math.max(W,H)*.5,c:'rgba(40,140,200,0.10)'},{x:W*.6,y:H*.1,r:Math.max(W,H)*.3,c:'rgba(255,150,80,0.05)'}]; }
  function frame(){
    t+=1; g.clearRect(0,0,W,H);
    neb.forEach(n=>{ const gr=g.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r); gr.addColorStop(0,n.c); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H); });
    stars.forEach(s=>{ if(!reduce){ s.x-=s.z*0.15; if(s.x<0) s.x+=W; } const a=0.35+0.65*Math.abs(Math.sin(s.p+t*0.02*s.z)); g.fillStyle=`rgba(${s.z>.8?'255,230,190':'210,230,255'},${a*s.z})`; const r=s.z*1.6; g.fillRect(s.x,s.y,r,r); });
    if(!reduce){ if(!shoot&&Math.random()<0.004) shoot={x:Math.random()*W*0.8+W*0.2,y:Math.random()*H*0.4,l:0};
      if(shoot){ shoot.l+=1; const x=shoot.x-shoot.l*9,y=shoot.y+shoot.l*4; const gr=g.createLinearGradient(x,y,x+90,y-40); gr.addColorStop(0,'rgba(255,255,255,0.9)'); gr.addColorStop(1,'rgba(111,227,245,0)'); g.strokeStyle=gr; g.lineWidth=2; g.beginPath(); g.moveTo(x,y); g.lineTo(x+90,y-40); g.stroke(); if(shoot.l>40) shoot=null; } }
    if(!reduce&&!document.hidden) requestAnimationFrame(frame); else if(!reduce) setTimeout(()=>requestAnimationFrame(frame),500);
  }
  size(); addEventListener('resize',size); frame();
}
// linh vật PÔLYA-7 – robot trắng, kính mặt xanh đậm, mắt cười phát sáng (vẽ riêng cho game)
let BOTN=0;
function botSVG(cls='bot'){
  const k='b'+(BOTN++), O='#1d2a5c';
  return `<svg class="${cls}" viewBox="0 0 120 150" aria-hidden="true">
  <defs>
    <linearGradient id="${k}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3fa8"/><stop offset="1" stop-color="#121c5a"/></linearGradient>
    <linearGradient id="${k}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#ffffff"/><stop offset="1" stop-color="#d7e3ff"/></linearGradient>
  </defs>
  <ellipse class="shadow" cx="60" cy="145" rx="26" ry="4" fill="#7fa6e8" opacity=".45"/>
  <g class="float">
  <!-- tay trái buông -->
  <path d="M38 100 Q24 104 26 118 Q30 124 38 116 Z" fill="url(#${k}w)" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
  <!-- tay phải vẫy -->
  <g class="wave"><path d="M80 98 Q96 92 100 76 Q100 68 93 70 Q86 82 78 88 Z" fill="url(#${k}w)" stroke="${O}" stroke-width="3" stroke-linejoin="round"/></g>
  <!-- thân -->
  <path d="M38 90 Q36 128 60 132 Q84 128 82 90 Z" fill="url(#${k}w)" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M46 102 H74 Q74 120 60 122 Q46 120 46 102 Z" fill="#3ec6f5" stroke="${O}" stroke-width="2.6"/>
  <!-- vây tai -->
  <path d="M16 46 L20 22 Q24 20 25 26 L25 46 Z" fill="#4aa8ff" stroke="${O}" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M104 46 L100 22 Q96 20 95 26 L95 46 Z" fill="#4aa8ff" stroke="${O}" stroke-width="2.6" stroke-linejoin="round"/>
  <!-- tay cầm trên đầu -->
  <rect x="50" y="10" width="20" height="12" rx="5" fill="#fff" stroke="${O}" stroke-width="3"/>
  <!-- đầu -->
  <ellipse cx="60" cy="56" rx="42" ry="36" fill="url(#${k}w)" stroke="${O}" stroke-width="3.2"/>
  <rect x="11" y="42" width="14" height="28" rx="7" fill="#fff" stroke="${O}" stroke-width="3"/>
  <rect x="95" y="42" width="14" height="28" rx="7" fill="#fff" stroke="${O}" stroke-width="3"/>
  <!-- kính mặt -->
  <path d="M30 46 Q30 32 46 32 H74 Q90 32 90 46 V60 Q90 76 74 76 Q66 72 60 72 Q54 72 46 76 Q30 76 30 60 Z" fill="url(#${k}v)" stroke="${O}" stroke-width="3"/>
  <ellipse cx="60" cy="44" rx="22" ry="5" fill="#ffffff" opacity=".08"/>
  <g class="eyes"><path d="M40 56 Q46 49 52 56" stroke="#5ff2ff" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="M68 56 Q74 49 80 56" stroke="#5ff2ff" stroke-width="4.2" fill="none" stroke-linecap="round"/></g>
  <g class="glow" opacity=".35"><path d="M40 56 Q46 49 52 56" stroke="#5ff2ff" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M68 56 Q74 49 80 56" stroke="#5ff2ff" stroke-width="10" fill="none" stroke-linecap="round"/></g>
  </g></svg>`;
}
// nhạc nền: hộp nhạc không gian, êm và vui (tự tổng hợp bằng WebAudio)
const MUSIC={ctx:null,master:null,timer:null,step:0,next:0,on:false};
function mtof(n){ return 440*Math.pow(2,(n-69)/12); }
function musicStart(ctx){
  if(MUSIC.on) return; MUSIC.on=true; MUSIC.ctx=ctx;
  const master=ctx.createGain(); master.gain.value=0; master.connect(ctx.destination);
  const dl=ctx.createDelay(); dl.delayTime.value=0.42; const fb=ctx.createGain(); fb.gain.value=0.32; const wet=ctx.createGain(); wet.gain.value=0.45;
  dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(master);
  MUSIC.master=master; MUSIC.dl=dl;
  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime+2);
  const CH=[[48,[60,64,67,71,72,76]],[45,[57,60,64,67,69,72]],[41,[57,60,65,69,72,76]],[43,[55,59,62,67,71,74]]];
  const PAT=[0,2,4,5,4,2,3,1];
  const spb=60/84/2; MUSIC.step=0; MUSIC.next=ctx.currentTime+0.1;
  function note(f,t,d,vol,type){ const o=ctx.createOscillator(), g=ctx.createGain(); o.type=type; o.frequency.value=f; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+d); o.connect(g); g.connect(master); g.connect(dl); o.start(t); o.stop(t+d+0.05); }
  function tick(){
    while(MUSIC.next<ctx.currentTime+0.25){
      const bar=Math.floor(MUSIC.step/8)%CH.length, [root,tones]=CH[bar], i=MUSIC.step%8, t=MUSIC.next;
      const n=tones[PAT[i]]+(MUSIC.step%32>=16&&i%2?12:0);
      note(mtof(n),t,1.3,0.05,'sine'); note(mtof(n+12),t,0.6,0.012,'triangle');
      if(i===0){ note(mtof(root),t,spb*8,0.05,'sine'); note(mtof(root+12),t,spb*8,0.018,'triangle'); }
      if(i===4) note(mtof(root+7),t,spb*4,0.03,'sine');
      MUSIC.step++; MUSIC.next+=spb;
    }
  }
  tick(); MUSIC.timer=setInterval(tick,90);
}
function musicStop(){ if(!MUSIC.on) return; MUSIC.on=false; clearInterval(MUSIC.timer); const c=MUSIC.ctx, m=MUSIC.master; try{ m.gain.cancelScheduledValues(c.currentTime); m.gain.setValueAtTime(m.gain.value,c.currentTime); m.gain.linearRampToValueAtTime(0,c.currentTime+0.6); setTimeout(()=>{ try{ m.disconnect(); }catch(e){} },800);}catch(e){} }
// biểu tượng khoang
const ZICON = {
  train:`<svg viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 40 h16 M24 34 v6" stroke="currentColor" stroke-width="2.4"/><path d="M12 28 L20 20 L26 25 L36 15" stroke="#ffb547" stroke-width="2.4" fill="none"/></svg>`,
  lab:`<svg viewBox="0 0 48 48"><path d="M24 6 L42 15 L24 24 L6 15 Z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M6 23 L24 32 L42 23" fill="none" stroke="#ffb547" stroke-width="2.4"/><path d="M6 31 L24 40 L42 31" fill="none" stroke="currentColor" stroke-width="2.4" opacity=".6"/></svg>`,
  ch1:`<svg viewBox="0 0 48 48"><path d="M8 40 L40 40 L8 8 Z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M8 33 h7 v7" stroke="#ffb547" stroke-width="2.4" fill="none"/><path d="M8 40 L24 24" stroke="currentColor" stroke-dasharray="3 3" stroke-width="2"/></svg>`,
  ch2:`<svg viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="19" ry="8" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="24" cy="24" r="8" fill="none" stroke="#ffb547" stroke-width="2.4"/><circle cx="24" cy="24" r="2.5" fill="currentColor"/></svg>`,
  ch3:`<svg viewBox="0 0 48 48"><path d="M8 34 A16 16 0 0 1 40 34 Z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M24 30 L36 10" stroke="#ffb547" stroke-width="3"/><path d="M6 40 h36" stroke="currentColor" stroke-width="2.4"/></svg>`,
  ch4:`<svg viewBox="0 0 48 48"><circle cx="20" cy="26" r="12" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M32 4 L32 44" stroke="#ffb547" stroke-width="2.4"/><circle cx="32" cy="26" r="2.8" fill="#ffb547"/></svg>`,
  ch5:`<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M8 24 h32" stroke="#ffb547" stroke-width="2.4"/><circle cx="24" cy="24" r="5" fill="currentColor" opacity=".7"/></svg>`,
};
// trạm Orthos – mỗi khoang là một con tàu vẽ tay nét mực, màu pastel
const INK='#2a2533';
const ST=`stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
function grid(x,y,w,h,nx,ny,fill){ let g=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${ST}/>`; for(let i=1;i<nx;i++) g+=`<path d="M${x+w*i/nx} ${y} V${y+h}" stroke="${INK}" stroke-width="1.3"/>`; for(let j=1;j<ny;j++) g+=`<path d="M${x} ${y+h*j/ny} H${x+w}" stroke="${INK}" stroke-width="1.3"/>`; return g; }
const CRAFT = {
  // tên lửa huấn luyện
  train:()=>`<g class="flower"><circle cx="0" cy="66" r="9" fill="#ffd34d" ${ST}/><circle cx="-10" cy="60" r="7" fill="#ffb35c" ${ST}/><circle cx="10" cy="60" r="7" fill="#ffb35c" ${ST}/><circle cx="-8" cy="74" r="7" fill="#ffb35c" ${ST}/><circle cx="8" cy="74" r="7" fill="#ffb35c" ${ST}/><circle cx="0" cy="67" r="5" fill="#ff5d5d"/></g>
    <path d="M-22 22 L-40 56 L-22 50 Z" fill="#c4c9d2" ${ST}/><path d="M22 22 L40 56 L22 50 Z" fill="#c4c9d2" ${ST}/>
    <path d="M0 -76 C20 -64 24 -30 24 10 L24 54 L-24 54 L-24 10 C-24 -30 -20 -64 0 -76 Z" fill="#e6e9ee" ${ST}/>
    <path d="M0 -76 C14 -68 20 -52 21 -40 L-21 -40 C-20 -52 -14 -68 0 -76 Z" fill="#ff7f93" ${ST}/>
    <circle cx="0" cy="-14" r="10" fill="#a8dcff" ${ST}/><path d="M-4 -18 Q0 -21 4 -18" stroke="#fff" stroke-width="2" fill="none"/>
    <path d="M-12 14 h4 M-4 14 h4 M4 14 h4 M12 14 h-1" stroke="${INK}" stroke-width="2"/><path d="M-24 40 H24" stroke="${INK}" stroke-width="2"/>`,
  // vệ tinh cánh vàng chanh
  ch2:()=>`<g transform="rotate(-12)">${grid(-112,-11,84,22,6,2,'#c6e86a')}${grid(28,-11,84,22,6,2,'#c6e86a')}
    <path d="M-28 0 H-16 M16 0 H28" stroke="${INK}" stroke-width="2.6"/>
    <path d="M-16 -16 L10 -16 L16 -10 L16 16 L-10 16 L-16 10 Z" fill="#ffb35c" ${ST}/><path d="M10 -16 L10 10 L16 16 M10 10 L-16 10" stroke="${INK}" stroke-width="1.6" fill="none"/>
    <path d="M-6 -16 Q2 -34 14 -26" fill="#ffe2b8" ${ST}/><path d="M4 -26 L8 -40" stroke="${INK}" stroke-width="2"/><circle cx="8" cy="-42" r="3" fill="#ff5d5d" ${ST}/></g>`,
  // tàu con thoi
  ch1:()=>`<g transform="rotate(-8)"><g class="exh"><circle cx="112" cy="-6" r="7" fill="#ffb35c" ${ST}/><circle cx="128" cy="2" r="5" fill="#ffd34d" ${ST}/><circle cx="140" cy="-4" r="3.5" fill="#ff8f9a" ${ST}/></g>
    <path d="M-10 14 L58 14 L74 44 L-24 34 Z" fill="#cfd4dc" ${ST}/>
    <path d="M52 -20 L66 -50 L82 -50 L80 -20 Z" fill="#cfd4dc" ${ST}/>
    <path d="M-96 2 C-90 -18 -50 -24 10 -22 L84 -22 L94 -8 L94 16 L-60 20 C-84 18 -98 12 -96 2 Z" fill="#eef0f3" ${ST}/>
    <path d="M-86 -6 Q-78 -14 -64 -14 L-62 -4 L-86 -2 Z" fill="#3b3f4f" ${ST}/>
    <path d="M-40 -22 L-40 18 M10 -22 L10 18" stroke="${INK}" stroke-width="1.5"/>
    <circle cx="98" cy="-10" r="9" fill="#ffb35c" ${ST}/><circle cx="98" cy="-10" r="4" fill="#ff5d5d"/><circle cx="98" cy="10" r="9" fill="#ffb35c" ${ST}/><circle cx="98" cy="10" r="4" fill="#ff5d5d"/></g>`,
  // tàu đổ bộ có chảo ăng-ten (đài quan sát)
  ch3:()=>`<path d="M-20 18 L-34 44 M20 18 L34 44 M0 20 L0 46" stroke="${INK}" stroke-width="2.6"/><path d="M-40 44 h12 M28 44 h12 M-6 46 h12" stroke="${INK}" stroke-width="3.2"/>
    ${grid(-24,-8,48,28,3,2,'#c8f0dc')}
    <path d="M-30 -22 Q0 -64 40 -40 Q10 -14 -30 -22 Z" fill="#a8e8a0" ${ST}/><path d="M4 -34 L22 -56" stroke="${INK}" stroke-width="2.4"/><circle cx="23" cy="-58" r="3" fill="#ff5d5d" ${ST}/>
    <path d="M30 -64 q8 6 0 14 M38 -68 q12 10 0 22" stroke="${INK}" stroke-width="2" fill="none" class="sig"/>
    <path d="M0 -26 L0 -8" stroke="${INK}" stroke-width="2.6"/>`,
  // tàu thăm dò chảo tím (tiếp tuyến)
  ch4:()=>`<g transform="rotate(-15)"><path d="M0 -46 L13 -44 L24 -38 L34 -30 L42 -20 L46 -8 L46 4 L42 16 L34 27 L24 36 L12 42 L0 44 L-12 42 L-24 36 L-34 27 L-42 16 L-46 4 L-46 -8 L-42 -20 L-34 -30 L-24 -38 L-12 -44 Z" fill="#b48cf2" ${ST}/>
    ${[0,1,2,3,4,5,6,7].map(i=>{ const a=i*Math.PI/4; return `<path d="M0 0 L${44*Math.cos(a)} ${44*Math.sin(a)}" stroke="${INK}" stroke-width="1.4"/>`; }).join('')}
    <circle cx="0" cy="0" r="9" fill="#cfd4dc" ${ST}/><path d="M6 6 L34 40" stroke="${INK}" stroke-width="2.6"/><rect x="28" y="38" width="14" height="18" rx="3" fill="#ff8f9a" ${ST} transform="rotate(-40 35 47)"/><circle cx="-8" cy="-6" r="2.4" fill="#fff"/></g>`,
  // tàu thăm dò thân bạc hà, chảo hồng (đường kính)
  ch5:()=>`<g transform="rotate(20)"><path d="M-46 -30 L-46 30 L10 34 L10 -34 Z" fill="#8de8c8" ${ST}/>
    ${[-22,-6,10].map(y=>`<rect x="-40" y="${y}" width="16" height="10" rx="2" fill="#c8f6e6" ${ST}/><rect x="-18" y="${y}" width="16" height="10" rx="2" fill="#c8f6e6" ${ST}/>`).join('')}
    <path d="M10 -24 L34 -16 L34 16 L10 24 Z" fill="#cfd4dc" ${ST}/>
    <ellipse cx="50" cy="0" rx="14" ry="40" fill="#ff8f9a" ${ST}/><path d="M50 -38 L40 0 L50 38 M40 0 L64 0" stroke="${INK}" stroke-width="1.8" fill="none"/><circle cx="64" cy="0" r="3.5" fill="#ffd34d" ${ST}/>
    <path d="M-46 -24 L-64 -40 M-46 24 L-66 34" stroke="${INK}" stroke-width="2.4"/><circle cx="-66" cy="-42" r="3" fill="#ff5d5d" ${ST}/></g>`,
  // trạm thí nghiệm dài màu bạc hà, pin xanh
  lab:()=>`<g transform="rotate(-6)">${grid(-40,-82,34,60,2,5,'#8ec5ff')}${grid(6,22,34,60,2,5,'#8ec5ff')}
    <path d="M-23 -22 V-6 M23 22 V6" stroke="${INK}" stroke-width="2.6"/>
    <rect x="-110" y="-22" width="190" height="44" rx="20" fill="#a7f0d8" ${ST}/>
    <path d="M-60 -22 V22 M20 -22 V22" stroke="${INK}" stroke-width="1.6"/>
    <circle cx="-38" cy="0" r="7" fill="#e6fbff" ${ST}/><circle cx="-16" cy="0" r="7" fill="#e6fbff" ${ST}/><circle cx="44" cy="0" r="7" fill="#e6fbff" ${ST}/>
    <path d="M80 -14 L104 -10 L104 10 L80 14 Z" fill="#cfd4dc" ${ST}/><ellipse cx="106" cy="0" rx="6" ry="12" fill="#8de8c8" ${ST}/>
    <ellipse cx="-110" cy="0" rx="8" ry="18" fill="#8de8c8" ${ST}/><ellipse cx="-110" cy="0" rx="3.5" ry="8" fill="#2f8f72"/></g>`,
};
// MỘT con tàu Orthos, vẽ tay nét mực + màu pastel; mỗi bộ phận là một khoang
const PART = {
  ch4:()=>`<path d="M392 156 L432 70 L566 70 L584 154 Z" fill="#c6e86a" ${ST}/>${[466,500,534].map(x=>`<path d="M${x-30+ (x-466)*0.05} 156 L${x} 70" stroke="${INK}" stroke-width="1.4"/>`).join('')}<path d="M412 113 L575 113" stroke="${INK}" stroke-width="1.4"/>
    <path d="M392 264 L432 350 L566 350 L584 266 Z" fill="#8ec5ff" ${ST}/>${[466,500,534].map(x=>`<path d="M${x-30+(x-466)*0.05} 264 L${x} 350" stroke="${INK}" stroke-width="1.4"/>`).join('')}<path d="M412 307 L575 307" stroke="${INK}" stroke-width="1.4"/>
    <path d="M432 70 L566 70" stroke="${INK}" stroke-width="5"/><path d="M432 350 L566 350" stroke="${INK}" stroke-width="5"/>`,
  ch1:()=>`<g class="flower"><circle cx="112" cy="186" r="10" fill="#ffd34d" ${ST}/><circle cx="100" cy="176" r="8" fill="#ffb35c" ${ST}/><circle cx="100" cy="196" r="8" fill="#ffb35c" ${ST}/><circle cx="86" cy="186" r="7" fill="#ff8f9a" ${ST}/><circle cx="110" cy="186" r="4" fill="#ff5d5d"/></g>
    <g class="flower"><circle cx="112" cy="236" r="10" fill="#ffd34d" ${ST}/><circle cx="100" cy="226" r="8" fill="#ffb35c" ${ST}/><circle cx="100" cy="246" r="8" fill="#ffb35c" ${ST}/><circle cx="86" cy="236" r="7" fill="#ff8f9a" ${ST}/><circle cx="110" cy="236" r="4" fill="#ff5d5d"/></g>
    <path d="M124 170 L178 166 L178 204 L124 200 Z" fill="#ffb35c" ${ST}/><path d="M124 220 L178 216 L178 254 L124 250 Z" fill="#ffb35c" ${ST}/>
    <path d="M140 168 V202 M140 218 V252" stroke="${INK}" stroke-width="1.6"/>`,
  hull:()=>`<path d="M176 156 L700 146 Q860 154 936 210 Q860 266 700 274 L176 264 Q158 210 176 156 Z" fill="#e9f7f1" ${ST}/>
    <path d="M190 172 L700 164 Q800 168 860 184" stroke="#b48cf2" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M190 248 L700 256 Q800 252 860 236" stroke="#ff8f9a" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M190 172 L700 164 Q800 168 860 184 M190 248 L700 256 Q800 252 860 236" stroke="${INK}" stroke-width="1.2" fill="none" opacity=".35"/>
    ${[380,430,480,530,660,770].map(x=>`<circle cx="${x}" cy="210" r="10" fill="#a8dcff" ${ST}/><path d="M${x-4} ${206} q4 -3 8 0" stroke="#fff" stroke-width="2" fill="none"/>`).join('')}
    <path d="M560 158 V262" stroke="${INK}" stroke-width="1.5"/><path d="M820 172 V248" stroke="${INK}" stroke-width="1.5"/>
    <text x="420" y="242" fill="${INK}" font-family="Chakra Petch,sans-serif" font-size="13" font-weight="700" letter-spacing="5" opacity=".75">ORTHOS</text>`,
  ch5:()=>`<circle cx="300" cy="210" r="38" fill="#ff8f9a" ${ST}/><circle cx="300" cy="210" r="27" fill="#ffd9de" ${ST}/>
    <path d="M273 210 H327" stroke="${INK}" stroke-width="2.6"/><circle cx="273" cy="210" r="4" fill="#ffd34d" ${ST}/><circle cx="327" cy="210" r="4" fill="#ffd34d" ${ST}/><circle cx="300" cy="210" r="4.5" fill="${INK}"/>`,
  ch2:()=>`<ellipse cx="610" cy="210" rx="20" ry="98" fill="none" stroke="${INK}" stroke-width="11"/><ellipse cx="610" cy="210" rx="20" ry="98" fill="none" stroke="#ffb3d9" stroke-width="6"/>
    ${[[610,112],[610,308],[590,210],[630,210]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#ffd34d" ${ST}/>`).join('')}`,
  ch3:()=>`<path d="M660 150 Q706 92 752 148 Z" fill="#a8dcff" ${ST}/><path d="M676 134 Q690 116 708 112" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M716 118 L732 84" stroke="${INK}" stroke-width="2.6"/><path d="M704 92 Q730 48 768 74 Q740 100 704 92 Z" fill="#a8e8a0" ${ST}/><path d="M736 80 L752 64" stroke="${INK}" stroke-width="2"/><circle cx="754" cy="62" r="3.2" fill="#ff5d5d" ${ST}/>
    <path d="M764 48 q8 7 0 15 M772 42 q13 11 0 26" stroke="${INK}" stroke-width="2" fill="none" class="sig"/>`,
  lab:()=>`<path d="M720 262 V276 M770 262 V276" stroke="${INK}" stroke-width="3"/>
    ${grid(650,282,30,34,2,3,'#8ec5ff')}<path d="M680 299 H690" stroke="${INK}" stroke-width="2.6"/>
    <rect x="690" y="276" width="124" height="46" rx="22" fill="#8de8c8" ${ST}/>${[720,750,780].map(x=>`<circle cx="${x}" cy="299" r="7" fill="#e6fbff" ${ST}/>`).join('')}
    <ellipse cx="814" cy="299" rx="6" ry="14" fill="#c8f6e6" ${ST}/>`,
  train:()=>`<path d="M846 168 Q900 182 936 210 Q900 238 846 252 Q830 210 846 168 Z" fill="#ff7f93" ${ST}/>
    <ellipse cx="878" cy="206" rx="17" ry="13" fill="#a8dcff" ${ST}/><path d="M868 200 q8 -6 16 -2" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M936 210 L962 204" stroke="${INK}" stroke-width="2.4"/><circle cx="965" cy="203" r="3.5" fill="#ffd34d" ${ST}/>`,
};
function shipBody2D(){ return PART.ch4()+PART.ch1()+PART.hull()+PART.ch5()+PART.ch2()+PART.ch3()+PART.lab()+PART.train(); }
const SNAP={};
function shipBody(mode){ mode=mode||'ok'; if(SNAP[mode]===undefined) SNAP[mode]=(window.SHIP3D&&SHIP3D.snap(mode))||''; return SNAP[mode]?`<image href="${SNAP[mode]}" x="0" y="-20" width="1000" height="422"/>`:shipBody2D(); }
function shipArt(stat){
  // [tâm nhãn x, y, điểm neo x, y]
  const L = { ch4:[480,30,500,72], ch1:[150,92,150,166], ch5:[290,388,300,248], ch2:[620,392,612,308], ch3:[820,30,750,70], lab:[860,388,800,322], train:[860,124,880,180] };
  const NAME = { train:'Mô phỏng', lab:'Tách lớp', ch1:'K1 · Động cơ', ch2:'K2 · Trung tuyến', ch3:'K3 · Quan sát', ch4:'K4 · Tiếp tuyến', ch5:'K5 · Đường kính' };
  const puff=(x,y)=>`<g class="puff"><circle cx="${x}" cy="${y}" r="8" fill="#ffb35c" ${ST}/><circle cx="${x+9}" cy="${y-6}" r="6" fill="#ffb35c" ${ST}/><circle cx="${x+8}" cy="${y+6}" r="5" fill="#ffd0a0" ${ST}/></g>`;
  const star=(x,y,r,c)=>`<path class="twk" d="M${x} ${y-r} Q${x} ${y} ${x+r} ${y} Q${x} ${y} ${x} ${y+r} Q${x} ${y} ${x-r} ${y} Q${x} ${y} ${x} ${y-r} Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`;
  const lock=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-5 -2 v-4 a5 5 0 0 1 10 0 v4" fill="none" ${ST}/><rect x="-9" y="-2" width="18" height="14" rx="3" fill="#ffd34d" ${ST}/></g>`;
  const zone=k=>{ const s=stat[k], [lx,ly,ax,ay]=L[k], full=s.d===s.n, col=!s.open?'#9a96ad':full?'#2fbf71':'#ff4f6e';
    const mark=!s.open?lock(ax+14,ay-6):full?star(ax+14,ay-10,9,'#ffd34d'):puff(ax+12,ay-10);
    return `<g class="zone ${s.open?'':'off'}" data-k="${k}" tabindex="0" role="button" aria-label="${NAME[k]} ${s.open?s.d+'/'+s.n:'khoá'}">
      <g class="part">${PART[k]()}</g>
      <path d="M${lx} ${ly+(ly<ay?16:-16)} L${ax} ${ay}" stroke="${INK}" stroke-width="1.6" stroke-dasharray="3 5" stroke-linecap="round"/><circle cx="${ax}" cy="${ay}" r="3.5" fill="${INK}"/>
      ${mark}
      <g transform="translate(${lx-94} ${ly-16})"><rect class="body" width="188" height="32" rx="16" fill="#ffffff" stroke="${INK}" stroke-width="2.4"/>
      <circle cx="16" cy="16" r="6" fill="${col}" stroke="${INK}" stroke-width="1.5" class="${s.open&&!full?'warn':''}"/>
      <text x="28" y="21" fill="${INK}" font-family="Chakra Petch,sans-serif" font-size="12.5" font-weight="700">${NAME[k]}</text>
      <text x="176" y="21" text-anchor="end" fill="${s.open?(full?'#1e9d5b':'#e0284f'):'#9a96ad'}" font-family="Chakra Petch,sans-serif" font-size="12" font-weight="700">${s.open?s.d+'/'+s.n:'khoá'}</text></g></g>`; };
  const bits=Array.from({length:24},(_,i)=>{ const x=(i*157+40)%960+10, y=(i*89+20)%400+10, c=['#ffb35c','#8de8c8','#b48cf2','#ff8f9a','#8ec5ff','#c6e86a'][i%6]; return i%3?`<rect x="${x}" y="${y}" width="5" height="5" fill="${c}" stroke="${INK}" stroke-width="1" transform="rotate(${i*23} ${x+2} ${y+2})"/>`:`<circle cx="${x}" cy="${y}" r="1.8" fill="${INK}"/>`; }).join('');
  const planets=`<circle cx="62" cy="340" r="30" fill="#8de8c8" ${ST}/><circle cx="52" cy="330" r="6" fill="#c8f6e6" ${ST}/><circle cx="74" cy="352" r="4" fill="#c8f6e6" ${ST}/>
    <g transform="translate(926 322)"><path d="M-40 6 Q0 26 40 -6" stroke="${INK}" stroke-width="2.6" fill="none"/><circle r="24" fill="#ffb3d9" ${ST}/><path d="M-40 6 Q0 -10 40 -6" stroke="${INK}" stroke-width="2.6" fill="none"/></g>
    <circle cx="320" cy="44" r="13" fill="#ffb35c" ${ST}/><circle cx="324" cy="40" r="3" fill="#ffd9b0"/>`;
  return `<svg viewBox="0 0 980 420" role="img" aria-label="Tinh hạm Orthos – bấm vào từng bộ phận của tàu để vào khoang">
  <rect width="980" height="420" rx="12" fill="#f3f1fb"/>
  ${bits}${planets}${star(40,40,8,'#ffd34d')}${star(620,30,6,'#ff8f9a')}${star(220,380,7,'#b48cf2')}${star(960,150,6,'#8de8c8')}${star(420,396,5,'#ffd34d')}
  <g class="shipbob">${zone('ch4')}${zone('ch1')}<g class="hull">${PART.hull()}</g>${zone('ch5')}${zone('ch2')}${zone('ch3')}${zone('lab')}${zone('train')}</g>
  </svg>`;
}
// tranh cho cốt truyện
const SCENE = [
  // 1. tàu giữa tinh vân
  `<svg viewBox="0 0 560 210" class="scene"><defs><radialGradient id="nb1"><stop offset="0" stop-color="#7a4fd6" stop-opacity=".55"/><stop offset="1" stop-color="#7a4fd6" stop-opacity="0"/></radialGradient></defs>
   <rect width="560" height="210" fill="#070b18"/><circle cx="420" cy="70" r="140" fill="url(#nb1)"/>
   ${Array.from({length:60},(_,i)=>`<circle cx="${(i*97)%560}" cy="${(i*53)%210}" r="${i%5?0.8:1.6}" fill="#dfe8ff"/>`).join('')}
   <circle cx="470" cy="160" r="54" fill="#284a8f"/><path d="M420 150 Q470 130 522 152" stroke="#6fe3f5" stroke-opacity=".35" stroke-width="6" fill="none"/>
   <g transform="translate(20 4) scale(.5)">${shipBody('ok')}</g></svg>`,
  // 2. bão từ
  `<svg viewBox="0 0 560 210" class="scene"><rect width="560" height="210" fill="#0b0716"/>
   <g fill="none" stroke="#c58bff" stroke-opacity=".5" stroke-width="3"><path d="M-20 60 Q140 0 280 70 T600 50"/><path d="M-20 120 Q160 60 300 130 T600 110"/><path d="M-20 180 Q180 120 320 190 T600 170"/></g>
   <path class="bolt" d="M300 10 L270 90 L300 90 L262 200 L340 76 L306 76 L336 10 Z" fill="#fff3a0"/>
   <g transform="translate(40 30) rotate(-6) scale(.42)">${shipBody('bad')}</g>
   <text x="410" y="190" fill="#ff6b7a" font-family="Chakra Petch,sans-serif" font-size="16" font-weight="700">LÕI SUY LUẬN: 0%</text></svg>`,
  // 3. PÔLYA-7
  `<svg viewBox="0 0 560 210" class="scene"><rect width="560" height="210" fill="#0a1230"/><g fill="#6fe3f5" opacity=".08">${Array.from({length:14},(_,i)=>`<rect x="${i*40}" y="0" width="1" height="210"/>`).join('')}</g>
   <g transform="translate(222 4) scale(1.35)">${botSVG('').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g></svg>`,
  // 4. Máy lắp ráp
  `<svg viewBox="0 0 560 210" class="scene"><rect width="560" height="210" fill="#0a1230"/>
   <ellipse cx="90" cy="105" rx="70" ry="44" fill="#123c35" stroke="#5fe0a0" stroke-width="3"/><text x="90" y="110" text-anchor="middle" fill="#5fe0a0" font-family="Chakra Petch,sans-serif" font-size="16" font-weight="700">INPUT</text>
   <path d="M168 105 h36" stroke="#e8edfb" stroke-width="4" marker-end="url(#ar)"/><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#e8edfb"/></marker></defs>
   <rect x="212" y="40" width="140" height="130" rx="12" fill="#2a2412" stroke="#ffb547" stroke-width="3"/>
   <g class="gear" style="transform-origin:258px 100px"><circle cx="258" cy="100" r="22" fill="none" stroke="#ffb547" stroke-width="6" stroke-dasharray="7 5"/></g><g class="gear r" style="transform-origin:306px 128px"><circle cx="306" cy="128" r="16" fill="none" stroke="#ffd27a" stroke-width="5" stroke-dasharray="6 4"/></g>
   <text x="282" y="160" text-anchor="middle" fill="#ffb547" font-family="Chakra Petch,sans-serif" font-size="12" font-weight="700">CHỌN LỌC</text>
   <path d="M360 105 h36" stroke="#e8edfb" stroke-width="4" marker-end="url(#ar)"/>
   <ellipse cx="470" cy="105" rx="70" ry="44" fill="#3c1420" stroke="#ff6b7a" stroke-width="3"/><text x="470" y="110" text-anchor="middle" fill="#ff6b7a" font-family="Chakra Petch,sans-serif" font-size="16" font-weight="700">OUTPUT</text></svg>`,
  // 5. thẻ
  `<svg viewBox="0 0 560 210" class="scene"><rect width="560" height="210" fill="#0a1230"/>
   ${[['G','#ff7a85',-18],['V','#3fd6c2',-9],['N','#6aa8ff',0],['S','#ffc04d',9],['B','#ffd27a',18]].map(([k,c,a],i)=>`<g transform="translate(280 230) rotate(${a}) translate(-40 -200)"><rect width="80" height="112" rx="8" fill="#141d3d" stroke="${c}" stroke-width="3"/><rect x="8" y="8" width="26" height="16" rx="3" fill="${c}"/><text x="21" y="20" text-anchor="middle" font-family="Chakra Petch,sans-serif" font-size="12" font-weight="700" fill="#0a0f1f">${k}</text><circle cx="40" cy="62" r="18" fill="none" stroke="${c}" stroke-width="2.5"/></g>`).join('')}</svg>`,
];
