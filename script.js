"use strict";
const gift=document.querySelector('#gift'),overlay=document.querySelector('#overlay'),modal=document.querySelector('.modal'),effects=document.querySelector('#effects'),audio=document.querySelector('#music'),musicBtn=document.querySelector('#musicBtn');
let opening=false,opened=false,muted=false,lastTap=0,previousFocus=null;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;const rand=(a,b)=>Math.random()*(b-a)+a;
function addEffect(cls,css,text='',ttl=1800){if(reduce)return;const el=document.createElement('span');el.className=cls;el.style.cssText=css;el.textContent=text;effects.append(el);setTimeout(()=>el.remove(),ttl)}
function burst(x=innerWidth/2,y=innerHeight/2,count=90){const colors=['#ffda70','#fa7ab5','#8fe9ff','#bda0ff','#ffffff','#ff8c67'];for(let i=0;i<count;i++){const angle=rand(0,Math.PI*2),distance=rand(65,Math.min(innerWidth,420));addEffect('particle',`--x:${x}px;--y:${y}px;--dx:${Math.cos(angle)*distance}px;--dy:${Math.sin(angle)*distance+90}px;--c:${colors[i%colors.length]};--s:${rand(5,12)}px;--r:${i%3===0?'50%':'2px'};--d:${rand(1.1,2.3)}s`, '',2600)}}
function floatBalloons(){for(let i=0;i<13;i++){addEffect('rising',`--x:${rand(3,95)}%;--s:${rand(22,43)}px;--d:${rand(4,8)}s`,'🎈',8500)}}
function fireworks(){for(let i=0;i<5;i++)setTimeout(()=>addEffect('firework',`--x:${rand(12,85)}%;--y:${rand(10,55)}%`,'✨',1100),i*250)}
function playMusic(){if(muted)return;audio.volume=.52;audio.play().catch(()=>{musicBtn.textContent='▶️ Play music'})}
function reveal(){showMemory(0);overlay.hidden=false;document.body.style.overflow='hidden';modal.classList.remove('reveal');void modal.offsetWidth;modal.classList.add('reveal');modal.focus();burst(innerWidth/2,innerHeight*.3,110);floatBalloons();fireworks()}
function openGift(){if(opening||opened)return;opening=true;previousFocus=document.activeElement;gift.classList.add('open');document.querySelector('#hint').textContent='✨ Your magical surprise is opening! ✨';playMusic();burst(innerWidth/2,innerHeight*.53,55);setTimeout(()=>{opened=true;opening=false;reveal()},reduce?50:850)}
// Pointerup works for touch, pen and mouse without synthetic-click duplication.
gift.addEventListener('pointerup',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;const now=performance.now();if(now-lastTap<550){lastTap=0;openGift()}else lastTap=now});
gift.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGift()}});
function close(){clearTimeout(memoryTimer);overlay.hidden=true;document.body.style.overflow='';audio.pause();audio.currentTime=0;gift.classList.remove('open');opening=false;opened=false;lastTap=0;document.querySelector('#hint').textContent='🎁 Double-Tap to Unlock Your Magical Birthday Surprise! ✨';document.querySelectorAll('.balloon').forEach(b=>b.classList.remove('popped'));resetBlessings();effects.replaceChildren();(previousFocus||gift).focus()}
document.querySelector('#close').addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)close();if(e.key==='Tab'&&!overlay.hidden){const focusables=[...modal.querySelectorAll('button:not([disabled])')];const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
document.querySelector('#replayBtn').addEventListener('click',()=>{audio.currentTime=0;playMusic();reveal();document.querySelectorAll('.balloon').forEach(b=>b.classList.remove('popped'));resetBlessings()});
musicBtn.addEventListener('click',()=>{muted=!muted;if(muted){audio.pause();musicBtn.textContent='🔇 Music off'}else{playMusic();musicBtn.textContent='🔊 Music on'}});
const diyaButton=document.querySelector('#diyaBtn');
const diyaStage=document.querySelector('#diyaStage');
const wishReveal=document.querySelector('#wishReveal');
const wishPrompt=document.querySelector('#wishPrompt');
let blessingsShown=false;
function showerPetals(){if(reduce)return;const symbols=['🌸','🌼','🌺','✨','💮'];for(let i=0;i<32;i++){setTimeout(()=>addEffect('blessing-petal',`--x:${rand(5,95)}%;--d:${rand(3.5,6)}s;--drift:${rand(-90,90)}px`,symbols[i%symbols.length],7000),i*85)}}
function resetBlessings(){blessingsShown=false;diyaStage.classList.remove('blessing-active');wishReveal.hidden=true;wishPrompt.textContent='🙏 Tap below to light up the celebration with blessings!';diyaButton.textContent='🪔 Shower Birthday Blessings'}
diyaButton.addEventListener('click',()=>{
 if(blessingsShown){resetBlessings();return}
 blessingsShown=true;diyaStage.classList.add('blessing-active');wishReveal.hidden=false;
 wishPrompt.textContent='🌸 Blessings, joy, and bright beginnings!';diyaButton.textContent='🔄 Celebrate Again';
 const r=diyaStage.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height*.45,65);showerPetals();fireworks();
});
document.querySelectorAll('.balloon').forEach(b=>b.addEventListener('click',()=>{if(b.classList.contains('popped'))return;const r=b.getBoundingClientRect();b.classList.add('popped');burst(r.left+r.width/2,r.top+r.height/2,25)}));

// Reveal the original picture first, then transition automatically to the birthday poster.
const memorySlides=[document.querySelector('#memoryOriginal'),document.querySelector('#memoryPoster')];
let memoryIndex=0,memoryTimer=null;
function showMemory(index,automatic=false){memoryIndex=(index+memorySlides.length)%memorySlides.length;memorySlides.forEach((el,i)=>{const active=i===memoryIndex;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active))});document.querySelectorAll('.memory-dot').forEach((dot,i)=>dot.classList.toggle('selected',i===memoryIndex));document.querySelector('#memoryProgress').textContent=memoryIndex===0?'📸 1 of 2 · Next: magical poster':'🎨 2 of 2 · Birthday magic!';clearTimeout(memoryTimer);if(memoryIndex===0){memoryTimer=setTimeout(()=>{if(!overlay.hidden){showMemory(1,true);burst(innerWidth/2,innerHeight*.34,45)}},4400)}else if(automatic){fireworks()}}
document.querySelector('#memoryNext').addEventListener('click',()=>showMemory(memoryIndex+1));
document.querySelector('#memoryPrev').addEventListener('click',()=>showMemory(memoryIndex-1));
document.querySelectorAll('.memory-dot').forEach((dot,i)=>dot.addEventListener('click',()=>showMemory(i)));
