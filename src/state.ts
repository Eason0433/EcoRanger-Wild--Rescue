import type { SaveData } from "./types";

export let save: SaveData = {coins:0,xp:0,completed:[],stars:{},
  equip:{base:"ranger",hat:null,gear:null,pet:null}, owned:["ranger","girl"],
  collected:{}, scenariosSeen:[], guessLvl:0, listenLvl:0, tut:{}, ach:[], muted:false, ctrl:"dpad", lang:"ms", rewardedGuess:[], rewardedListen:[]};
function loadSave(){try{const s=JSON.parse(localStorage.getItem("ecoRangerSave3"));if(s)save=Object.assign(save,s);}catch(e){}
  if(!save.equip)save.equip={base:"ranger",hat:null,gear:null,pet:null};
  if(!save.owned||save.owned.indexOf("ranger")<0)save.owned=(save.owned||[]).concat(["ranger","girl"]);
  if(!save.collected)save.collected={}; if(!save.scenariosSeen)save.scenariosSeen=[]; if(!save.tut)save.tut={};
  if(!save.lang)save.lang="ms"; if(!save.rewardedGuess)save.rewardedGuess=[]; if(!save.rewardedListen)save.rewardedListen=[]; }
function persist(){try{localStorage.setItem("ecoRangerSave3",JSON.stringify(save));}catch(e){}}
loadSave();
function markCollected(name,mode){ save.collected[name]=save.collected[name]||{}; save.collected[name][mode]=true; persist(); }
function isDiscovered(name){ const c=save.collected[name]; return c&&(c.quiz||c.guess||c.listen); }


export { loadSave, persist, markCollected, isDiscovered };
