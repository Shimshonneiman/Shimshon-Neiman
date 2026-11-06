/* TheraGift: fictional public profile cards, no patient data. */
(()=>{'use strict';const data=window.TG_PROFILES||[];const strip=document.getElementById('tgFundcaseStrip');if(!strip)return;
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function turnIntoLink(card){if(card.tagName==='A')return card;const title=card.querySelector('h3')?.textContent||'';const match=data.find(p=>p.slug===slugify(title));if(!match)return card;
 const a=document.createElement('a');for(const attr of card.attributes){if(!['tabindex','role','aria-label'].includes(attr.name))a.setAttribute(attr.name,attr.value)}
 a.href='profile.html?case='+encodeURIComponent(match.slug);a.dataset.profileSlug=match.slug;a.setAttribute('aria-label','Read fictional funding profile: '+match.title);
 while(card.firstChild)a.append(card.firstChild);card.replaceWith(a);return a}
for(const card of [...strip.querySelectorAll('.tg-fundcase')])turnIntoLink(card);
const amount=n=>'£'+n.toLocaleString('en-GB');
for(const p of data){if(strip.querySelector('[data-profile-slug="'+p.slug+'"]'))continue;
 const a=document.createElement('a');a.className='tg-fundcase';a.href='profile.html?case='+encodeURIComponent(p.slug);a.dataset.profileSlug=p.slug;a.dataset.tgCategory=p.category;a.dataset.tgTopic=p.topic;a.setAttribute('aria-label','Read fictional funding profile: '+p.title);
 const art=document.createElement('div');art.className='tg-fundcase-art '+(['tone-sage','tone-ivory','tone-honey'][data.indexOf(p)%3]);const tag=document.createElement('span');tag.className='tg-fundcase-topic';tag.textContent=p.topic;const mark=document.createElement('span');mark.className='tg-fundcase-star';mark.textContent='✦';art.append(tag,mark);
 const info=document.createElement('div');info.className='tg-fundcase-info';const demo=document.createElement('small');demo.textContent='FICTIONAL EXAMPLE';const title=document.createElement('h3');title.textContent=p.title;const excerpt=document.createElement('p');excerpt.textContent=p.story;const track=document.createElement('div');track.className='tg-fundcase-track';const progress=document.createElement('span');progress.style.width=Math.floor(100*p.raised/p.target)+'%';track.append(progress);
 const amounts=document.createElement('div');amounts.className='tg-fundcase-figures';const raised=document.createElement('strong');raised.textContent=amount(p.raised)+' raised';const target=document.createElement('span');target.textContent='of '+amount(p.target);amounts.append(raised,target);
 const act=document.createElement('span');act.className='tg-fundcase-action';act.textContent='Read the story ↗';info.append(demo,title,excerpt,track,amounts,act);a.append(art,info);strip.append(a);
}
})();
