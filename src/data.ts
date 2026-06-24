import { save } from "./state";
import type { Stage, Item, Species, Scenario, RankTier, AchievementDef, RarityInfo } from "./types";

const STAGES: Record<string, Stage> = {
"1-1":{region:"MALAYSIA 🇲🇾",flag:"🇲🇾",type:"animal",title:"Level 1-1 · Haiwan Terancam Malaysia",species:[
  {name:"Harimau Malaya",sci:"Panthera tigris jacksoni",common:"Malayan Tiger",emoji:"🐅",status:"Kritikal Terancam",habitat:"darat",sound:"roar",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Malayan_tiger.jpg?width=800",
   info:{"Taburan":"Hanya Semenanjung Malaysia","Populasi liar":"< 150 ekor","Habitat":"Hutan hujan tropika","Pemakanan":"Karnivor — rusa & babi hutan","Fakta":"Lambang pada Jata Negara Malaysia"},
   bank:[{q:"Apakah makanan utama Harimau Malaya?",a:["Buah hutan","Daging (rusa & babi)","Rumput","Ikan"],c:1},
     {q:"Di mana Harimau Malaya hidup secara semula jadi?",a:["Seluruh Asia","Hanya Semenanjung Malaysia","Afrika","Australia"],c:1},
     {q:"Anggaran populasi liarnya kini?",a:["10,000+","5,000","< 150 ekor","Pupus"],c:2},
     {q:"Harimau Malaya ialah lambang pada Jata Negara Malaysia.",tf:true},
     {q:"Harimau Malaya makan rumput dan daun.",tf:false}]},
  {name:"Orang Utan",sci:"Pongo pygmaeus",common:"Bornean Orangutan",emoji:"🦧",status:"Terancam",habitat:"darat",sound:"call",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Orang_Utan,_Semenggok_Forest_Reserve,_Sarawak,_Borneo,_Malaysia.JPG?width=800",
   info:{"Taburan":"Borneo (Sabah & Sarawak)","Ancaman":"Pembalakan & kehilangan habitat","Habitat":"Hutan paya & hutan hujan","Pemakanan":"Omnivor — buah, pucuk, serangga","Fakta":"'Orang Utan' = 'orang hutan'"},
   bank:[{q:"Di negeri mana Orang Utan ditemui di Malaysia?",a:["Sabah & Sarawak","Johor","Perlis","Melaka"],c:0},
     {q:"Maksud nama 'Orang Utan'?",a:["Orang gunung","Orang hutan","Orang kuat","Orang tua"],c:1},
     {q:"Ancaman terbesar kepada Orang Utan?",a:["Cuaca sejuk","Pembalakan & kehilangan habitat","Harimau","Banjir"],c:1},
     {q:"Orang Utan ialah primat (mamalia), bukan monyet ekor panjang biasa.",tf:true},
     {q:"Orang Utan hanya makan daging.",tf:false}]},
  {name:"Penyu Belimbing",sci:"Dermochelys coriacea",common:"Leatherback Turtle",emoji:"🐢",status:"Kritikal Terancam",habitat:"air",sound:"splash",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Leatherback_sea_turtle_Tinglar,_USVI_(5839996547).jpg?width=800",
   info:{"Taburan":"Pernah mendarat di Rantau Abang, Terengganu","Status Malaysia":"Hampir pupus tempatan","Habitat":"Lautan terbuka","Pemakanan":"Ubur-ubur","Fakta":"Penyu terbesar di dunia — cengkerang lembut seperti kulit"},
   bank:[{q:"Makanan kegemaran Penyu Belimbing?",a:["Ubur-ubur","Ketam","Rumpai","Anak jerung"],c:0},
     {q:"Keunikan cengkerangnya?",a:["Keras seperti besi","Lembut seperti kulit","Berduri","Bercahaya"],c:1},
     {q:"Penyu Belimbing ialah penyu terbesar di dunia.",tf:true},
     {q:"Pantai terkenal pendaratannya di Malaysia?",a:["Rantau Abang, Terengganu","Langkawi","Port Dickson","Teluk Batik"],c:0},
     {q:"Sampah plastik dalam laut tidak membahayakan penyu ini.",tf:false}]}
 ],scenes:[
  {type:"api",title:"Kebakaran Hutan!",emoji:"🔥",number:"999 (Bomba)",situation:"Api besar marak merebak di hutan! Pokok-pokok terbakar dan haiwan lari menyelamatkan diri.",question:"Apa tindakan paling betul?",options:[
    {t:"Buat tak tahu — bukan urusan saya",correct:false,fb:"Salah. Api akan musnahkan seluruh habitat. Kita semua bertanggungjawab."},
    {t:"Hubungi Bomba 999 segera",correct:true,fb:"Betul! Talian 999 panggil Bomba. Jangan padam api besar sendiri."},
    {t:"Padam guna botol air sendiri",correct:false,fb:"Bahaya! Api hutan terlalu besar. Panggil Bomba (999)."}]}
 ]},

"1-2":{region:"MALAYSIA 🇲🇾",flag:"🇲🇾",type:"plant",title:"Level 1-2 · Tumbuhan Terancam Malaysia",species:[
  {name:"Rafflesia",sci:"Rafflesia spp.",common:"Corpse Flower",emoji:"🌺",status:"Terancam",habitat:"darat",sound:"none",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Rafflesia_arnoldii.jpg?width=800",
   info:{"Taburan":"Sabah, Sarawak, Pahang","Ciri":"Bunga tunggal terbesar di dunia","Habitat":"Hutan hujan","Pemakanan":"Parasit pokok Tetrastigma","Fakta":"Bau busuk seperti bangkai menarik lalat"},
   bank:[{q:"Keistimewaan Rafflesia?",a:["Bunga tunggal terbesar dunia","Bunga terkecil","Paling wangi","Makan daging"],c:0},
     {q:"Mengapa Rafflesia berbau busuk?",a:["Menarik lalat pendebunga","Menghalau musuh","Kerana rosak","Menarik lebah"],c:0},
     {q:"Rafflesia hidup sebagai parasit pada pokok lain.",tf:true},
     {q:"Ancaman utama Rafflesia?",a:["Pemusnahan hutan","Hujan lebat","Tanah subur","Matahari"],c:0},
     {q:"Rafflesia mempunyai daun dan batang yang besar.",tf:false}]},
  {name:"Periuk Kera",sci:"Nepenthes spp.",common:"Pitcher Plant",emoji:"🪷",status:"Terancam",habitat:"darat",sound:"none",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Nepenthes_rajah.jpg?width=800",
   info:{"Taburan":"Tanah tinggi Borneo & Semenanjung","Ciri":"Tumbuhan karnivor berbentuk periuk","Habitat":"Tanah berasid miskin nutrien","Pemakanan":"Serangga terperangkap","Fakta":"Cecair dalam periuk mencerna serangga"},
   bank:[{q:"Bagaimana Periuk Kera dapat nutrien tambahan?",a:["Memerangkap serangga","Dari hujan","Mencuri pokok lain","Dari batu"],c:0},
     {q:"Periuk Kera ialah tumbuhan karnivor (pemakan serangga).",tf:true},
     {q:"Mengapa perlu perangkap serangga?",a:["Tanahnya miskin nutrien","Untuk pertahanan","Untuk berbunga","Tiada sebab"],c:0},
     {q:"Bentuk istimewanya?",a:["Seperti periuk/jag","Seperti bola","Seperti bintang","Rata"],c:0},
     {q:"Periuk Kera tumbuh di dasar laut.",tf:false}]},
  {name:"Pokok Cengal",sci:"Neobalanocarpus heimii",common:"Chengal",emoji:"🌳",status:"Terancam",habitat:"darat",sound:"none",
   image:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
   info:{"Taburan":"Hutan Semenanjung Malaysia","Ciri":"Kayu keras paling bernilai","Habitat":"Hutan hujan dataran rendah","Kegunaan":"Pembinaan, bot, jambatan","Fakta":"Boleh hidup beratus tahun"},
   bank:[{q:"Cengal terkenal kerana?",a:["Kayu keras & bernilai","Buah manis","Bunga wangi","Daun ubat"],c:0},
     {q:"Ancaman utama Pokok Cengal?",a:["Pembalakan berlebihan","Banjir","Sejuk","Serangga"],c:0},
     {q:"Cengal boleh hidup beratus tahun.",tf:true},
     {q:"Kayu Cengal digunakan untuk?",a:["Pembinaan & bot","Kertas","Bahan api","Makanan"],c:0},
     {q:"Cengal tumbuh di puncak gunung salji.",tf:false}]}
 ],scenes:[
  {type:"pembalakan",title:"Pembalakan Haram!",emoji:"🪓",number:"1-800-88-5151 (PERHILITAN)",situation:"Pembalak haram menebang pokok besar tanpa lesen di hutan simpan. Lori balak menunggu.",question:"Tindakan paling betul & selamat?",options:[
    {t:"Lawan mereka seorang diri",correct:false,fb:"Bahaya! Jangan berdepan penjenayah sendiri."},
    {t:"Laporkan kepada PERHILITAN/polis",correct:true,fb:"Betul! Laporkan supaya pihak berkuasa ambil tindakan undang-undang."},
    {t:"Abaikan kerana takut",correct:false,fb:"Salah. Pembalakan haram memusnahkan habitat. Laporkan dengan selamat."}]}
 ]},

"2-1":{region:"ASIA 🌏",flag:"🌏",type:"animal",title:"Level 2-1 · Haiwan Terancam Asia",species:[
  {name:"Panda Gergasi",sci:"Ailuropoda melanoleuca",common:"Giant Panda",emoji:"🐼",status:"Terdedah",habitat:"darat",sound:"growl",
   image:"https://images.unsplash.com/photo-1527118732049-c88155f2107c?w=800&q=80",
   info:{"Taburan":"Pergunungan China","Populasi liar":"~1,800 ekor","Habitat":"Hutan buluh","Pemakanan":"99% buluh","Fakta":"Logo pemuliharaan WWF"},
   bank:[{q:"Makanan utama Panda Gergasi?",a:["Buluh","Daging","Ikan","Madu"],c:0},
     {q:"Panda Gergasi hidup liar di negara?",a:["Jepun","China","India","Korea"],c:1},
     {q:"Panda menjadi logo pertubuhan WWF.",tf:true},
     {q:"Habitat semula jadi Panda?",a:["Hutan buluh pergunungan","Padang pasir","Lautan","Tundra"],c:0},
     {q:"Panda Gergasi ialah haiwan pemburu laut.",tf:false}]},
  {name:"Gajah Asia",sci:"Elephas maximus",common:"Asian Elephant",emoji:"🐘",status:"Terancam",habitat:"darat",sound:"trumpet",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Elephas_maximus_(Bandipur).jpg?width=800",
   info:{"Taburan":"India, Thailand, Indonesia","Ancaman":"Konflik manusia","Habitat":"Hutan & padang rumput","Pemakanan":"Herbivor","Fakta":"Mamalia darat terbesar di Asia"},
   bank:[{q:"Pemakanan Gajah Asia?",a:["Herbivor (tumbuhan)","Karnivor","Serangga","Ikan"],c:0},
     {q:"Gajah Asia ialah mamalia darat terbesar di Asia.",tf:true},
     {q:"Ancaman utama Gajah Asia?",a:["Konflik manusia & habitat","Sejuk","Terlalu banyak air","Harimau"],c:0},
     {q:"Gajah Asia banyak ditemui di?",a:["India & Thailand","Eropah","Antartika","Amerika"],c:0},
     {q:"Telinga Gajah Asia lebih besar daripada Gajah Afrika.",tf:false}]},
  {name:"Biawak Komodo",sci:"Varanus komodoensis",common:"Komodo Dragon",emoji:"🦎",status:"Terancam",habitat:"darat",sound:"hiss",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Komodo_dragon_(Varanus_komodoensis).jpg?width=800",
   info:{"Taburan":"Pulau Komodo, Indonesia","Populasi":"Terhad beberapa pulau","Habitat":"Hutan kering & sabana","Pemakanan":"Karnivor — rusa, babi, bangkai","Fakta":"Cicak terbesar dunia, air liur berbisa"},
   bank:[{q:"Biawak Komodo ialah?",a:["Cicak terbesar dunia","Ular terpanjang","Buaya terkecil","Katak terbesar"],c:0},
     {q:"Komodo ditemui di negara?",a:["Indonesia","Jepun","Filipina","India"],c:0},
     {q:"Air liur Komodo berbisa.",tf:true},
     {q:"Pemakanan Komodo?",a:["Daging & bangkai","Buluh","Rumput","Buah"],c:0},
     {q:"Komodo mengeluarkan api dari mulutnya.",tf:false}]}
 ],scenes:[
  {type:"jerat",title:"Jerat Pemburu Haram!",emoji:"🪤",number:"Hubungi polis / pihak berkuasa hidupan liar",situation:"Anda jumpa jerat besi pemburu haram. Seekor haiwan terancam hampir terperangkap!",question:"Tindakan paling bertanggungjawab?",options:[
    {t:"Ambil haiwan jadi peliharaan",correct:false,fb:"Salah. Haiwan liar terancam tidak boleh dipelihara — menyalahi undang-undang."},
    {t:"Laporkan kepada polis/pihak berkuasa",correct:true,fb:"Betul! Laporan bantu tangkap pemburu haram & selamatkan haiwan."},
    {t:"Pasang lebih banyak jerat",correct:false,fb:"Salah. Jerat membahayakan haiwan. Laporkan."}]}
 ]},

"2-2":{region:"ASIA 🌏",flag:"🌏",type:"plant",title:"Level 2-2 · Tumbuhan Terancam Asia",species:[
  {name:"Bunga Bangkai",sci:"Amorphophallus titanum",common:"Titan Arum",emoji:"🌸",status:"Terancam",habitat:"darat",sound:"none",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Titan-arum1web.jpg?width=800",
   info:{"Taburan":"Sumatera, Indonesia","Ciri":"Jambak bunga tertinggi dunia","Habitat":"Hutan hujan tropika","Pendebungaan":"Bau busuk menarik kumbang","Fakta":"Jarang berbunga (beberapa tahun sekali)"},
   bank:[{q:"Bunga Bangkai terkenal kerana?",a:["Jambak bunga tertinggi dunia","Bunga terkecil","Buah termanis","Daun terlebar"],c:0},
     {q:"Mengapa digelar 'Bunga Bangkai'?",a:["Bau busuk seperti bangkai","Hitam","Tumbuh di kubur","Beracun"],c:0},
     {q:"Bunga Bangkai berasal dari Sumatera, Indonesia.",tf:true},
     {q:"Bau busuknya untuk?",a:["Menarik kumbang pendebunga","Menghalau haiwan","Membunuh serangga","Tiada"],c:0},
     {q:"Bunga Bangkai berbunga setiap hari.",tf:false}]},
  {name:"Pokok Ginkgo",sci:"Ginkgo biloba",common:"Maidenhair Tree",emoji:"🍃",status:"Terancam",habitat:"darat",sound:"none",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Ginkgo_biloba_leaves.jpg?width=800",
   info:{"Taburan":"Asli China","Ciri":"'Fosil hidup'","Habitat":"Hutan iklim sederhana","Kegunaan":"Daun ubat tradisional","Fakta":"Wujud sejak zaman dinosaur"},
   bank:[{q:"Mengapa Ginkgo digelar 'fosil hidup'?",a:["Wujud sejak zaman dinosaur","Dari batu","Sudah pupus","Di muzium"],c:0},
     {q:"Pokok Ginkgo berasal dari China.",tf:true},
     {q:"Bahagian Ginkgo untuk ubat?",a:["Daun","Akar","Batu","Bunga"],c:0},
     {q:"Bentuk daun Ginkgo?",a:["Seperti kipas","Seperti jarum","Bulat","Berduri"],c:0},
     {q:"Ginkgo ialah pokok yang baru sahaja ditemui tahun ini.",tf:false}]},
  {name:"Pokok Cendana",sci:"Santalum album",common:"Indian Sandalwood",emoji:"🌳",status:"Terancam",habitat:"darat",sound:"none",
   image:"https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80",
   info:{"Taburan":"India & Asia Selatan","Ciri":"Kayu wangi bernilai tinggi","Habitat":"Hutan kering","Kegunaan":"Minyak wangi & dupa","Fakta":"Diburu kerana minyak kayunya mahal"},
   bank:[{q:"Cendana terkenal kerana?",a:["Kayu wangi & bernilai","Buah manis","Bunga besar","Daun dimakan"],c:0},
     {q:"Ancaman utama Cendana?",a:["Penebangan berlebihan","Banjir","Salji","Tiada"],c:0},
     {q:"Kayu Cendana digunakan untuk minyak wangi & dupa.",tf:true},
     {q:"Pokok Cendana banyak di?",a:["India","Iceland","Greenland","Antartika"],c:0},
     {q:"Cendana tidak bernilai dan tiada siapa memburunya.",tf:false}]}
 ],scenes:[
  {type:"curi",title:"Tumbuhan Liar Dicuri!",emoji:"🚯",number:"Laporkan kepada polis / pihak berkuasa",situation:"Seseorang menggali & mencuri tumbuhan terancam untuk dijual di pasaran gelap.",question:"Tindakan terbaik?",options:[
    {t:"Beli tumbuhan itu",correct:false,fb:"Salah. Membeli menggalakkan jenayah & kepupusan."},
    {t:"Rakam bukti & laporkan pihak berkuasa",correct:true,fb:"Betul! Bukti & laporan bantu hentikan perdagangan haram."},
    {t:"Turut menggali untuk koleksi sendiri",correct:false,fb:"Salah. Mengambil tumbuhan terancam menyalahi undang-undang."}]}
 ]},

"3-1":{region:"DUNIA 🌍",flag:"🌍",type:"animal",title:"Level 3-1 · Haiwan Terancam Dunia",species:[
  {name:"Gorila Gunung",sci:"Gorilla beringei beringei",common:"Mountain Gorilla",emoji:"🦍",status:"Terancam",habitat:"darat",sound:"growl",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Male_gorilla_in_SF_zoo.jpg?width=800",
   info:{"Taburan":"Afrika Tengah (Rwanda, Uganda, Congo)","Populasi liar":"~1,000 ekor","Habitat":"Hutan pergunungan tinggi","Pemakanan":"Herbivor","Fakta":"Primat terbesar; ~98% DNA dikongsi dengan manusia"},
   bank:[{q:"Di benua mana Gorila Gunung hidup?",a:["Afrika","Asia","Eropah","Amerika"],c:0},
     {q:"Pemakanan Gorila Gunung?",a:["Herbivor (daun & pucuk)","Karnivor","Ikan","Madu"],c:0},
     {q:"Gorila berkongsi ~98% DNA dengan manusia.",tf:true},
     {q:"Gorila Gunung tinggal di?",a:["Hutan pergunungan tinggi","Padang pasir","Lautan","Kutub"],c:0},
     {q:"Gorila Gunung suka berburu di laut.",tf:false}]},
  {name:"Beruang Kutub",sci:"Ursus maritimus",common:"Polar Bear",emoji:"🐻‍❄️",status:"Terdedah",habitat:"darat",sound:"roar",
   image:"https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&q=80",
   info:{"Taburan":"Artik (Kutub Utara)","Ancaman":"Pemanasan global","Habitat":"Lautan & ais terapung","Pemakanan":"Karnivor — anjing laut","Fakta":"Kulitnya hitam, bulunya lutsinar"},
   bank:[{q:"Beruang Kutub hidup di?",a:["Artik (Kutub Utara)","Hutan hujan","Gurun","Gunung tropika"],c:0},
     {q:"Ancaman terbesar Beruang Kutub?",a:["Pemanasan global","Hujan asid","Banyak ikan","Pokok tumbang"],c:0},
     {q:"Makanan utama Beruang Kutub ialah anjing laut.",tf:true},
     {q:"Fakta tentang Beruang Kutub?",a:["Kulitnya hitam","Ia hijau","Tidak berbulu","Bertelur"],c:0},
     {q:"Beruang Kutub ialah haiwan herbivor pemakan rumput.",tf:false}]},
  {name:"Jaguar",sci:"Panthera onca",common:"Jaguar",emoji:"🐆",status:"Hampir Terancam",habitat:"darat",sound:"roar",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Standing_jaguar.jpg?width=800",
   info:{"Taburan":"Amazon, Amerika Tengah & Selatan","Ancaman":"Pemusnahan hutan","Habitat":"Hutan hujan & paya","Pemakanan":"Karnivor","Fakta":"Gigitan terkuat antara kucing besar; perenang handal"},
   bank:[{q:"Jaguar hidup liar di benua?",a:["Amerika Selatan & Tengah","Asia","Afrika","Australia"],c:0},
     {q:"Keistimewaan Jaguar?",a:["Gigitan terkuat antara kucing besar","Tak boleh berenang","Pemakan rumput","Sangat kecil"],c:0},
     {q:"Jaguar ialah haiwan karnivor (pemangsa).",tf:true},
     {q:"Habitat utama Jaguar?",a:["Hutan hujan Amazon","Padang salji","Gurun","Tundra"],c:0},
     {q:"Jaguar takut air dan tidak boleh berenang.",tf:false}]}
 ],scenes:[
  {type:"api",title:"Kebakaran Hutan Amazon!",emoji:"🔥",number:"Hubungi bomba / pihak berkuasa",situation:"Kebakaran besar memusnahkan hutan hujan — 'paru-paru dunia'. Haiwan terancam kehilangan habitat.",question:"Sebagai EcoRanger global, tindakan terbaik?",options:[
    {t:"Biarkan, ia jauh dari negara saya",correct:false,fb:"Salah. Hutan hujan dunia mempengaruhi iklim seluruh planet."},
    {t:"Maklumkan bomba & sokong pemuliharaan",correct:true,fb:"Betul! Laporan & sokongan lindungi habitat global."},
    {t:"Tebang lebih pokok 'halang api'",correct:false,fb:"Salah. Menebang memburukkan pemusnahan hutan."}]}
 ]},

"3-2":{region:"DUNIA 🌍",flag:"🌍",type:"plant",title:"Level 3-2 · Tumbuhan Terancam Dunia",species:[
  {name:"Pokok Baobab",sci:"Adansonia grandidieri",common:"Baobab",emoji:"🌳",status:"Terancam",habitat:"darat",sound:"none",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/Adansonia_grandidieri04.jpg?width=800",
   info:{"Taburan":"Madagascar, Afrika","Ciri":"Batang tebal menyimpan air","Habitat":"Kawasan kering & sabana","Kegunaan":"Buah, biji & kulit kayu","Fakta":"'Pokok terbalik'; hidup lebih 1,000 tahun"},
   bank:[{q:"Batang Baobab istimewa kerana?",a:["Tebal & menyimpan air","Sangat nipis","Biru","Boleh bergerak"],c:0},
     {q:"Baobab banyak di?",a:["Madagascar, Afrika","Jepun","Antartika","England"],c:0},
     {q:"Baobab boleh hidup lebih 1,000 tahun.",tf:true},
     {q:"Mengapa digelar 'pokok terbalik'?",a:["Dahan seperti akar","Tumbuh ke bawah","Mudah tumbang","Buah di akar"],c:0},
     {q:"Baobab tumbuh subur di kawasan salji tebal.",tf:false}]},
  {name:"Sequoia Gergasi",sci:"Sequoiadendron giganteum",common:"Giant Sequoia",emoji:"🌲",status:"Terancam",habitat:"darat",sound:"none",
   image:"https://commons.wikimedia.org/wiki/Special:FilePath/General_Sherman_tree_looking_up.jpg?width=800",
   info:{"Taburan":"California, Amerika Syarikat","Ciri":"Antara pokok terbesar dunia","Habitat":"Pergunungan Sierra Nevada","Ancaman":"Kebakaran luar kawalan","Fakta":"Hidup lebih 3,000 tahun; kulit tebal tahan api"},
   bank:[{q:"Sequoia Gergasi ialah pokok?",a:["Antara terbesar dunia","Terkecil","Terpendek","Paling laju"],c:0},
     {q:"Sequoia Gergasi tumbuh di California, Amerika Syarikat.",tf:true},
     {q:"Sequoia boleh hidup berapa lama?",a:["Lebih 3,000 tahun","30 tahun","100 hari","1 tahun"],c:0},
     {q:"Kulit kayu Sequoia?",a:["Tebal & tahan api","Sangat nipis","Beracun","Bercahaya"],c:0},
     {q:"Sequoia ialah pokok kecil sebesar pasu bunga.",tf:false}]},
  {name:"Kaktus Saguaro",sci:"Carnegiea gigantea",common:"Saguaro Cactus",emoji:"🌵",status:"Hampir Terancam",habitat:"darat",sound:"none",
   image:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
   info:{"Taburan":"Gurun Sonora, Amerika Utara","Ciri":"Kaktus gergasi tinggi","Habitat":"Gurun panas & kering","Ancaman":"Pencurian & pembangunan","Fakta":"Simpan air dalam batang; rumah burung gurun"},
   bank:[{q:"Saguaro menyimpan air di?",a:["Batangnya","Akar","Bunga","Duri"],c:0},
     {q:"Saguaro tumbuh di Gurun Sonora, Amerika Utara.",tf:true},
     {q:"Saguaro membantu hidupan lain dengan?",a:["Jadi rumah burung gurun","Memberi salji","Membuat ais","Memberi minyak"],c:0},
     {q:"Saiz Kaktus Saguaro?",a:["Sangat tinggi (belasan meter)","Sejengkal","1 cm","Tidak tumbuh"],c:0},
     {q:"Saguaro tumbuh di dasar laut yang dalam.",tf:false}]}
 ],scenes:[
  {type:"sakit",title:"Haiwan Liar Cedera!",emoji:"🩹",number:"Hubungi pusat penyelamat hidupan liar",situation:"Anda jumpa haiwan liar cedera teruk, mungkin dilanggar kenderaan.",question:"Tindakan paling betul & selamat?",options:[
    {t:"Ubati sendiri tanpa pengetahuan",correct:false,fb:"Bahaya. Haiwan cedera boleh menyerang & anda boleh memburukkan kecederaan."},
    {t:"Hubungi pusat penyelamat hidupan liar",correct:true,fb:"Betul! Pakar tahu cara rawat & pulihkan haiwan dengan selamat."},
    {t:"Biarkan, 'hukum alam'",correct:false,fb:"Bagi haiwan terancam yang cedera akibat manusia, bantuan pakar beri peluang pulih."}]}
 ]}
};

const ORDER=["1-1","1-2","2-1","2-2","3-1","3-2"];
/* ---------- PERALATAN (gaya Soul Knight: slot berasingan) ----------
   slot: base(karakter) | hat(topi) | gear(gajet) | pet(haiwan peliharaan)
   special: dibuka dgn menamatkan misi tertentu (unlock=[stageKeys]) */
const ITEMS: Item[] = [
  // KARAKTER
  {id:"ranger",slot:"base",emoji:"🧑‍🌾",name:"Ranger Klasik",price:0},
  {id:"girl",slot:"base",emoji:"👧",name:"Ranger Wanita",price:0},
  {id:"boy",slot:"base",emoji:"👦",name:"Ranger Muda",price:80},
  {id:"sci",slot:"base",emoji:"🧑‍🔬",name:"Saintis Alam",price:400},
  {id:"astro",slot:"base",emoji:"🧑‍🚀",name:"Penjelajah",price:700},
  {id:"hero",slot:"base",emoji:"🦸",name:"Wira Alam",price:1200,rare:true},
  // TOPI
  {id:"cap",slot:"hat",emoji:"🧢",name:"Topi Sukan",price:100},
  {id:"sun",slot:"hat",emoji:"👒",name:"Topi Lebar",price:220},
  {id:"grad",slot:"hat",emoji:"🎓",name:"Topi Graduasi",price:450},
  {id:"helm",slot:"hat",emoji:"🪖",name:"Helmet Tentera",price:550},
  {id:"crown",slot:"hat",emoji:"👑",name:"Mahkota Emas",price:1500,rare:true},
  // GAJET
  {id:"torch",slot:"gear",emoji:"🔦",name:"Lampu Suluh",price:150},
  {id:"magnify",slot:"gear",emoji:"🔍",name:"Kaca Pembesar",price:260},
  {id:"camera",slot:"gear",emoji:"📷",name:"Kamera Hidupan",price:500},
  {id:"binoc",slot:"gear",emoji:"🔭",name:"Teropong Pakar",price:850,rare:true},
  // HAIWAN PELIHARAAN
  {id:"dog",slot:"pet",emoji:"🐕",name:"Anjing Pengesan",price:320},
  {id:"parrot",slot:"pet",emoji:"🦜",name:"Burung Nuri",price:480},
  {id:"fox",slot:"pet",emoji:"🦊",name:"Rakan Rubah",price:1000,rare:true},
  // KHAS (ganjaran tamat misi — tidak boleh dibeli)
  {id:"songkok",slot:"hat",emoji:"👳",name:"Songkok Tradisi 🇲🇾",special:true,unlock:["1-1","1-2"],hint:"Tamatkan kedua misi Malaysia"},
  {id:"batik",slot:"base",emoji:"🧝",name:"Pakaian Asia 🌏",special:true,unlock:["2-1","2-2"],hint:"Tamatkan kedua misi Asia"},
  {id:"champ",slot:"pet",emoji:"🦚",name:"Merak Juara 🌍",special:true,unlock:["3-1","3-2"],hint:"Tamatkan semua misi dunia"}
];

/* ---------- HADIAH IKUT LEVEL (mini-game Teka & Dengar) ----------
   Capai level tertentu → dapat item. Dipaparkan sbg "peta hadiah". */
const GAME_REWARDS: Record<string, { level: number; item: string }[]> = {
  guess:  [ { level: 2, item: "cap" },   { level: 3, item: "magnify" }, { level: 5, item: "fox" } ],
  listen: [ { level: 2, item: "sun" },   { level: 3, item: "camera" },  { level: 5, item: "crown" } ]
};
function itemById(id){ return ITEMS.find(i=>i.id===id); }
function specialUnlocked(it){ return it.unlock && it.unlock.every(k=>save.completed.indexOf(k)>=0); }
function avatarParts(){ const e: any = save.equip||{}; const g=id=>{const it=itemById(id);return it?it.emoji:"";};
  return { base:g(e.base)||"🧑‍🌾", hat:e.hat?g(e.hat):"", gear:e.gear?g(e.gear):"", pet:e.pet?g(e.pet):"" }; }
function avatarHTML(size){ const p=avatarParts(); size=size||64;
  return '<div class="relative inline-block" style="width:'+size+'px;height:'+size+'px">'+
    '<span class="absolute inset-0 flex items-center justify-center" style="font-size:'+(size*0.7)+'px">'+p.base+'</span>'+
    (p.hat?'<span class="absolute left-1/2 -translate-x-1/2" style="top:-6%;font-size:'+(size*0.4)+'px">'+p.hat+'</span>':'')+
    (p.gear?'<span class="absolute" style="right:-4%;bottom:6%;font-size:'+(size*0.36)+'px">'+p.gear+'</span>':'')+
    (p.pet?'<span class="absolute" style="left:-10%;bottom:0;font-size:'+(size*0.38)+'px">'+p.pet+'</span>':'')+'</div>'; }

/* ---------- HAIWAN TAMBAHAN (utk game Dengar Bunyi & Teka Siapa) ---------- */
/* ---------- HAIWAN LAIN (utk game Teka & Dengar — bukan haiwan kuiz) ----------
   audio = rakaman bunyi SEBENAR (Wikimedia Commons). rarity 1=mudah .. 4=misteri.
   biome: air | darat | savana | gurun | salji */
const FP="https://commons.wikimedia.org/wiki/Special:FilePath/";
const EXTRA: Species[] = [
  {name:"Singa",sci:"Panthera leo",common:"Lion",emoji:"🦁",status:"Terdedah",region:"DUNIA 🌍",rtype:"animal",habitat:"darat",biome:"savana",rarity:3,sound:"roar",audio:null,
   image:FP+"002_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg?width=700",
   info:{"Taburan":"Sabana Afrika","Habitat":"Padang rumput savana","Pemakanan":"Karnivor","Fakta":"Digelar 'Raja Rimba'; jantan bermisai (rambut leher)"}},
  {name:"Serigala Kelabu",sci:"Canis lupus",common:"Gray Wolf",emoji:"🐺",status:"Risiko Rendah",region:"DUNIA 🌍",rtype:"animal",habitat:"darat",biome:"salji",rarity:2,sound:"howl",audio:FP+"Wolf_howls.ogg",
   image:FP+"Front_view_of_a_resting_Canis_lupus_ssp.jpg?width=700",
   info:{"Taburan":"Amerika Utara, Eropah, Asia","Habitat":"Hutan & tundra sejuk","Pemakanan":"Karnivor (berkawan)","Fakta":"Melolong untuk berkomunikasi dengan kawanan"}},
  {name:"Gajah Afrika",sci:"Loxodonta africana",common:"African Elephant",emoji:"🐘",status:"Terancam",region:"DUNIA 🌍",rtype:"animal",habitat:"darat",biome:"savana",rarity:2,sound:"trumpet",audio:FP+"Elephant_voice_-_trumpeting.ogg",
   image:FP+"African_bush_elephants_(Loxodonta_africana)_female_with_six-week-old_baby.jpg?width=700",
   info:{"Taburan":"Sabana Afrika","Habitat":"Padang rumput & hutan","Pemakanan":"Herbivor","Fakta":"Haiwan darat terbesar di dunia; telinga lebih besar drpd gajah Asia"}},
  {name:"Burung Helang Laut",sci:"Haliaeetus leucogaster",common:"Sea Eagle",emoji:"🦅",status:"Risiko Rendah",region:"ASIA 🌏",rtype:"animal",habitat:"darat",biome:"darat",rarity:2,sound:"screech",audio:FP+"White-bellied_Sea_Eagle_(Haliaeetus_leucogaster)_flight_call_from_Ezhimala%2C_Kerala.wav",
   image:FP+"White-bellied_Sea-Eagle_in_Sundarbans_National_Park_October_2025_by_Tisha_Mukherjee_03.jpg?width=700",
   info:{"Taburan":"Pantai Asia & Australia","Habitat":"Pinggir laut & tasik","Pemakanan":"Ikan & ketam","Fakta":"Penglihatan amat tajam untuk memburu dari udara"}},
  {name:"Burung Hantu",sci:"Tyto alba",common:"Barn Owl",emoji:"🦉",status:"Risiko Rendah",region:"DUNIA 🌍",rtype:"animal",habitat:"darat",biome:"darat",rarity:1,sound:"call",audio:FP+"Maghreb_owl_hooting.wav",
   image:FP+"Tyto_alba_(Scopoli%2C_1769).jpg?width=700",
   info:{"Taburan":"Hampir seluruh dunia","Habitat":"Hutan, ladang & bangunan lama","Pemakanan":"Tikus & serangga","Fakta":"Memburu pada waktu malam; terbang hampir senyap"}},
  {name:"Katak",sci:"Ranidae",common:"Frog",emoji:"🐸",status:"Risiko Rendah",region:"MALAYSIA 🇲🇾",rtype:"animal",habitat:"air",biome:"air",rarity:1,sound:"splash",audio:FP+"Single_Frog_Croak.oga",
   image:FP+"The_Green_and_Golden_Bell_Frog.jpg?width=700",
   info:{"Taburan":"Seluruh dunia","Habitat":"Kolam, sawah & paya","Pemakanan":"Serangga","Fakta":"Amfibia — hidup di air & darat; kulit perlu lembap"}},
  {name:"Monyet",sci:"Macaca",common:"Monkey",emoji:"🐒",status:"Risiko Rendah",region:"ASIA 🌏",rtype:"animal",habitat:"darat",biome:"darat",rarity:1,sound:"call",audio:FP+"Brown_woolly_monkey_alarm_call.wav",
   image:FP+"Monkey_eating.jpg?width=700",
   info:{"Taburan":"Asia, Afrika & Amerika","Habitat":"Hutan","Pemakanan":"Omnivor (buah, daun, serangga)","Fakta":"Sangat pandai & hidup berkumpulan"}},
  {name:"Lumba-lumba",sci:"Delphinidae",common:"Dolphin",emoji:"🐬",status:"Terdedah",region:"DUNIA 🌍",rtype:"animal",habitat:"air",biome:"air",rarity:2,sound:"splash",audio:FP+"Whales_and_Dolphins_whale_nature_sounds_songs_nueva_esparta.ogg",
   image:FP+"Eilat_Dolphin_Reef_(3).jpg?width=700",
   info:{"Taburan":"Lautan seluruh dunia","Habitat":"Laut & muara","Pemakanan":"Ikan & sotong","Fakta":"Mamalia laut yang sangat pintar; guna sonar untuk 'melihat'"}},
  {name:"Cengkerik",sci:"Gryllus",common:"Cricket",emoji:"🦗",status:"Risiko Rendah",region:"MALAYSIA 🇲🇾",rtype:"animal",habitat:"darat",biome:"darat",rarity:1,sound:"call",audio:FP+"Cricket_Gryllus_bimaculatus_Chirps.oga",
   image:FP+"Gryllus_campestris_MHNT.jpg?width=700",
   info:{"Taburan":"Seluruh dunia","Habitat":"Rumput & tanah","Pemakanan":"Tumbuhan & sisa","Fakta":"Berbunyi dengan menggosok sayap, bukan dengan mulut"}},
  {name:"Ayam Jantan",sci:"Gallus gallus",common:"Rooster",emoji:"🐓",status:"Domestik",region:"MALAYSIA 🇲🇾",rtype:"animal",habitat:"darat",biome:"darat",rarity:1,sound:"call",audio:FP+"Rooster_crowing.ogg",
   image:FP+"Rooster04_adjusted.jpg?width=700",
   info:{"Taburan":"Seluruh dunia","Habitat":"Ladang & kampung","Pemakanan":"Bijirin & serangga","Fakta":"Berkokok pada waktu pagi"}},
  {name:"Kuda",sci:"Equus caballus",common:"Horse",emoji:"🐴",status:"Domestik",region:"DUNIA 🌍",rtype:"animal",habitat:"darat",biome:"savana",rarity:1,sound:"call",audio:FP+"Wiehern.ogg",
   image:FP+"Draft_horse_pulling_logs_in_Parc_naturel_Hautes_Fagnes%2C_Eupen%2C_Belgium_(VeloTour_54_to_55%2C_DSCF3703).jpg?width=700",
   info:{"Taburan":"Seluruh dunia","Habitat":"Padang rumput & ladang","Pemakanan":"Herbivor (rumput)","Fakta":"Boleh tidur sambil berdiri"}},
  {name:"Lembu",sci:"Bos taurus",common:"Cow",emoji:"🐄",status:"Domestik",region:"MALAYSIA 🇲🇾",rtype:"animal",habitat:"darat",biome:"savana",rarity:1,sound:"call",audio:FP+"Single_Cow_Moo.ogg",
   image:FP+"Cow_(Fleckvieh_breed)_Oeschinensee_Slaunger_2009-07-07.jpg?width=700",
   info:{"Taburan":"Seluruh dunia","Habitat":"Ladang & padang rumput","Pemakanan":"Herbivor (rumput)","Fakta":"Mengunyah semula makanan (memamah biak)"},
   infoEn:{"Range":"Worldwide","Habitat":"Farms & grassland","Diet":"Herbivore (grass)","Fact":"Chews its food again (ruminates)"}},

  // ---- HAIWAN TERANCAM (endangered — fokus pembelajaran) ----
  {name:"Citah",sci:"Acinonyx jubatus",common:"Cheetah",emoji:"🐆",status:"Terdedah",region:"DUNIA 🌍",rtype:"animal",habitat:"darat",biome:"savana",rarity:2,sound:"growl",audio:FP+"Acoustic-Structure-and-Contextual-Use-of-Calls-by-Captive-Male-and-Female-Cheetahs-(Acinonyx-pone.0158546.s001.oga",
   image:FP+"Cheetah_(Acinonyx_jubatus)_female_2.jpg?width=700",
   info:{"Taburan":"Sabana Afrika","Habitat":"Padang rumput terbuka","Pemakanan":"Karnivor","Fakta":"Haiwan darat terpantas — boleh capai 100+ km/j!"},
   infoEn:{"Range":"African savanna","Habitat":"Open grasslands","Diet":"Carnivore","Fact":"Fastest land animal — can reach 100+ km/h!"}},
  {name:"Enggang",sci:"Buceros rhinoceros",common:"Hornbill",emoji:"🦜",status:"Terancam",region:"MALAYSIA 🇲🇾",rtype:"animal",habitat:"darat",biome:"darat",rarity:3,sound:"screech",audio:FP+"Malabar_pied_hornbill_call_recorded_in_May_2014_at_Netravali%2C_Goa.wav",
   image:FP+"Buceros_bicornis_-Stone_Zoo%2C_Stoneham%2C_Massachusetts%2C_USA-8a.jpg?width=700",
   info:{"Taburan":"Hutan Malaysia & Borneo","Habitat":"Hutan hujan","Pemakanan":"Buah & serangga","Fakta":"Burung lambang negeri Sarawak; ada 'tanduk' di paruh"},
   infoEn:{"Range":"Malaysia & Borneo forests","Habitat":"Rainforest","Diet":"Fruit & insects","Fact":"State bird of Sarawak; has a 'horn' on its beak"}},
  {name:"Ungka",sci:"Hylobates lar",common:"Lar Gibbon",emoji:"🐒",status:"Terancam",region:"MALAYSIA 🇲🇾",rtype:"animal",habitat:"darat",biome:"darat",rarity:3,sound:"call",audio:null,
   image:FP+"Hylobates_lar_-_Kaeng_Krachan_WB.jpg?width=700",
   info:{"Taburan":"Hutan Asia Tenggara","Habitat":"Kanopi hutan hujan","Pemakanan":"Buah & daun","Fakta":"Berayun antara pokok; nyanyiannya kuat pada waktu pagi"},
   infoEn:{"Range":"Southeast Asian forests","Habitat":"Rainforest canopy","Diet":"Fruit & leaves","Fact":"Swings between trees; sings loudly in the morning"}},
  {name:"Panda Merah",sci:"Ailurus fulgens",common:"Red Panda",emoji:"🦊",status:"Terancam",region:"ASIA 🌏",rtype:"animal",habitat:"darat",biome:"darat",rarity:3,sound:"call",audio:null,
   image:FP+"Ailurus_fulgens_-_Karlsruhe_Zoo_01.jpg?width=700",
   info:{"Taburan":"Pergunungan Himalaya","Habitat":"Hutan buluh sejuk","Pemakanan":"Kebanyakannya buluh","Fakta":"Bukan saudara panda gergasi; seperti kucing-rakun"},
   infoEn:{"Range":"Himalayan mountains","Habitat":"Cool bamboo forest","Diet":"Mostly bamboo","Fact":"Not related to giant panda; cat-like raccoon relative"}},
  {name:"Harimau Salji",sci:"Panthera uncia",common:"Snow Leopard",emoji:"🐆",status:"Terdedah",region:"ASIA 🌏",rtype:"animal",habitat:"darat",biome:"salji",rarity:3,sound:"growl",audio:null,
   image:FP+"Snow_leopard_portrait-2010-07-09.jpg?width=700",
   info:{"Taburan":"Pergunungan tinggi Asia Tengah","Habitat":"Cerun berbatu bersalji","Pemakanan":"Karnivor","Fakta":"Ekor tebal panjang untuk imbangan & kehangatan"},
   infoEn:{"Range":"High mountains of Central Asia","Habitat":"Snowy rocky slopes","Diet":"Carnivore","Fact":"Long thick tail for balance & warmth"}},
  {name:"Beruang Matahari",sci:"Helarctos malayanus",common:"Sun Bear",emoji:"🐻",status:"Terdedah",region:"MALAYSIA 🇲🇾",rtype:"animal",habitat:"darat",biome:"darat",rarity:2,sound:"growl",audio:null,
   image:FP+"Sun_bear_(Helarctos_malayanus).jpg?width=700",
   info:{"Taburan":"Hutan Asia Tenggara","Habitat":"Hutan hujan tropika","Pemakanan":"Omnivor — madu, buah, serangga","Fakta":"Beruang terkecil di dunia; ada tanda dada keemasan"},
   infoEn:{"Range":"Southeast Asian forests","Habitat":"Tropical rainforest","Diet":"Omnivore — honey, fruit, insects","Fact":"Smallest bear in the world; golden chest patch"}},
  {name:"Bekantan",sci:"Nasalis larvatus",common:"Proboscis Monkey",emoji:"🐒",status:"Terancam",region:"ASIA 🌏",rtype:"animal",habitat:"darat",biome:"darat",rarity:3,sound:"call",audio:null,
   image:FP+"Proboscis_monkey_(Nasalis_larvatus)_composite.jpg?width=700",
   info:{"Taburan":"Borneo sahaja","Habitat":"Hutan paya bakau","Pemakanan":"Daun & buah","Fakta":"Hidung panjang besar; perenang yang handal"},
   infoEn:{"Range":"Borneo only","Habitat":"Mangrove swamp forest","Diet":"Leaves & fruit","Fact":"Large long nose; a strong swimmer"}},
  {name:"Badak Sumatera",sci:"Dicerorhinus sumatrensis",common:"Sumatran Rhino",emoji:"🦏",status:"Kritikal Terancam",region:"ASIA 🌏",rtype:"animal",habitat:"darat",biome:"darat",rarity:3,sound:"growl",audio:null,
   image:FP+"Sumatran_Rhino_2.jpg?width=700",
   info:{"Taburan":"Sumatra & Borneo","Habitat":"Hutan hujan","Pemakanan":"Herbivor","Fakta":"Badak terkecil & paling berbulu; sangat hampir pupus"},
   infoEn:{"Range":"Sumatra & Borneo","Habitat":"Rainforest","Diet":"Herbivore","Fact":"Smallest & hairiest rhino; very close to extinction"}},
  {name:"Yu Paus",sci:"Rhincodon typus",common:"Whale Shark",emoji:"🦈",status:"Terancam",region:"DUNIA 🌍",rtype:"animal",habitat:"air",biome:"air",rarity:3,sound:"splash",audio:null,
   image:FP+"Whale_Shark_AdF.jpg?width=700",
   info:{"Taburan":"Lautan tropika seluruh dunia","Habitat":"Laut terbuka hangat","Pemakanan":"Plankton (penapis)","Fakta":"Ikan terbesar di dunia — tetapi lembut & tidak bahaya"},
   infoEn:{"Range":"Tropical oceans worldwide","Habitat":"Warm open sea","Diet":"Plankton (filter feeder)","Fact":"Largest fish in the world — yet gentle & harmless"}},
  {name:"Dugong",sci:"Dugong dugon",common:"Dugong",emoji:"🦭",status:"Terdedah",region:"ASIA 🌏",rtype:"animal",habitat:"air",biome:"air",rarity:3,sound:"splash",audio:null,
   image:FP+"Trang_-_Dugong_Roundabout_06_-_Sep_2024.jpg?width=700",
   info:{"Taburan":"Perairan cetek Asia & Australia","Habitat":"Padang rumput laut","Pemakanan":"Rumpai laut","Fakta":"Mamalia laut; dikatakan asal legenda 'duyung'"},
   infoEn:{"Range":"Shallow waters of Asia & Australia","Habitat":"Seagrass meadows","Diet":"Seagrass","Fact":"Sea mammal; inspired old 'mermaid' legends"}}
];
/* ---------- HAIWAN MISTERI (sukar dijumpai — Pokémon style) ---------- */
const MYSTERY: Species[] = [
  {name:"Tenggiling",sci:"Manis javanica",common:"Sunda Pangolin",emoji:"🦔",status:"Kritikal Terancam",region:"MALAYSIA 🇲🇾",rtype:"animal",habitat:"darat",biome:"darat",rarity:4,sound:"none",audio:null,mystery:true,
   image:FP+"Tree_Pangolin.JPG?width=800",
   info:{"Taburan":"Malaysia & Asia Tenggara","Ciri":"Bersisik keratin, menggulung bila terancam","Pemakanan":"Semut & anai-anai","Fakta":"Mamalia paling banyak diseludup di dunia!"}},
  {name:"Harimau Dahan",sci:"Neofelis nebulosa",common:"Clouded Leopard",emoji:"🐆",status:"Terancam",region:"ASIA 🌏",rtype:"animal",habitat:"darat",biome:"darat",rarity:4,sound:"growl",audio:null,mystery:true,
   image:FP+"Clouded_leopard.jpg?width=800",
   info:{"Taburan":"Hutan Asia Tenggara & Himalaya","Ciri":"Corak 'awan', pemanjat pokok terhebat","Pemakanan":"Karnivor","Fakta":"Taring terpanjang berbanding saiz badan antara kucing"}},
  {name:"Axolotl",sci:"Ambystoma mexicanum",common:"Axolotl",emoji:"🦎",status:"Kritikal Terancam",region:"DUNIA 🌍",rtype:"animal",habitat:"air",biome:"air",rarity:4,sound:"none",audio:null,mystery:true,
   image:FP+"AxolotlBE.jpg?width=800",
   info:{"Taburan":"Tasik Xochimilco, Mexico","Ciri":"Salamander kekal akuatik, insang luar","Fakta":"Boleh menjana semula anggota badan & sebahagian otak!"}}
];
/* ---------- BABAK / SITUASI (utk Buku Koleksi) ---------- */
const SCENARIOS: Scenario[] = [
  {type:"api",name:"Kebakaran Hutan",icon:"🔥",number:"999 (Bomba)",desc:"Api memusnahkan beribu hektar hutan, melepaskan asap & karbon.",casesMY:"Ribuan hektar terbakar setiap musim kemarau di Malaysia (jerebu 2015 & 2019).",effect:"Habitat harimau, gajah & orang utan musnah; haiwan mati atau kehilangan rumah."},
  {type:"pembalakan",name:"Pembalakan Haram",icon:"🪓",number:"1-800-88-5151 (PERHILITAN)",desc:"Penebangan pokok tanpa lesen merosakkan hutan simpan.",casesMY:"Antara punca utama kehilangan hutan di Sabah & Sarawak.",effect:"Pokok Cengal & Meranti pupus; orang utan & haiwan kehilangan kawasan tinggal."},
  {type:"jerat",name:"Pemburuan & Jerat Haram",icon:"🪤",number:"1-800-88-5151 (PERHILITAN)",desc:"Jerat & pemburu memburu haiwan terancam untuk dagangan.",casesMY:"Ratusan jerat dijumpai setiap tahun dlm operasi PERHILITAN.",effect:"Harimau Malaya & tenggiling semakin pupus akibat pemburuan."},
  {type:"curi",name:"Pencurian Tumbuhan",icon:"🚯",number:"1-800-88-5151 (PERHILITAN)",desc:"Tumbuhan terancam digali & dijual di pasaran gelap.",casesMY:"Rafflesia & periuk kera kerap dicuri dari hutan simpan.",effect:"Spesies tumbuhan unik hilang sebelum sempat dikaji."},
  {type:"sakit",name:"Haiwan Liar Cedera",icon:"🩹",number:"Pusat Penyelamat Hidupan Liar",desc:"Haiwan cedera dilanggar kenderaan atau terperangkap.",casesMY:"Gajah & tapir kerap dilanggar di lebuh raya merentas hutan.",effect:"Tanpa rawatan pakar, haiwan terancam boleh mati."}
];
/* ---------- KATALOG (semua spesies utk Buku Koleksi/game) ---------- */
const BIOME_BY_NAME={"Beruang Kutub":"salji","Kaktus Saguaro":"gurun","Pokok Baobab":"savana","Gorila Gunung":"darat","Jaguar":"darat"};
function biomeFor(sp){ if(sp.biome)return sp.biome; if(BIOME_BY_NAME[sp.name])return BIOME_BY_NAME[sp.name]; if(sp.habitat==="air")return "air"; return "darat"; }
function buildCatalog(){ const arr=[];
  ORDER.forEach(k=>{ const st=STAGES[k]; st.species.forEach(s=>{ const c=Object.assign({},s); c.region=st.region; c.rtype=st.type; c.stage=k;
    if(!c.rarity) c.rarity = st.region.indexOf("MALAYSIA")>=0?1:st.region.indexOf("ASIA")>=0?2:3;
    c.biome=biomeFor(c); arr.push(c); }); });
  EXTRA.forEach(e=>{ const c=Object.assign({},e); c.biome=biomeFor(c); arr.push(c); });
  MYSTERY.forEach(e=>{ const c=Object.assign({},e); c.biome=biomeFor(c); arr.push(c); });
  return arr;
}
function regionOf(r){ return r.indexOf("MALAYSIA")>=0?"Malaysia":r.indexOf("ASIA")>=0?"Asia":"Dunia"; }
const RARITY: Record<number, RarityInfo> = {1:{name:"Mudah",frame:"border-yellow-300",ring:"ring-yellow-200",chip:"bg-yellow-100 text-yellow-700"},2:{name:"Sederhana",frame:"border-emerald-300",ring:"ring-emerald-200",chip:"bg-emerald-100 text-emerald-700"},3:{name:"Sukar",frame:"border-violet-300",ring:"ring-violet-200",chip:"bg-violet-100 text-violet-700"},4:{name:"Misteri",frame:"border-amber-400",ring:"ring-amber-300",chip:"bg-amber-100 text-amber-700"}};
function rarityOf(sp){ return sp.rarity|| (sp.mystery?4:1); }
const RANKS: RankTier[] = [{min:0,name:"Perekrut",icon:"🌱"},{min:50,name:"Ranger Junior",icon:"🍃"},{min:130,name:"Ranger",icon:"🌿"},{min:260,name:"Ranger Pakar",icon:"🌳"},{min:450,name:"Penjaga Alam",icon:"🛡️"},{min:700,name:"Legenda EcoRanger",icon:"👑"}];
const ACH: Record<string, AchievementDef> = {
  first_stamp:{name:"Langkah Pertama",icon:"🐾",desc:"Kumpul cop pertama"},
  perfect:{name:"Genius Alam",icon:"🧠",desc:"Kuiz sempurna 3/3"},
  hero:{name:"Penyelamat",icon:"🚒",desc:"Selesaikan satu krisis"},
  combo3:{name:"Rentak Panas",icon:"🔥",desc:"Capai combo x3"},
  shopper:{name:"Bergaya",icon:"🛍️",desc:"Beli item kedai"},
  my_done:{name:"Wira Malaysia",icon:"🇲🇾",desc:"Habiskan kedua misi Malaysia"},
  asia_done:{name:"Penjelajah Asia",icon:"🌏",desc:"Habiskan kedua misi Asia"},
  world_done:{name:"Juara Dunia",icon:"🌍",desc:"Habiskan semua 6 misi"}
};

export const CATALOG: Species[] = buildCatalog();
export { STAGES, ORDER, ITEMS, GAME_REWARDS, FP, EXTRA, MYSTERY, SCENARIOS, BIOME_BY_NAME, RARITY, RANKS, ACH, itemById, specialUnlocked, avatarParts, avatarHTML, biomeFor, buildCatalog, regionOf, rarityOf };
