/* Browser-only matching of donor interests with FICTIONAL therapy scenarios.
   No analytics, API calls, storage, logs or donor-identifying records. */
(()=>{'use strict';const $=id=>document.getElementById(id);const input=$('tgDonorStory'),go=$('tgMatchGo'),result=$('tgMatchResult');if(!input||!go||!result)return;
const rules=[
 {category:'life',topics:['Bereavement & loss','Childhood bereavement'],keys:['grief','grieving','bereavement','bereaved','loss','lost','death','died','passed away','mourning']},
 {category:'life',topics:['Long-term health conditions','Disability & adjustment'],keys:['illness','health','disability','disabled','chronic','medical','condition','hospital']},
 {category:'life',topics:['Later-life wellbeing','Major life transitions'],keys:['older','senior','retirement','retire','transition','change']},
 {category:'wellbeing',topics:['Anxiety & panic','Social anxiety'],keys:['anxiety','anxious','panic','worried','worry','fear','nervous','phobia']},
 {category:'wellbeing',topics:['Depression & low mood','Loneliness & isolation'],keys:['depressed','depression','sad','lonely','loneliness','isolated','isolation','low mood']},
 {category:'wellbeing',topics:['Stress & burnout'],keys:['stress','stressed','burnout','overwhelmed','exhausted','overwork']},
 {category:'wellbeing',topics:['Obsessive thoughts & OCD'],keys:['ocd','obsessive','intrusive thoughts','compulsion']},
 {category:'trauma',topics:['Trauma & PTSD','Complex trauma','Abuse recovery'],keys:['trauma','traumatic','ptsd','abuse','survivor','violence','assault','crisis']},
 {category:'trauma',topics:['Addiction & recovery'],keys:['addiction','alcohol','dependency','substance','recovery']},
 {category:'families',topics:['Family conflict','Couples & relationships','Separation & divorce'],keys:['family','marriage','relationship','partner','couple','divorce','separation','arguments','conflict']},
 {category:'families',topics:['Parenting support','New parenthood','Carers & caring responsibilities'],keys:['parenting','parent','new baby','motherhood','fatherhood','carer','caregiving']},
 {category:'young',topics:['Childhood anxiety','Teenage wellbeing','Bullying & school difficulties','School-related stress'],keys:['child','children','kids','teen','teenager','young person','school','bully','bullied','bullying']},
 {category:'young',topics:['Young adult transitions'],keys:['university','college','young adult','student']},
 {category:'community',topics:['Culturally sensitive therapy','Refugee & displacement experiences','Identity & belonging'],keys:['refugee','migrant','immigrant','culture','cultural','community','belonging','identity','faith','religious']},
 {category:'community',topics:['Neurodivergent-affirming care','LGBTQ+ affirming care'],keys:['autism','autistic','adhd','neurodivergent','lgbtq','lgbt','inclusive','affirming']},
 {category:'community',topics:['Financial barriers to care'],keys:['afford','financial','cost','low income','poverty','money']}
];
const identifiers=[/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/,/(?:\+44|\b0)[\d\s()-]{9,}/,/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/i,/https?:\/\/|www\./i];
const normal=s=>s.toLocaleLowerCase('en-GB').normalize('NFKD').replace(/[^a-z0-9+]+/g,' ').trim();
const has=(text,t)=>(' '+text+' ').includes(' '+normal(t)+' ');
const stop=new Set('the and for with into from you they were have that your friend friends people someone something something about would want like therapy give giving help other others these those their them what where because some who how when just i we it he she my our this of to is are be in on at a an'.split(' '));
const all=window.TG_PROFILES||[];
function rank(text){const words=normal(text).split(' ').filter(w=>w.length>3&&!stop.has(w)),hit=rules.filter(rule=>rule.keys.some(k=>has(normal(text),k)));
 return all.map((p,i)=>{let score=0,topic=normal(p.topic),about=normal([p.title,p.topic,p.story].join(' '));for(const r of hit)if(p.category===r.category){score+=6;if(r.topics.some(t=>normal(t)===topic))score+=12}
 for(const w of words){if(has(topic,w))score+=5;else if(has(about,w))score+=2}return {p,i,score}}).sort((a,b)=>b.score-a.score||a.i-b.i)}
function card(p){const source=document.querySelector('#tgFundcaseStrip [data-profile-slug="'+p.slug+'"]');return source?.cloneNode(true)||null}
function show(text){result.hidden=false;const headline=$('tgMatchTitle'),help=$('tgMatchExplanation'),container=$('tgMatchCards');container.replaceChildren();
 if(identifiers.some(r=>r.test(text))){headline.textContent='Your privacy comes first.';help.textContent='We spotted possible identifying information, so we cleared your words without searching. Please try again with a broad topic only.';return}
 const scored=rank(text),confident=scored.length&&scored[0].score>=6;
 headline.textContent=confident?'We found a cause close to your heart.':'Let’s find a cause that matters to you.';
 help.textContent=confident?'These fictional profiles share broad themes with what you described. They are examples, not matched real patients.':'We could not confidently identify a particular theme, so here are some fictional examples to explore. Try mentioning bereavement, anxiety, family or young people.';
 for(const item of (confident?scored.filter(x=>x.score>0).slice(0,6):scored.slice(0,6))){const c=card(item.p);if(c)container.append(c)}
 result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
}
input.addEventListener('input',()=>{$('tgStoryCount').textContent=input.value.length+' / 600'});
go.addEventListener('click',()=>{const text=input.value.trim();input.value='';$('tgStoryCount').textContent='0 / 600';if(text.length<8){result.hidden=false;$('tgMatchTitle').textContent='A few words are enough.';$('tgMatchExplanation').textContent='Try a broad phrase such as “I would like to help someone after bereavement”. Nothing you write is stored.';$('tgMatchCards').replaceChildren();return}show(text)});
$('tgMatchTryExample')?.addEventListener('click',()=>{input.value='A close friend found counselling helpful after a loss. I would like to help others access therapy.';$('tgStoryCount').textContent=input.value.length+' / 600';input.focus()});
$('tgMatchClear')?.addEventListener('click',()=>{result.hidden=true;$('tgMatchCards').replaceChildren();input.value='';$('tgStoryCount').textContent='0 / 600';input.focus()});
})();
