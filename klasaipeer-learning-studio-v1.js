/* Klasaipeer Learning Studio v1 — isolated, offline-first public preview. No storage/network/accounts. */
(()=>{"use strict";
const $=id=>document.getElementById(id),say=(id,s)=>{const e=$(id);if(e)e.textContent=s};
const locale=()=>($("conversationLanguage")?.value||"en-US").split("-")[0];
const lex={
 en:{hello:"Hello, my friend!",thanks:"Thank you",book:"book",welcome:"Welcome to our story studio!"},
 es:{hello:"¡Hola, amigo!",thanks:"Gracias",book:"libro",welcome:"¡Bienvenido a nuestro taller de cuentos!"},
 fr:{hello:"Bonjour, mon ami !",thanks:"Merci",book:"livre",welcome:"Bienvenue à notre atelier d'histoires !"},
 de:{hello:"Hallo, mein Freund!",thanks:"Danke",book:"Buch",welcome:"Willkommen in unserer Geschichtenwerkstatt!"},
 ar:{hello:"مرحبًا يا صديقي!",thanks:"شكرًا",book:"كتاب",welcome:"مرحبًا بك في ورشة القصص!"},
 ja:{hello:"こんにちは、友だち！",thanks:"ありがとう",book:"本",welcome:"お話の工房へようこそ！"},
 zh:{hello:"你好，朋友！",thanks:"谢谢",book:"书",welcome:"欢迎来到故事工作室！"},
 ru:{hello:"Привет, друг!",thanks:"Спасибо",book:"книга",welcome:"Добро пожаловать в мастерскую историй!"},
 pt:{hello:"Olá, amigo!",thanks:"Obrigado",book:"livro",welcome:"Bem-vindo ao nosso ateliê de histórias!"}
};
const names=["Auri","Milo","Nova","Kai","Lumi","Sora","Eli","Zuri","Rio","Sage","Amira","Niko"];
let nameCounter=0;
function naming(){const field=$("peerName");if(!field)return;const area=document.createElement("div");area.className="name-ideas";area.innerHTML='<p class="subtle">Choose your own name, or try an inspiration:</p><div class="actions" id="kl-name-ideas"></div><p id="kl-name-feedback" class="subtle" role="status"></p>';field.closest("div").insertAdjacentElement("afterend",area);const target=$("kl-name-ideas");for(const name of names){const b=document.createElement("button");b.type="button";b.className="button alt";b.textContent=name;b.addEventListener("click",()=>chooseName(name));target.append(b)}const surprise=document.createElement("button");surprise.className="button";surprise.type="button";surprise.textContent="Surprise Me";surprise.addEventListener("click",()=>{nameCounter++;const i=(Math.floor(Math.random()*names.length)+nameCounter)%names.length;chooseName(names[i])});target.append(surprise);
function chooseName(name){field.value=name;field.dispatchEvent(new Event("input",{bubbles:true}));say("kl-name-feedback","Name preview updated. Your choice is not saved or sent.");}}
function voice(text,lang){if(!("speechSynthesis" in window)||!("SpeechSynthesisUtterance" in window)){say("kl-lang-status","This browser has no speech playback.");return;}speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=lang;utterance.rate=Number($("pace")?.value||0.9);utterance.volume=Number($("volume")?.value||80)/100;const options=speechSynthesis.getVoices();utterance.voice=options.find(v=>v.lang.toLowerCase()===lang.toLowerCase())||options.find(v=>v.lang.split("-")[0].toLowerCase()===lang.split("-")[0].toLowerCase())||null;utterance.onerror=()=>say("kl-lang-status","Voice unavailable on this device.");speechSynthesis.speak(utterance)}
function language(){const chosen=locale(),set=lex[chosen]||lex.en;const key=$("kl-phrase")?.value||"hello";const label=$("kl-phrase-preview");if(label){label.textContent=set[key];label.lang=$("conversationLanguage")?.value||"en-US";label.dir=chosen==="ar"?"rtl":"auto"}say("kl-lang-status","Curated example only. Not general conversational translation.");}
let seeds=0;
const storyData={characters:["a curious fox","a tiny dragon","a thoughtful explorer","a singing owl"],places:["a moonlit garden","a quiet library","a floating island","a forest classroom"],challenges:["find a lost melody","help a friend","solve a gentle mystery","learn a new word"]};
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function story(){seeds++;const c=pick(storyData.characters),p=pick(storyData.places),q=pick(storyData.challenges);const line="Once upon a time, "+c+" visited "+p+" to "+q+". What happened next?";say("kl-story-output",line);say("kl-story-status","Original local prompt #"+seeds+" · No content saved");}
function rhyme(){const words=($("kl-rhyme-word")?.value||"star").trim().slice(0,24).replace(/[^\p{L}\p{M} '-]/gu,"");if(!words){say("kl-rhyme-output","Choose a word first.");return}const a="Here is a song about "+words+".",b="We clap together, gentle and strong.",c="We make a rhythm, one, two, three.",d="And sing a brand-new melody!";say("kl-rhyme-output",[a,b,c,d].join("\n"));say("kl-story-status","Original four-line rhythm prompt, not a generated music recording.");}
const questions=[
 {level:1,q:"Which number comes after 3?",choices:["2","4","7"],answer:1,why:"Counting forward: 1, 2, 3, 4."},
 {level:1,q:"Which word rhymes with cat?",choices:["hat","sun","tree"],answer:0,why:"Cat and hat end with the same sound."},
 {level:2,q:"What is 8 + 5?",choices:["11","13","15"],answer:1,why:"Eight plus five equals thirteen."},
 {level:2,q:"Which word is a noun?",choices:["quickly","garden","bright"],answer:1,why:"A garden is a place, so it is a noun."},
 {level:3,q:"What is one quarter of 24?",choices:["4","6","8"],answer:1,why:"24 divided by 4 equals 6."},
 {level:3,q:"Which sentence gives a testable prediction?",choices:["Science is fun.","All plants are nice.","A plant with more light may grow taller."],answer:2,why:"A prediction can be checked using observations."}
];
let tier=1,streak=0,asked=0,correct=0,current=null;const completed=[];
function nextQuestion(){const pool=questions.filter(x=>x.level===tier),prior=new Set(completed.slice(-3));const options=pool.filter(q=>!prior.has(q.q));current=pick(options.length?options:pool);say("kl-quest-question",current.q);const target=$("kl-quest-choices");target.replaceChildren();current.choices.forEach((c,i)=>{const b=document.createElement("button");b.className="button alt";b.type="button";b.textContent=c;b.addEventListener("click",()=>answer(i));target.append(b)});say("kl-quest-status","Practice level "+tier+" · "+correct+"/"+asked+" correct. This is not an Academy grade.");}
function answer(i){if(!current)return;const good=i===current.answer;asked++;if(good){correct++;streak++;if(streak>=2&&tier<3){tier++;streak=0}}else{streak=0;if(asked>=3&&correct/asked<.4&&tier>1)tier--;}completed.push(current.q);say("kl-quest-feedback",(good?"Correct! ":"Let's review. ")+current.why);current=null;$("kl-quest-choices").replaceChildren();say("kl-quest-status","Practice "+correct+"/"+asked+" · Level "+tier+" · Sample feedback, not mastery evidence.");renderGarden();}
function renderGarden(){say("kl-garden-count",asked+" activities · "+correct+" correct");say("kl-garden-note",asked?"This is a temporary practice snapshot. Your work is not uploaded or saved.":"Your learning garden starts empty. Practice a question to see progress.");}
function clearGarden(){tier=1;streak=0;asked=0;correct=0;current=null;completed.length=0;$("kl-quest-choices").replaceChildren();say("kl-quest-question","Choose Start Practice to begin.");say("kl-quest-feedback","");renderGarden();}
function init(){if(!$("kl-activity-studio"))return;naming();$("kl-phrase")?.addEventListener("change",language);$("conversationLanguage")?.addEventListener("change",language);$("kl-hear-phrase")?.addEventListener("click",()=>voice($("kl-phrase-preview").textContent,$("conversationLanguage")?.value||"en-US"));$("kl-story-go")?.addEventListener("click",story);$("kl-rhyme-go")?.addEventListener("click",rhyme);$("kl-quest-go")?.addEventListener("click",nextQuestion);$("kl-garden-clear")?.addEventListener("click",clearGarden);language();renderGarden();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();