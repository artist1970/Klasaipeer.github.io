/* Klasaipeer public chat demo: original, offline-first, no requests, no persistence. */
(()=>{"use strict";
const input=document.getElementById("klasaipeer-chat-input"),send=document.getElementById("klasaipeer-chat-send"),log=document.getElementById("klasaipeer-chat-log"),status=document.getElementById("klasaipeer-chat-status"),clear=document.getElementById("klasaipeer-chat-clear"),stage=document.getElementById("stage");
if(!input||!send||!log)return;
const corpus=[
 {terms:["hello","hi","hey","bonjour","hola"],response:"Hello! I'm a public preview of Klasaipeer. We can practice words, try a story idea, or make a small learning plan."},
 {terms:["who are you","your name"],response:"I'm the Klasaipeer public demonstration, not your adopted schoolmate yet. In the Academy, a family could choose and customize a companion."},
 {terms:["learn","study","homework","lesson"],response:"What subject are you working on? We can choose one small goal, practice it, then review what you've learned."},
 {terms:["read","reading","book"],response:"Let's practice reading! Choose a short sentence and tell me its main idea. What clues support your answer?"},
 {terms:["write","writing","sentence"],response:"Try a sentence with a character, an action, and a place. You can add a feeling to make the writing more vivid."},
 {terms:["science","experiment"],response:"A curious scientist begins with a question. What do you predict will happen, and what observation could help us test it?"},
 {terms:["math","numbers","count"],response:"Let's practice one step at a time. What kind of problem would you like to try: counting, fractions, geometry or algebra?"},
 {terms:["french","français","bonjour"],response:"Bonjour means hello in French. Try greeting someone with Bonjour! Would you like to practice one more phrase?"},
 {terms:["spanish","español","hola"],response:"Hola means hello in Spanish. Practice a friendly greeting: ¡Hola!"},
 {terms:["german","deutsch","hallo"],response:"Hallo is a German greeting. Would you like to learn another everyday word?"},
 {terms:["japanese","こんにちは"],response:"こんにちは is a Japanese greeting often used during the day. Would you like to learn a simple introduction?"},
 {terms:["arabic","مرحبا"],response:"مرحبا is a common Arabic greeting. We can explore short phrases together."},
 {terms:["story","imagine","fairytale","fairy tale"],response:"Let's make a tiny original story using three ingredients: a character, a place, and a challenge. Which one shall we choose first?"},
 {terms:["sad","upset","worried","scared"],response:"I'm sorry things feel difficult. You can take a break and talk with someone you trust. Would a small, gentle learning activity help?"},
 {terms:["parent","guardian","teacher","mentor"],response:"Your family and teachers are important partners. In the future, Klasaipeer can help you find an approved Academy mentor."}
];
const themes={child:{lead:"Let's try a playful idea. ",end:" We can take it one step at a time."},elementary:{lead:"Here's an idea. ",end:" What would you try next?"},tween:{lead:"Let's explore this together. ",end:" What evidence or example would help?"},teen:{lead:"We can approach this thoughtfully. ",end:" What would be your next step?"},adult:{lead:"Let's frame a clear learning goal. ",end:" How would you like to apply it?"}};
function band(){const x=Number(stage?.value??1);return x<=0?"child":x===1?"elementary":x===2?"tween":x===3?"teen":"adult"}
function normalized(s){return s.toLocaleLowerCase().normalize("NFKC").replace(/[!?.,]+/g," ").replace(/\s+/g," ").trim()}
function append(sender,message){const article=document.createElement("div");article.style.cssText="padding:10px 12px;border-radius:7px;margin:8px 0;background:"+(sender==="You"?"#f4eddd":"#e3eee5");const label=document.createElement("strong");label.textContent=sender+" · ";const p=document.createElement("span");p.textContent=message;article.append(label,p);log.append(article);log.scrollTop=log.scrollHeight}
function reply(raw){const q=normalized(raw);if(!q)return "Please type a question.";const found=corpus.find(item=>item.terms.some(t=>q.includes(t)));if(found)return found.response;const t=themes[band()];return t.lead+"I don't have a verified answer to that in this public demonstration. Could you ask about reading, writing, a language, a story, math or science?"+t.end}
function submit(){const q=input.value.trim().slice(0,400);if(!q)return;append("You",q);append("Klasaipeer · demo",reply(q));input.value="";status.textContent="Response from a small local knowledge set; no chat was sent or saved.";input.focus()}
send.addEventListener("click",submit);input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}});clear?.addEventListener("click",()=>{log.replaceChildren();status.textContent="Public demo chat cleared.";input.focus()});
append("Klasaipeer · demo","Hello! This is an offline-friendly public chat sample. Ask about stories, languages or learning. For private schoolmate chat, use your future Academy profile.");
})();
