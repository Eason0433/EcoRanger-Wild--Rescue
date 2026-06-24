// ============================================================
// English content overrides (keyed by name / stage / type).
// Malay remains the source in data.ts; this provides EN.
// ============================================================
import type { QA, SceneOption } from "./types";

export const STAGE_TITLE_EN: Record<string, string> = {
  "1-1": "Level 1-1 · Endangered Animals of Malaysia",
  "1-2": "Level 1-2 · Endangered Plants of Malaysia",
  "2-1": "Level 2-1 · Endangered Animals of Asia",
  "2-2": "Level 2-2 · Endangered Plants of Asia",
  "3-1": "Level 3-1 · Endangered Animals of the World",
  "3-2": "Level 3-2 · Endangered Plants of the World"
};

interface SpeciesEn { info?: Record<string, string>; bank?: QA[]; }
export const SPECIES_EN: Record<string, SpeciesEn> = {
  // ---- 1-1 animals ----
  "Harimau Malaya": {
    info: { "Range": "Peninsular Malaysia only", "Wild population": "< 150 left", "Habitat": "Tropical rainforest", "Diet": "Carnivore — deer & wild boar", "Fact": "Featured on Malaysia's Coat of Arms" },
    bank: [{ q: "What does the Malayan Tiger mainly eat?", a: ["Forest fruit", "Meat (deer & boar)", "Grass", "Fish"], c: 1 },
      { q: "Where does the Malayan Tiger live naturally?", a: ["All of Asia", "Peninsular Malaysia only", "Africa", "Australia"], c: 1 },
      { q: "Its current wild population is about?", a: ["10,000+", "5,000", "< 150", "Extinct"], c: 2 },
      { q: "The Malayan Tiger appears on Malaysia's Coat of Arms.", tf: true },
      { q: "The Malayan Tiger eats grass and leaves.", tf: false }]
  },
  "Orang Utan": {
    info: { "Range": "Borneo (Sabah & Sarawak)", "Threat": "Logging & habitat loss", "Habitat": "Swamp & rainforest", "Diet": "Omnivore — fruit, shoots, insects", "Fact": "'Orang Utan' means 'forest person'" },
    bank: [{ q: "In which states is the Orangutan found in Malaysia?", a: ["Sabah & Sarawak", "Johor", "Perlis", "Melaka"], c: 0 },
      { q: "What does the name 'Orang Utan' mean?", a: ["Mountain person", "Forest person", "Strong person", "Old person"], c: 1 },
      { q: "The biggest threat to the Orangutan?", a: ["Cold weather", "Logging & habitat loss", "Tigers", "Floods"], c: 1 },
      { q: "The Orangutan is a primate (mammal), not an ordinary monkey.", tf: true },
      { q: "The Orangutan only eats meat.", tf: false }]
  },
  "Penyu Belimbing": {
    info: { "Range": "Once nested at Rantau Abang, Terengganu", "Malaysia status": "Almost locally extinct", "Habitat": "Open ocean", "Diet": "Jellyfish", "Fact": "Largest turtle on Earth — soft leathery shell" },
    bank: [{ q: "Favourite food of the Leatherback Turtle?", a: ["Jellyfish", "Crab", "Seaweed", "Baby shark"], c: 0 },
      { q: "What makes its shell unique?", a: ["Hard as steel", "Soft like leather", "Spiky", "Glowing"], c: 1 },
      { q: "The Leatherback is the largest turtle in the world.", tf: true },
      { q: "Famous nesting beach in Malaysia?", a: ["Rantau Abang, Terengganu", "Langkawi", "Port Dickson", "Teluk Batik"], c: 0 },
      { q: "Ocean plastic does not harm this turtle.", tf: false }]
  },
  // ---- 1-2 plants ----
  "Rafflesia": {
    info: { "Range": "Sabah, Sarawak, Pahang", "Feature": "Largest single flower in the world", "Habitat": "Rainforest", "Diet": "Parasite on Tetrastigma vine", "Fact": "Smells like rotting flesh to attract flies" },
    bank: [{ q: "What is Rafflesia famous for?", a: ["Largest single flower in the world", "Smallest flower", "Most fragrant", "Eats meat"], c: 0 },
      { q: "Why does Rafflesia smell foul?", a: ["To attract pollinating flies", "To scare enemies", "Because it's rotten", "To attract bees"], c: 0 },
      { q: "Rafflesia lives as a parasite on another plant.", tf: true },
      { q: "Main threat to Rafflesia?", a: ["Forest destruction", "Heavy rain", "Fertile soil", "Sunlight"], c: 0 },
      { q: "Rafflesia has large leaves and a stem.", tf: false }]
  },
  "Periuk Kera": {
    info: { "Range": "Highlands of Borneo & the Peninsula", "Feature": "Pitcher-shaped carnivorous plant", "Habitat": "Acidic, nutrient-poor soil", "Diet": "Trapped insects", "Fact": "Fluid inside the pitcher digests insects" },
    bank: [{ q: "How does the Pitcher Plant get extra nutrients?", a: ["By trapping insects", "From rain", "Stealing from other plants", "From rocks"], c: 0 },
      { q: "The Pitcher Plant is carnivorous (an insect-eater).", tf: true },
      { q: "Why must it trap insects?", a: ["Its soil is nutrient-poor", "For defence", "To bloom", "No reason"], c: 0 },
      { q: "Its special shape?", a: ["Like a pitcher/jug", "Like a ball", "Like a star", "Flat"], c: 0 },
      { q: "The Pitcher Plant grows on the sea floor.", tf: false }]
  },
  "Pokok Cengal": {
    info: { "Range": "Peninsular Malaysian forests", "Feature": "Most valuable hardwood", "Habitat": "Lowland rainforest", "Use": "Construction, boats, bridges", "Fact": "Can live for hundreds of years" },
    bank: [{ q: "Chengal is famous for?", a: ["Hard & valuable timber", "Sweet fruit", "Fragrant flowers", "Medicinal leaves"], c: 0 },
      { q: "Main threat to the Chengal tree?", a: ["Over-logging", "Floods", "Cold", "Insects"], c: 0 },
      { q: "Chengal can live for hundreds of years.", tf: true },
      { q: "Chengal wood is used for?", a: ["Construction & boats", "Paper", "Fuel", "Food"], c: 0 },
      { q: "Chengal grows on snowy mountain peaks.", tf: false }]
  },
  // ---- 2-1 animals ----
  "Panda Gergasi": {
    info: { "Range": "Mountains of China", "Wild population": "~1,800", "Habitat": "Bamboo forest", "Diet": "99% bamboo", "Fact": "The WWF conservation logo" },
    bank: [{ q: "Main food of the Giant Panda?", a: ["Bamboo", "Meat", "Fish", "Honey"], c: 0 },
      { q: "The Giant Panda lives wild in which country?", a: ["Japan", "China", "India", "Korea"], c: 1 },
      { q: "The Panda is the logo of the WWF.", tf: true },
      { q: "Natural habitat of the Panda?", a: ["Mountain bamboo forest", "Desert", "Ocean", "Tundra"], c: 0 },
      { q: "The Giant Panda is a sea-hunting animal.", tf: false }]
  },
  "Gajah Asia": {
    info: { "Range": "India, Thailand, Indonesia", "Threat": "Human conflict", "Habitat": "Forest & grassland", "Diet": "Herbivore", "Fact": "Largest land mammal in Asia" },
    bank: [{ q: "Diet of the Asian Elephant?", a: ["Herbivore (plants)", "Carnivore", "Insects", "Fish"], c: 0 },
      { q: "The Asian Elephant is the largest land mammal in Asia.", tf: true },
      { q: "Main threat to the Asian Elephant?", a: ["Human conflict & habitat loss", "Cold", "Too much water", "Tigers"], c: 0 },
      { q: "The Asian Elephant is mostly found in?", a: ["India & Thailand", "Europe", "Antarctica", "America"], c: 0 },
      { q: "The Asian Elephant has bigger ears than the African Elephant.", tf: false }]
  },
  "Biawak Komodo": {
    info: { "Range": "Komodo Island, Indonesia", "Population": "Limited to a few islands", "Habitat": "Dry forest & savanna", "Diet": "Carnivore — deer, pigs, carrion", "Fact": "World's largest lizard; venomous saliva" },
    bank: [{ q: "The Komodo Dragon is?", a: ["The world's largest lizard", "The longest snake", "The smallest crocodile", "The biggest frog"], c: 0 },
      { q: "Komodo is found in which country?", a: ["Indonesia", "Japan", "Philippines", "India"], c: 0 },
      { q: "Komodo saliva is venomous.", tf: true },
      { q: "Diet of the Komodo Dragon?", a: ["Meat & carrion", "Bamboo", "Grass", "Fruit"], c: 0 },
      { q: "The Komodo breathes fire from its mouth.", tf: false }]
  },
  // ---- 2-2 plants ----
  "Bunga Bangkai": {
    info: { "Range": "Sumatra, Indonesia", "Feature": "Tallest unbranched flower cluster", "Habitat": "Tropical rainforest", "Pollination": "Foul smell attracts beetles", "Fact": "Rarely blooms (once every few years)" },
    bank: [{ q: "The Corpse Flower is famous for?", a: ["Tallest flower cluster in the world", "Smallest flower", "Sweetest fruit", "Widest leaf"], c: 0 },
      { q: "Why is it called the 'Corpse Flower'?", a: ["It smells like rotting flesh", "It's black", "It grows in graves", "It's poisonous"], c: 0 },
      { q: "The Corpse Flower comes from Sumatra, Indonesia.", tf: true },
      { q: "Its foul smell is to?", a: ["Attract pollinating beetles", "Scare animals", "Kill insects", "Nothing"], c: 0 },
      { q: "The Corpse Flower blooms every day.", tf: false }]
  },
  "Pokok Ginkgo": {
    info: { "Range": "Native to China", "Feature": "A 'living fossil'", "Habitat": "Temperate forest", "Use": "Leaves in traditional medicine", "Fact": "Existed since the age of dinosaurs" },
    bank: [{ q: "Why is Ginkgo called a 'living fossil'?", a: ["It existed since the dinosaurs", "Made of stone", "Already extinct", "In a museum"], c: 0 },
      { q: "The Ginkgo tree comes from China.", tf: true },
      { q: "Which part of Ginkgo is used for medicine?", a: ["Leaves", "Roots", "Stone", "Flowers"], c: 0 },
      { q: "Shape of a Ginkgo leaf?", a: ["Like a fan", "Like a needle", "Round", "Spiky"], c: 0 },
      { q: "Ginkgo is a tree that was just discovered this year.", tf: false }]
  },
  "Pokok Cendana": {
    info: { "Range": "India & South Asia", "Feature": "Highly valuable fragrant wood", "Habitat": "Dry forest", "Use": "Perfume & incense", "Fact": "Over-harvested for its costly oil" },
    bank: [{ q: "Sandalwood is famous for?", a: ["Fragrant, valuable wood", "Sweet fruit", "Big flowers", "Edible leaves"], c: 0 },
      { q: "Main threat to Sandalwood?", a: ["Over-harvesting", "Floods", "Snow", "None"], c: 0 },
      { q: "Sandalwood is used for perfume & incense.", tf: true },
      { q: "Sandalwood is mostly found in?", a: ["India", "Iceland", "Greenland", "Antarctica"], c: 0 },
      { q: "Sandalwood is worthless and nobody harvests it.", tf: false }]
  },
  // ---- 3-1 animals ----
  "Gorila Gunung": {
    info: { "Range": "Central Africa (Rwanda, Uganda, Congo)", "Wild population": "~1,000", "Habitat": "High mountain forest", "Diet": "Herbivore", "Fact": "Largest primate; ~98% DNA shared with humans" },
    bank: [{ q: "On which continent does the Mountain Gorilla live?", a: ["Africa", "Asia", "Europe", "America"], c: 0 },
      { q: "Diet of the Mountain Gorilla?", a: ["Herbivore (leaves & shoots)", "Carnivore", "Fish", "Honey"], c: 0 },
      { q: "Gorillas share ~98% of their DNA with humans.", tf: true },
      { q: "The Mountain Gorilla lives in?", a: ["High mountain forest", "Desert", "Ocean", "Polar ice"], c: 0 },
      { q: "The Mountain Gorilla likes to hunt at sea.", tf: false }]
  },
  "Beruang Kutub": {
    info: { "Range": "The Arctic (North Pole)", "Threat": "Global warming", "Habitat": "Ocean & floating ice", "Diet": "Carnivore — seals", "Fact": "Its skin is black; its fur is see-through" },
    bank: [{ q: "Where does the Polar Bear live?", a: ["The Arctic (North Pole)", "Rainforest", "Desert", "Tropical mountain"], c: 0 },
      { q: "Biggest threat to the Polar Bear?", a: ["Global warming", "Acid rain", "Too many fish", "Falling trees"], c: 0 },
      { q: "The Polar Bear's main food is seals.", tf: true },
      { q: "A fact about the Polar Bear?", a: ["Its skin is black", "It is green", "It has no fur", "It lays eggs"], c: 0 },
      { q: "The Polar Bear is a grass-eating herbivore.", tf: false }]
  },
  "Jaguar": {
    info: { "Range": "Amazon, Central & South America", "Threat": "Forest destruction", "Habitat": "Rainforest & swamp", "Diet": "Carnivore", "Fact": "Strongest bite of any big cat; a great swimmer" },
    bank: [{ q: "On which continent does the Jaguar live wild?", a: ["South & Central America", "Asia", "Africa", "Australia"], c: 0 },
      { q: "Special trait of the Jaguar?", a: ["Strongest bite of the big cats", "Cannot swim", "Eats grass", "Very tiny"], c: 0 },
      { q: "The Jaguar is a carnivore (predator).", tf: true },
      { q: "Main habitat of the Jaguar?", a: ["Amazon rainforest", "Snowfield", "Desert", "Tundra"], c: 0 },
      { q: "The Jaguar fears water and cannot swim.", tf: false }]
  },
  // ---- 3-2 plants ----
  "Pokok Baobab": {
    info: { "Range": "Madagascar, Africa", "Feature": "Thick trunk stores water", "Habitat": "Dry areas & savanna", "Use": "Fruit, seeds & bark", "Fact": "The 'upside-down tree'; lives over 1,000 years" },
    bank: [{ q: "The Baobab's trunk is special because it?", a: ["Is thick & stores water", "Is very thin", "Is blue", "Can move"], c: 0 },
      { q: "Baobabs are mostly found in?", a: ["Madagascar, Africa", "Japan", "Antarctica", "England"], c: 0 },
      { q: "Baobabs can live over 1,000 years.", tf: true },
      { q: "Why is it called the 'upside-down tree'?", a: ["Branches look like roots", "It grows downward", "It topples easily", "Fruit on its roots"], c: 0 },
      { q: "Baobabs thrive in thick snow.", tf: false }]
  },
  "Sequoia Gergasi": {
    info: { "Range": "California, USA", "Feature": "Among the largest trees on Earth", "Habitat": "Sierra Nevada mountains", "Threat": "Out-of-control wildfires", "Fact": "Lives over 3,000 years; thick fire-resistant bark" },
    bank: [{ q: "The Giant Sequoia is a tree that is?", a: ["Among the largest in the world", "The smallest", "The shortest", "The fastest-growing"], c: 0 },
      { q: "The Giant Sequoia grows in California, USA.", tf: true },
      { q: "How long can a Sequoia live?", a: ["Over 3,000 years", "30 years", "100 days", "1 year"], c: 0 },
      { q: "The Sequoia's bark is?", a: ["Thick & fire-resistant", "Very thin", "Poisonous", "Glowing"], c: 0 },
      { q: "The Sequoia is a tiny tree the size of a flowerpot.", tf: false }]
  },
  "Kaktus Saguaro": {
    info: { "Range": "Sonoran Desert, North America", "Feature": "Giant tall cactus", "Habitat": "Hot dry desert", "Threat": "Theft & development", "Fact": "Stores water in its trunk; home to desert birds" },
    bank: [{ q: "The Saguaro stores water in its?", a: ["Trunk", "Roots", "Flowers", "Spines"], c: 0 },
      { q: "The Saguaro grows in the Sonoran Desert, North America.", tf: true },
      { q: "The Saguaro helps other wildlife by?", a: ["Being a home for desert birds", "Giving snow", "Making ice", "Giving oil"], c: 0 },
      { q: "Size of the Saguaro Cactus?", a: ["Very tall (over ten metres)", "A handspan", "1 cm", "It doesn't grow"], c: 0 },
      { q: "The Saguaro grows on the deep sea floor.", tf: false }]
  },
  // ---- mystery (collection detail only) ----
  "Tenggiling": { info: { "Range": "Malaysia & Southeast Asia", "Feature": "Keratin scales; rolls up when threatened", "Diet": "Ants & termites", "Fact": "The most trafficked mammal in the world!" } },
  "Harimau Dahan": { info: { "Range": "Southeast Asian & Himalayan forests", "Feature": "'Cloud' pattern; the best tree climber", "Diet": "Carnivore", "Fact": "Longest canines relative to body size among cats" } },
  "Axolotl": { info: { "Range": "Lake Xochimilco, Mexico", "Feature": "Permanently aquatic salamander, external gills", "Fact": "Can regrow limbs & even part of its brain!" } }
};

interface SceneEn { number?: string; situation: string; question: string; options: { t: string; fb: string }[]; }
// keyed by stage key (each stage has one scene)
export const SCENE_EN: Record<string, SceneEn> = {
  "1-1": { number: "999 (Fire Brigade)", situation: "A big fire is spreading through the forest! Trees are burning and animals are fleeing.", question: "What is the most correct action?",
    options: [{ t: "Pretend not to see — not my business", fb: "Wrong. The fire will destroy the whole habitat. We are all responsible." },
      { t: "Call the Fire Brigade (999) immediately", fb: "Correct! Dial 999 for the Fire Brigade. Don't fight a big fire yourself." },
      { t: "Put it out with my own water bottle", fb: "Dangerous! A forest fire is far too big. Call the Fire Brigade (999)." }] },
  "1-2": { number: "1-800-88-5151 (PERHILITAN)", situation: "Illegal loggers are cutting down big trees without a licence in a forest reserve. A logging truck waits nearby.", question: "The most correct & safe action?",
    options: [{ t: "Fight them on my own", fb: "Dangerous! Never confront criminals yourself." },
      { t: "Report to PERHILITAN / police", fb: "Correct! Report it so the authorities can take legal action." },
      { t: "Ignore it out of fear", fb: "Wrong. Illegal logging destroys habitats. Report it safely." }] },
  "2-1": { number: "Call the police / wildlife authority", situation: "You find an illegal poacher's iron trap. An endangered animal is nearly caught!", question: "The most responsible action?",
    options: [{ t: "Take the animal as a pet", fb: "Wrong. Endangered wild animals can't be kept as pets — it's illegal." },
      { t: "Report it to the police / authority", fb: "Correct! Reporting helps catch poachers and save the animal." },
      { t: "Set even more traps", fb: "Wrong. Traps harm animals. Report it." }] },
  "2-2": { number: "Report to the police / authority", situation: "Someone is digging up and stealing endangered plants to sell on the black market.", question: "The best action?",
    options: [{ t: "Buy the plant from them", fb: "Wrong. Buying encourages crime & extinction." },
      { t: "Record evidence & report the authority", fb: "Correct! Evidence & reports help stop illegal trade." },
      { t: "Dig some up for my own collection", fb: "Wrong. Taking endangered plants is illegal." }] },
  "3-1": { number: "Call the fire brigade / authority", situation: "A huge fire is destroying the rainforest — the 'lungs of the world'. Endangered animals are losing their habitat.", question: "As a global EcoRanger, the best action?",
    options: [{ t: "Leave it, it's far from my country", fb: "Wrong. The world's rainforests affect the whole planet's climate." },
      { t: "Alert the fire brigade & support conservation", fb: "Correct! Reporting & support protect global habitats." },
      { t: "Cut more trees to 'stop the fire'", fb: "Wrong. Cutting trees worsens forest destruction." }] },
  "3-2": { number: "Call a wildlife rescue centre", situation: "You find a badly injured wild animal, possibly hit by a vehicle.", question: "The most correct & safe action?",
    options: [{ t: "Treat it myself without knowledge", fb: "Dangerous. An injured animal may attack and you could worsen the injury." },
      { t: "Call a wildlife rescue centre", fb: "Correct! Experts know how to treat and recover the animal safely." },
      { t: "Leave it — 'the law of nature'", fb: "For endangered animals hurt by humans, expert help gives them a chance." }] }
};

export const ACH_EN: Record<string, { name: string; desc: string }> = {
  first_stamp: { name: "First Step", desc: "Collect your first stamp" },
  perfect: { name: "Nature Genius", desc: "Perfect quiz 3/3" },
  hero: { name: "Rescuer", desc: "Resolve one crisis" },
  combo3: { name: "Hot Streak", desc: "Reach a x3 combo" },
  shopper: { name: "Stylish", desc: "Buy a store item" },
  my_done: { name: "Malaysia Hero", desc: "Finish both Malaysia missions" },
  asia_done: { name: "Asia Explorer", desc: "Finish both Asia missions" },
  world_done: { name: "World Champion", desc: "Finish all 6 missions" }
};
export const RARITY_EN: Record<number, string> = { 1: "Easy", 2: "Medium", 3: "Hard", 4: "Mystery" };
export const RANK_EN: Record<string, string> = { "Perekrut": "Recruit", "Ranger Junior": "Junior Ranger", "Ranger": "Ranger", "Ranger Pakar": "Expert Ranger", "Penjaga Alam": "Nature Guardian", "Legenda EcoRanger": "EcoRanger Legend" };
export const ITEM_EN: Record<string, string> = {
  ranger: "Classic Ranger", girl: "Lady Ranger", boy: "Young Ranger", sci: "Nature Scientist", astro: "Explorer", hero: "Nature Hero",
  cap: "Sports Cap", sun: "Wide Hat", grad: "Graduate Cap", helm: "Army Helmet", crown: "Gold Crown",
  torch: "Flashlight", magnify: "Magnifier", camera: "Wildlife Camera", binoc: "Pro Binoculars",
  dog: "Tracker Dog", parrot: "Parrot", fox: "Fox Friend",
  songkok: "Traditional Songkok 🇲🇾", batik: "Asian Attire 🌏", champ: "Champion Peacock 🌍"
};
export const ITEM_HINT_EN: Record<string, string> = {
  songkok: "Finish both Malaysia missions", batik: "Finish both Asia missions", champ: "Finish all world missions"
};
export const STATUS_EN: Record<string, string> = {
  "Kritikal Terancam": "Critically Endangered", "Terancam": "Endangered", "Terdedah": "Vulnerable",
  "Hampir Terancam": "Near Threatened", "Risiko Rendah": "Least Concern", "Domestik": "Domestic", "Pupus Lokal": "Locally Extinct"
};

interface ScenarioEn { name: string; desc: string; casesMY: string; effect: string; number?: string; }
export const SCENARIO_EN: Record<string, ScenarioEn> = {
  api: { name: "Forest Fire", number: "999 (Fire Brigade)", desc: "Fire destroys thousands of hectares of forest, releasing smoke & carbon.", casesMY: "Thousands of hectares burn each dry season in Malaysia (haze of 2015 & 2019).", effect: "Tiger, elephant & orangutan habitats are destroyed; animals die or lose their homes." },
  pembalakan: { name: "Illegal Logging", number: "1-800-88-5151 (PERHILITAN)", desc: "Unlicensed tree-felling damages forest reserves.", casesMY: "A leading cause of forest loss in Sabah & Sarawak.", effect: "Chengal & Meranti trees vanish; orangutans & wildlife lose their homes." },
  jerat: { name: "Poaching & Illegal Traps", number: "1-800-88-5151 (PERHILITAN)", desc: "Traps & hunters target endangered animals for trade.", casesMY: "Hundreds of traps are found each year in PERHILITAN operations.", effect: "Malayan Tigers & pangolins grow closer to extinction from poaching." },
  curi: { name: "Plant Theft", number: "1-800-88-5151 (PERHILITAN)", desc: "Endangered plants are dug up & sold on the black market.", casesMY: "Rafflesia & pitcher plants are often stolen from forest reserves.", effect: "Unique plant species are lost before they can even be studied." },
  sakit: { name: "Injured Wildlife", number: "Wildlife Rescue Centre", desc: "Animals injured by vehicles or traps.", casesMY: "Elephants & tapirs are often hit on highways crossing forests.", effect: "Without expert care, injured endangered animals can die." }
};
