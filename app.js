
const Q=window.WSET_QUESTIONS||[];
const state=JSON.parse(localStorage.getItem('wset2State')||'{"stats":{}}');
const $=s=>document.querySelector(s);
function save(){localStorage.setItem('wset2State',JSON.stringify(state));}
function stat(id){return state.stats[id]||{seen:0,correct:0,wrong:0,streak:0,last:0};}
function weight(q){const s=stat(q.id);let w=1+s.wrong*2.5;w/=(1+s.correct*.7+Math.max(0,s.streak-1)*.9);if(!s.seen)w*=2.5;if(s.last&&Date.now()-s.last>432000000)w*=1.35;return Math.max(.06,w);}
function sample(pool,n){const a=[...pool],out=[];while(a.length&&out.length<n){const ws=a.map(weight),tot=ws.reduce((x,y)=>x+y,0);let r=Math.random()*tot,i=0;for(;i<a.length;i++){r-=ws[i];if(r<=0)break;}out.push(a.splice(Math.min(i,a.length-1),1)[0]);}return out;}
function mock(){const plan={vineyard:5,winemaking:4,principal:19,regional:12,sparkling:6,service:4};let out=[];for(const [t,n] of Object.entries(plan))out.push(...sample(Q.filter(q=>q.topic===t),n));return out.sort(()=>Math.random()-.5);}
let current=[],idx=0,score=0,answered=false,review=[];
function show(id){['home','quiz','results'].forEach(x=>$('#'+x).hidden=x!==id);}
function start(mode,topic,count){current=mode==='mock'?mock():sample(topic==='all'?Q:Q.filter(q=>q.topic===topic),count);idx=0;score=0;review=[];show('quiz');render();}
function render(){const q=current[idx];answered=false;$('#progress').textContent=`${idx+1} / ${current.length}`;$('#bar').style.width=`${idx/current.length*100}%`;$('#qtopic').textContent=q.topic.toUpperCase();$('#qtext').textContent=q.question;const box=$('#answers');box.innerHTML='';q.answers.forEach((a,i)=>{const b=document.createElement('button');b.className='answer';b.textContent=`${String.fromCharCode(65+i)}. ${a}`;b.onclick=()=>choose(i);box.appendChild(b)});$('#feedback').hidden=true;$('#next').hidden=true;}
function choose(i){if(answered)return;answered=true;const q=current[idx],ok=i===q.correct,s=stat(q.id);s.seen++;s.last=Date.now();if(ok){s.correct++;s.streak++;score++;}else{s.wrong++;s.streak=0;}state.stats[q.id]=s;save();review.push({q,ok,choice:i});document.querySelectorAll('.answer').forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add('correct');if(j===i&&!ok)b.classList.add('wrong')});$('#feedback').innerHTML=`<strong>${ok?'Correct':'Not quite'}</strong><div>${q.explanation}</div>`;$('#feedback').hidden=false;$('#next').hidden=false;$('#bar').style.width=`${(idx+1)/current.length*100}%`;}
$('#next').onclick=()=>{if(idx<current.length-1){idx++;render()}else finish()};
function finish(){show('results');const pct=Math.round(score/current.length*100);$('#score').textContent=`${pct}%`;$('#grade').textContent=pct>=85?'Distinction level':pct>=70?'Merit level':pct>=55?'Pass level':'More study needed';const missed=review.filter(x=>!x.ok);$('#review').innerHTML=missed.length?missed.map(x=>`<div class="review"><b>${x.q.question}</b><div>Correct answer: ${x.q.answers[x.q.correct]}</div><small>${x.q.explanation}</small></div>`).join(''):'<div class="review"><b>Perfect score.</b></div>';dashboard();}
document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>start(b.dataset.start,b.dataset.topic||'all',Number(b.dataset.count||10)));
$('#homeBtn').onclick=()=>show('home');$('#quit').onclick=()=>show('home');
function dashboard(){const vals=Object.values(state.stats);$('#seen').textContent=Object.keys(state.stats).length;$('#wrongTotal').textContent=vals.reduce((a,s)=>a+s.wrong,0);$('#accuracy').textContent=vals.length?Math.round(vals.reduce((a,s)=>a+s.correct,0)/Math.max(1,vals.reduce((a,s)=>a+s.correct+s.wrong,0))*100)+'%':'—';}
dashboard();
