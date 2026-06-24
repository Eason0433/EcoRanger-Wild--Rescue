// ============================================================
// i18n — Bahasa Melayu (ms) / English (en)
// ============================================================
import { save, persist } from "./state";

type Dict = Record<string, string>;

const MS: Dict = {
  tagline: "Selamatkan haiwan & tumbuhan terancam — lindungi <b class='text-emerald-700'>Hidupan di Darat (SDG 15)</b>!",
  play: "▶ MULA MAIN",
  btn_collection: "Koleksi", btn_store: "Kedai", btn_ach: "Pencapaian", btn_how: "Cara",
  choose_game: "🎮 Pilih Permainan",
  explore_t: "Teroka & Kuiz", explore_d: "Jelajah hutan, jejaki haiwan & tumbuhan, jawab kuiz untuk kumpul cop.",
  guess_t: "Teka Siapa Saya?", guess_d: "Lihat sebahagian gambar, taip nama haiwan/tumbuhan yang betul!",
  listen_t: "Dengar Bunyi", listen_d: "Dengar bunyi haiwan, teka haiwan yang betul antara pilihan.",
  book_t: "Buku Koleksi", book_d: "Lihat semua cop haiwan, tumbuhan & babak yang telah dikumpul.",
  back: "Kembali", menu: "Menu", exit: "Keluar",
  store_title: "🛍️ Kedai Ranger", coll_title: "📖 Buku Koleksi", ach_title: "🏅 Pencapaian",
  rewards_map: "🎁 Hadiah Level", level: "Level", locked: "Terkunci",
  congrats: "Tahniah!", you_got: "Anda dapat", reward_costume: "kostum baharu",
  continue: "Teruskan", play_again: "Main Lagi →", game_hub: "Hub Permainan", next_mission: "Misi Seterusnya →",
  mission_map: "Peta Misi",
  tab_animal: "🐾 Haiwan", tab_plant: "🌿 Tumbuhan", tab_scene: "🚨 Babak",
  r_all: "Semua", r_my: "Malaysia", r_asia: "Asia", r_world: "Dunia",
  hint: "Petunjuk", send: "Hantar ✓", show_options: "Tak pasti? Tunjuk pilihan",
  type_here: "Taip nama di sini...", sound_q: "Bunyi apakah ini? Tekan untuk dengar.",
  understood: "Faham!", skip: "Langkau", next: "Seterusnya →", start_tut: "Mula! ✓",
  help_title: "📖 Cara Main", ranger_you: "Ranger Anda",
  obj_track: "Jejaki", stamp: "cop", portal_open: "🚪 Portal misi telah terbuka!",
  study_note: "Kaji ciri-ciri dahulu — maklumat ini disembunyikan semasa kuiz!",
  mula_kuiz: "SAYA DAH FAHAM — MULA KUIZ ▶", q_label: "Soalan",
  store_desc: "Lengkapkan slot: <b>Karakter</b>, <b>Topi</b>, <b>Gajet</b> & <b>Haiwan Peliharaan</b>. Item <span class='text-amber-600 font-bold'>RARE</span> & <span class='text-rose-600 font-bold'>KHAS</span> (ganjaran tamat misi) menanti!",
  help_1: "🕹️ <b>Gerak</b> dengan <b>WASD</b> / anak panah / pad sentuh.",
  help_2: "🧭 Ikut <b>petunjuk arah</b> & <b>peta mini</b> (kanan atas) cari haiwan/tumbuhan. Haiwan air ada di tasik, haiwan darat di habitatnya!",
  help_3: "📚 Bila jumpa, <b>kaji ciri-cirinya</b> — kemudian kuiz <b>menyembunyikan</b> maklumat itu.",
  help_4: "🧠 Jawab kuiz (pilihan, Betul/Salah, kenal gambar). Betul <b>2/3</b> untuk dapat <b>cop</b>. Jawab berturut-turut = <b>combo</b> & bonus!",
  help_5: "🚨 Selamatkan krisis: panggil <b>bomba/polis</b> dengan tindakan & nombor betul — tonton mereka menyelamat!",
  help_6: "🏅 Naik <b>pangkat</b>, kumpul <b>pencapaian</b> & <b>bintang</b>. Masuk <b>portal</b> ke misi seterusnya.",
  levels_title: "🗺️ Pilih Misi", guess_title: "🔍 Teka Siapa Saya", listen_title: "🔊 Dengar Bunyi",
  investigate: "Siasat", emergency_line: "Talian Kecemasan", investigate_q: "Apakah tindakan terbaik?",
  lang_label: "Bahasa", lang_short: "BM"
};

const EN: Dict = {
  tagline: "Save endangered animals & plants — protect <b class='text-emerald-700'>Life on Land (SDG 15)</b>!",
  play: "▶ START",
  btn_collection: "Collection", btn_store: "Store", btn_ach: "Awards", btn_how: "How",
  choose_game: "🎮 Choose a Game",
  explore_t: "Explore & Quiz", explore_d: "Roam the forest, track animals & plants, answer quizzes to earn stamps.",
  guess_t: "Guess Who Am I?", guess_d: "See part of a photo, type the correct animal/plant name!",
  listen_t: "Listen to Sounds", listen_d: "Hear an animal sound and pick the correct animal.",
  book_t: "Collection Book", book_d: "View all the animal, plant & scene stamps you've collected.",
  back: "Back", menu: "Menu", exit: "Exit",
  store_title: "🛍️ Ranger Store", coll_title: "📖 Collection Book", ach_title: "🏅 Awards",
  rewards_map: "🎁 Level Rewards", level: "Level", locked: "Locked",
  congrats: "Congratulations!", you_got: "You got", reward_costume: "a new costume",
  continue: "Continue", play_again: "Play Again →", game_hub: "Game Hub", next_mission: "Next Mission →",
  mission_map: "Mission Map",
  tab_animal: "🐾 Animals", tab_plant: "🌿 Plants", tab_scene: "🚨 Scenes",
  r_all: "All", r_my: "Malaysia", r_asia: "Asia", r_world: "World",
  hint: "Hint", send: "Submit ✓", show_options: "Not sure? Show choices",
  type_here: "Type the name here...", sound_q: "What sound is this? Tap to listen.",
  understood: "Got it!", skip: "Skip", next: "Next →", start_tut: "Start! ✓",
  help_title: "📖 How to Play", ranger_you: "Your Ranger",
  obj_track: "Find", stamp: "stamps", portal_open: "🚪 The mission portal is open!",
  study_note: "Study the facts first — this info is hidden during the quiz!",
  mula_kuiz: "I UNDERSTAND — START QUIZ ▶", q_label: "Question",
  store_desc: "Fill the slots: <b>Character</b>, <b>Hat</b>, <b>Gadget</b> & <b>Pet</b>. <span class='text-amber-600 font-bold'>RARE</span> & <span class='text-rose-600 font-bold'>SPECIAL</span> (mission-reward) items await!",
  help_1: "🕹️ <b>Move</b> with <b>WASD</b> / arrow keys / touch pad.",
  help_2: "🧭 Follow the <b>direction hint</b> & <b>minimap</b> (top-right) to find animals/plants. Water animals are in the lake, land animals in their habitat!",
  help_3: "📚 When you find one, <b>study its facts</b> — then the quiz <b>hides</b> that info.",
  help_4: "🧠 Answer the quiz (multiple choice, True/False, photo ID). Get <b>2/3</b> to earn a <b>stamp</b>. Consecutive correct = <b>combo</b> & bonus!",
  help_5: "🚨 Solve crises: call the <b>fire brigade/police</b> with the right action & number — watch them rescue!",
  help_6: "🏅 Rank up, collect <b>awards</b> & <b>stars</b>. Enter the <b>portal</b> to the next mission.",
  levels_title: "🗺️ Choose a Mission", guess_title: "🔍 Guess Who Am I", listen_title: "🔊 Listen to Sounds",
  investigate: "Investigate", emergency_line: "Emergency Hotline", investigate_q: "What is the best action?",
  lang_label: "Language", lang_short: "EN"
};

const TABLE: Record<string, Dict> = { ms: MS, en: EN };

export function lang(): string { return save.lang === "en" ? "en" : "ms"; }
export function t(key: string): string {
  const d = TABLE[lang()] || MS;
  return d[key] ?? MS[key] ?? key;
}

/** Isi semua elemen [data-i18n] / [data-i18n-html] mengikut bahasa semasa */
export function applyI18n(): void {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n"); if (k) el.textContent = t(k);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-html]").forEach((el) => {
    const k = el.getAttribute("data-i18n-html"); if (k) el.innerHTML = t(k);
  });
  document.querySelectorAll<HTMLInputElement>("[data-i18n-ph]").forEach((el) => {
    const k = el.getAttribute("data-i18n-ph"); if (k) el.placeholder = t(k);
  });
}

export function setLang(l: string): void {
  save.lang = l === "en" ? "en" : "ms";
  persist();
  applyI18n();
}

export function toggleLang(): void {
  setLang(lang() === "en" ? "ms" : "en");
}
