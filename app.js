
const Q = window.WSET_QUESTIONS || [];
const state = JSON.parse(localStorage.getItem('wsetStateV6')||'{"stats":{}}');
function save(){localStorage.setItem('wsetStateV6',JSON.stringify(state));}
function qStat(id){return state.stats[id]||{seen:0,correct:0,wrong:0,streak:0,last:0};}
function weight(q){
  const s=qStat(q.id);
  let w=1;
  w += s.wrong*2.3;
  w /= (1+s.correct*0.6+Math.max(0,s.streak-1)*0.9);
  if(!s.seen) w*=2.4;
  if(s.last && Date.now()-s.last>1000*60*60*24*5) w*=1.35;
  return Math.max(0.05,w);
}
function weightedSample(pool,n){
  const copy=[...pool],out=[];
  while(copy.length && out.length<n){
    const ws=copy.map(weight), total=ws.reduce((a,b)=>a+b,0);
    let r=Math.random()*total, idx=0;
    for(;idx<copy.length;idx++){r-=ws[idx];if(r<=0)break;}
    out.push(copy.splice(Math.min(idx,copy.length-1),1)[0]);
  }
  return out;
}
function mockExam(){
  const plan={vineyard:5,winemaking:4,principal:19,regional:12,sparkling:6,service:4};
  let out=[];
  for(const [topic,n] of Object.entries(plan)){
    out.push(...weightedSample(Q.filter(q=>q.topic===topic),n));
  }
  return out.sort(()=>Math.random()-0.5);
}
let current=[],idx=0,score=0,answered=false,review=[];
const $=s=>document.querySelector(s);
function start(mode,topic='all',count=10){
  current=mode==='mock'?mockExam():weightedSample(topic==='all'?Q:Q.filter(q=>q.topic===topic),count);
  idx=0;score=0;review=[];
  $('#home').hidden=true;$('#results').hidden=true;$('#quiz').hidden=false;render();
}
function render(){
  const q=current[idx];answered=false;
  $('#progress').textContent=`${idx+1} / ${current.length}`;
  $('#bar').style.width=`${(idx/current.length)*100}%`;
  $('#qtopic').textContent=q.topic.toUpperCase();
  $('#qtext').textContent=q.question;
  const a=$('#answers');a.innerHTML='';
  q.answers.forEach((x,i)=>{
    const b=document.createElement('button');
    b.className='answer';b.textContent=`${String.fromCharCode(65+i)}. ${x}`;
    b.onclick=()=>choose(i);a.appendChild(b);
  });
  $('#feedback').hidden=true;$('#next').hidden=true;
}
function choose(i){
  if(answered)return;answered=true;
  const q=current[idx],ok=i===q.correct,s=qStat(q.id);
  s.seen++;s.last=Date.now();
  if(ok){s.correct++;s.streak++;score++;}else{s.wrong++;s.streak=0;}
  state.stats[q.id]=s;save();review.push({q,ok});
  [...document.querySelectorAll('.answer')].forEach((b,j)=>{
    b.disabled=true;
    if(j===q.correct)b.classList.add('correct');
    if(j===i&&!ok)b.classList.add('wrong');
  });
  $('#feedback').innerHTML=`<strong>${ok?'Correct':'Not quite'}</strong><div>${q.explanation}</div>`;
  $('#feedback').hidden=false;$('#next').hidden=false;
  $('#bar').style.width=`${((idx+1)/current.length)*100}%`;
}
$('#next').onclick=()=>{if(idx<current.length-1){idx++;render()}else finish()};
function finish(){
  $('#quiz').hidden=true;$('#results').hidden=false;
  const pct=Math.round(score/current.length*100);
  $('#score').textContent=`${pct}%`;
  $('#grade').textContent=pct>=85?'Distinction level':pct>=70?'Merit level':pct>=55?'Pass level':'More study needed';
  const missed=review.filter(x=>!x.ok);
  $('#review').innerHTML=missed.length?missed.map(x=>`<div class="review"><b>${x.q.question}</b><div>Correct: ${x.q.answers[x.q.correct]}</div><small>${x.q.explanation}</small></div>`).join(''):'<div class="review"><b>Perfect score.</b></div>';
}
document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>start(b.dataset.start,b.dataset.topic||'all',Number(b.dataset.count||10)));
$('#homeBtn').onclick=()=>{$('#results').hidden=true;$('#home').hidden=false};
$('#quit').onclick=()=>{$('#quiz').hidden=true;$('#home').hidden=false};
$('#seen').textContent=Object.keys(state.stats).length;
$('#wrongTotal').textContent=Object.values(state.stats).reduce((a,s)=>a+s.wrong,0);
