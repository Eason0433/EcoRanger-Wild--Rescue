import { save, persist, markCollected, isDiscovered } from "./state";
import { ensureAudio, SFX, animalSound, playRealSound, toggleMute, refreshMute } from "./audio";
import {
  STAGES, ORDER, ITEMS, GAME_REWARDS, EXTRA, MYSTERY, SCENARIOS, RANKS, ACH, RARITY, CATALOG,
  itemById, specialUnlocked, avatarParts, avatarHTML, biomeFor, regionOf, rarityOf
} from "./data";
import { t, applyI18n, setLang, lang, toggleLang } from "./i18n";
import { STAGE_TITLE_EN, SPECIES_EN, SCENE_EN, SCENARIO_EN, ACH_EN, RARITY_EN, STATUS_EN, RANK_EN, ITEM_EN, ITEM_HINT_EN } from "./content_en";

/** Pembantu DOM (any supaya akses .value/.innerText/.style bebas) */
const $ = (id: string): any => document.getElementById(id);

/** Pemilih kandungan dwibahasa (English bila lang=en) */
function spInfo(sp: any): Record<string, string> { return lang() === "en" ? ((SPECIES_EN[sp.name] && SPECIES_EN[sp.name].info) || sp.infoEn || sp.info) : sp.info; }
function spBank(sp: any): any[] { return lang() === "en" ? ((SPECIES_EN[sp.name] && SPECIES_EN[sp.name].bank) || sp.bank) : sp.bank; }
function titleFor(key: string): string { return lang() === "en" ? (STAGE_TITLE_EN[key] || STAGES[key].title) : STAGES[key].title; }
function typeLabel(type: string): string { return lang() === "en" ? (type === "animal" ? "Animals" : "Plants") : (type === "animal" ? "Haiwan" : "Tumbuhan"); }
/** Pemilih teks inline: L("Melayu","English") */
function L(ms: string, en: string): string { return lang() === "en" ? en : ms; }
function achName(id: string): string { return lang() === "en" ? ((ACH_EN[id] && ACH_EN[id].name) || ACH[id].name) : ACH[id].name; }
function achDesc(id: string): string { return lang() === "en" ? ((ACH_EN[id] && ACH_EN[id].desc) || ACH[id].desc) : ACH[id].desc; }
function rarityName(r: number): string { return lang() === "en" ? (RARITY_EN[r] || RARITY[r].name) : RARITY[r].name; }
function statusLabel(s: string): string { return lang() === "en" ? (STATUS_EN[s] || s) : s; }
function regionLabel(r: string): string { const m = regionOf(r); return lang() === "en" ? (m === "Dunia" ? "World" : m) : m; }
function slotName(s: string): string { const ms: any = { base: "Karakter", hat: "Topi", gear: "Gajet", pet: "Haiwan" }; const en: any = { base: "Character", hat: "Hat", gear: "Gadget", pet: "Pet" }; return (lang() === "en" ? en : ms)[s]; }
function rankName(r: any): string { return lang() === "en" ? (RANK_EN[r.name] || r.name) : r.name; }
function itemName(it: any): string { return lang() === "en" ? (ITEM_EN[it.id] || it.name) : it.name; }
function itemHint(it: any): string { return lang() === "en" ? (ITEM_HINT_EN[it.id] || it.hint) : it.hint; }
function regionTag(r: string): string { return lang() === "en" ? r.replace("DUNIA", "WORLD") : r; }
/** Nama spesies ikut bahasa (Inggeris guna nama biasa) */
function spName(sp: any): string { return lang() === "en" ? (sp.common || sp.name) : sp.name; }
/** Tajuk babak/krisis ikut bahasa */
function sceneTitle(sc: any): string { if (lang() === "en") { const scen: any = SCENARIO_EN[sc.type]; return scen ? scen.name + "!" : sc.title; } return sc.title; }

/* ---------- CACHE IMEJ ---------- */
const imgCache: any = {};
function getImg(url){ if(imgCache[url])return imgCache[url]; const im: any = new Image(); im._ready=false; im.onload=()=>im._ready=true; im.onerror=()=>im._ready=false; im.src=url; imgCache[url]=im; return im; }

/* ---------- SKRIN ---------- */
function showScreen(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); $(id).classList.add("active"); applyI18n(); syncHUD(); }
function syncHUD(){ const r=rankFor(save.xp); ["startCoins","levelCoins","storeCoins","hudCoins"].forEach(i=>{const e=$(i);if(e)e.innerText=save.coins;}); const sr=$("startRank"); if(sr)sr.innerHTML=r.icon+" "+rankName(r); const hr=$("hudRank"); if(hr)hr.innerHTML=r.icon+" "+rankName(r); refreshMute(); }
function openHelp(){ SFX.click(); const m=$("helpModal"); m.classList.remove("hidden"); m.classList.add("flex"); }
function closeHelp(){ const m=$("helpModal"); m.classList.add("hidden"); m.classList.remove("flex"); }

/* ---------- PANGKAT / XP / GANJARAN ---------- */
function rankFor(xp){ let r=RANKS[0]; for(const x of RANKS) if(xp>=x.min) r=x; return r; }
function addXP(n){ const before=rankFor(save.xp); save.xp+=n; const after=rankFor(save.xp); persist(); syncHUD(); if(after.name!==before.name){ SFX.levelup(); toast(after.icon+" "+L("Naik Pangkat","Rank Up")+": <b>"+after.name+"</b>!","sky"); } }
function addCoins(n){ save.coins+=n; persist(); syncHUD(); }
function unlockAch(id){ if(save.ach.indexOf(id)>=0)return; save.ach.push(id); persist(); const a=ACH[id]; SFX.levelup(); toast(a.icon+" "+L("Pencapaian","Achievement")+": <b>"+achName(id)+"</b>","amber"); }
function toast(html, color?){ const c={emerald:"from-emerald-400 to-green-500",amber:"from-amber-400 to-orange-500",sky:"from-sky-400 to-blue-500",rose:"from-rose-400 to-pink-500"}[color||"emerald"]; const el=document.createElement("div"); el.className="toast pointer-events-none w-full text-center text-white font-bold text-sm px-4 py-2.5 rounded-2xl shadow-lg bg-gradient-to-r "+c; el.innerHTML=html; $("toastLayer").appendChild(el); setTimeout(()=>{el.style.transition="opacity .4s,transform .4s";el.style.opacity="0";el.style.transform="translateY(-12px)";setTimeout(()=>el.remove(),420);},1900); }

/* ---------- PILIH LEVEL ---------- */
function isUnlocked(key){ const i=ORDER.indexOf(key); return i===0||save.completed.indexOf(ORDER[i-1])>=0; }
function buildLevelGrid(){
  const r=rankFor(save.xp); const next=RANKS[RANKS.indexOf(r)+1];
  const prog=next?Math.min(100,Math.round((save.xp-r.min)/(next.min-r.min)*100)):100;
  $("rankBar").innerHTML='<div class="text-3xl">'+r.icon+'</div><div class="flex-1"><div class="flex justify-between text-xs font-bold mb-1"><span class="text-emerald-700">'+rankName(r)+'</span><span class="text-slate-400">'+save.xp+' XP'+(next?' • '+(next.min-save.xp)+' '+L("lagi →","to →")+' '+rankName(next):''  )+'</span></div><div class="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden"><div class="sheen h-full rounded-full" style="width:'+prog+'%"></div></div></div>';
  const grid=$("levelGrid"); grid.innerHTML="";
  ORDER.forEach(key=>{ const st=STAGES[key],done=save.completed.indexOf(key)>=0,open=isUnlocked(key),stars=save.stars[key]||0;
    const card=document.createElement("div");
    card.className="btn-press relative p-4 rounded-3xl border-2 transition-all "+(open?"bg-white border-emerald-200 hover:border-emerald-400 cursor-pointer shadow-md":"bg-slate-100 border-slate-200 opacity-70");
    let starHTML=""; if(done){ for(let s=0;s<3;s++) starHTML+= s<stars?"⭐":"<span class='opacity-25'>⭐</span>"; }
    card.innerHTML='<div class="flex justify-between items-start mb-2"><div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl '+(st.type==="animal"?"bg-amber-100":"bg-emerald-100")+'">'+(st.type==="animal"?"🐾":"🌿")+'</div>'+(done?'<span class="text-emerald-500 text-xl"><i class="fa-solid fa-circle-check"></i></span>':(open?'<span class="text-emerald-400 text-xl"><i class="fa-solid fa-play"></i></span>':'<span class="text-slate-400 text-xl"><i class="fa-solid fa-lock"></i></span>'))+'</div><p class="text-[10px] font-extrabold text-amber-500 uppercase tracking-wide">'+regionTag(st.region)+'</p><h3 class="display font-extrabold text-slate-800 text-base leading-tight">'+titleFor(key)+'</h3><p class="text-[11px] text-slate-500 mt-1">'+st.species.length+' '+L("spesies","species")+' • '+st.scenes.length+' '+L("krisis",st.scenes.length===1?"crisis":"crises")+'</p><div class="text-sm mt-1">'+starHTML+'</div>';
    if(open)card.onclick=()=>{SFX.click();startStage(key);};
    grid.appendChild(card);
  });
}

/* ---------- KEDAI / PENCAPAIAN ---------- */
let storeSlot="base";
const SLOT_NAMES={base:"Karakter",hat:"Topi",gear:"Gajet",pet:"Haiwan"};
function storeTab(slot){ storeSlot=slot; buildStore(); SFX.click(); }
function buildStore(){
  const tabs=$("storeTabs");
  if(tabs){ tabs.innerHTML=""; ["base","hat","gear","pet"].forEach(s=>{ const b=document.createElement("button"); b.className="btn-press px-4 py-2 rounded-2xl text-sm font-bold "+(storeSlot===s?"sheen text-white shadow":"bg-white text-slate-500 border border-slate-200"); b.innerText=slotName(s); b.onclick=()=>storeTab(s); tabs.appendChild(b); }); }
  // pratonton avatar semasa
  const prev=$("storePreview"); if(prev) prev.innerHTML=avatarHTML(86);
  const grid=$("storeGrid"); grid.innerHTML="";
  ITEMS.filter(it=>it.slot===storeSlot).forEach(it=>{
    const owned=save.owned.indexOf(it.id)>=0, eq=save.equip[it.slot]===it.id;
    const card=document.createElement("div");
    card.className="bg-white p-3 rounded-3xl border-2 text-center shadow-sm relative "+(eq?"border-emerald-400":it.rare?"border-amber-300":"border-slate-100");
    let badge=it.rare?'<span class="absolute top-2 left-2 text-[9px] font-extrabold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">RARE</span>':(it.special?'<span class="absolute top-2 left-2 text-[9px] font-extrabold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">'+L("KHAS","SPECIAL")+'</span>':'');
    let btn;
    if(it.special){ const ok=specialUnlocked(it);
      if(eq) btn='<span class="block w-full py-2 sheen text-white text-xs font-bold rounded-xl">'+L("✓ DIPAKAI","✓ EQUIPPED")+'</span>';
      else if(ok) btn='<button onclick="equipItem(\''+it.id+'\')" class="btn-press w-full py-2 bg-slate-700 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl">'+L("Pakai","Equip")+'</button>';
      else btn='<span class="block w-full py-2 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-xl">🔒 '+itemHint(it)+'</span>';
    } else if(eq) btn='<span class="block w-full py-2 sheen text-white text-xs font-bold rounded-xl">'+L("✓ DIPAKAI","✓ EQUIPPED")+'</span>';
    else if(owned) btn='<button onclick="equipItem(\''+it.id+'\')" class="btn-press w-full py-2 bg-slate-700 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl">'+L("Pakai","Equip")+'</button>';
    else btn='<button onclick="buyItem(\''+it.id+'\')" class="btn-press w-full py-2 bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold rounded-xl"><i class="fa-solid fa-coins"></i> '+it.price+'</button>';
    card.innerHTML=badge+'<div class="text-5xl mb-1">'+it.emoji+'</div><p class="text-[11px] font-bold text-slate-700 mb-2 leading-tight">'+itemName(it)+'</p>'+btn;
    grid.appendChild(card);
  });
}
function buyItem(id){ const it=itemById(id); if(!it)return; if(save.coins<it.price){SFX.wrong();toast(L("Syiling tak cukup! Main lagi untuk kumpul.","Not enough coins! Play more to earn."),"rose");return;}
  save.coins-=it.price; save.owned.push(id); save.equip[it.slot]=id; persist(); SFX.collect(); unlockAch("shopper"); buildStore(); syncHUD(); toast(L("✅ Dibeli & dipakai!","✅ Bought & equipped!"),"emerald"); }
function equipItem(id){ const it=itemById(id); if(!it)return; save.equip[it.slot]=id; persist(); SFX.click(); buildStore(); }
function unequipSlot(slot){ save.equip[slot]=null; persist(); buildStore(); }
function buildAch(){ const grid=$("achGrid"); grid.innerHTML="";
  Object.keys(ACH).forEach(id=>{ const a=ACH[id],got=save.ach.indexOf(id)>=0; const card=document.createElement("div");
    card.className="p-4 rounded-3xl text-center border-2 "+(got?"bg-white border-amber-300 shadow-md":"bg-slate-100 border-slate-200");
    card.innerHTML='<div class="text-4xl mb-1 '+(got?"":"grayscale opacity-40")+'">'+a.icon+'</div><p class="text-xs font-extrabold '+(got?"text-slate-800":"text-slate-400")+'">'+achName(id)+'</p><p class="text-[10px] text-slate-400 mt-0.5">'+achDesc(id)+'</p>'+(got?'':'<p class="text-[9px] text-slate-300 mt-1">'+L("🔒 Terkunci","🔒 Locked")+'</p>'); grid.appendChild(card); });
}

/* ===================== ENJIN ===================== */
const canvas=$("gameCanvas"),ctx=canvas.getContext("2d");
let VIEW_W=900,VIEW_H=560; const WORLD_W=2600,WORLD_H=2000;
let DPR=1;
function sizeCanvas(){ DPR=Math.min(window.devicePixelRatio||1,2);
  const wrap=$("mapWrap");
  let w=wrap?wrap.clientWidth:0, h=wrap?wrap.clientHeight:0;
  if(w<80||h<80){ w=900; h=560; }
  VIEW_W=w; VIEW_H=h;
  canvas.width=Math.round(w*DPR); canvas.height=Math.round(h*DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
sizeCanvas(); window.addEventListener("resize",sizeCanvas);

const player={x:WORLD_W/2,y:WORLD_H-200,speed:240,size:20,face:1};
const camera={x:0,y:0};
let keys: any = {}, lastTime = 0, gameActive = false, modalOpen = false;
let joyVec={x:0,y:0};
let stageKey=null,stage=null,stageSpecies=[],stageScenes=[],targetIndex=0,doorActive=false,targetArmed=true;
let trees=[],ponds=[],clearings=[],flowers=[],responders=[],habitatPatches=[];
let stageStars={mistakes:0};
const door={x:WORLD_W/2,y:150};

/* sprite pokok */
let treeSprites=[];
function makeTreeSprite(scale,pal){ const w=Math.round(120*scale),h=Math.round(150*scale); const c=document.createElement("canvas");c.width=w;c.height=h; const g=c.getContext("2d"); const cx=w/2,baseY=h*0.78;
  g.fillStyle="rgba(0,0,0,0.18)"; g.beginPath(); g.ellipse(cx,baseY+6*scale,34*scale,12*scale,0,0,Math.PI*2); g.fill();
  const tg=g.createLinearGradient(cx-7*scale,0,cx+7*scale,0); tg.addColorStop(0,"#8a5a2b");tg.addColorStop(.5,"#a9743a");tg.addColorStop(1,"#5e3c1c"); g.fillStyle=tg; g.fillRect(cx-6*scale,baseY-22*scale,12*scale,30*scale);
  const blobs=[[0,-58,30],[-22,-40,24],[22,-40,24],[-12,-24,22],[12,-24,22],[0,-34,30]];
  blobs.forEach(b=>{const bx=cx+b[0]*scale,by=baseY+b[1]*scale,br=b[2]*scale; const rg=g.createRadialGradient(bx-br*0.3,by-br*0.35,br*0.2,bx,by,br); rg.addColorStop(0,pal[2]);rg.addColorStop(.6,pal[1]);rg.addColorStop(1,pal[0]); g.fillStyle=rg; g.beginPath();g.arc(bx,by,br,0,Math.PI*2);g.fill();});
  g.fillStyle="rgba(255,255,255,0.18)"; g.beginPath();g.arc(cx-10*scale,baseY-52*scale,11*scale,0,Math.PI*2);g.fill();
  return {canvas:c,w,h,footY:baseY};
}
function initTreeSprites(p){ treeSprites=[]; p.forEach(x=>{treeSprites.push(makeTreeSprite(1,x));treeSprites.push(makeTreeSprite(.78,x));}); }

function rand(a,b){return Math.random()*(b-a)+a;}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function dist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by);}

function inPond(x,y){ for(const p of ponds){ if(dist(x,y,p.x,p.y)<p.r*0.92) return p; } return null; }
function collides(nx,ny){ if(nx<40||nx>WORLD_W-40||ny<40||ny>WORLD_H-40)return true; for(const t of trees){ if(t.burning)continue; if(dist(nx,ny,t.x,t.y)<t.cr)return true; } return false; }

function buildWorld(){
  trees=[];ponds=[];clearings=[];flowers=[];responders=[];habitatPatches=[];
  const region=stage.region; let pal;
  if(region.indexOf("MALAYSIA")>=0)pal=[["#1f7a4d","#2fae6a","#7ef0ab"],["#256b3a","#3aa856","#86e08f"]];
  else if(region.indexOf("ASIA")>=0)pal=[["#1f7a5a","#22a08f","#74e6cf"],["#3a7a2e","#62a83f","#bff06a"]];
  else pal=[["#8a6a2f","#b88a3a","#f0c46a"],["#3a6a3a","#5fa83f","#a6e06a"]];
  initTreeSprites(pal);
  // tasik organik
  const nPonds=region.indexOf("DUNIA")>=0?3:4;
  for(let i=0;i<nPonds;i++){ ponds.push(makeBlob(rand(380,WORLD_W-380),rand(360,WORLD_H-360),rand(150,230))); }
  // kawasan lapang (habitat darat) - bukan blok, bentuk organik
  for(let i=0;i<10;i++){ let cx=rand(260,WORLD_W-260),cy=rand(260,WORLD_H-260); if(inPond(cx,cy))continue; clearings.push(makeBlob(cx,cy,rand(120,180))); }
  // pagar pokok sempadan
  for(let x=0;x<=WORLD_W;x+=72){ pushTree(x,32); pushTree(x,WORLD_H-32); }
  for(let y=0;y<=WORLD_H;y+=72){ pushTree(32,y); pushTree(WORLD_W-32,y); }
  // pokok dalaman (elak tasik, kawasan lapang, pintu, pemain)
  for(let i=0;i<150;i++){ let rx=rand(90,WORLD_W-90),ry=rand(90,WORLD_H-90);
    if(inPond(rx,ry))continue; let inClear=clearings.some(c=>dist(rx,ry,c.x,c.y)<c.r*0.7);
    if(inClear)continue; if(dist(rx,ry,player.x,player.y)<180||dist(rx,ry,door.x,door.y)<150)continue;
    if(!collides(rx,ry))pushTree(rx,ry); }
  // bunga hiasan dalam kawasan lapang
  clearings.forEach(c=>{ for(let i=0;i<10;i++){ let a=Math.random()*Math.PI*2,d=Math.random()*c.r*0.8; flowers.push({x:c.x+Math.cos(a)*d,y:c.y+Math.sin(a)*d,c:["#fb7185","#fbbf24","#a78bfa","#f472b6","#fde047"][Math.floor(Math.random()*5)],s:rand(4,7)}); } });
}
function makeBlob(x,y,r): any { const pts=[],n=10; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2; const rr=r*rand(0.78,1.12); pts.push({x:x+Math.cos(a)*rr,y:y+Math.sin(a)*rr}); } return {x,y,r,pts}; }
function pushTree(x,y){ trees.push({x,y,si:Math.floor(Math.random()*treeSprites.length),cr:22,burning:false}); }

function placeSpecies(){
  stageSpecies=JSON.parse(JSON.stringify(stage.species));
  stageSpecies.forEach(sp=>{ getImg(sp.image); sp.biome=biomeFor(sp); sp.found=false;
    if(sp.biome==="air" && ponds.length){ const p=ponds[Math.floor(Math.random()*ponds.length)]; sp.x=p.x+rand(-p.r*0.4,p.r*0.4); sp.y=p.y+rand(-p.r*0.4,p.r*0.4); return; }
    // cipta tompok habitat bertema (ais/gurun/savana/darat) di lokasi sah
    let hx,hy,tries=0;
    do{ hx=rand(280,WORLD_W-280); hy=rand(280,WORLD_H-280); tries++; }
    while((inPond(hx,hy)||dist(hx,hy,player.x,player.y)<240||dist(hx,hy,door.x,door.y)<220||habitatPatches.some(p=>dist(hx,hy,p.x,p.y)<300))&&tries<120);
    const patch=makeBlob(hx,hy,rand(130,165)); patch.biome=sp.biome; habitatPatches.push(patch);
    sp.x=hx+rand(-30,30); sp.y=hy+rand(-30,30);
  });
}
function placeScenes(){
  stageScenes=JSON.parse(JSON.stringify(stage.scenes));
  stageScenes.forEach(sc=>{ let hx,hy,tries=0;
    do{ hx=rand(220,WORLD_W-220); hy=rand(220,WORLD_H-220); tries++; }
    while((inPond(hx,hy)||dist(hx,hy,player.x,player.y)<260||dist(hx,hy,door.x,door.y)<200)&&tries<200);
    sc.x=hx;sc.y=hy;sc.resolved=false;sc.resolving=false;sc.fireLife=1;
    // titik api untuk babak kebakaran (hutan terbakar)
    if(sc.type==="api"){ sc.fireSpots=[]; for(let i=0;i<10;i++){ const a=Math.random()*Math.PI*2,d=Math.random()*135; sc.fireSpots.push({x:hx+Math.cos(a)*d,y:hy+Math.sin(a)*d,ph:Math.random()*6,sz:rand(.8,1.3)}); }
      // bakar pokok sedia ada yang berdekatan
      trees.forEach(t=>{ if(dist(t.x,t.y,hx,hy)<160) t.burning=true; });
      // tanam beberapa pokok terbakar supaya kelihatan sebuah hutan menyala
      for(let i=0;i<6;i++){ const a=Math.random()*Math.PI*2,d=rand(40,140); const bx=hx+Math.cos(a)*d,by=hy+Math.sin(a)*d; if(inPond(bx,by))continue; trees.push({x:bx,y:by,si:Math.floor(Math.random()*treeSprites.length),cr:22,burning:true}); } }
  });
}

function startStage(key){
  ensureAudio();
  stageKey=key; stage=STAGES[key];
  player.x=WORLD_W/2; player.y=WORLD_H-200; camera.x=player.x-VIEW_W/2; camera.y=player.y-VIEW_H/2;
  buildWorld(); placeSpecies(); placeScenes();
  targetIndex=0; doorActive=false; targetArmed=true; stageStars={mistakes:0};
  $("hudZone").innerText=stage.region+" — "+typeLabel(stage.type);
  buildStampRow(); updateObjective(); syncHUD();
  showScreen("screen-game"); sizeCanvas(); applyCtrlMode(); gameActive=true; modalOpen=false; keys={};
  maybeTut("explore");
  if(!(window as any)._loop){ (window as any)._loop=true; lastTime=0; requestAnimationFrame(gameLoop); }
}
function quitToLevels(){ SFX.click(); gameActive=false; goLevels(); }

function buildStampRow(){ const row=$("stampRow"); row.innerHTML="";
  stageSpecies.forEach((sp,i)=>{ const d=document.createElement("div"); d.id="stamp-"+i; d.className="w-11 h-11 rounded-2xl bg-white/75 border-2 border-white/90 flex items-center justify-center text-xl shadow-md"; d.innerText="❔"; row.appendChild(d); });
}
function compass(tx,ty){ const ang=Math.atan2(ty-player.y,tx-player.x); let deg=(ang*180/Math.PI+360)%360,idx=Math.round(deg/45)%8;
  const ms=["Timur","Tenggara","Selatan","Barat Daya","Barat","Barat Laut","Utara","Timur Laut"];
  const en=["East","Southeast","South","Southwest","West","Northwest","North","Northeast"];
  return {name:(lang()==="en"?en:ms)[idx],arrow:["➡️","↘️","⬇️","↙️","⬅️","↖️","⬆️","↗️"][idx]}; }

function updateObjective(){
  const found=stageSpecies.filter(s=>s.found).length;
  const tT=$("targetThumb"),tN=$("targetName"),tD=$("targetDir"),obj=$("hudObjective");
  const EN=lang()==="en";
  if(doorActive){ tT.innerText="🚪"; tN.innerText=EN?"Portal Open!":"Portal Terbuka!"; const c=compass(door.x,door.y); tD.innerText=c.arrow+" "+c.name; obj.innerText=EN?"✅ All stamps collected! Head to the portal to finish.":"✅ Semua cop dikumpul! Menuju portal untuk tamat."; }
  else if(targetIndex<stageSpecies.length){ const sp=stageSpecies[targetIndex];
    getImg(sp.image); tT.innerHTML='<img src="'+sp.image+'" class="w-full h-full object-cover" onerror="this.parentElement.textContent=\''+sp.emoji+'\'">';
    tN.innerText=spName(sp); obj.innerText="🎯 "+t("obj_track")+" "+spName(sp)+(sp.habitat==="air"?(EN?" (in water!)":" (di air!)"):"")+" — "+(found)+"/"+stageSpecies.length+" "+t("stamp"); }
}

/* ---------- SPESIES & KUIZ ---------- */
let quiz=[],qIndex=0,qCorrect=0,combo=0,currentSpecies=null;
function buildQuizFor(sp){
  let pool=[];
  spBank(sp).forEach(q=>{ if(q.tf!==undefined) pool.push({kind:"text",prompt:q.q,opts:[{text:L("✅ Betul","✅ True"),correct:q.tf===true},{text:L("❌ Salah","❌ False"),correct:q.tf===false}]});
    else pool.push({kind:"text",prompt:q.q,opts:q.a.map((t,i)=>({text:t,correct:i===q.c}))}); });
  // soalan kenal-pasti gambar
  const others=stageSpecies.filter(x=>x.name!==sp.name).slice(0,2);
  if(others.length>=2){ const opts=[{img:sp.image,correct:true}].concat(others.map(o=>({img:o.image,correct:false}))); pool.push({kind:"image",prompt:L("Yang manakah "+sp.name+"? Pilih gambar betul.","Which one is the "+spName(sp)+"? Pick the correct photo."),opts:opts}); }
  pool=shuffle(pool).slice(0,3).map(q=>({kind:q.kind,prompt:q.prompt,opts:shuffle(q.opts.slice())}));
  return pool;
}
function openSpecies(sp){ currentSpecies=sp; modalOpen=true; keys={}; ensureAudio(); SFX.collect();
  $("spName").innerText=spName(sp); $("spSci").innerText=sp.sci+" • "+(lang()==="en"?sp.name:sp.common); $("spStatus").innerText=statusLabel(sp.status); $("spFallback").innerText=sp.emoji;
  const img=$("spImg"); img.style.display="block"; img.src=sp.image; img.onerror=function(){this.style.display="none";};
  const info=$("spInfo"); info.innerHTML='<div class="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl sm:col-span-2"><b class="block text-[10px] text-emerald-600 uppercase tracking-wide mb-0.5">'+L("Nama","Name")+'</b><span class="text-slate-800 font-bold">'+spName(sp)+'</span> <span class="text-slate-400 italic text-xs">('+(lang()==="en"?sp.name:sp.common)+' · '+sp.sci+')</span></div>'; for(const k in spInfo(sp)) info.innerHTML+='<div class="bg-slate-50 border border-slate-100 p-2.5 rounded-xl"><b class="block text-[10px] text-emerald-600 uppercase tracking-wide mb-0.5">'+k+'</b><span class="text-slate-700">'+spInfo(sp)[k]+'</span></div>';
  quiz=buildQuizFor(sp); qIndex=0; qCorrect=0;
  $("spHeader").style.display="block";
  $("studyView").classList.remove("hidden"); $("quizView").classList.add("hidden"); $("quizResult").classList.add("hidden");
  const m=$("speciesModal"); m.classList.remove("hidden"); m.classList.add("flex");
}
function closeSpecies(){ const m=$("speciesModal"); m.classList.add("hidden"); m.classList.remove("flex"); modalOpen=false; }
function startQuiz(){ SFX.click(); $("spHeader").style.display="none"; $("studyView").classList.add("hidden"); $("quizView").classList.remove("hidden"); renderQ(); }
function renderQ(){
  $("qNum").innerText=qIndex+1;
  const dots=$("qDots"); dots.innerHTML=""; for(let i=0;i<3;i++){ dots.innerHTML+='<div class="flex-1 h-1.5 rounded-full '+(i<qIndex?"bg-emerald-400":(i===qIndex?"bg-amber-300":"bg-slate-200"))+'"></div>'; }
  const q=quiz[qIndex];
  $("qKind").innerHTML = q.kind==="image"?'<i class="fa-solid fa-image"></i> '+L("Kenal Pasti Gambar","Identify the Photo") : (q.opts.length===2?'<i class="fa-solid fa-circle-half-stroke"></i> '+L("Betul / Salah","True / False"):'<i class="fa-solid fa-list-check"></i> '+L("Pilihan","Multiple Choice"));
  $("qText").innerText=q.prompt;
  const cp=$("comboPill"); if(combo>=2){cp.classList.remove("hidden");cp.innerText="🔥 Combo x"+combo;}else cp.classList.add("hidden");
  const box=$("qOptions"); box.innerHTML=""; box.className = q.kind==="image"?"grid grid-cols-3 gap-2":"grid gap-2";
  q.opts.forEach(opt=>{ const b=document.createElement("button"); b.className="btn-press";
    if(q.kind==="image"){ b.className+=" rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-emerald-400 aspect-square bg-slate-100"; b.innerHTML='<img src="'+opt.img+'" class="w-full h-full object-cover">'; }
    else { b.className+=" w-full text-left p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm text-slate-700 font-semibold hover:border-emerald-400"; b.innerText=opt.text; }
    b.onclick=()=>answerQ(b,opt.correct,box); box.appendChild(b); });
}
function answerQ(btn,correct,box){
  for(const b of box.children) b.disabled=true;
  if(correct){ btn.classList.add("ring-4","ring-emerald-300"); btn.style.borderColor="#10b981"; btn.style.background=btn.querySelector("img")?"":"#dcfce7"; qCorrect++; combo++; SFX.correct();
    let bonus=combo>=2?combo:0; addCoins(5+bonus); addXP(8);
    if(combo>=2) toast("🔥 Combo x"+combo+" +"+(5+bonus)+" "+L("syiling","coins"),"amber"); if(combo>=3)unlockAch("combo3");
  } else { btn.style.borderColor="#ef4444"; btn.style.background=btn.querySelector("img")?"":"#fee2e2"; combo=0; stageStars.mistakes++; SFX.wrong();
    for(const b of box.children){ const idx=[...box.children].indexOf(b); if(quiz[qIndex].opts[idx].correct){ b.style.borderColor="#10b981"; b.style.background=b.querySelector("img")?"":"#dcfce7"; } }
  }
  setTimeout(()=>{ qIndex++; if(qIndex<quiz.length)renderQ(); else quizDone(); },1050);
}
function quizDone(){
  $("qOptions").innerHTML=""; $("qText").innerText=L("Keputusan kuiz:","Quiz result:");
  $("comboPill").classList.add("hidden");
  const r=$("quizResult"); r.classList.remove("hidden");
  if(qCorrect>=2){ addCoins(10); addXP(20); unlockAch("first_stamp"); if(qCorrect===3)unlockAch("perfect");
    r.className="mt-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-sm font-semibold text-center";
    r.innerHTML=L("🎉 Hebat! Skor ","🎉 Great! Score ")+qCorrect+"/3"+(qCorrect===3?L(" — SEMPURNA!"," — PERFECT!"):"")+"<br><span class='text-amber-500'>+"+(qCorrect===3?"genius bonus ":"")+L("syiling & XP","coins & XP")+"</span><br><button onclick=\"claimStamp()\" class=\"btn-press w-full py-2.5 sheen text-white font-bold rounded-xl mt-3\">"+(lang()==="en"?"Claim Stamp 🏅":"Terima Cop 🏅")+"</button>"; SFX.collect();
  } else {
    r.className="mt-4 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-sm font-semibold text-center";
    r.innerHTML=L("❌ Skor ","❌ Score ")+qCorrect+L("/3 (perlu 2).<br>Jom kaji semula!","/3 (need 2).<br>Let's study again!")+"<br><button onclick=\"retryStudy()\" class=\"btn-press w-full py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-xl mt-3\">"+(lang()==="en"?"Study Again 🔁":"Kaji Semula 🔁")+"</button>";
  }
}
function retryStudy(){ openSpecies(currentSpecies); }
function claimStamp(){
  const sp=stageSpecies[targetIndex]; sp.found=true; markCollected(sp.name,"quiz"); const st=$("stamp-"+targetIndex); st.innerText=sp.emoji; st.className="w-11 h-11 rounded-2xl bg-emerald-400 border-2 border-white flex items-center justify-center text-xl shadow-md pop";
  targetIndex++; targetArmed=true; closeSpecies();
  if(stageSpecies.every(s=>s.found)){ doorActive=true; toast(t("portal_open"),"sky"); }
  updateObjective();
}

/* ---------- BABAK / KRISIS ---------- */
let currentScene=null;
function openScene(sc){ currentScene=sc; modalOpen=true; keys={}; SFX.click();
  const respColor={api:"linear-gradient(135deg,#f97316,#ef4444)",pembalakan:"linear-gradient(135deg,#a16207,#854d0e)",jerat:"linear-gradient(135deg,#475569,#1e293b)",pemburu:"linear-gradient(135deg,#475569,#1e293b)",curi:"linear-gradient(135deg,#7c3aed,#4c1d95)",sakit:"linear-gradient(135deg,#0ea5e9,#0369a1)"}[sc.type]||"linear-gradient(135deg,#f97316,#ef4444)";
  $("scBanner").style.background=respColor;
  const en:any = lang()==="en" ? SCENE_EN[stageKey] : null;
  const scen:any = SCENARIO_EN[sc.type];
  const vTitle = en && scen ? scen.name+"!" : sc.title;
  const vSit = en ? en.situation : sc.situation;
  const vQ = en ? en.question : sc.question;
  const vNum = en ? en.number : sc.number;
  const vOpts = sc.options.map((o,i)=> (en && en.options[i]) ? {t:en.options[i].t, correct:o.correct, fb:en.options[i].fb} : o);
  $("scIcon").innerText=sc.emoji; $("scTitle").innerText=vTitle; $("scSituation").innerText=vSit; $("scQuestion").innerText=vQ;
  const nb=$("scNumberBox"); if(vNum){nb.classList.remove("hidden");$("scNumber").innerText=vNum;}else nb.classList.add("hidden");
  $("scFeedback").classList.add("hidden");
  const box=$("scOptions"); box.innerHTML="";
  shuffle(vOpts.slice()).forEach(opt=>{ const b=document.createElement("button"); b.className="btn-press w-full text-left p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm text-slate-700 font-semibold hover:border-amber-400"; b.innerText=opt.t; b.onclick=()=>sceneAnswer(b,opt,box); box.appendChild(b); });
  const m=$("sceneModal"); m.classList.remove("hidden"); m.classList.add("flex");
}
function sceneAnswer(btn,opt,box){ const fb=$("scFeedback"); fb.classList.remove("hidden");
  if(opt.correct){ for(const b of box.children)b.disabled=true; btn.style.borderColor="#10b981"; btn.style.background="#dcfce7"; SFX.correct();
    fb.className="mt-3 p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-sm font-semibold text-center";
    fb.innerHTML="✅ "+opt.fb+"<br><button onclick=\"launchRescue()\" class=\"btn-press w-full py-2.5 sheen text-white font-bold rounded-xl mt-2\">"+(lang()==="en"?"Call Help 🚨":"Panggil Bantuan 🚨")+"</button>";
  } else { btn.style.borderColor="#ef4444"; btn.style.background="#fee2e2"; btn.disabled=true; stageStars.mistakes++; SFX.wrong();
    fb.className="mt-3 p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-sm font-semibold text-center"; fb.innerHTML="❌ "+opt.fb+"<br><b>"+L("Cuba lagi.","Try again.")+"</b>"; }
}
function launchRescue(){ const sc=currentScene; const m=$("sceneModal"); m.classList.add("hidden"); m.classList.remove("flex"); modalOpen=false;
  const real=stageScenes.find(s=>s.x===sc.x&&s.y===sc.y); if(!real||real.resolving||real.resolved)return; real.resolving=true;
  const vtype={api:"bomba",pembalakan:"polis",jerat:"polis",pemburu:"polis",curi:"polis",sakit:"vet"}[real.type]||"polis";
  // datang dari bawah skrin menuju babak
  responders.push({type:vtype,scene:real,x:real.x,y:Math.min(WORLD_H-60,real.y+520),tx:real.x,ty:real.y+78,phase:"drive",t:0});
  SFX.siren(vtype); toast((vtype==="bomba"?L("🚒 Trak Bomba","🚒 Fire Truck"):vtype==="vet"?L("🚑 Pasukan Penyelamat","🚑 Rescue Team"):L("🚓 Polis","🚓 Police"))+L(" dalam perjalanan!"," on the way!"),"rose");
}
function resolveScene(real){ real.resolved=true; real.resolving=false; if(save.scenariosSeen.indexOf(real.type)<0)save.scenariosSeen.push(real.type); persist(); addCoins(10); addXP(15); unlockAch("hero"); SFX.victory(); toast(L("✅ Krisis selesai! +10 syiling +15 XP","✅ Crisis resolved! +10 coins +15 XP"),"emerald"); }

/* ---------- KEMENANGAN ---------- */
function completeStage(){ gameActive=false; if(save.completed.indexOf(stageKey)<0)save.completed.push(stageKey);
  let stars=1; if(stageScenes.every(s=>s.resolved))stars++; if(stageStars.mistakes===0)stars++;
  save.stars[stageKey]=Math.max(save.stars[stageKey]||0,stars); addXP(30); persist();
  // pencapaian kawasan
  if(save.completed.indexOf("1-1")>=0&&save.completed.indexOf("1-2")>=0)unlockAch("my_done");
  if(save.completed.indexOf("2-1")>=0&&save.completed.indexOf("2-2")>=0)unlockAch("asia_done");
  if(ORDER.every(k=>save.completed.indexOf(k)>=0))unlockAch("world_done");
  const idx=ORDER.indexOf(stageKey),isFinal=idx===ORDER.length-1;
  $("winEmoji").innerText=isFinal?"👑":"🏆";
  $("winTitle").innerText=isFinal?(lang()==="en"?"WORLD SAVED!":"DUNIA DISELAMATKAN!"):(lang()==="en"?"Mission Complete!":"Misi Selesai!");
  $("winStars").innerHTML="⭐".repeat(stars)+"<span class='opacity-20'>"+"⭐".repeat(3-stars)+"</span>";
  setWinLabels(L("Cop","Stamps"),L("Syiling","Coins"),"XP");
  $("winStamps").innerText=stageSpecies.length+"/"+stageSpecies.length;
  $("winCoins").innerText=save.coins; $("winXp").innerText=save.xp;
  // kostum istimewa baru dibuka oleh misi ini?
  const newSpecial:any = ITEMS.find(it=>it.special && it.unlock && it.unlock.indexOf(stageKey)>=0 && it.unlock.every(k=>save.completed.indexOf(k)>=0));
  let baseTxt = isFinal?L("Tahniah EcoRanger! Anda melindungi hidupan terancam di <b>Malaysia, Asia & dunia</b>. Anda juara <b>SDG 15</b>! 🌍","Congratulations EcoRanger! You protected endangered life across <b>Malaysia, Asia & the world</b>. You are an <b>SDG 15</b> champion! 🌍"):L("Hebat! Anda lengkapkan <b>","Great! You completed <b>")+titleFor(stageKey)+"</b>.";
  if(newSpecial){ $("winEmoji").innerText="🎁"; baseTxt += "<br><span class='inline-block mt-2 bg-amber-100 text-amber-700 font-extrabold px-3 py-2 rounded-2xl'>🎉 "+t("congrats")+" "+t("you_got")+" "+(lang()==="en"?"a special costume":"kostum istimewa")+":<br><span class='text-2xl'>"+newSpecial.emoji+"</span> "+itemName(newSpecial)+"!</span>"; }
  $("winText").innerHTML=baseTxt;
  const btns=$("winButtons"); btns.innerHTML="";
  if(!isFinal){ const next=ORDER[idx+1]; btns.innerHTML="<button onclick=\"hideWin();startStage('"+next+"')\" class=\"btn-press w-full py-3 sheen text-white display font-bold rounded-2xl text-base\">"+t("next_mission")+"</button>"; }
  btns.innerHTML+="<button onclick=\"hideWin();goLevels()\" class=\"btn-press w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl\">"+t("mission_map")+"</button>";
  const m=$("winModal"); m.classList.remove("hidden"); m.classList.add("flex"); SFX.victory();
}
function hideWin(){ const m=$("winModal"); m.classList.add("hidden"); m.classList.remove("flex"); }

/* ---------- INPUT ---------- */
window.addEventListener("keydown",e=>{const k=e.key.toLowerCase(); if(["arrowup","w"].indexOf(k)>=0)keys.w=true; if(["arrowdown","s"].indexOf(k)>=0)keys.s=true; if(["arrowleft","a"].indexOf(k)>=0)keys.a=true; if(["arrowright","d"].indexOf(k)>=0)keys.d=true;});
window.addEventListener("keyup",e=>{const k=e.key.toLowerCase(); if(["arrowup","w"].indexOf(k)>=0)keys.w=false; if(["arrowdown","s"].indexOf(k)>=0)keys.s=false; if(["arrowleft","a"].indexOf(k)>=0)keys.a=false; if(["arrowright","d"].indexOf(k)>=0)keys.d=false;});
function bindBtn(id,k){const b=$(id);if(!b)return;const dn=e=>{e.preventDefault();keys[k]=true;};const up=e=>{e.preventDefault();keys[k]=false;};b.onmousedown=dn;b.onmouseup=up;b.onmouseleave=up;b.ontouchstart=dn;b.ontouchend=up;}
bindBtn("ctrl-up","w");bindBtn("ctrl-down","s");bindBtn("ctrl-left","a");bindBtn("ctrl-right","d");
$("btnAction").onclick=()=>{ if((window as any)._nearbyScene)openScene((window as any)._nearbyScene); };

/* ---------- JOYSTICK & TUKAR MOD KAWALAN ---------- */
function applyCtrlMode(){ const joy=save.ctrl==="joystick"; const d=$("dpadCtrl"),j=$("joyCtrl"),t=$("ctrlToggle");
  if(d)d.classList.toggle("hidden",joy); if(j)j.classList.toggle("hidden",!joy); if(t)t.innerHTML=joy?L("🕹️ Stik","🕹️ Stick"):L("🎮 Pad","🎮 D-Pad");
  keys={}; joyVec={x:0,y:0}; }
function toggleCtrl(){ save.ctrl=save.ctrl==="joystick"?"dpad":"joystick"; persist(); SFX.click(); applyCtrlMode(); }
(function(){ const base=$("joyBase"),knob=$("joyKnob"); if(!base)return;
  let active=false, cx=0, cy=0; const R=33;
  function setKnob(dx,dy){ const len=Math.hypot(dx,dy); if(len>R){ dx=dx/len*R; dy=dy/len*R; } knob.style.left=(33+dx)+"px"; knob.style.top=(33+dy)+"px"; joyVec={x:dx/R, y:dy/R}; }
  function start(e){ active=true; const r=base.getBoundingClientRect(); cx=r.left+r.width/2; cy=r.top+r.height/2; move(e); }
  function move(e){ if(!active)return; e.preventDefault(); const p=e.touches?e.touches[0]:e; setKnob(p.clientX-cx, p.clientY-cy); }
  function end(){ active=false; joyVec={x:0,y:0}; knob.style.left="33px"; knob.style.top="33px"; }
  base.addEventListener("mousedown",start); window.addEventListener("mousemove",move); window.addEventListener("mouseup",end);
  base.addEventListener("touchstart",start,{passive:false}); window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",end);
})();

/* ---------- GELUNG ---------- */
function gameLoop(ts){ if(!lastTime)lastTime=ts; let dt=(ts-lastTime)/1000; if(dt>0.1)dt=0.1; lastTime=ts;
  if(gameActive&&!modalOpen)update(dt); updateResponders(dt);
  if($("screen-game").classList.contains("active"))render(); requestAnimationFrame(gameLoop); }

function update(dt){
  let mx=0,my=0; if(keys.w)my-=1;if(keys.s)my+=1;if(keys.a)mx-=1;if(keys.d)mx+=1;
  mx+=joyVec.x; my+=joyVec.y;
  const len=Math.hypot(mx,my); if(len>1){mx/=len;my/=len;}
  if(mx<-0.05)player.face=-1; else if(mx>0.05)player.face=1;
  const inWater=inPond(player.x,player.y); const sp=(inWater?player.speed*0.62:player.speed)*dt;
  if(mx&&!collides(player.x+mx*sp,player.y))player.x+=mx*sp;
  if(my&&!collides(player.x,player.y+my*sp))player.y+=my*sp;
  let tx=player.x-VIEW_W/2,ty=player.y-VIEW_H/2; camera.x+=(tx-camera.x)*0.12; camera.y+=(ty-camera.y)*0.12;
  camera.x=Math.max(0,Math.min(camera.x,WORLD_W-VIEW_W)); camera.y=Math.max(0,Math.min(camera.y,WORLD_H-VIEW_H));
  $("coordDisplay")&&($("coordDisplay").innerText=Math.round(player.x)+","+Math.round(player.y));

  if(!doorActive&&targetIndex<stageSpecies.length){ const t=stageSpecies[targetIndex]; const d=dist(player.x,player.y,t.x,t.y); const c=compass(t.x,t.y);
    $("targetDir").innerText=c.arrow+" "+c.name+" • "+Math.round(d)+"m"; if(d>200)targetArmed=true;
    if(d<48&&targetArmed&&!modalOpen){targetArmed=false;openSpecies(t);} }
  else if(doorActive){ if(dist(player.x,player.y,door.x,door.y)<55&&!modalOpen)completeStage(); }

  let alertOn=false; (window as any)._nearbyScene=null;
  if(!doorActive&&targetIndex<stageSpecies.length){ const t=stageSpecies[targetIndex]; const d=dist(player.x,player.y,t.x,t.y);
    if(d<200&&d>=48){alertOn=true; $("clueAlertText").innerHTML="🔍 <b>"+spName(t)+"</b> "+L("berdekatan","nearby")+(t.habitat==="air"?L(" — cuba di air!"," — try the water!"):"!"); $("btnAction").classList.add("hidden");} }
  for(const sc of stageScenes){ if(sc.resolved||sc.resolving)continue; if(dist(player.x,player.y,sc.x,sc.y)<95){ (window as any)._nearbyScene=sc; alertOn=true; $("clueAlertText").innerHTML="⚠️ <b>"+sceneTitle(sc)+"</b>"; $("btnAction").classList.remove("hidden"); break; } }
  const cb=$("clueAlert"); if(alertOn)cb.classList.remove("opacity-0","translate-y-6","pointer-events-none"); else cb.classList.add("opacity-0","translate-y-6","pointer-events-none");
}

function updateResponders(dt){
  for(let i=responders.length-1;i>=0;i--){ const r=responders[i]; r.t+=dt;
    if(r.phase==="drive"){ const dx=r.tx-r.x,dy=r.ty-r.y,dd=Math.hypot(dx,dy); const sp=420*dt;
      if(dd<sp){r.x=r.tx;r.y=r.ty;r.phase="act";r.t=0;} else {r.x+=dx/dd*sp;r.y+=dy/dd*sp;} }
    else if(r.phase==="act"){ if(r.scene&&r.scene.type==="api"){ r.scene.fireLife=Math.max(0,1-r.t/1.7); }
      if(r.t>1.7){ if(r.scene&&!r.scene.resolved)resolveScene(r.scene); r.phase="leave"; r.t=0; r.ty=WORLD_H+120; } }
    else if(r.phase==="leave"){ r.y+=300*dt; if(r.y>WORLD_H+100)responders.splice(i,1); }
  }
}

/* ---------- RENDER ---------- */
function render(){ ctx.clearRect(0,0,VIEW_W,VIEW_H); ctx.save(); ctx.translate(-camera.x,-camera.y);
  // tanah cerah
  const gg=ctx.createLinearGradient(0,0,0,WORLD_H);
  if(stage.region.indexOf("DUNIA")>=0){gg.addColorStop(0,"#cdd98a");gg.addColorStop(1,"#b6cf7a");}
  else if(stage.region.indexOf("ASIA")>=0){gg.addColorStop(0,"#aee6c8");gg.addColorStop(1,"#8fd9b6");}
  else{gg.addColorStop(0,"#a7e3b4");gg.addColorStop(1,"#7fce99");}
  ctx.fillStyle=gg; ctx.fillRect(0,0,WORLD_W,WORLD_H);
  const vx0=camera.x-90,vy0=camera.y-170,vx1=camera.x+VIEW_W+90,vy1=camera.y+VIEW_H+90;

  // kawasan lapang (habitat darat) – patch rumput lebih cerah
  for(const c of clearings){ if(c.x<vx0-200||c.x>vx1+200||c.y<vy0-200||c.y>vy1+200)continue; blobPath(c.pts); ctx.fillStyle="rgba(190,226,150,0.16)"; ctx.fill(); }
  // tompok habitat bertema (ais/gurun/savana) supaya kelihatan seperti tempat tinggal haiwan
  for(const p of habitatPatches){ if(p.x<vx0-260||p.x>vx1+260||p.y<vy0-260||p.y>vy1+260)continue; drawHabitatPatch(p); }
  // bunga
  for(const f of flowers){ if(f.x<vx0||f.x>vx1||f.y<vy0||f.y>vy1)continue; ctx.fillStyle=f.c; for(let p=0;p<5;p++){const a=p/5*Math.PI*2;ctx.beginPath();ctx.arc(f.x+Math.cos(a)*f.s,f.y+Math.sin(a)*f.s,f.s*0.6,0,Math.PI*2);ctx.fill();} ctx.fillStyle="#fde047";ctx.beginPath();ctx.arc(f.x,f.y,f.s*0.5,0,Math.PI*2);ctx.fill(); }
  // tasik organik
  for(const p of ponds){ if(p.x<vx0-260||p.x>vx1+260||p.y<vy0-260||p.y>vy1+260)continue; blobPath(p.pts); const wg=ctx.createRadialGradient(p.x,p.y,10,p.x,p.y,p.r); wg.addColorStop(0,"#5cc6e8");wg.addColorStop(1,"#2f7fd1"); ctx.fillStyle=wg; ctx.fill(); ctx.lineWidth=4; ctx.strokeStyle="rgba(255,255,255,.45)"; ctx.stroke();
    // kilauan air
    ctx.fillStyle="rgba(255,255,255,.18)"; for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(p.x-p.r*0.3+k*22,p.y-p.r*0.3+Math.sin(Date.now()/600+k)*4,10,3,0,0,Math.PI*2);ctx.fill();} }

  // pintu portal
  drawDoor();

  // babak (krisis) – api besar, dll
  ctx.textAlign="center"; ctx.textBaseline="middle";
  for(const sc of stageScenes){ if(sc.resolved)continue; if(sc.x<vx0-160||sc.x>vx1+160||sc.y<vy0-160||sc.y>vy1+160)continue; drawScene(sc); }

  // spesies (gambar sebenar bulat)
  for(let i=0;i<stageSpecies.length;i++){ const sp=stageSpecies[i]; if(sp.x<vx0||sp.x>vx1||sp.y<vy0||sp.y>vy1)continue;
    if(sp.found){ drawAnimalToken(sp,sp.x,sp.y,30,true); }
    else if(i===targetIndex){ const d=dist(player.x,player.y,sp.x,sp.y); if(d<175){ const bob=Math.sin(Date.now()*0.005)*5; drawAnimalToken(sp,sp.x,sp.y+bob,36,false); } } }

  // pokok (isih Y)
  const vt=trees.filter(t=>!(t.x<vx0||t.x>vx1||t.y<vy0||t.y>vy1)); vt.sort((a,b)=>a.y-b.y);
  for(const t of vt){ const s=treeSprites[t.si]; if(!s)continue; if(t.burning && curFireLife(t)>0){ ctx.globalAlpha=0.55+0.45*(1-curFireLife(t)); ctx.drawImage(s.canvas,t.x-s.w/2,t.y-s.footY); ctx.globalAlpha=1; drawFlame(t.x,t.y-30,curFireLife(t),t.x*0.7); }
    else ctx.drawImage(s.canvas,t.x-s.w/2,t.y-s.footY); }

  // responders (kenderaan menyelamat)
  for(const r of responders) drawResponder(r);

  // ===== PEMAIN — avatar pod moden, jelas & legap =====
  let inW=inPond(player.x,player.y);
  const bob=Math.sin(Date.now()/430)*2.4;
  const px=player.x, py=player.y-6+bob, R=21;
  ctx.globalAlpha=1; ctx.textAlign="center"; ctx.textBaseline="middle";
  // bayang tanah
  ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.beginPath(); ctx.ellipse(player.x,player.y+16,R*0.82,6.5,0,0,Math.PI*2); ctx.fill();
  // riak air ketika di dalam tasik
  if(inW){ ctx.strokeStyle="rgba(255,255,255,.7)"; ctx.lineWidth=2.5; ctx.beginPath(); ctx.ellipse(player.x,player.y+13,R+6+Math.sin(Date.now()/200)*2,6,0,0,Math.PI*2); ctx.stroke(); }
  // gelang nadi lembut (tarik mata, tidak melekat pada watak)
  const pulse=(Date.now()%1600)/1600; ctx.strokeStyle="rgba(16,185,129,"+(0.40*(1-pulse))+")"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(px,py,R+3+pulse*8,0,Math.PI*2); ctx.stroke();
  // cakera latar kontras tinggi — watak sentiasa kelihatan
  const dg=ctx.createRadialGradient(px-R*0.4,py-R*0.5,3,px,py,R+2);
  dg.addColorStop(0,"#ffffff"); dg.addColorStop(0.7,"#f1fbf6"); dg.addColorStop(1,"#d8f3e6");
  ctx.beginPath(); ctx.arc(px,py,R,0,Math.PI*2); ctx.fillStyle=dg; ctx.fill();
  ctx.lineWidth=3.2; ctx.strokeStyle="#10b981"; ctx.stroke();
  ctx.lineWidth=1.4; ctx.strokeStyle="rgba(255,255,255,.95)"; ctx.beginPath(); ctx.arc(px,py,R-2.6,0,Math.PI*2); ctx.stroke();
  const av=avatarParts();
  // haiwan peliharaan di sisi
  if(av.pet){ const pb=Math.sin(Date.now()/220)*3; ctx.font="20px sans-serif"; ctx.fillText(av.pet, px-R-7, py+6+pb); }
  // watak (emoji penuh & legap, diklip kemas dalam cakera)
  ctx.save(); ctx.beginPath(); ctx.arc(px,py,R-2.4,0,Math.PI*2); ctx.clip();
  ctx.save(); ctx.translate(px,py+R*0.30); ctx.scale(player.face,1); ctx.font="36px sans-serif"; ctx.fillText(av.base,0,0); ctx.restore();
  ctx.restore();
  // topi di atas kepala
  if(av.hat){ ctx.font="21px sans-serif"; ctx.fillText(av.hat, px, py-R+3); }
  // gajet di bahu
  if(av.gear){ ctx.font="16px sans-serif"; ctx.fillText(av.gear, px+R-3, py+R-7); }
  ctx.globalAlpha=1;

  ctx.restore(); drawMiniMap();
}
function blobPath(pts){ ctx.beginPath(); for(let i=0;i<pts.length;i++){ const a=pts[i],b=pts[(i+1)%pts.length]; const mx=(a.x+b.x)/2,my=(a.y+b.y)/2; if(i===0)ctx.moveTo(mx,my); ctx.quadraticCurveTo(b.x,b.y,(b.x+pts[(i+2)%pts.length].x)/2,(b.y+pts[(i+2)%pts.length].y)/2); } ctx.closePath(); }
function drawHabitatPatch(p){ ctx.save(); blobPath(p.pts); ctx.clip();
  if(p.biome==="salji"){ // ais/salji
    ctx.fillStyle="#eaf6ff"; ctx.fillRect(p.x-p.r-20,p.y-p.r-20,p.r*2+40,p.r*2+40);
    ctx.strokeStyle="rgba(147,197,253,.5)"; ctx.lineWidth=3; for(let i=0;i<5;i++){ ctx.beginPath(); ctx.moveTo(p.x-p.r+i*40,p.y-p.r); ctx.lineTo(p.x-p.r+i*40+30,p.y+p.r); ctx.stroke(); }
    ctx.fillStyle="rgba(255,255,255,.8)"; ctx.beginPath(); ctx.arc(p.x-30,p.y-20,18,0,Math.PI*2); ctx.arc(p.x+30,p.y+18,14,0,Math.PI*2); ctx.fill();
  } else if(p.biome==="gurun"){ // gurun pasir
    ctx.fillStyle="#f3e2b3"; ctx.fillRect(p.x-p.r-20,p.y-p.r-20,p.r*2+40,p.r*2+40);
    ctx.strokeStyle="rgba(214,178,102,.7)"; ctx.lineWidth=4; for(let i=0;i<4;i++){ ctx.beginPath(); ctx.arc(p.x-40+i*30,p.y+30+i*8,60,Math.PI*1.05,Math.PI*1.95); ctx.stroke(); }
    ctx.fillStyle="#caa15a"; ctx.beginPath(); ctx.arc(p.x+p.r*0.4,p.y+p.r*0.4,5,0,Math.PI*2); ctx.fill();
  } else if(p.biome==="savana"){ // savana kering
    ctx.fillStyle="#e7d488"; ctx.fillRect(p.x-p.r-20,p.y-p.r-20,p.r*2+40,p.r*2+40);
    ctx.strokeStyle="rgba(180,150,60,.5)"; ctx.lineWidth=2; for(let i=0;i<40;i++){ const gx=p.x-p.r+Math.random()*p.r*2, gy=p.y-p.r+Math.random()*p.r*2; ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+2,gy-9); ctx.stroke(); }
  } else { // darat (hutan) – hijau lembut
    ctx.fillStyle="rgba(150,210,140,.5)"; ctx.fillRect(p.x-p.r-20,p.y-p.r-20,p.r*2+40,p.r*2+40);
  }
  ctx.restore();
  // sempadan lembut
  ctx.save(); blobPath(p.pts); ctx.strokeStyle="rgba(255,255,255,.35)"; ctx.lineWidth=4; ctx.stroke(); ctx.restore();
}
function curFireLife(t){ let life=0; for(const sc of stageScenes){ if(sc.type==="api"&&!sc.resolved&&dist(t.x,t.y,sc.x,sc.y)<150) life=Math.max(life,sc.fireLife); } return life; }
function drawFlame(x,y,life,seed){ if(life<=0)return; const fl=1+Math.sin(Date.now()/90+seed)*0.18; ctx.save();
  ctx.globalAlpha=0.92*life; ctx.fillStyle="#ef4444"; flameShape(x,y,22*fl*life); ctx.fillStyle="#f97316"; flameShape(x,y-4,16*fl*life); ctx.fillStyle="#fde047"; flameShape(x,y-7,9*fl*life); ctx.restore(); }
function flameShape(x,y,r){ ctx.beginPath(); ctx.moveTo(x,y-r*1.6); ctx.quadraticCurveTo(x+r,y-r*0.2,x,y+r*0.5); ctx.quadraticCurveTo(x-r,y-r*0.2,x,y-r*1.6); ctx.closePath(); ctx.fill(); }
function drawScene(sc){
  if(sc.type==="api"){ // tanah hangus (kecerunan) + cahaya api
    ctx.save();
    const sg=ctx.createRadialGradient(sc.x,sc.y,20,sc.x,sc.y,165);
    sg.addColorStop(0,"rgba(40,26,15,"+(0.72*sc.fireLife)+")"); sg.addColorStop(0.6,"rgba(60,40,22,"+(0.45*sc.fireLife)+")"); sg.addColorStop(1,"rgba(60,40,22,0)");
    ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(sc.x,sc.y,165,0,Math.PI*2); ctx.fill();
    const glow=ctx.createRadialGradient(sc.x,sc.y,10,sc.x,sc.y,150); glow.addColorStop(0,"rgba(249,115,22,"+(0.28*sc.fireLife)+")"); glow.addColorStop(1,"rgba(249,115,22,0)");
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(sc.x,sc.y,150,0,Math.PI*2); ctx.fill();
    ctx.restore();
    // asap berkepul naik
    for(let i=0;i<8;i++){ const t=(Date.now()/1000+i*0.55)%3.2; ctx.globalAlpha=(1-t/3.2)*0.28*sc.fireLife; ctx.fillStyle="#94a3b8"; ctx.beginPath(); ctx.arc(sc.x+(i-4)*26+Math.sin(t*2)*8,sc.y-50-t*70,16+t*16,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
    for(const f of sc.fireSpots){ drawFlame(f.x,f.y,sc.fireLife,f.ph); }
    return;
  }
  // ikon krisis lain (penanda)
  const pulse=16+Math.sin(Date.now()/180)*5;
  const col={pembalakan:"#a16207",jerat:"#475569",pemburu:"#475569",curi:"#7c3aed",sakit:"#0ea5e9"}[sc.type]||"#ef4444";
  ctx.fillStyle=col+"33"; ctx.beginPath(); ctx.arc(sc.x,sc.y,pulse+22,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.ellipse(sc.x,sc.y+16,18,6,0,0,Math.PI*2); ctx.fill();
  if(sc.type==="pembalakan"){ ctx.fillStyle="#8a5a2b"; ctx.beginPath();ctx.arc(sc.x,sc.y+4,14,0,Math.PI*2);ctx.fill(); ctx.fillStyle="#caa472";ctx.beginPath();ctx.arc(sc.x,sc.y+4,8,0,Math.PI*2);ctx.fill(); }
  ctx.font="34px sans-serif"; ctx.fillText(sc.emoji,sc.x,sc.y-6);
}
function drawAnimalToken(sp,x,y,r,found){
  const im=getImg(sp.image);
  ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.beginPath(); ctx.ellipse(x,y+r*0.8,r*0.85,r*0.32,0,0,Math.PI*2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.closePath(); ctx.clip();
  if(im&&im._ready){ const iw=im.naturalWidth,ih=im.naturalHeight,s=Math.max(2*r/iw,2*r/ih),dw=iw*s,dh=ih*s; ctx.drawImage(im,x-dw/2,y-dh/2,dw,dh); }
  else { ctx.fillStyle="#bbf7d0"; ctx.fillRect(x-r,y-r,2*r,2*r); ctx.fillStyle="#065f46"; ctx.font=(r*1.1)+"px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(sp.emoji,x,y); }
  ctx.restore();
  ctx.lineWidth=3.5; ctx.strokeStyle=found?"#10b981":"#ffffff"; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  if(found){ ctx.fillStyle="#10b981"; ctx.beginPath(); ctx.arc(x+r*0.72,y-r*0.72,r*0.42,0,Math.PI*2); ctx.fill(); ctx.fillStyle="#fff"; ctx.font="bold "+(r*0.5)+"px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("✓",x+r*0.72,y-r*0.68); }
}
function drawDoor(){ const x=door.x,y=door.y; ctx.save();
  ctx.fillStyle=doorActive?"#10b981":"#94a3b8"; rrect(x-34,y-46,16,92,4);ctx.fill(); rrect(x+18,y-46,16,92,4);ctx.fill(); rrect(x-36,y-58,72,18,6);ctx.fill();
  const pg=ctx.createRadialGradient(x,y,4,x,y,30); if(doorActive){pg.addColorStop(0,"#d1fae5");pg.addColorStop(1,"#059669");}else{pg.addColorStop(0,"#e2e8f0");pg.addColorStop(1,"#94a3b8");}
  ctx.fillStyle=pg; rrect(x-18,y-44,36,88,8);ctx.fill();
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="26px sans-serif"; ctx.fillText(doorActive?"✨":"🔒",x,y);
  if(doorActive){ctx.fillStyle="#fff";ctx.strokeStyle="#059669";ctx.lineWidth=3;ctx.font="bold 12px sans-serif";ctx.strokeText("PORTAL",x,y-66);ctx.fillText("PORTAL",x,y-66);} ctx.restore(); }
function drawResponder(r){
  const x=r.x,y=r.y, body={bomba:"#dc2626",polis:"#1d4ed8",vet:"#f8fafc"}[r.type]||"#dc2626";
  // jet air bomba semasa act
  if(r.type==="bomba"&&r.phase==="act"&&r.scene){ ctx.strokeStyle="rgba(125,211,252,.8)"; ctx.lineWidth=4; for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(x,y-14);ctx.quadraticCurveTo((x+r.scene.x)/2,y-70-k*8,r.scene.x+(k-1)*20,r.scene.y);ctx.stroke();} }
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.ellipse(x,y+18,22,7,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#111827"; rrect(x-16,y-6,8,12,2);ctx.fill(); rrect(x+8,y-6,8,12,2);ctx.fill(); rrect(x-16,y-24,8,12,2);ctx.fill(); rrect(x+8,y-24,8,12,2);ctx.fill();
  ctx.fillStyle=body; rrect(x-15,y-30,30,52,7); ctx.fill();
  ctx.fillStyle="#bae6fd"; rrect(x-11,y-26,22,12,3); ctx.fill();
  if(r.type==="vet"){ ctx.fillStyle="#ef4444"; ctx.fillRect(x-2,y-4,4,14); ctx.fillRect(x-7,y+1,14,4); }
  // lampu siren berkelip
  const on=Math.floor(Date.now()/220)%2===0; ctx.fillStyle=on?(r.type==="bomba"?"#fca5a5":"#93c5fd"):"#fff";
  rrect(x-9,y-34,18,5,2); ctx.fill();
  ctx.fillStyle=r.type==="bomba"?"#ef4444":r.type==="vet"?"#0ea5e9":"#3b82f6"; ctx.font="14px sans-serif"; ctx.textAlign="center"; ctx.fillText(r.type==="bomba"?"🚒":r.type==="vet"?"🚑":"🚓",x,y-44);
}
function rrect(x,y,w,h,r){ ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath(); }

function drawMiniMap(){ const mm=$("miniMap"),mc=mm.getContext("2d"),W=mm.width,H=mm.height; mc.clearRect(0,0,W,H);
  mc.fillStyle="#bde8c4"; mc.fillRect(0,0,W,H); const sx=W/WORLD_W,sy=H/WORLD_H;
  mc.fillStyle="#3f9fd6"; for(const p of ponds){mc.beginPath();mc.ellipse(p.x*sx,p.y*sy,p.r*sx,p.r*sy,0,0,Math.PI*2);mc.fill();}
  mc.fillStyle="rgba(255,255,255,.5)"; for(const c of clearings){mc.beginPath();mc.arc(c.x*sx,c.y*sy,c.r*sx*0.7,0,Math.PI*2);mc.fill();}
  for(const sc of stageScenes){ if(sc.resolved)continue; mc.fillStyle=sc.type==="api"?"#ef4444":"#f59e0b"; mc.beginPath();mc.arc(sc.x*sx,sc.y*sy,3,0,Math.PI*2);mc.fill(); }
  if(!doorActive&&targetIndex<stageSpecies.length){ const t=stageSpecies[targetIndex]; const r=3+Math.sin(Date.now()/200)*1.5; mc.fillStyle="#16a34a"; mc.beginPath();mc.arc(t.x*sx,t.y*sy,r+1,0,Math.PI*2);mc.fill(); }
  mc.fillStyle=doorActive?"#10b981":"#64748b"; mc.fillRect(door.x*sx-3,door.y*sy-3,6,6);
  for(const r of responders){ mc.fillStyle=r.type==="bomba"?"#dc2626":r.type==="vet"?"#0ea5e9":"#1d4ed8"; mc.fillRect(r.x*sx-2,r.y*sy-2,4,4); }
  mc.fillStyle="#fff"; mc.strokeStyle="#16a34a"; mc.lineWidth=2; mc.beginPath();mc.arc(player.x*sx,player.y*sy,3.5,0,Math.PI*2);mc.fill();mc.stroke();
}

/* ===================== NAVIGASI HUB & SUB-SKRIN ===================== */
let subReturn="screen-start";
function curScreen(){ const a=document.querySelector(".screen.active"); return a?a.id:"screen-start"; }
function goHub(){ SFX.click(); showScreen("screen-hub"); maybeTut("hub"); }
function backFromSub(){ showScreen(subReturn); }
function goLevels(){ SFX.click(); subReturn="screen-hub"; buildLevelGrid(); showScreen("screen-levels"); }
function openStore(){ SFX.click(); subReturn=curScreen(); storeSlot="base"; buildStore(); showScreen("screen-store"); maybeTut("store"); }
function openAch(){ SFX.click(); subReturn=curScreen(); buildAch(); showScreen("screen-ach"); }
function openCollection(){ SFX.click(); subReturn=curScreen(); colTab="animal"; colRegion="Semua"; buildCollection(); showScreen("screen-collection"); maybeTut("collection"); }
function quitGame(){ SFX.click(); gameActive=false; showScreen("screen-hub"); }

/* ===================== TUTORIAL / ONBOARDING ===================== */
const TUTS={
  hub:[{icon:"🎮",t:"Pusat Permainan",d:"Pilih cara bermain: Teroka & Kuiz, Teka Siapa Saya, Dengar Bunyi, atau lihat Buku Koleksi anda."}],
  explore:[
    {icon:"🧭",t:"Cari Spesies",d:"Gerak dengan pad/anak panah. Ikut PETUNJUK ARAH & jarak (kiri atas) dan PETA MINI (kanan atas) untuk cari haiwan."},
    {icon:"💧",t:"Habitat",d:"Haiwan air berada di dalam TASIK, haiwan darat di kawasan habitatnya. Hampiri untuk berjumpa!"},
    {icon:"📚",t:"Kaji & Kuiz",d:"Baca ciri-cirinya dahulu, kemudian jawab KUIZ (betul 2/3) untuk dapat COP koleksi."},
    {icon:"🚨",t:"Selamatkan Krisis",d:"Nampak kebakaran/pemburu? Tekan SIASAT, pilih tindakan betul & panggil bomba/polis!"},
    {icon:"🏅",t:"Ganjaran",d:"Setiap jawapan beri SYILING & XP (naik PANGKAT). Belanja di KEDAI. Kumpul semua COP untuk buka PORTAL ke misi seterusnya."}
  ],
  guess:[{icon:"🔍",t:"Teka Siapa Saya",d:"Hanya sebahagian gambar ditunjuk. TAIP nama haiwan/tumbuhan, atau guna PETUNJUK. Ronda pertama ialah LATIHAN. Naik LEVEL untuk dapat hadiah (lihat 🎁 di atas) — ada haiwan terancam & MISTERI!"}],
  listen:[{icon:"🔊",t:"Dengar Bunyi",d:"Tekan butang untuk dengar bunyi haiwan SEBENAR, kemudian pilih haiwan yang BETUL antara 4 pilihan. Naik LEVEL untuk dapat topi/gajet sebagai hadiah!"}],
  collection:[{icon:"📖",t:"Buku Koleksi",d:"Setiap spesies yang anda jumpa (kuiz/teka/bunyi) akan DICOP di sini, mengikut Malaysia/Asia/Dunia. Warna bingkai = tahap kesukaran. Tekan cop untuk butiran penuh!"}],
  store:[{icon:"🛍️",t:"Kedai Ranger",d:"Guna SYILING untuk beli pakaian: KARAKTER, TOPI, GAJET & HAIWAN PELIHARAAN. Item KHAS (kostum tradisi) dibuka apabila anda tamatkan misi sesuatu kawasan!"}]
};
const TUTS_EN={
  hub:[{icon:"🎮",t:"Game Hub",d:"Pick how to play: Explore & Quiz, Guess Who Am I, Listen to Sounds, or view your Collection Book."}],
  explore:[
    {icon:"🧭",t:"Find Species",d:"Move with the pad/arrow keys. Follow the DIRECTION & distance (top-left) and the MINIMAP (top-right) to find animals."},
    {icon:"💧",t:"Habitat",d:"Water animals live in the LAKE, land animals in their habitat patch. Walk up to meet them!"},
    {icon:"📚",t:"Study & Quiz",d:"Read its facts first, then answer the QUIZ (get 2/3) to earn a collection STAMP."},
    {icon:"🚨",t:"Solve the Crisis",d:"See a fire/poacher? Tap INVESTIGATE, pick the right action & call the fire brigade/police!"},
    {icon:"🏅",t:"Rewards",d:"Every answer gives COINS & XP (rank up). Spend at the STORE. Collect all STAMPS to open the PORTAL to the next mission."}
  ],
  guess:[{icon:"🔍",t:"Guess Who Am I",d:"Only part of the photo is shown. TYPE the animal/plant name, or use a HINT. The first round is PRACTICE. Level up for rewards (see 🎁 above) — with endangered & MYSTERY animals!"}],
  listen:[{icon:"🔊",t:"Listen to Sounds",d:"Tap the button to hear a REAL animal sound, then pick the CORRECT animal from 4 choices. Level up to earn hats/gadgets as rewards!"}],
  collection:[{icon:"📖",t:"Collection Book",d:"Every species you meet (quiz/guess/listen) gets STAMPED here, sorted by Malaysia/Asia/World. Frame colour = difficulty. Tap a stamp for full details!"}],
  store:[{icon:"🛍️",t:"Ranger Store",d:"Use COINS to buy outfits: CHARACTER, HAT, GADGET & PET. SPECIAL items (traditional costumes) unlock when you finish a region's missions!"}]
};
let tutSteps=[],tutIdx=0,tutDoneCb=null;
function maybeTut(key, cb?){ if(save.tut[key]){ if(cb)cb(); return; } showTut(key,cb); }
function showTut(key,cb){ tutSteps=(lang()==="en"?TUTS_EN:TUTS)[key]||[]; if(!tutSteps.length){ if(cb)cb(); return; } tutIdx=0; tutDoneCb=cb||null; save.tut[key]=true; persist(); renderTut(); const m=$("tutModal"); m.classList.remove("hidden"); m.classList.add("flex"); }
function renderTut(){ const s=tutSteps[tutIdx]; $("tutIcon").innerText=s.icon; $("tutTitle").innerText=s.t; $("tutText").innerText=s.d;
  const dots=$("tutDots"); dots.innerHTML=""; tutSteps.forEach((_,i)=>dots.innerHTML+='<span class="w-2 h-2 rounded-full inline-block '+(i===tutIdx?"bg-emerald-500":"bg-slate-200")+'"></span>');
  $("tutNextBtn").innerText=tutIdx<tutSteps.length-1?t("next"):t("start_tut"); }
function tutNext(){ SFX.click(); if(tutIdx<tutSteps.length-1){ tutIdx++; renderTut(); } else tutClose(); }
function tutSkip(){ SFX.click(); tutClose(); }
function tutClose(){ const m=$("tutModal"); m.classList.add("hidden"); m.classList.remove("flex"); const cb=tutDoneCb; tutDoneCb=null; if(cb)cb(); }

/* ===================== GANJARAN LEVEL ===================== */
/** Beri hadiah jika level baru dicapai padan dgn GAME_REWARDS (sekali sahaja per level) */
function checkLevelReward(mode){
  const lvl = mode==="guess"?save.guessLvl:save.listenLvl;
  const got = (mode==="guess"?save.rewardedGuess:save.rewardedListen) || [];
  const map = GAME_REWARDS[mode]||[];
  for(const r of map){ if(lvl>=r.level && got.indexOf(r.level)<0){ got.push(r.level); if(save.owned.indexOf(r.item)<0)save.owned.push(r.item); persist(); return itemById(r.item); } }
  return null;
}
function setWinLabels(a,b,c){ const e1=$("winL1"); if(e1){ e1.innerText=a; $("winL2").innerText=b; $("winL3").innerText=c; } }
function gameRewardScreen(title,cleared,score,total,mode){
  let bonus=cleared?20+score*3:score*2; addCoins(bonus); addXP(cleared?20:8);
  const reward = cleared ? checkLevelReward(mode) : null;
  const newLvl = mode==="guess"?save.guessLvl:save.listenLvl;
  const stars=cleared?Math.max(1,Math.min(3,Math.round(score/total*3))):0;
  $("winEmoji").innerText=cleared?(reward?"🎁":"🎉"):"🙂";
  $("winTitle").innerText=cleared?(title+" — "+t("level")+" "+newLvl+"!"):(lang()==="en"?"Out of tries":"Habis Cubaan");
  $("winStars").innerHTML="⭐".repeat(stars)+"<span class='opacity-20'>"+"⭐".repeat(3-stars)+"</span>";
  setWinLabels(lang()==="en"?"Score":"Markah", lang()==="en"?"Coins":"Syiling", "XP");
  $("winStamps").innerText=score+"/"+total;
  $("winCoins").innerText=save.coins; $("winXp").innerText=save.xp;
  let txt = cleared ? ((lang()==="en"?"Great! +":"Hebat! +")+"<b>"+bonus+"</b> "+(lang()==="en"?"coins":"syiling")+".") : (lang()==="en"?"Don't give up — try again!":"Jangan putus asa — cuba sekali lagi!");
  if(reward) txt += "<br><span class='text-amber-600 font-bold'>🎉 "+t("you_got")+": "+reward.emoji+" "+itemName(reward)+"!</span>";
  $("winText").innerHTML=txt;
  const btns=$("winButtons"); btns.innerHTML="";
  const again=mode==="guess"?"startGuess":"startListen";
  btns.innerHTML='<button onclick="hideWin();'+again+'()" class="btn-press w-full py-3 sheen text-white display font-bold rounded-2xl text-base">'+t("play_again")+'</button>'+
    '<button onclick="hideWin();showScreen(\'screen-hub\')" class="btn-press w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl">'+t("game_hub")+'</button>';
  const m=$("winModal"); m.classList.remove("hidden"); m.classList.add("flex"); if(reward){SFX.levelup();} else if(cleared)SFX.victory();
}

/* ===================== GAME: TEKA SIAPA SAYA ===================== */
let guessRound=0,guessTotal=5,guessLives=3,guessScore=0,guessCur=null,guessHints=0;
function renderRoadmap(mode){ const box=$(mode==="guess"?"guessRoadmap":"listenRoadmap"); if(!box)return;
  box.innerHTML='<span class="text-slate-400 font-bold mr-1">'+t("rewards_map")+':</span>'+
    (GAME_REWARDS[mode]||[]).map(r=>{ const it=itemById(r.item); const got=save.owned.indexOf(r.item)>=0;
      return '<span class="px-2 py-1 rounded-full '+(got?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-500")+' font-bold">L'+r.level+' '+(it?it.emoji:"🎁")+(got?" ✓":"")+'</span>'; }).join(""); }
function startGuess(){ SFX.click(); maybeTut("guess",()=>{ guessScore=0; guessLives=3; guessRound=0; guessTotal=5; $("guessLvlNum").innerText=(save.guessLvl+1); renderRoadmap("guess"); showScreen("screen-guess"); nextGuess(); }); }
let guessNoPenalty=false;
function nextGuess(){ if(guessRound>=guessTotal||guessLives<=0) return guessEnd();
  guessRound++; guessHints=0; guessNoPenalty=false; $("guessProg").innerText=guessRound+"/"+guessTotal;
  const isPractice = (!save.playedGuess && guessRound===1);
  const maxR = save.guessLvl===0?2:Math.min(4,2+save.guessLvl);
  let normalPool=EXTRA.filter(s=>rarityOf(s)<=maxR); if(!normalPool.length)normalPool=EXTRA;
  const mysteryChance = Math.min(0.4, 0.08 + save.guessLvl*0.1);
  const useMystery = !isPractice && save.guessLvl>=1 && Math.random()<mysteryChance;
  if(isPractice){ normalPool=EXTRA.filter(s=>rarityOf(s)===1); guessCur=normalPool[Math.floor(Math.random()*normalPool.length)]||EXTRA[0]; }
  else guessCur= useMystery? MYSTERY[Math.floor(Math.random()*MYSTERY.length)] : normalPool[Math.floor(Math.random()*normalPool.length)];
  const img=$("guessImg"); img.src=guessCur.image;
  const myst=$("guessMystery"); if(guessCur.mystery){ myst.innerHTML="🌟 "+L("Misteri","Mystery"); myst.classList.remove("hidden"); } else myst.classList.add("hidden");
  img.onload=applyGuessView; if(img.complete) applyGuessView();
  $("guessInput").value=""; try{$("guessInput").focus();}catch(e){}
  $("guessOptions").innerHTML="";
  $("guessFeedback").classList.add("hidden");
  if(isPractice){ guessNoPenalty=true; save.playedGuess=true; persist();
    $("guessHintBox").innerHTML=L("🎓 <b>Ronda Latihan</b> — pilih jawapan, tiada nyawa hilang!","🎓 <b>Practice round</b> — pick an answer, no lives lost!");
    guessShowOptions();
  } else { $("guessHintBox").innerText=""; }
  updateGuessHUD();
}
function setGuessCrop(){ const img=$("guessImg"),box=$("guessImgBox");
  const bw=box.clientWidth||320,bh=box.clientHeight||224,zoom=2.6,iw=bw*zoom,ih=bh*zoom;
  img.style.filter="none"; img.style.maxWidth="none"; img.style.width=iw+"px"; img.style.height=ih+"px"; img.style.objectFit="cover";
  const ox=-(Math.random()*(iw-bw)),oy=-(Math.random()*(ih-bh)); img.style.transform="translate("+ox+"px,"+oy+"px)"; }
/** MISTERI: tunjuk foto sebenar tetapi kabur (boleh diteka dari warna/bentuk), bukan kotak ❓ kosong */
function setGuessMystery(){ const img=$("guessImg"); img.style.maxWidth="none"; img.style.width="100%"; img.style.height="100%"; img.style.objectFit="cover"; img.style.transform="scale(1.12)"; img.style.filter="blur(11px) saturate(1.2)"; }
function applyGuessView(){ if(guessCur&&guessCur.mystery) setGuessMystery(); else setGuessCrop(); }
function revealGuessImg(){ const img=$("guessImg"); img.style.filter="none"; img.style.width="100%"; img.style.height="100%"; img.style.transform="translate(0,0)"; $("guessMystery").classList.add("hidden"); }
function updateGuessHUD(){ $("guessLives").innerText="❤️".repeat(guessLives)+"🖤".repeat(3-guessLives); $("guessScore").innerText=guessScore; }
function normalize(s){ return (s||"").toLowerCase().replace(/[^a-z ]/g,"").trim(); }
function guessMatch(input,sp){ const a=normalize(input); if(!a)return false; return [sp.name,sp.common].some(n=>{const x=normalize(n); return x===a||(a.length>=4&&x.indexOf(a)>=0)||(x.length>=4&&a.indexOf(x)>=0);}); }
function submitGuess(){ if(!guessCur)return; const v=$("guessInput").value; if(!v.trim())return;
  if(guessMatch(v,guessCur)) guessCorrect();
  else { if(!guessNoPenalty)guessLives--; SFX.wrong(); updateGuessHUD(); const fb=$("guessFeedback"); fb.classList.remove("hidden"); fb.className="mt-2 text-center font-bold text-rose-500"; fb.innerText=guessNoPenalty?(L("Jawapan: ","Answer: ")+spName(guessCur)+L(". Teruskan!",". Keep going!")):L("❌ Salah! Cuba lagi atau guna petunjuk.","❌ Wrong! Try again or use a hint."); if(guessNoPenalty){ revealGuessImg(); setTimeout(nextGuess,1200);} else if(guessLives<=0) setTimeout(guessReveal,700); } }
function guessCorrect(){ SFX.correct(); markCollected(guessCur.name,"guess"); const pts=Math.max(1,3-guessHints); guessScore+=pts; addCoins(4+pts); addXP(6);
  if(guessCur.mystery){ addCoins(20); unlockAch("first_stamp"); toast(L("🌟 Haiwan MISTERI ditemui: ","🌟 MYSTERY animal found: ")+guessCur.name+"!","amber"); }
  revealGuessImg(); const fb=$("guessFeedback"); fb.classList.remove("hidden"); fb.className="mt-2 text-center font-bold text-emerald-600"; fb.innerText=L("✅ Betul — ","✅ Correct — ")+spName(guessCur)+"!"; setTimeout(nextGuess,1100); }
function guessReveal(){ revealGuessImg(); const fb=$("guessFeedback"); fb.classList.remove("hidden"); fb.className="mt-2 text-center font-bold text-rose-500"; fb.innerText=L("Jawapan: ","Answer: ")+spName(guessCur); setTimeout(guessEnd,1300); }
function guessHint(){ if(!guessCur)return; guessHints++; SFX.click(); const sp=guessCur,hb=$("guessHintBox");
  if(guessHints===1) hb.innerText="💡 "+(sp.rtype==="plant"?L("Tumbuhan","Plant"):L("Haiwan","Animal"))+L(" dari "," from ")+regionLabel(sp.region)+".";
  else if(guessHints===2) hb.innerText=L("💡 Bermula dengan '","💡 Starts with '")+spName(sp)[0]+"' ("+spName(sp).replace(/ /g,"").length+L(" huruf)."," letters).");
  else { const img=$("guessImg"),box=$("guessImgBox");
    if(sp.mystery){ img.style.filter="blur(3.5px) saturate(1.2)"; hb.innerText=L("💡 Imej menjadi lebih jelas!","💡 The image is getting clearer!"); }
    else { const bw=box.clientWidth,bh=box.clientHeight,zoom=1.5; img.style.width=(bw*zoom)+"px"; img.style.height=(bh*zoom)+"px"; img.style.transform="translate("+(-(bw*zoom-bw)/2)+"px,"+(-(bh*zoom-bh)/2)+"px)"; hb.innerText=L("💡 Gambar diperbesar — lihat lebih banyak!","💡 Image zoomed out — see more!"); } } }
function guessShowOptions(){ if(!guessCur)return; SFX.click(); const box=$("guessOptions"); if(box.children.length)return;
  const others=shuffle(EXTRA.concat(MYSTERY).filter(s=>s.name!==guessCur.name)).slice(0,3); const opts=shuffle([guessCur].concat(others));
  opts.forEach(o=>{ const b=document.createElement("button"); b.className="btn-press py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-amber-400"; b.innerText=spName(o); b.onclick=()=>{ $("guessInput").value=spName(o); submitGuess(); }; box.appendChild(b); }); }
function guessEnd(){ const cleared=guessRound>=guessTotal&&guessLives>0; if(cleared&&save.guessLvl<99){save.guessLvl++;persist();} gameRewardScreen("Teka Siapa",cleared,guessScore,guessTotal*3,"guess"); }

/* ===================== GAME: DENGAR BUNYI ===================== */
let listenRound=0,listenTotal=5,listenLives=3,listenScore=0,listenCur=null,listenNoPenalty=false;
function listenAnimals(){ return EXTRA.filter(s=>s.audio); }
function startListen(){ SFX.click(); maybeTut("listen",()=>{ listenScore=0; listenLives=3; listenRound=0; listenTotal=5; $("listenLvlNum").innerText=(save.listenLvl+1); renderRoadmap("listen"); showScreen("screen-listen"); nextListen(); }); }
function nextListen(){ if(listenRound>=listenTotal||listenLives<=0) return listenEnd();
  listenRound++; $("listenProg").innerText=listenRound+"/"+listenTotal;
  const pool=listenAnimals(); listenCur=pool[Math.floor(Math.random()*pool.length)];
  const others=shuffle(pool.filter(s=>s.name!==listenCur.name)).slice(0,3); const opts=shuffle([listenCur].concat(others));
  const box=$("listenOptions"); box.innerHTML="";
  opts.forEach(o=>{ const b=document.createElement("button"); b.className="btn-press p-2 bg-slate-50 border-2 border-slate-200 rounded-2xl hover:border-sky-400 flex flex-col items-center gap-1"; b.dataset.name=o.name;
    b.innerHTML='<div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-100"><img src="'+o.image+'" class="w-full h-full object-cover"></div><span class="text-xs font-bold text-slate-700">'+spName(o)+'</span>';
    b.onclick=()=>listenPick(o,b); box.appendChild(b); });
  const isPractice=(!save.playedListen && listenRound===1); listenNoPenalty=isPractice;
  const lfb=$("listenFeedback");
  if(isPractice){ save.playedListen=true; persist(); lfb.classList.remove("hidden"); lfb.className="mt-3 text-center font-bold text-sky-600"; lfb.innerText=L("🎓 Ronda Latihan — tiada nyawa hilang!","🎓 Practice round — no lives lost!"); }
  else lfb.classList.add("hidden");
  updateListenHUD(); setTimeout(playListen,450);
}
function playListen(){ if(listenCur) playRealSound(listenCur); }
function updateListenHUD(){ $("listenLives").innerText="❤️".repeat(listenLives)+"🖤".repeat(3-listenLives); $("listenScore").innerText=listenScore; }
function listenPick(o,btn){ const box=$("listenOptions"); for(const b of box.children)b.disabled=true;
  if(o.name===listenCur.name){ SFX.correct(); btn.style.borderColor="#10b981"; btn.style.background="#dcfce7"; listenScore++; markCollected(listenCur.name,"listen"); addCoins(5); addXP(6); const fb=$("listenFeedback"); fb.classList.remove("hidden"); fb.className="mt-3 text-center font-bold text-emerald-600"; fb.innerText=L("✅ Betul — ","✅ Correct — ")+spName(listenCur)+"!"; }
  else { SFX.wrong(); btn.style.borderColor="#ef4444"; btn.style.background="#fee2e2"; if(!listenNoPenalty)listenLives--; for(const b of box.children){ if(b.dataset.name===listenCur.name)b.style.borderColor="#10b981"; } const fb=$("listenFeedback"); fb.classList.remove("hidden"); fb.className="mt-3 text-center font-bold text-rose-500"; fb.innerText=L("❌ Itu ","❌ That is ")+spName(o)+L(". Betulnya ",". The answer is ")+spName(listenCur)+"."; }
  updateListenHUD(); setTimeout(nextListen,1250); }
function listenEnd(){ const cleared=listenRound>=listenTotal&&listenLives>0; if(cleared&&save.listenLvl<99){save.listenLvl++;persist();} gameRewardScreen("Dengar Bunyi",cleared,listenScore,listenTotal,"listen"); }

/* ===================== BUKU KOLEKSI ===================== */
let colTab="animal",colRegion="Semua";
function buildCollection(){
  const tabs=$("colTabs"); tabs.innerHTML="";
  [["animal",t("tab_animal")],["plant",t("tab_plant")],["scenario",t("tab_scene")]].forEach(d=>{ const b=document.createElement("button"); b.className="btn-press px-4 py-2 rounded-2xl text-sm font-bold "+(colTab===d[0]?"bg-violet-500 text-white shadow":"bg-white text-slate-500 border border-slate-200"); b.innerText=d[1]; b.onclick=()=>{colTab=d[0];buildCollection();SFX.click();}; tabs.appendChild(b); });
  const regBox=$("colRegions"); regBox.innerHTML="";
  if(colTab!=="scenario"){ ["Semua","Malaysia","Asia","Dunia"].forEach(r=>{ const b=document.createElement("button"); b.className="btn-press px-3 py-1.5 rounded-xl text-xs font-bold "+(colRegion===r?"bg-emerald-500 text-white":"bg-white text-slate-500 border border-slate-200"); b.innerText=({Semua:t("r_all"),Malaysia:t("r_my"),Asia:t("r_asia"),Dunia:t("r_world")} as any)[r]||r; b.onclick=()=>{colRegion=r;buildCollection();SFX.click();}; regBox.appendChild(b); }); }
  const grid=$("colGrid"); grid.innerHTML="";
  if(colTab==="scenario"){
    SCENARIOS.forEach(sc=>{ const seen=save.scenariosSeen.indexOf(sc.type)>=0; const c=document.createElement("div"); c.className="btn-press rounded-2xl p-3 text-center border-2 "+(seen?"bg-white border-rose-200 cursor-pointer":"bg-slate-100 border-slate-200");
      c.innerHTML='<div class="text-4xl mb-1 '+(seen?"":"grayscale opacity-40")+'">'+sc.icon+'</div><p class="text-[10px] font-bold '+(seen?"text-slate-700":"text-slate-400")+'">'+(seen?(lang()==="en"&&SCENARIO_EN[sc.type]?SCENARIO_EN[sc.type].name:sc.name):"???")+'</p>'; if(seen)c.onclick=()=>openScenarioDetail(sc); grid.appendChild(c); });
  } else {
    let list=CATALOG.filter(s=>colTab==="animal"?s.rtype==="animal":s.rtype==="plant");
    if(colRegion!=="Semua") list=list.filter(s=>regionOf(s.region)===colRegion);
    list.forEach(sp=>{ const disc=isDiscovered(sp.name); const rr=RARITY[rarityOf(sp)]; const c=document.createElement("div"); c.className="btn-press rounded-2xl p-2 text-center border-2 "+(disc?("bg-white cursor-pointer "+rr.frame):(sp.mystery?"bg-slate-100 border-amber-200":"bg-slate-100 border-slate-200"));
      if(disc){ c.innerHTML='<div class="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 mb-1 relative"><img src="'+sp.image+'" class="w-full h-full object-cover"><span class="absolute top-1 left-1 text-[8px] font-extrabold px-1 rounded '+rr.chip+'">'+rarityName(rarityOf(sp))+'</span></div><p class="text-[10px] font-bold text-slate-700 leading-tight">'+spName(sp)+'</p>'; c.onclick=()=>openSpeciesDetail(sp); }
      else if(sp.mystery){ c.innerHTML='<div class="w-full aspect-square rounded-xl bg-slate-800 flex items-center justify-center text-3xl mb-1">❓</div><p class="text-[10px] font-bold text-amber-500">'+L("MISTERI","MYSTERY")+'</p>'; }
      else { c.innerHTML='<div class="w-full aspect-square rounded-xl bg-slate-200 flex items-center justify-center text-3xl mb-1 grayscale opacity-50">'+sp.emoji+'</div><p class="text-[10px] font-bold text-slate-400">???</p>'; }
      grid.appendChild(c); });
  }
  const total=CATALOG.length,got=CATALOG.filter(s=>isDiscovered(s.name)).length; $("colCount").innerText="🐾 "+got+"/"+total;
}
function openSpeciesDetail(sp){ SFX.click(); const c=save.collected[sp.name]||{}; const badges=[]; if(c.quiz)badges.push(L("🧠 Kuiz","🧠 Quiz")); if(c.guess)badges.push(L("🔍 Teka","🔍 Guess")); if(c.listen)badges.push(L("🔊 Bunyi","🔊 Sound"));
  let infoHTML=""; for(const k in spInfo(sp)) infoHTML+='<div class="bg-slate-50 border border-slate-100 p-2.5 rounded-xl"><b class="block text-[10px] text-emerald-600 uppercase tracking-wide mb-0.5">'+k+'</b><span class="text-slate-700">'+spInfo(sp)[k]+'</span></div>';
  $("detailBody").innerHTML=
    '<div class="h-44 overflow-hidden"><img src="'+sp.image+'" class="w-full h-full object-cover"></div>'+
    '<div class="p-4">'+(sp.mystery?'<span class="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full uppercase mr-1">🌟 '+L("Misteri","Mystery")+'</span>':'')+
    '<span class="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full uppercase">'+statusLabel(sp.status||"")+'</span>'+
    '<h2 class="display text-2xl font-extrabold text-slate-800 mt-1">'+spName(sp)+'</h2>'+
    '<p class="text-[11px] italic text-slate-400 mb-1">'+(sp.sci||"")+' • '+(lang()==="en"?(sp.name||""):(sp.common||""))+'</p>'+
    '<p class="text-[11px] font-bold text-violet-500 mb-3">📍 '+regionLabel(sp.region)+' • '+L("Dicop","Stamped")+': '+(badges.join("  ")||"-")+'</p>'+
    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">'+infoHTML+'</div></div>';
  const m=$("detailModal"); m.classList.remove("hidden"); m.classList.add("flex");
}
function openScenarioDetail(sc){ SFX.click();
  const en:any = lang()==="en" ? SCENARIO_EN[sc.type] : null;
  const v = en ? {name:en.name, desc:en.desc, casesMY:en.casesMY, effect:en.effect, number:en.number||sc.number} : sc;
  $("detailBody").innerHTML=
    '<div class="p-5 text-center text-white" style="background:linear-gradient(135deg,#f97316,#ef4444)"><div class="text-5xl mb-1">'+sc.icon+'</div><h2 class="display text-2xl font-extrabold">'+v.name+'</h2></div>'+
    '<div class="p-4 space-y-2 text-sm">'+
    '<div class="bg-slate-50 border border-slate-100 p-3 rounded-xl"><b class="block text-[10px] text-rose-600 uppercase mb-0.5">'+(en?"What is it?":"Apa Itu?")+'</b>'+v.desc+'</div>'+
    '<div class="bg-slate-50 border border-slate-100 p-3 rounded-xl"><b class="block text-[10px] text-amber-600 uppercase mb-0.5">'+(en?"Cases in Malaysia":"Kes di Malaysia")+'</b>'+v.casesMY+'</div>'+
    '<div class="bg-slate-50 border border-slate-100 p-3 rounded-xl"><b class="block text-[10px] text-emerald-600 uppercase mb-0.5">'+(en?"Impact on wildlife":"Kesan kepada Hidupan")+'</b>'+v.effect+'</div>'+
    '<div class="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center"><b class="text-[10px] text-emerald-600 uppercase block mb-0.5">'+(en?"Hotline / Action":"Talian / Tindakan")+'</b><span class="font-extrabold text-slate-800">'+v.number+'</span></div></div>';
  const m=$("detailModal"); m.classList.remove("hidden"); m.classList.add("flex");
}
function closeDetail(){ const m=$("detailModal"); m.classList.add("hidden"); m.classList.remove("flex"); }

/* ---------- BOOT & WINDOW HANDLERS ---------- */
function _boot(){ const gi = $("guessInput"); if (gi) gi.addEventListener("keydown", (e: any) => { if (e.key === "Enter") submitGuess(); }); applyI18n(); syncHUD(); }
Object.assign(window as any, {
  goHub, goLevels, openStore, openAch, openCollection, openHelp, closeHelp, backFromSub,
  quitToLevels, quitGame, showScreen, startStage, startGuess, startListen, startQuiz,
  submitGuess, guessHint, guessShowOptions, playListen, toggleCtrl, toggleMute, toggleLang, setLang, tutNext, tutSkip,
  closeSpecies, closeDetail, claimStamp, retryStudy, launchRescue, hideWin, buyItem, equipItem
});
_boot();
