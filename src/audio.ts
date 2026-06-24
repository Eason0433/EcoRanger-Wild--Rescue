import { save, persist } from "./state";

/* ---------- BUNYI (Web Audio, disintesis) ---------- */
let actx: any = null;
function ensureAudio(){ if(!actx){try{actx=new ((window as any).AudioContext||(window as any).webkitAudioContext)();}catch(e){}} if(actx&&actx.state==="suspended")actx.resume(); }
window.addEventListener("pointerdown",ensureAudio,{once:false});
function tone(freq, dur, type?, vol?, when?){ if(save.muted||!actx)return; const t=(when||actx.currentTime); const o=actx.createOscillator(),g=actx.createGain(); o.type=type||"sine"; o.frequency.setValueAtTime(freq,t); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol||.18,t+.012); g.gain.exponentialRampToValueAtTime(.0008,t+dur); o.connect(g).connect(actx.destination); o.start(t); o.stop(t+dur+.02); }
function noise(dur,filterType,freq,vol){ if(save.muted||!actx)return; const n=Math.floor(actx.sampleRate*dur); const buf=actx.createBuffer(1,n,actx.sampleRate); const d=buf.getChannelData(0); for(let i=0;i<n;i++)d[i]=(Math.random()*2-1); const src=actx.createBufferSource(); src.buffer=buf; const f=actx.createBiquadFilter(); f.type=filterType||"lowpass"; f.frequency.value=freq||800; const g=actx.createGain(); g.gain.setValueAtTime(vol||.2,actx.currentTime); g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+dur); src.connect(f).connect(g).connect(actx.destination); src.start(); }
const SFX={
  click:()=>tone(440,.06,"triangle",.12),
  correct:()=>{ensureAudio();tone(660,.1,"sine",.16);tone(880,.12,"sine",.16,actx&&actx.currentTime+.09);tone(1320,.16,"sine",.14,actx&&actx.currentTime+.18);},
  wrong:()=>{ensureAudio();tone(200,.18,"sawtooth",.14);tone(150,.22,"sawtooth",.12,actx&&actx.currentTime+.12);},
  collect:()=>{ensureAudio();tone(784,.09,"square",.12);tone(1175,.14,"square",.12,actx&&actx.currentTime+.08);},
  levelup:()=>{ensureAudio();[523,659,784,1046].forEach((f,i)=>tone(f,.18,"triangle",.16,actx&&actx.currentTime+i*.1));},
  victory:()=>{ensureAudio();[523,659,784,1046,784,1046].forEach((f,i)=>tone(f,.22,"sine",.16,actx&&actx.currentTime+i*.12));},
  siren:(type)=>{ensureAudio();if(!actx||save.muted)return; const t0=actx.currentTime;
    if(type==="bomba"){ for(let i=0;i<4;i++){tone(800,.32,"sawtooth",.13,t0+i*.5);tone(600,.3,"sawtooth",.12,t0+i*.5+.3);} }
    else if(type==="vet"){ for(let i=0;i<5;i++){tone(900,.2,"sine",.12,t0+i*.34);tone(680,.18,"sine",.12,t0+i*.34+.18);} }
    else { for(let i=0;i<6;i++){tone(980,.16,"square",.11,t0+i*.28);tone(720,.14,"square",.11,t0+i*.28+.14);} } },
  fire:()=>noise(.5,"lowpass",500,.12),
  splash:()=>noise(.35,"lowpass",900,.16),
  hiss:()=>noise(.5,"highpass",2200,.1)
};
function animalSound(kind){ ensureAudio(); if(!actx||save.muted)return; const t=actx.currentTime;
  if(kind==="roar"){noise(.6,"lowpass",380,.18);tone(110,.5,"sawtooth",.12);tone(90,.55,"sawtooth",.10,t+.08);}
  else if(kind==="growl"){noise(.45,"lowpass",300,.14);tone(130,.4,"sawtooth",.10);}
  else if(kind==="trumpet"){tone(300,.18,"sawtooth",.14);tone(520,.3,"sawtooth",.14,t+.12);tone(420,.22,"sawtooth",.12,t+.36);}
  else if(kind==="call"){tone(620,.18,"sine",.14);tone(840,.2,"sine",.14,t+.18);tone(560,.22,"sine",.12,t+.4);}
  else if(kind==="hiss"){noise(.5,"highpass",2400,.12);}
  else if(kind==="splash"){noise(.3,"lowpass",1000,.18);}
  else if(kind==="howl"){ const o=actx.createOscillator(),g=actx.createGain(); o.type="sine"; o.frequency.setValueAtTime(330,t); o.frequency.linearRampToValueAtTime(520,t+.4); o.frequency.linearRampToValueAtTime(440,t+1.0); g.gain.setValueAtTime(.001,t); g.gain.linearRampToValueAtTime(.16,t+.15); g.gain.linearRampToValueAtTime(.12,t+.8); g.gain.exponentialRampToValueAtTime(.001,t+1.2); o.connect(g).connect(actx.destination); o.start(t); o.stop(t+1.25); }
  else if(kind==="screech"){ noise(.25,"highpass",3000,.12); const o=actx.createOscillator(),g=actx.createGain(); o.type="sawtooth"; o.frequency.setValueAtTime(1800,t); o.frequency.exponentialRampToValueAtTime(700,t+.3); g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.001,t+.32); o.connect(g).connect(actx.destination); o.start(t); o.stop(t+.34); }
}
function toggleMute(){ save.muted=!save.muted; persist(); refreshMute(); if(!save.muted){ensureAudio();SFX.click();} }
function refreshMute(){ const ic=save.muted?'<i class="fa-solid fa-volume-xmark"></i>':'<i class="fa-solid fa-volume-high"></i>'; ["muteBtn","muteBtn2"].forEach(id=>{const e=document.getElementById(id);if(e)e.innerHTML=ic;}); }

/* ---------- BUNYI HAIWAN SEBENAR (rakaman Wikimedia) ---------- */
let realAudioEl=null, realAudioTimer=null;
function playRealSound(sp){
  if(save.muted) return;
  if(sp && sp.audio){
    try{
      if(!realAudioEl){ realAudioEl=new Audio(); realAudioEl.preload="auto"; }
      if(realAudioTimer){ clearTimeout(realAudioTimer); }
      realAudioEl.pause(); realAudioEl.src=sp.audio; realAudioEl.currentTime=0; realAudioEl.volume=0.9;
      const p=realAudioEl.play(); if(p&&p.catch)p.catch(()=>{ animalSound(sp.sound); });
      realAudioTimer=setTimeout(()=>{ try{ realAudioEl.pause(); }catch(e){} }, 4500); // had clip panjang
      return;
    }catch(e){}
  }
  // tiada rakaman → bunyi sintetik atau chime
  if(sp && sp.sound && sp.sound!=="none") animalSound(sp.sound); else SFX.collect();
}

export { ensureAudio, tone, noise, SFX, animalSound, toggleMute, refreshMute, playRealSound };
