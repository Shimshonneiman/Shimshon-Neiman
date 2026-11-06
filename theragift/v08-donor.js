/* TheraGift v0.8: public-only fictional discovery. No login, network requests,
   user-text logging or persistence. Donor search text never appears in URLs. */
(()=>{'use strict';
const examples=window.TheraGiftExamples||[];
if(examples.length!==60)return;
const byId=id=>document.getElementById(id);
const cards=byId('tgFundcaseStrip');
const related=byId('tgRelatedCases');
const matchSection=byId('find-match');
const searchText=byId('tgMatchTextV08');
const output=byId('tgMatchOutputV08');
if(!cards||!matchSection||!searchText||!output)return;
const CAUSES={wellbeing:'Mental & emotional wellbeing',trauma:'Trauma & recovery',families:'Relationships & family',young:'Children & young people',life:'Loss, health & life changes',community:'Community & belonging'};
const rules=[
{cat:'life',words:['bereavement','grief','grieving','lost someone','loss','passed away','died','death','widow','widower','mourning'],topics:['Bereavement & loss']},
{cat:'life',words:['illness','health','disability','chronic','medical','older','retirement','life change','change','workplace','job loss','redundancy'],topics:['Long-term health conditions','Disability & adjustment','Major life transitions']},
{cat:'wellbeing',words:['anxiety','anxious','panic','worried','worry','nervous','stress','burnout','sad','depression','depressed','low mood','lonely','loneliness','ocd','intrusive','isolated'],topics:['Anxiety & panic','Depression & low mood','Stress & burnout','Loneliness & isolation']},
{cat:'trauma',words:['trauma','ptsd','abuse','abusive','survivor','recovery','crisis','violence','assault','domestic'],topics:['Trauma & PTSD','Abuse recovery','Recovery after crisis']},
{cat:'families',words:['divorce','separation','partner','relationship','couple','family','family conflict','parenting','parent','new baby','fertility','carer','carers'],topics:['Separation & divorce','Family conflict','Parenting support']},
{cat:'young',words:['child','children','teen','teenager','young person','school','student','bullying','bullied','young adult','university'],topics:['Teenage wellbeing','Childhood anxiety','School-related stress']},
{cat:'community',words:['identity','belonging','community','cultural','culture','refugee','displaced','faith','religion','autism','adhd','neurodivergent','lgbtq','afford','money','financial','cost'],topics:['Identity & belonging','Culturally sensitive therapy','Financial barriers to care']}
];
const sensitive=[/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,/(\+44|0)[\s()\d-]{9,}/,/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/i,/https?:\/\/|www\./i];
const fmt=n=>'£'+Number(n).toLocaleString('en-GB');
const create=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
function makeCard(p){
 const a=create('a','tg-fundcase tg-v08-profile');
 a.href='profile.html#'+encodeURIComponent(p.slug);
 a.dataset.tgCategory=p.cat;a.dataset.tgTopic=p.topic;
 a.setAttribute('aria-label','Explore fictional profile: '+p.title);
 const art=create('div','tg-fundcase-art tone-'+(p.tone==='mist'?'ivory':p.tone));
 art.append(create('span','tg-fundcase-topic',p.topic),create('span','tg-fundcase-star','✦'));
 const info=create('div','tg-fundcase-info');
 info.append(create('small','', 'FICTIONAL EXAMPLE'),create('h3','',p.title),create('p','',p.story));
 const bar=create('div','tg-fundcase-track'),fill=create('span');
 fill.style.width=Math.round(100*p.raised/p.target)+'%';bar.append(fill);
 const figures=create('div','tg-fundcase-figures');
 figures.append(create('strong','',fmt(p.raised)+' raised'),create('span','', 'of '+fmt(p.target)));
 info.append(bar,figures,create('span','tg-fundcase-action','Explore this story ↗'));
 a.append(art,info);return a;
}
function fill(container,items){container.replaceChildren();const nodes=items.map(makeCard);container.append(...nodes);}
let active='all';
function selectCause(cat,topic){
 active=cat||'all';
 const pool=examples.filter(p=>active==='all'||p.cat===active);
 const exact=topic?pool.filter(p=>p.topic.toLowerCase()===topic.toLowerCase()):[];
 const ordered=exact.length?[...exact,...pool.filter(p=>!exact.includes(p))]:pool;
 fill(cards,ordered);
 if(related&&active!=='all')fill(related,ordered.slice(0,5));
 const strip=cards;strip.scrollLeft=0;
 document.querySelectorAll('[data-tg-filter]').forEach(b=>{const state=b.dataset.tgFilter===active;b.classList.toggle('active',state);b.setAttribute('aria-pressed',String(state))});
}
selectCause('all');
document.querySelectorAll('[data-tg-filter]').forEach(b=>b.addEventListener('click',()=>selectCause(b.dataset.tgFilter)));
document.querySelectorAll('[data-open-cause]').forEach(b=>b.addEventListener('click',()=>{selectCause(b.dataset.openCause);}));
document.querySelectorAll('.donor-cause-card').forEach(c=>c.addEventListener('click',()=>selectCause(c.dataset.cause)));
document.querySelectorAll('[data-topic]').forEach(b=>b.addEventListener('click',()=>{const cat=document.querySelector('.donor-cause-card.active')?.dataset.cause||active;selectCause(cat,b.dataset.topic)}));
document.querySelectorAll('[data-all-topic]').forEach(b=>b.addEventListener('click',()=>selectCause(b.dataset.topicCause,b.dataset.allTopic)));
const sampleStrip=byId('tgBottomProfilesV08');if(sampleStrip)fill(sampleStrip,examples.filter((p,i)=>i%7===0).slice(0,9));
const norm=s=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
const phrase=(text,p)=>(' '+text+' ').includes(' '+norm(p)+' ');
function search(q){
 const text=norm(q);
 const scores=examples.map((p,i)=>{
  let score=0;
  for(const rule of rules){const hit=rule.words.some(w=>phrase(text,w));if(hit&&rule.cat===p.cat){score+=5;if(rule.topics.includes(p.topic))score+=4}}
  for(const word of text.split(' ').filter(w=>w.length>=4)){if(phrase(norm(p.topic),word))score+=5;else if(phrase(norm(p.title+' '+p.story),word))score+=1}
  return {p,score,i};
 }).sort((a,b)=>b.score-a.score||a.i-b.i);
 return scores;
}
function announce(headline,description,picks=[]){
 output.hidden=false;byId('tgMatchTitleV08').textContent=headline;byId('tgMatchSummaryV08').textContent=description;
 const target=byId('tgMatchedV08');fill(target,picks);output.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
}
function submit(){
 const phraseText=searchText.value.trim();searchText.value='';byId('tgMatchCountV08').textContent='0 / 600';
 if(!phraseText){announce('A few words are enough.','Describe a broad cause, such as loss, family change, anxiety or support for young people.');return}
 if(sensitive.some(rx=>rx.test(phraseText))){announce('Your privacy comes first.','That description may contain identifying details. We cleared the text without running a search. Please use broad topics only.');return}
 const scored=search(phraseText),top=scored[0]?.score||0;
 const matches=top>=4?scored.filter(x=>x.score>0).slice(0,6).map(x=>x.p):examples.filter((_,i)=>i%11===0).slice(0,6);
 const causes=[...new Set(matches.map(x=>CAUSES[x.cat]))].slice(0,3).join(' · ');
 if(top>=4)announce('We found a close match.','These fictional stories relate to '+causes+'. Your description was used only within this browser page.',matches);
 else announce('Here are some possibilities.','We could not find a strong cause match, so here are fictional stories you might explore. Your description was not saved.',matches);
}
byId('tgMatchButtonV08')?.addEventListener('click',submit);
searchText.addEventListener('input',()=>{byId('tgMatchCountV08').textContent=searchText.value.length+' / 600'});
byId('tgMatchExampleV08')?.addEventListener('click',()=>{searchText.value='I would like to help someone dealing with grief after losing a loved one';byId('tgMatchCountV08').textContent=searchText.value.length+' / 600';searchText.focus()});
byId('tgMatchClearV08')?.addEventListener('click',()=>{searchText.value='';output.hidden=true;byId('tgMatchedV08').replaceChildren();byId('tgMatchCountV08').textContent='0 / 600';searchText.focus()});
})();