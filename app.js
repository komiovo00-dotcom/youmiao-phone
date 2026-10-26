'use strict';

const $=s=>document.querySelector(s);
const SCREEN=$('#screen'),APP=$('#appL'),HOME=$('#homeL'),LOCK=$('#lockL'),OV=$('#ov'),PLAYER=$('#player');
const MAIN_CHAT='周湘';
function A(p){return (window.__ASSET&&window.__ASSET[p])||p}
const base=Date.now();let timeOffset=0;
const elapsed=()=>(Date.now()-base)/1000+timeOffset;


let view='lock',curDark=true,SC=1,lastRect=null,animTok=0,firstOpen=true,pendingOpen=null;
let pincode='',noteId=0,selectedDay=19,calMonth=10,chatId='周湘',videoIndex=0,mailId=0,missOnly=false,safSearch=false;
let unread={'小米汽车-顾问':2,'宠物医院':1};
let zhouUnread=0,todayChat=(typeof TODAY_HISTORY!=='undefined'?TODAY_HISTORY.map(x=>x.slice()):[]),incoming=0,replyStage=0,lineIdx=0,typing=false,pendingText='',replyBusy=false;
let alarmStates=Array(2).fill(true),readMail=new Set(),nowSong=-1,flashOn=false;
const ALARMS=[{h:9,m:0,label:'每天'},{h:15,m:0,label:'每天'}];
let callState='',phoneDone=false,declined=0,callStart=0,callPrev='',nextCallAt=0,ringIv=null,ringTo=null,capIdx=-1,extraCalls=[];
let askedCall=false,callName='周湘',callTimers=[],busySent=false,declineSent=false,rbIv=null;
let userStage=0,callConfirmed=false,callBusySent=false;
let chatStage='pre',autoMsgDone=false,callTriggered=false,callBranch='',doneKeys={};
let lockNotes=[{title:'🐱',body:'你几点回来呀',app:'wechat',time:t('now')}];


const pad=n=>String(n).padStart(2,'0');
const esc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const clock12=()=>{const d=new Date();return((d.getHours()%12)||12)+':'+pad(d.getMinutes())};
function ampm(min){return fmtTime(min)}
const nowMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
const nowAmpm=()=>{const last=todayChat[todayChat.length-1];if(last&&last[2]&&/^\d{2}:\d{2}$/.test(last[2])){const [h,m]=last[2].split(':').map(Number);return fmtTime(h*60+m+1)}return fmtTime(22*60+41+todayChat.filter(x=>x[1]!=='date').length)};
function relRect(el){const s=SCREEN.getBoundingClientRect(),r=el.getBoundingClientRect();return{x:(r.left-s.left)/SC,y:(r.top-s.top)/SC,w:r.width/SC,h:r.height/SC}}
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const t_=t;const T={duration:460,easing:'cubic-bezier(.32,.72,0,1)'};
function devRadius(){return document.getElementById('phone').classList.contains('mob')?0:56}


const g=(p,o='')=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${o}>${p}</svg>`;
const G={
 chevL:`<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg>`,
 chevR:`<svg class="chev" viewBox="0 0 8 13"><path d="m1.5 1.5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 chevRb:g('<path d="m9 5 7 7-7 7"/>'),chevLb:g('<path d="m15 5-7 7 7 7"/>'),
 search:g('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
 plus:g('<path d="M12 5v14M5 12h14"/>'),
 dots:g('<circle cx="12" cy="12" r="9.2"/><circle cx="8" cy="12" r=".8" fill="currentColor"/><circle cx="12" cy="12" r=".8" fill="currentColor"/><circle cx="16" cy="12" r=".8" fill="currentColor"/>'),
 dotsH:g('<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>'),
 menu:g('<path d="M4 7h16M4 12h16M4 17h16"/>'),
 gear:g('<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8"/><circle cx="12" cy="12" r="6.4"/>'),
 person:g('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'),
 chat:g('<path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/>'),
 chatPlus:g('<path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/><path d="M12 8.5v5M9.5 11h5"/>'),
 openchat:g('<circle cx="12" cy="12" r="8.5"/><path d="M8 12.5c1 1.6 2.4 2.4 4 2.4s3-.8 4-2.4"/>'),
 bag:g('<path d="M5 8h14l-1 12H6Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
 clock:g('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
 star:g('<path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/>'),
 contacts:g('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="9.5" r="3"/><path d="M6.8 18c.9-2.4 2.9-3.6 5.2-3.6s4.3 1.2 5.2 3.6"/>'),
 keypad:g('<g fill="currentColor" stroke="none"><circle cx="6" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="18" cy="5" r="1.7"/><circle cx="6" cy="11" r="1.7"/><circle cx="12" cy="11" r="1.7"/><circle cx="18" cy="11" r="1.7"/><circle cx="6" cy="17" r="1.7"/><circle cx="12" cy="17" r="1.7"/><circle cx="18" cy="17" r="1.7"/><circle cx="12" cy="22" r="1.5"/></g>'),
 voicemail:g('<circle cx="6.5" cy="12" r="3.5"/><circle cx="17.5" cy="12" r="3.5"/><path d="M6.5 15.5h11"/>'),
 info:g('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".7" fill="currentColor"/>'),
 compose:g('<path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z"/>'),
 filter:g('<circle cx="12" cy="12" r="9"/><path d="M8 10h8M9.5 13h5M11 16h2"/>'),
 share:g('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/>'),
 heart:g('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>'),
 trash:g('<path d="M5 7h14M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>'),
 book:g('<path d="M4 5.5C6 4.5 9 4.5 12 6c3-1.5 6-1.5 8-.5V19c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5Z"/><path d="M12 6v13.5"/>'),
 tabs:g('<rect x="4" y="4" width="11" height="11" rx="2"/><path d="M9 20h9a2 2 0 0 0 2-2V9"/>'),
 mic:g('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
 globe:g('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.8 3.5 5.8 3.5 9s-1 6.2-3.5 9c-2.5-2.8-3.5-5.8-3.5-9s1-6.2 3.5-9Z"/>'),
 smile:g('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/><circle cx="9" cy="10" r=".9" fill="currentColor"/><circle cx="15" cy="10" r=".9" fill="currentColor"/>'),
 plusSq:g('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8v8M8 12h8"/>'),
 arrowUp:g('<path d="M12 19V5M6 11l6-6 6 6"/>'),
 home:g('<path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4Z"/>'),
 reels:g('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M3.5 8.5h17M9 3.5l2.5 5M14.5 3.5 17 8.5"/><path d="m10 12 5 2.8-5 2.8Z"/>'),
 bell:g('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
 send:g('<path d="M21 3 10 14"/><path d="M21 3 14.5 21l-4.5-7-7-4.5Z"/>'),
 comment:g('<path d="M12 3.5a8.5 8.5 0 1 0 4.3 15.8l4.2 1.2-1.2-4.2A8.5 8.5 0 0 0 12 3.5Z"/>'),
 grid:g('<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>'),
 tag:g('<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><circle cx="12" cy="10" r="3"/><path d="M7.5 18c.9-2 2.5-3 4.5-3s3.6 1 4.5 3"/>'),
 bookmark:g('<path d="M6 3.5h12v17l-6-4-6 4Z"/>'),
 camera:g('<path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4Z"/><circle cx="12" cy="13" r="3.5"/>'),
 flash:g('<path d="M8.5 3h7l-1 5h-5Z"/><path d="M9.5 8h5v11a2.5 2.5 0 0 1-5 0Z"/><path d="M12 11.5v2.5"/>'),
 photo:g('<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>'),
 video:g('<rect x="3" y="6.5" width="13" height="11" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>'),
 list:g('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".9" fill="currentColor"/><circle cx="4.5" cy="12" r=".9" fill="currentColor"/><circle cx="4.5" cy="18" r=".9" fill="currentColor"/>'),
 inbox:g('<path d="M3.5 13.5 6 5h12l2.5 8.5V19h-17Z"/><path d="M3.5 13.5H9a3 3 0 0 0 6 0h5.5"/>'),
 check:g('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.7L16 9.5"/>'),
 pen:g('<path d="m14.5 5.5 4 4L8 20H4v-4Z"/>'),
 alarm:g('<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.5M4.5 5 7 3M19.5 5 17 3"/>'),
 stopwatch:g('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M10 2.5h4M12 2.5V6"/>'),
 timer:g('<circle cx="12" cy="12" r="8.5"/><path d="M12 12 8 8"/>'),
 musicNote:'<svg viewBox="0 0 24 24"><path d="M17 3v11.5a3 3 0 1 1-2-2.8V7.3l-6 1.4v8a3 3 0 1 1-2-2.8V5.5Z"/></svg>',
 playF:'<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5Z"/></svg>',
 pauseF:'<svg viewBox="0 0 24 24"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',
 fwdF:'<svg viewBox="0 0 32 24"><path d="M2 4.5v15l12-7.5Z"/><path d="M15 4.5v15l12-7.5Z"/></svg>',
 bwdF:'<svg viewBox="0 0 32 24"><path d="M30 4.5v15l-12-7.5Z"/><path d="M17 4.5v15L5 12Z"/></svg>',
 handset:'<svg viewBox="0 0 24 24"><path d="M6.6 3.2c.6-.3 1.4-.1 1.8.5l1.9 3c.4.6.3 1.4-.2 1.9l-1.4 1.3a12.4 12.4 0 0 0 5.4 5.4l1.3-1.4c.5-.5 1.3-.6 1.9-.2l3 1.9c.6.4.8 1.2.5 1.8l-.9 1.9c-.5 1-1.6 1.6-2.7 1.4C10 19.6 4.4 14 3.3 6.8c-.2-1.1.4-2.2 1.4-2.7Z"/></svg>',
 speaker:'<svg viewBox="0 0 24 24"><path d="M3.5 9h4l5-4.5v15l-5-4.5h-4Z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
 muteF:'<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M4 4l16 16" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
 videoF:'<svg viewBox="0 0 24 24"><rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="m16.5 10.5 5-3v9l-5-3Z"/></svg>',
 plusF:'<svg viewBox="0 0 24 24"><path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7Z"/></svg>',
 keypadF:'<svg viewBox="0 0 24 24"><g><circle cx="6" cy="5" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="18" cy="5" r="1.8"/><circle cx="6" cy="11" r="1.8"/><circle cx="12" cy="11" r="1.8"/><circle cx="18" cy="11" r="1.8"/><circle cx="6" cy="17" r="1.8"/><circle cx="12" cy="17" r="1.8"/><circle cx="18" cy="17" r="1.8"/></g></svg>',
 bellF:'<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><circle cx="12" cy="20.5" r="2"/></svg>',
 msgF:'<svg viewBox="0 0 24 24"><path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.5 4.5 3.9 5.8L6 20.5l4-2.4c.6.1 1.3.1 2 .1 5 0 9-3.1 9-7.1S17 4 12 4Z"/></svg>',
 shift:'<svg viewBox="0 0 24 24" width="22" fill="none" stroke="#000" stroke-width="1.7" stroke-linejoin="round"><path d="M12 4 4 12.5h4.5V20h7v-7.5H20Z"/></svg>',
 bksp:'<svg viewBox="0 0 26 20" width="26" fill="none" stroke="#000" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M8 3h15v14H8l-6-7Z"/><path d="m12 7 6 6M18 7l-6 6"/></svg>',
 sil:'<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4.3" fill="#fff"/><path d="M3.8 22c.6-4.4 4-7 8.2-7s7.6 2.6 8.2 7Z" fill="#fff"/></svg>',
 calSm:g('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
 sun:'<svg viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="5" fill="#ffd60a"/><g stroke="#ffd60a" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>',
 moon:'<svg viewBox="0 0 24 24" width="24"><path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5Z" fill="#fff"/></svg>',
 pcloud:'<svg viewBox="0 0 24 24" width="24"><circle cx="9" cy="9" r="4.2" fill="#ffd60a"/><path d="M8 19.5h9.5a3.5 3.5 0 0 0 .3-7A5 5 0 0 0 8.4 11 4.3 4.3 0 0 0 8 19.5Z" fill="#fff"/></svg>',
 cloud:'<svg viewBox="0 0 24 24" width="24"><path d="M7 19h10.5a4 4 0 0 0 .4-8A5.6 5.6 0 0 0 7.2 9.2 5 5 0 0 0 7 19Z" fill="#fff"/></svg>',
};
const APPS={};
function appIcon(id){
 const L=(a,b,c,d)=>`<linearGradient id="${a}" x1="0" y1="${d?1:0}" x2="${d?1:0}" y2="${d?0:1}"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
 const W=(defs,body)=>`<svg viewBox="0 0 60 60"><defs>${defs}</defs>${body}</svg>`;
 switch(id){
 case'xhs':return W('',`<rect width="60" height="60" fill="#ff2442"/><text x="30" y="25.5" text-anchor="middle" font-size="14.5" font-weight="700" fill="#fff" font-family="PingFang SC,Microsoft YaHei,sans-serif">小红书</text>`);
 case'douyin':return W('',`<rect width="60" height="60" fill="#010101"/><g><path d="M38 12.5v23.2a9.6 9.6 0 1 1-4.4-8.1V12.5Z" fill="#25f4ee"/><path d="M35.2 9.6v23.2a9.6 9.6 0 1 1-4.4-8.1V9.6Z" fill="#fe2c55"/><path d="M33 8.2v23.4a8.6 8.6 0 1 1-4-7.4V8.2Z" fill="#fff"/><rect x="40.5" y="8.2" width="2.2" height="26.4" rx="1.1" fill="#fff"/></g>`);

case'photos':{let p='';for(let i=0;i<10;i++)p+=`<ellipse cx="30" cy="18.2" rx="4.4" ry="10.5" fill="#fff" transform="rotate(${i*36} 30 30)"/>`;return W(L('gp','#9bdcff','#d8f1ff'),`<rect width="60" height="60" fill="url(#gp)"/>${p}<circle cx="30" cy="30" r="7.2" fill="#ffc83d"/><circle cx="30" cy="30" r="7.2" fill="none" stroke="#f0a500" stroke-width="1"/>`)}
 case'mail':return W(L('gm','#3fb0ff','#0a6cf5'),`<rect width="60" height="60" fill="url(#gm)"/><rect x="11.5" y="18" width="37" height="25" rx="3.5" fill="#fff"/><path d="M12.5 20 30 32.5 47.5 20" fill="none" stroke="#1676f3" stroke-width="2.4" stroke-linejoin="round"/>`);
 case'calendar':return W('',`<rect width="60" height="60" fill="#fff"/><text x="30" y="17.5" text-anchor="middle" font-size="9" font-weight="600" fill="#ff3b30" font-family="PingFang SC,Microsoft YaHei,sans-serif">${wdLong(STORY.y,STORY.m,STORY.d)}</text><text x="30" y="47" text-anchor="middle" font-size="31" font-weight="300" fill="#111" font-family="PingFang SC,Microsoft YaHei,sans-serif">${STORY.d}</text>`);

case'clock':{const d=new Date(),h=d.getHours()%12,m=d.getMinutes();let t='';for(let i=0;i<12;i++)t+=`<path d="M30 8.5v${i%3?2.6:3.8}" stroke="#111" stroke-width="${i%3?1:1.6}" transform="rotate(${i*30} 30 30)"/>`;
  return W('',`<rect width="60" height="60" fill="#000"/><circle cx="30" cy="30" r="24" fill="#fff"/>${t}<path d="M30 30V17" stroke="#111" stroke-width="2.6" stroke-linecap="round" transform="rotate(${h*30+m/2} 30 30)"/><path d="M30 30V11.5" stroke="#111" stroke-width="1.8" stroke-linecap="round" transform="rotate(${m*6} 30 30)"/><path d="M30 34V11" stroke="#ff9500" stroke-width="1" transform="rotate(${(m*6+90)%360} 30 30)"/><circle cx="30" cy="30" r="1.8" fill="#ff9500"/>`)}
 case'notes':return W(L('gn','#ffe27a','#ffc933'),`<rect width="60" height="60" fill="#fff"/><rect width="60" height="17" fill="url(#gn)"/><g stroke="#d9d9de" stroke-width="1.2"><path d="M8 27h44M8 35h44M8 43h44M8 51h44"/></g><g fill="#cfcfd4"><circle cx="10" cy="17" r=".9"/><circle cx="14" cy="17" r=".9"/><circle cx="18" cy="17" r=".9"/><circle cx="22" cy="17" r=".9"/><circle cx="26" cy="17" r=".9"/><circle cx="30" cy="17" r=".9"/><circle cx="34" cy="17" r=".9"/><circle cx="38" cy="17" r=".9"/><circle cx="42" cy="17" r=".9"/><circle cx="46" cy="17" r=".9"/><circle cx="50" cy="17" r=".9"/></g>`);
 case'weather':return W(L('gw','#53b5ff','#1f6fe0'),`<rect width="60" height="60" fill="url(#gw)"/><circle cx="23" cy="23" r="9.5" fill="#ffd84a"/><path d="M19 45h21.5a7.5 7.5 0 0 0 .6-15 10 10 0 0 0-19.2 3.2A6 6 0 0 0 19 45Z" fill="#fff"/>`);
 case'settings':return W(L('gs','#a7adb6','#6d727b'),`<rect width="60" height="60" fill="url(#gs)"/><circle cx="30" cy="30" r="17" fill="none" stroke="#e9eaee" stroke-width="7" stroke-dasharray="4.4 4.5"/><circle cx="30" cy="30" r="14" fill="#878c95" stroke="#e9eaee" stroke-width="3.2"/><circle cx="30" cy="30" r="5.5" fill="none" stroke="#e9eaee" stroke-width="3"/><g stroke="#e9eaee" stroke-width="2.4"><path d="M30 17.5v7M30 35.5v7M17.5 30h7M35.5 30h7"/></g>`);
 case'phone':return W(L('gph','#65f38f','#28c253'),`<rect width="60" height="60" fill="url(#gph)"/><g transform="translate(12 12) scale(1.5)" fill="#fff">${G.handset.replace(/<\/?svg[^>]*>/g,'')}</g>`);
 case'safari':return W(L('gsa','#3aa8ff','#0f5fe0'),`<rect width="60" height="60" fill="#fff"/><circle cx="30" cy="30" r="21" fill="url(#gsa)"/><g fill="none" stroke="#fff" stroke-width="1.6" opacity=".95"><ellipse cx="30" cy="30" rx="8.5" ry="21"/><path d="M9 30h42M12 19.5h36M12 40.5h36M30 9v42"/></g>`);
 case'wechat':return W(L('gwx','#3ddc7a','#07c160'),`<rect width="60" height="60" fill="url(#gwx)"/><g fill="#fff"><path d="M25 14c-9.4 0-17 5.9-17 13.2 0 4.6 3.1 8.6 7.9 10.9l-1.7 6.2c-.2.6.5 1.1 1 .7l7.3-4.8c.8.1 1.7.1 2.5.1 9.4 0 17-5.9 17-13.2S34.4 14 25 14Z"/><g fill="#07c160"><circle cx="19.5" cy="27.2" r="2.2"/><circle cx="25" cy="27.2" r="2.2"/><circle cx="30.5" cy="27.2" r="2.2"/></g></g><g fill="#fff" opacity=".92"><path d="M45 26.5c3.6 1.6 6 4.3 6 7.4 0 2.7-1.9 5.1-4.8 6.5l1 3.9c.2.6-.4 1-.9.6l-4.6-3c-.5.1-1.1.1-1.7.1-2.1 0-4-.5-5.6-1.4 5.5-.9 9.6-4.3 9.6-8.2 0-2.1-1.1-4.1-2.9-5.9Z"/></g>`);
case'recipe':return W(L('gr','#ffd36b','#ff9f0a'),`<rect width="60" height="60" fill="url(#gr)"/><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M21 13v13a5 5 0 0 0 10 0V13"/><path d="M26 30v17"/><path d="M39 13c-3 2-4 4.5-4 8 0 2.6 1.3 4.5 3.5 4.5S42 23.6 42 21c0-3.5-1-6-3-8Z"/><path d="M39.5 28v19"/></g>`);

case'music':return W(L('gmu','#ff6f86','#fa2b47'),`<rect width="60" height="60" fill="url(#gmu)"/><g transform="translate(11 10) scale(1.55)" fill="#fff">${G.musicNote.replace(/<\/?svg[^>]*>/g,'')}</g>`);
 case'maps':return W('',`<rect width="60" height="60" fill="#e9f2df"/><path d="M0 38 60 22v12L0 50Z" fill="#fff"/><path d="M24 0h9L27 60h-9Z" fill="#ffd966"/><path d="M0 12c14 6 30-4 60 6V0H0Z" fill="#bfe3a5"/><path d="M42 60c0-8 10-10 18-12v12Z" fill="#9fd0f5"/><path d="M40 14a8 8 0 0 0-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 0 0-8-8Z" fill="#ff3b30"/><circle cx="40" cy="22" r="3" fill="#fff"/>`);
 case'rem':return W('',`<rect width="60" height="60" fill="#fff"/><circle cx="16" cy="19" r="4.5" fill="#007aff"/><circle cx="16" cy="31" r="4.5" fill="#ff3b30"/><circle cx="16" cy="43" r="4.5" fill="#ff9500"/><g stroke="#d6d6db" stroke-width="2"><path d="M25 19h24M25 31h24M25 43h24"/></g>`);
 }return''}


let AC=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f,t0,dur,vol=.12,type='sine'){const a=ac();if(!a)return;const t=a.currentTime+t0,o=a.createOscillator(),gn=a.createGain();o.type=type;o.frequency.value=f;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(vol,t+.008);gn.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(gn).connect(a.destination);o.start(t);o.stop(t+dur+.05)}
function sfx(k){if(k==='key')tone(2400,0,.025,.035,'triangle');else if(k==='msg'){tone(1046,0,.22,.09);tone(1397,.1,.32,.09)}else if(k==='send'){tone(620,0,.07,.05);tone(930,.05,.09,.05)}else if(k==='unlock'){tone(1300,0,.05,.04,'triangle');tone(1700,.04,.05,.03,'triangle')}else if(k==='lock')tone(500,0,.06,.05,'triangle')}
function ringOnce(){[[784,0],[988,.2],[1175,.4],[988,.6],[784,1.0],[988,1.2],[1175,1.4],[1319,1.6]].forEach(([f,t])=>{tone(f,t,.35,.11);tone(f*2,t,.18,.03)})}
document.addEventListener('pointerdown',()=>ac(),{once:true});


function setStatus(dark){curDark=!!dark;$('#sb').classList.toggle('light',curDark);$('#hb').classList.toggle('light',curDark)}
const ART=[A('media/cover_01.jpg'),A('media/cover_02.jpg')];
const ARTIST=['杨丞琳','杨丞琳'];
function updateIsland(){typeof updateCrumb==='function'&&updateCrumb();const on=nowSong>=0&&!PLAYER.paused&&!['music','lock','pin'].includes(view)&&!OV.querySelector('.np,.call,.viewer');const il=$('#island');il.classList.toggle('act',on);if(on){const a=ART[nowSong];il.querySelector('.ia').style.backgroundImage=a?`url(${a})`:'linear-gradient(135deg,#ff9a9e,#fa2d48)'}}


function ncardHTML(n){const ic=n.app==='wechat'?`<div class="ni" style="position:relative;overflow:visible"><img src="${A('media/avatar_zhouxiang.jpg')}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;display:block"><span style="position:absolute;right:-4px;bottom:-4px;width:18px;height:18px;border-radius:5px;overflow:hidden;border:1.5px solid rgba(255,255,255,.9)">${appIcon('wechat')}</span></div>`:`<div class="ni">${appIcon(n.app)}</div>`;
 return `${ic}<div class="nt"><div class="nh"><span>${esc(n.title)}</span><small>${n.time}</small></div><div class="nb">${esc(n.body)}</div></div>`}
function renderLock(){
 $('#lkc').innerHTML=`<div class="lk-date">${fmtLockDate()}</div><div class="lk-time" id="lkt">${clock12()}</div>
 <div class="lk-notes">${lockNotes.map((n,i)=>`<button class="ncard" data-i="${i}" onclick="lockNoteTap(${i},event)">${ncardHTML(n)}</button>`).join('')}</div>
 <button class="lk-btn" style="left:46px;${flashOn?'background:#fff;color:#000':''}" onclick="event.stopPropagation();flashOn=!flashOn;vib(15);renderLock()">${G.flash.replace('<svg','<svg width="24" height="24" style="color:'+(flashOn?'#000':'#fff')+'"')}</button>
 <button class="lk-btn" style="right:46px" onclick="event.stopPropagation();vib(15);this.animate([{transform:'scale(1.2)'},{transform:'none'}],250)">${G.camera.replace('<svg','<svg width="24" height="24" style="color:#fff"')}</button>
 <div class="lk-hint">${t('swipeUp')}</div>`}
function openLangSheet(){vib(10);const d=document.createElement('div');d.id='langSheet';
 d.innerHTML=`<div class="ls-g"><div class="ls-h">语言</div>${(window.LANGS||[]).map(l=>`<button class="${l[0]===LANG?'on':''}" data-l="${l[0]}">${l[1]}${l[0]===LANG?' ✓':''}</button>`).join('')}</div><button class="ls-c">${t('cancel')}</button>`;
 const close=()=>{d.animate([{opacity:1},{opacity:0}],{duration:200}).onfinish=()=>d.remove()};
 d.onclick=e=>{e.stopPropagation();const b=e.target.closest('[data-l]');if(b){if(b.dataset.l===LANG)return close();setLang(b.dataset.l);return}if(e.target===d||e.target.closest('.ls-c'))close()};
 d.addEventListener('pointerdown',e=>e.stopPropagation());
 $('#phone').appendChild(d);d.animate([{opacity:0},{opacity:1}],{duration:200});d.querySelector('.ls-g').animate([{transform:'translateY(60px)'},{transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.9,.25,1)'})}
function lockNoteTap(i,e){e.stopPropagation();if(lockNotes[i].app==='wechat')pendingOpen='chat';goPin()}
(function lockDrag(){const el=$('#lkc');let y0=null,dy=0,moved=false;
 el.addEventListener('pointerdown',e=>{if(view!=='lock'||e.target.closest('button'))return;y0=e.clientY;dy=0;moved=false;el.setPointerCapture(e.pointerId)});
 el.addEventListener('pointermove',e=>{if(y0===null)return;dy=Math.min(0,(e.clientY-y0)/SC);if(Math.abs(dy)>6)moved=true;el.style.transform=`translateY(${dy}px)`;el.style.opacity=1+dy/500;$('#wall').style.filter=`blur(${Math.min(24,-dy/8)}px) brightness(${1-Math.min(.38,-dy/700)})`});
 el.addEventListener('pointerup',e=>{if(y0===null)return;const d=dy;y0=null;$('#wall').style.filter='';
  if(d<-70||!moved&&!e.target.closest('button')){goPin(d)}else{el.animate([{transform:`translateY(${d}px)`,opacity:1+d/500},{transform:'none',opacity:1}],{duration:350,easing:'cubic-bezier(.2,1.3,.4,1)'});el.style.transform='';el.style.opacity=''}});
})();
function goPin(fromDy=0){view='pin';pincode='';const lk=$('#lkc');lk.animate([{transform:`translateY(${fromDy}px)`,opacity:Math.max(0,1+fromDy/500)},{transform:'translateY(-120px)',opacity:0}],{duration:380,easing:'cubic-bezier(.3,.7,.2,1)',fill:'forwards'});
 lk.style.transform='';lk.style.opacity='';lk.style.pointerEvents='none';$('#wall').classList.add('dim');renderPin();const p=$('#pinL');p.style.display='flex';p.animate([{opacity:0,transform:'translateY(40px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.9,.25,1)'})}
const PL=['','ABC','DEF','GHI','JKL','MNO','PQRS','TUV','WXYZ'];
function renderPin(){$('#pinL').innerHTML=`<div class="pt">${t('enterPass')}</div><div class="lk-pin-hint">${t('hintPass')}</div><div class="pdots" id="pdots">${[0,1,2,3].map(i=>`<i class="${i<pincode.length?'on':''}"></i>`).join('')}</div>
 <div class="pkeys">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="pk" onpointerdown="pinPress('${n}',this)"><b>${n}</b><small>${PL[n-1]}</small></button>`).join('')}<span></span><button class="pk" onpointerdown="pinPress('0',this)"><b>0</b><small></small></button><span></span></div>
 <div class="pbot"><button onclick="vib(10)">${t('emergency')}</button><button id="pcancel" onclick="pinCancelOrDel()">${pincode?t('delete'):t('cancel')}</button></div>`}
function pinDots(){$('#pdots').innerHTML=[0,1,2,3].map(i=>`<i class="${i<pincode.length?'on':''}"></i>`).join('');$('#pcancel').textContent=pincode?t('delete'):t('cancel')}
function pinPress(n,el){if(pincode.length>=4)return;el.classList.add('dn');setTimeout(()=>el.classList.remove('dn'),90);sfx('key');vib(8);pincode+=n;pinDots();
 if(pincode.length===4){if(pincode==='0805'){setTimeout(unlock,140)}else{setTimeout(()=>{const d=$('#pdots');d.classList.remove('shake');void d.offsetWidth;d.classList.add('shake');vib([60,40,60]);setTimeout(()=>{pincode='';pinDots()},420)},120)}}}
function pinCancelOrDel(){if(pincode){pincode=pincode.slice(0,-1);pinDots();return}pinCancel()}
function pinCancel(){view='lock';const p=$('#pinL');p.animate([{opacity:1},{opacity:0,transform:'translateY(30px)'}],{duration:300}).onfinish=()=>p.style.display='none';
 const lk=$('#lkc');lk.getAnimations().forEach(a=>a.cancel());lk.style.pointerEvents='';lk.animate([{transform:'translateY(-120px)',opacity:0},{transform:'none',opacity:1}],{duration:450,easing:'cubic-bezier(.2,.9,.25,1)'});$('#wall').classList.remove('dim')}
function unlock(){sfx('unlock');view='home';unlocked=true;saveState();$('#wall').classList.remove('dim');
 LOCK.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish=()=>{LOCK.style.visibility='hidden';$('#pinL').style.display='none';$('#lkc').getAnimations().forEach(a=>a.cancel());$('#lkc').style.pointerEvents=''};
 renderHome();HOME.style.visibility='visible';HOME.animate([{transform:'scale(1.18)',opacity:0},{transform:'none',opacity:1}],{duration:560,easing:'cubic-bezier(.2,.9,.22,1)'});
 [...HOME.querySelectorAll('.app,.widget')].forEach((el,i)=>el.animate([{transform:'scale(.7)',opacity:0},{transform:'none',opacity:1}],{duration:520,delay:30+i*14,easing:'cubic-bezier(.2,1.1,.3,1)',fill:'backwards'}));
 setStatus(true);if(pendingOpen){pendingOpen=null;setTimeout(()=>{chatId='周湘';openApp('chat',HOME.querySelector('.app[data-app="wechat"] .icon'))},520)}}


function badgeOf(id){if(id==='phone')return 1+declined;if(id==='mail')return[0,1].filter(i=>!readMail.has(i)).length;if(id==='wechat')return Object.values(unread).reduce((a,b)=>a+b,0)+zhouUnread;return 0}
function appBtn(id){const b=badgeOf(id);return `<button class="app" data-app="${id}" onclick="openApp('${id}',this.firstElementChild)"><div class="icon"><div class="ic">${appIcon(id)}</div>${b?`<span class="bdg">${b}</span>`:''}</div><span class="lbl">${t('app_'+id)}</span></button>`}
function renderHome(){
 HOME.innerHTML=`<div class="hgrid">
  <button class="widget wcal" data-app="calendar" onclick="openApp('calendar',this)"><div class="wd">${wdLong(STORY.y,STORY.m,STORY.d)}</div><div class="wn">${STORY.d}</div>${(events[STORY.m+'-'+STORY.d]||[]).map(x=>{const p=x.split(' · ');return `<div class="we">${esc(p[0])}<small>${esc(p[1]||t('allDay'))}</small></div>`}).join('')}</button>
  <button class="widget wwx" data-app="weather" onclick="openApp('weather',this)"><div class="c">${t('city')} ➚</div><div class="tp">19°</div><span style="position:absolute;top:14px;right:14px">${G.sun}</span><div class="ds">${t('mostlySunny')}<small>${t('hiLo')}</small></div></button>
  ${['douyin','xhs','photos','mail','calendar','clock','notes','weather','settings','maps','recipe'].map(appBtn).join('')}
 </div><button class="spot" onclick="this.animate([{transform:'translateX(-50%) scale(1)'},{transform:'translateX(-50%) scale(1.08)'},{transform:'translateX(-50%) scale(1)'}],300)">${G.search.replace('<svg','<svg width="13" height="13"')}${t('search')}</button>
 <div class="dock">${['phone','safari','wechat','music'].map(appBtn).join('')}</div>`}


const PARENT={note:'notes',chat:'wechat',maild:'mail',xhsProfile:'xhs',xhsPost:'xhs',xhsSearch:'xhs',screentime:'settings'};
const rootOf=v=>PARENT[v]||v;
function viewDark(){if(['lock','pin','home'].includes(view))return true;const p=APP.lastElementChild;return!!(p&&p.dataset.dark)}
function wireScroll(pg){const sc=pg.querySelector('.scroll');if(sc)sc.addEventListener('scroll',()=>pg.classList.toggle('scrolled',sc.scrollTop>38),{passive:true})}
function show(id,anim='swap'){
 const old=[...APP.children];old.forEach(o=>{o.querySelectorAll('video').forEach(v=>v.pause());if(o._cleanup)o._cleanup()});
 if(PLAYER.dataset.voice&&!(id==='chat')){PLAYER.pause()}
 view=id;const v=VIEWS[id]();const pg=document.createElement('div');pg.className='pg '+(v.cls||'');pg.innerHTML=v.html;pg.dataset.view=id;pg.dataset.dark=v.dark?'1':'';
 if(anim==='pop')APP.insertBefore(pg,APP.firstChild);else APP.appendChild(pg);
 setStatus(v.dark);wireScroll(pg);
 const done=()=>old.forEach(o=>o.remove());
 if(anim==='push'){pg.classList.add('pushed');pg.animate([{transform:'translateX(100%)'},{transform:'none'}],T);old.forEach(o=>o.animate([{transform:'none',filter:'brightness(1)'},{transform:'translateX(-28%)',filter:'brightness(.92)'}],T));setTimeout(done,T.duration)}
 else if(anim==='pop'){pg.animate([{transform:'translateX(-28%)',filter:'brightness(.92)'},{transform:'none',filter:'brightness(1)'}],T);old.forEach(o=>{o.classList.add('pushed');o.animate([{transform:'none'},{transform:'translateX(100%)'}],{...T,fill:'forwards'})});setTimeout(done,T.duration)}
 else done();
 v.init&&v.init(pg);updateIsland();return pg}
function zoomFrames(r){const W=SCREEN.clientWidth,H=SCREEN.clientHeight,s=r.w/W,iy=Math.max(0,(H-r.h/s)/2),dx=r.x+r.w/2-W/2,dy=r.y+r.h/2-H/2;
 return[{transform:`translate(${dx}px,${dy}px) scale(${s})`,clipPath:`inset(${iy}px 0px round ${15/s}px)`,opacity:.25},{transform:'translate(0px,0px) scale(1)',clipPath:`inset(0px 0px round ${devRadius()}px)`,opacity:1}]}
function openApp(id,el){if(callState)return;if(view!=='home'){return}
 lastRect=el?relRect(el):null;APP.innerHTML='';show(id,'none');const tok=++animTok;
 APP.style.visibility='visible';APP.getAnimations().forEach(a=>a.cancel());
 APP.animate(zoomFrames(lastRect||{x:166,y:396,w:60,h:60}),{duration:540,easing:'cubic-bezier(.2,.9,.22,1)'});
 HOME.animate([{transform:'none',opacity:1},{transform:'scale(1.1)',opacity:0}],{duration:400,easing:'ease-in'}).onfinish=()=>{if(tok===animTok&&view!=='home')HOME.style.visibility='hidden'};
 if(firstOpen){firstOpen=false;setTimeout(()=>{$('#hb').classList.add('pulse');setTimeout(()=>$('#hb').classList.remove('pulse'),3400)},900)}}
function closeApp(){if(callState||['home','lock','pin'].includes(view))return;
 const root=rootOf(view);if(PLAYER.dataset.voice)PLAYER.pause();
 view='home';renderHome();HOME.style.visibility='visible';setStatus(true);
 const icon=HOME.querySelector(`.app[data-app="${root}"] .icon`);const r=icon?relRect(icon):{x:166,y:396,w:60,h:60};
 const tok=++animTok;APP.getAnimations().forEach(a=>a.cancel());
 const a=APP.animate(zoomFrames(r).reverse(),{duration:460,easing:'cubic-bezier(.3,.75,.2,1)',fill:'forwards'});
 a.onfinish=()=>{if(tok!==animTok)return;APP.style.visibility='hidden';APP.querySelectorAll('video').forEach(v=>v.pause());APP.innerHTML='';a.cancel()};
 HOME.animate([{transform:'scale(1.1)',opacity:0},{transform:'none',opacity:1}],{duration:460,easing:'cubic-bezier(.2,.9,.22,1)'});updateIsland()}
function push(id){show(id,'push')}
function back(){if(PARENT[view])show(PARENT[view],'pop');else closeApp()}
function hbAction(){if(callState)return;const vw=OV.querySelector('.viewer');if(vw)return closeViewer();if(OV.querySelector('.videoOv'))return closeVideo();if(OV.querySelector('.np'))return closeNP();
 if(view==='lock')return goPin();if(view==='pin')return;if(view==='home')return HOME.animate([{transform:'none'},{transform:'scale(.97)'},{transform:'none'}],250);closeApp()}
(function hbGesture(){const hb=$('#hb');let y0=null;hb.addEventListener('pointerdown',e=>{y0=e.clientY;hb.setPointerCapture(e.pointerId)});hb.addEventListener('pointerup',e=>{if(y0===null)return;y0=null;hbAction()})})();
(function edgeBack(){let x0=null,y0=0,pg=null;SCREEN.addEventListener('pointerdown',e=>{const r=SCREEN.getBoundingClientRect();if(!PARENT[view]||(e.clientX-r.left)/SC>22)return;x0=e.clientX;y0=e.clientY;pg=APP.lastElementChild});
 SCREEN.addEventListener('pointermove',e=>{if(x0===null)return;const dx=Math.max(0,(e.clientX-x0)/SC);if(pg)pg.style.transform=`translateX(${dx}px)`});
 SCREEN.addEventListener('pointerup',e=>{if(x0===null)return;const dx=(e.clientX-x0)/SC;x0=null;if(pg)pg.style.transform='';if(dx>90)back()})})();

function goBack(){if(callState)return;const ls=document.getElementById('langSheet');if(ls){ls.remove();return}
 if(OV.querySelector('.viewer'))return closeViewer();if(OV.querySelector('.videoOv'))return closeVideo();if(OV.querySelector('.np'))return closeNP();
 if(['lock','pin','home'].includes(view)){if(view==='pin')pinCancel();return}back()}
function updateCrumb(){const on=!['lock','pin','home'].includes(view)&&!callState;$('#sb').classList.toggle('crumb',on)}
$('#sbk').innerHTML=`<svg viewBox="0 0 7 12"><path d="M6 1 1 6l5 5"/></svg>${t('home')}`;
$('#sbk').addEventListener('click',e=>{e.stopPropagation();if(callState)return;if(OV.querySelector('.viewer'))closeViewer();if(OV.querySelector('.videoOv'))closeVideo();if(OV.querySelector('.np'))closeNP();closeApp()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hbAction();else if(e.key==='Backspace'&&!e.target.closest('input,textarea')){e.preventDefault();goBack()}});
document.addEventListener('mouseup',e=>{if(e.button===3){e.preventDefault();goBack()}});
try{history.pushState({wb:1},'');addEventListener('popstate',()=>{goBack();history.pushState({wb:1},'')})}catch(e){}


function navHTML(o){return `<div class="nav ${o.solid?'solid':''}">${o.back!==undefined?`<button class="nb-back" onclick="${o.backFn||'back()'}">${G.chevL}${o.back}</button>`:(o.left||'<span></span>')}<div class="nb-title">${o.title||''}</div><div class="nb-right">${o.right||''}</div></div>`}
function tabbar(items,on,cls=''){return `<div class="tabbar ${cls}">${items.map(([ic,l],i)=>`<button class="${i===on?'on':''}">${G[ic]||ic}<span>${l}</span></button>`).join('')}</div>`}
const sw=(on,fn)=>`<button class="sw ${on?'on':''}" onclick="this.classList.toggle('on');vib(8);${fn||''}"></button>`;


const VIEWS={};


function noteDate(d,full){const [y,m,dd]=d.split('-').map(Number);if(full)return fmtYMD(y,m,dd);if(d==='2026-10-20')return t('yesterday');const diff=(new Date(STORY.y,STORY.m-1,STORY.d)-new Date(y,m-1,dd))/864e5;if(diff<7)return wdLong(y,m,dd);return fmtNum(y,m,dd)}
const noteRow=(n,i)=>`<button class="row tap" onclick="noteId=${i};push('note')"><b>${esc(n[0])}</b><small><em>${noteDate(n[3])}</em>${esc(n[1])}</small></button>`;
VIEWS.notes=()=>({cls:'grouped notes-pg',html:navHTML({title:t('app_notes'),back:t('folders'),right:G.dots})+`<div class="scroll"><h1 class="lt">${t('app_notes')}</h1><div class="srch">${G.search}${t('search')}</div>
 <div class="gh" style="margin-top:8px">📌 ${t('pinned')}</div><div class="group note-l">${notes.slice(0,4).map((n,i)=>noteRow(n,i)).join('')}</div>
 <div class="gh">${t('notesSec')}</div><div class="group note-l">${notes.slice(4).map((n,i)=>noteRow(n,i+4)).join('')}</div></div>
 <div class="toolbar"><span style="width:24px"></span><span style="color:#000;align-self:center;font-size:11px">${t('nNotes',notes.length)}</span>${G.compose}</div>`});
VIEWS.note=()=>{const n=notes[noteId];return{cls:'notes-pg',html:navHTML({title:'',back:t('app_notes'),right:G.share+G.dots,solid:false})+`<div class="scroll"><div class="note-v"><div class="nd">${noteDate(n[3],true)}</div><h2>${esc(n[0])}</h2>${esc(n[2])}</div></div><div class="toolbar">${G.check}${G.camera}${G.pen}${G.compose}</div>`}};

const RECIPES=[
 ['椰子鸡','周湘点的菜','文昌鸡半只、椰子两个、椰青水、沙姜、小米辣\n\n1. 椰子水倒进锅里，煮开\n2. 下鸡块，小火煮 12 分钟\n3. 关火焖 5 分钟\n4. 蘸料：沙姜 + 小米辣 + 生抽 + 青柠\n\n周湘：汤要喝两碗'],
 ['炒包菜','由淼拿手','包菜半个、干辣椒、蒜片\n\n1. 包菜手撕，沥干水\n2. 热锅冷油，下蒜片和干辣椒\n3. 大火快炒，加盐和一点点醋\n4. 出锅前淋一点生抽\n\n由淼：这个我做得比外卖好吃'],
 ['尖椒鸡丁','周五晚饭','鸡腿肉 300g、尖椒 4 个、姜蒜\n\n1. 鸡腿肉切丁，用生抽和淀粉腌十分钟\n2. 尖椒切段，热锅炒到起虎皮\n3. 下鸡丁大火炒熟\n4. 加一点糖和生抽\n\n周湘：别放太多辣椒']
];
VIEWS.recipe=()=>({cls:'rcp',html:navHTML({title:'菜谱',back:'主屏幕',backFn:'closeApp()',right:G.plus})+`<div class="scroll"><h1>菜谱</h1><div class="sub">由淼收藏 · 适合两个人吃</div>${RECIPES.map(r=>`<div class="card"><b>${esc(r[0])}</b><p>${esc(r[2])}</p></div>`).join('')}<div style="height:24px"></div></div>`});

function calEvents(){return events[calMonth+'-'+selectedDay]||[]}
VIEWS.calendar=()=>{const first=new Date(STORY.y,calMonth-1,1).getDay(),days=new Date(STORY.y,calMonth,0).getDate();let c='';for(let i=0;i<first;i++)c+='<div></div>';
 for(let d=1;d<=days;d++){const dow=(first+d-1)%7,evs=events[calMonth+'-'+d]||[],td=calMonth===STORY.m&&d===STORY.d;c+=`<button class="cal-d ${td?'td':''} ${d===selectedDay?'sel':''} ${dow===0||dow===6?'we':''}" onclick="selectedDay=${d};show('calendar')"><span>${d}</span>${evs.length?'<i></i>':''}</button>`}
 const ev=calEvents().map(x=>{const m=x.split(' · ');return `<div class="evt"><span class="bar" style="background:#af52de"></span><b>${esc(m[0])}</b><small>${m[1]||t('allDay')}</small></div>`}).join('')||`<div class="evt muted">${t('noEvents')}</div>`;
 return{html:navHTML({title:'',back:fmtYear(STORY.y),backFn:'closeApp()',right:G.list+G.search+G.plus})+`<div class="scroll" style="padding-bottom:120px"><div style="display:flex;justify-content:space-between;align-items:center;margin:0 16px 8px"><h1 class="lt" style="margin:0">${fmtMonth(calMonth)}</h1><span style="display:flex;gap:26px;color:var(--blue)"><button style="width:22px" onclick="calNav(-1)">${G.chevLb}</button><button style="width:22px" onclick="calNav(1)">${G.chevRb}</button></span></div>
 <div class="cal-g cal-w">${wdNarrow().map(w=>`<div>${w}</div>`).join('')}</div><div class="cal-g" id="calg">${c}</div><div style="border-top:.5px solid var(--sep);margin-top:4px;padding-top:4px">${ev}</div></div>
 <div class="tabbar" style="color:#ff3b30">${[t('today'),t('calendars'),t('inbox')].map(x=>`<button style="color:#ff3b30;font-size:16px;justify-content:center">${x}</button>`).join('')}</div>`}};
function calNav(d){const n=calMonth+d;if(n<10||n>12)return;calMonth=n;selectedDay=n===10?STORY.d:1;const pg=show('calendar');pg.querySelector('#calg').animate([{transform:`translateX(${d*40}%)`,opacity:0},{transform:'none',opacity:1}],{duration:350,easing:'cubic-bezier(.2,.9,.25,1)'})}



VIEWS.clock=()=>({cls:'dark',dark:true,html:`<div class="nav" style="color:#ff9f0a"><button style="color:#ff9f0a;font-size:17px;justify-self:start;padding-left:8px">${t('edit')}</button><div class="nb-title">${t('alarm')}</div><div class="nb-right" style="color:#ff9f0a">${G.plus}</div></div><div class="scroll"><h1 class="lt">${t('alarm')}</h1>
 
 <div style="margin:18px 16px 4px;font-size:15px;font-weight:600">${t('other')}</div>
 ${ALARMS.map((a,i)=>`<div class="alarm ${alarmStates[i]?'':'off'}"><div><div class="at">${(p=>p.before?`<small>${p.dp}</small>${p.tm}`:`${p.tm}<small style="margin-left:4px">${p.dp}</small>`)(alarmParts(a.h,a.m))}</div><div class="al">${a.label === '每天' ? '每天 · ' : a.label}${t('alarmLabel')}</div></div>${sw(alarmStates[i],`alarmStates[${i}]=!alarmStates[${i}];this.closest('.alarm').classList.toggle('off',!alarmStates[${i}])`)}</div>`).join('')}</div>
 ${tabbar([['globe',t('worldClock')],['alarm',t('alarm')],['stopwatch',t('stopwatch')],['timer',t('timer')]],1).replace('class="on"','class="on" style="color:#ff9f0a"')}`});


function callWhen(s){if(s.startsWith('今天 ')){const [h,m]=s.slice(3).split(':').map(Number);return ampm(h*60+m)}if(s.startsWith('昨天'))return t('yesterday');return s}
const callNameDisp=n=>n.replace(/^(.+?)( \(\d+\))?$/,(m,a,b)=>dn(a)+(b||''));
VIEWS.phone=()=>{const all=[...extraCalls,...calls].filter(c=>!missOnly||c[2]==='未接');
 return{html:`<div class="nav"><button style="color:var(--blue);font-size:17px;justify-self:start;padding-left:8px">${t('edit')}</button><div class="seg"><button class="${missOnly?'':'on'}" onclick="missOnly=false;show('phone')">${t('all')}</button><button class="${missOnly?'on':''}" onclick="missOnly=true;show('phone')">${t('missed')}</button></div><span></span></div>
 <div class="scroll"><h1 class="lt">${t('recents')}</h1><div class="srch">${G.search}${t('search')}</div>
 ${all.map(c=>`<div class="prow ${c[2]==='未接'?'miss':''}" style="cursor:pointer" onclick="dial('${esc(c[0].replace(/ \(\d+\)$/,''))}')"><span class="pi">${c[2]==='拨出'?'<svg viewBox="0 0 24 24"><path d="M6.6 3.2c.6-.3 1.4-.1 1.8.5l1.9 3c.4.6.3 1.4-.2 1.9l-1.4 1.3a12.4 12.4 0 0 0 5.4 5.4l1.3-1.4c.5-.5 1.3-.6 1.9-.2l3 1.9c.6.4.8 1.2.5 1.8l-.9 1.9c-.5 1-1.6 1.6-2.7 1.4C10 19.6 4.4 14 3.3 6.8c-.2-1.1.4-2.2 1.4-2.7Z"/></svg>':''}</span><div class="pn"><b>${esc(callNameDisp(c[0]))}</b><small>${t('mobile')}</small></div><span class="pd">${callWhen(c[1])}</span><span class="inf">${G.info}</span></div>`).join('')}</div>
 ${tabbar([['star',t('favorites')],['clock',t('recents')],['contacts',t('contacts')],['keypad',t('keypad')],['voicemail',t('voicemail')]],1)}`}};


const isGroup=n=>false;
const MEMBERS={};
function lastDate(n){const d=((chatData[n]||[]).filter(x=>x[1]==='date').slice(-1)[0]||[''])[0];return d==='10月20日'?'昨天':d}
function dateKey(n){if(n===MAIN_CHAT)return 999999;const l=lastDate(n);if(l==='今天')return 99999;if(l==='昨天')return 9999;const m=l.match(/(\d+)月(\d+)日/);return m?+m[1]*100+ +m[2]:0}
function previewText(s,grp){const m=mediaLabels[s];if(m)return m.kind==='image'?t('photo'):m.kind==='video'?t('video'):m.kind==='gift'?t('giftSent'):m.kind==='file'?t('fileColon')+fileInfo(s)[0]:t('voiceMsg');
 const b=s.match(/^\[(.+)\]$/);if(b){const n=b[1];
  if(KIND_WORDS.gift.test(n))return t('giftSent');
  if(KIND_WORDS.file.test(n)&&!KIND_WORDS.video.test(n))return t('fileColon')+fileInfo(n)[0];
  if(KIND_WORDS.video.test(n))return t('video');
  if(KIND_WORDS.audio.test(n))return t('voiceMsg');
  return t('photo')}
 return s}

const AVATARS={'小米汽车-顾问':A('media/avatar_sales.jpg'),'宠物医院':A('media/avatar_vet.jpg')};
function avatarFor(name,group){if(name===MAIN_CHAT)return '<img src="'+A('media/avatar_zhouxiang.jpg')+'" alt="">';if(AVATARS[name])return '<img src="'+AVATARS[name]+'" alt="">';if(group)return '<svg viewBox="0 0 24 24"><circle cx="8.5" cy="9" r="3" fill="#fff"/><circle cx="15.5" cy="9" r="3" fill="#fff"/><path d="M2.5 19c.4-3 2.9-5 6-5s5.6 2 6 5ZM9.5 19c.4-3 2.9-5 6-5s5.6 2 6 5Z" fill="#fff"/></svg>';return G.sil}

function otherUnread(){return Object.entries(unread).filter(([k])=>k!==chatId).reduce((a,[,b])=>a+b,0)+(chatId==='周湘'?0:zhouUnread)}
VIEWS.wechat=()=>{const list=chatNames.slice().sort((a,b)=>dateKey(b)-dateKey(a));
 return{cls:'kk',html:`<div class="kk-h"><b>${t('chats')}</b><span>${G.search}${G.chatPlus}${G.gear}</span></div><div class="scroll">${list.map(n=>{const arr=chatData[n]||[];let last=arr.filter(x=>x[1]!=='date').slice(-1)[0],time=fmtLabel(lastDate(n)),cnt=unread[n]||0;
  if(n==='周湘'&&todayChat.length){last=todayChat[todayChat.length-1];time=last[2];cnt=zhouUnread}
  return `<button class="crow" onclick="chatId=${esc(JSON.stringify(n))};push('chat')"><div class="av">${avatarFor(n,isGroup(n))}</div><div style="flex:1;min-width:0"><div class="cn">${esc(dn(n))}${MEMBERS[n]?`<small>${MEMBERS[n]}</small>`:''}</div><div class="cp">${last?esc(previewText(last[0],isGroup(n))):''}</div></div><div class="cm"><span class="ct">${time}</span>${cnt?`<span class="kbdg">${cnt}</span>`:''}</div></button>`}).join('')}</div>
 ${tabbar([['person',t('friends')],['chat',t('chats')],['openchat',t('openChat')],['bag',t('shopping')],['dotsH',t('more')]],1)}`}};

/* --- 朋友圈（已移除） --- */

const AUD_DUR={'media/voice_01.mp3':'0:08','media/voice_02.mp3':'0:11','media/voice_03.mp3':'0:06'};
function fileInfo(n){if(/曲目|演出/.test(n))return[t('f_assign'),'1.2MB'];if(/训练|脚脚/.test(n))return[t('f_check'),'48KB'];return[t('f_assign2'),'1.3MB']}
function bubble(s){const m=mediaLabels[s];
 if(m&&m.kind==='gift')return '<div class="bb gift"><div class="gt">☕️</div><div class="gb"><b>'+t('giftArrived')+'</b>'+t('giftItem')+'</div><div class="gbtn">'+t('giftCheck')+'</div></div>';
 if(m&&m.kind==='file'){const f=fileInfo(s);return '<div class="bb file"><span class="fi">'+f[0].split('.').pop().toUpperCase()+'</span><div><div class="fn">'+esc(f[0])+'</div><div class="fs">'+t('expired')+' · '+f[1]+'</div></div></div>'}
 if(m&&m.kind==='video'){const th=A(m.thumb||m.src);return '<div class="bb img vidmsg" onclick="event.stopPropagation();openVideo(\''+A(m.src)+'\')"><img src="'+th+'" alt=""><span class="vplay">'+G.playF.replace('<svg','<svg width="34" fill="#fff"')+'</span></div>'}
 if(m&&m.kind==='image')return '<div class="bb img" onclick="event.stopPropagation();openViewerSrc(\''+A(m.src)+'\',this.firstElementChild)"><img src="'+A(m.src)+'" alt=""></div>';
 if(m&&m.kind==='video'){const th=A(m.thumb||m.src);return '<div class="bb img vidmsg" onclick="event.stopPropagation();openVideo(\''+A(m.src)+'\')"><img src="'+th+'" alt=""><span class="vplay">'+G.playF.replace('<svg','<svg width="34" fill="#fff"')+'</span></div>'}
 if(m&&m.kind==='audio'){let w='';for(let i=0;i<20;i++)w+='<i style="height:'+(5+Math.round(Math.abs(Math.sin(i*1.7+s.length))*15))+'px;animation-delay:-'+((i%5)*.13)+'s"></i>';return '<div class="bb aud" data-src="'+A(m.src)+'" onclick="event.stopPropagation();playChatAudio(this)"><span class="pl">'+G.playF+'</span><span class="wv">'+w+'</span><span class="du">'+(AUD_DUR[m.src]||'0:10')+'</span></div>'}
 const b=s.match(/^\[(.+)\]$/);if(b){const n=b[1];
  if(KIND_WORDS.gift.test(n))return '<div class="bb gift"><div class="gt">☕️</div><div class="gb"><b>'+t('giftArrived')+'</b>'+t('giftItem')+'</div><div class="gbtn">'+t('giftCheck')+'</div></div>';
  if(KIND_WORDS.file.test(n)&&!KIND_WORDS.video.test(n)){const f=fileInfo(n);return '<div class="bb file"><span class="fi">'+f[0].split('.').pop().toUpperCase()+'</span><div><div class="fn">'+esc(f[0])+'</div><div class="fs">'+t('expired')+' · '+f[1]+'</div></div></div>'}
  if(KIND_WORDS.video.test(n))return '<div class="bb exp">'+G.video+'<span>'+t('expVideo')+'</span></div>'}
 return '<div class="bb">'+esc(s)+'</div>'}

function fullDate(l){return fmtLabel(l,true)}
function chatItems(id){const arr=id==='周湘'?[...chatData[id],...(todayChat.length?[['今天','date'],...todayChat]:[])]:(chatData[id]||[]);const items=[];let tm=0;
 const TT=CHAT_TIMES[id]||[];arr.forEach((m,i)=>{if(m[1]==='date'){items.push({date:m[0]});return}
  let text=m[0],sender=id==='周湘'?'周湘':id;
  if(TT[i]!=null)tm=TT[i];else tm+=1;items.push({who:m[1],text,sender,time:m[2]||ampm(tm)})});return items}
function avatarForMe(){return '<img src="'+A('media/avatar_youmiao.jpg')+'" alt="">'}
function chatMsgs(id){const it=chatItems(id);let o='';
 it.forEach((x,i)=>{if(x.date){o+=`<div class="dpill"><span>${G.calSm.replace('<svg','<svg width="12" height="12"')}${fullDate(x.date)}</span></div>`;return}
  const n=it[i+1];const last=!n||n.date||n.who!==x.who||n.time!==x.time;const me=x.who==='me';
  const tm=last?`<div class="tm"><span>${x.time}</span></div>`:'';
  o+=`<div class="ln ${me?'me':'th'} first">${me?`<div class="sav meav">${avatarForMe()}</div>`:`<div class="sav">${avatarFor(x.sender)}</div>`}<div class="col" style="${me?'align-items:flex-end':''}"><div class="wrap">${me?tm+bubble(x.text):bubble(x.text)+tm}</div></div></div>`});return o}
VIEWS.chat=()=>({cls:'chat',html:`<div class="chat-h"><button class="bk" onclick="back()">${G.chevL}<span>${otherUnread()||''}</span></button><div class="nm">${esc(dn(chatId))}</div><div class="rt">${G.search}${G.menu}</div></div>
 <div class="msgs" id="msgs">${chatMsgs(chatId)}</div>
 ${chatId==='周湘'?'<div class="chat-opts" id="opts"></div>':''}
 <div class="cin safe" id="cin">${G.plusSq}<div class="fld ro" id="fld">发消息</div>${G.smile}<button class="snd ro" id="snd">${G.arrowUp}</button></div>`,
 init:()=>{if(chatId==='周湘')zhouUnread=0;else unread[chatId]=0;typing=false;replyBusy=false;
  if(chatId==='周湘'){if(phoneDone&&(!chatStage||chatStage==='pre'||chatStage==='sad'))chatStage='topics';}
  scrollChat();renderChoices()}});
function scrollChat(smooth){const b=$('#msgs');if(!b)return;if(smooth)b.scrollTo({top:b.scrollHeight,behavior:'smooth'});else b.scrollTop=b.scrollHeight}
function refreshChat(pop){const b=$('#msgs');if(!b||view!=='chat')return;b.innerHTML=chatMsgs(chatId);scrollChat();if(pop){const l=b.lastElementChild&&b.lastElementChild.querySelector('.bb');if(l)l.classList.add('pop')}}
function showTyping(){if(!(view==='chat'&&chatId==='周湘'))return;const b=$('#msgs');if(!b||document.getElementById('typ'))return;b.insertAdjacentHTML('beforeend',`<div class="ln th first" id="typ"><div class="sav">${avatarFor('周湘')}</div><div class="col"><div class="wrap"><div class="bb typing pop"><i></i><i></i><i></i></div></div></div></div>`);scrollChat(true)}
function hideTyping(){const t=document.getElementById('typ');if(t)t.remove()}
function deliverSohee(text){todayChat.push([text,'them',nowAmpm()]);saveState();
 if(view==='chat'&&chatId==='周湘'){refreshChat(true);tone(1318,0,.12,.05)}
 else{zhouUnread++;notify(text);if(view==='wechat')show('wechat');if(view==='home')renderHome()}}
function pushMe(text){todayChat.push([text,'me',nowAmpm()]);if(view==='chat'&&chatId==='周湘')refreshChat(true);saveState()}

function choiceSet(){return LIVE_OPTIONS[chatStage]||[]}
function visibleChoices(){return choiceSet().filter(o=>!o.key||!doneKeys[o.key])}
function renderChoices(){const box=document.getElementById('opts');if(!box)return;if(chatId!=='周湘'||callState){box.innerHTML='';box.classList.remove('on');return}
 const list=visibleChoices();box.innerHTML=list.map((o,i)=>`<button class="opt" onclick="chooseOption(${i})">${esc(o.t)}</button>`).join('');box.classList.toggle('on',list.length>0)}
function chooseOption(i){if(callState||typing)return;const list=visibleChoices(),o=list[i];if(!o)return;
 if(o.key)doneKeys[o.key]=true;
 typing=true;pushMe(o.t);const ob=document.getElementById('opts');if(ob){ob.innerHTML='';ob.classList.remove('on')}let tt=620;
 o.r.forEach(m=>{const dur=620+String(m).length*40;setTimeout(()=>{hideTyping();showTyping()},tt);tt+=dur;setTimeout(()=>{hideTyping();deliverSohee(m)},tt);tt+=220});
 setTimeout(()=>{typing=false;if(o.next!==undefined)chatStage=o.next;renderChoices();saveState()},tt+260)}

function afterCallTopics(){chatStage='topics';if(view==='chat'&&chatId==='周湘')renderChoices();saveState()}
function branchAfter(kind){const me=kind==='miss'?BRANCH_MISS_ME:BRANCH_DECLINE_ME;const them=kind==='miss'?BRANCH_MISS_THEM:BRANCH_DECLINE_THEM;
 chatStage='topics';saveState();let tt=350;
 me.forEach(m=>{setTimeout(()=>{pushMe(m)},tt);tt+=620});
 them.forEach(m=>{setTimeout(()=>{deliverSohee(m)},tt);tt+=1250});
 setTimeout(()=>{if(view==='chat'&&chatId==='周湘')renderChoices();saveState()},tt+220)}
function playChatAudio(){}

function showToast(msg){let d=OV.querySelector('.toast');if(d)d.remove();d=document.createElement('div');d.className='toast';d.textContent=msg;OV.appendChild(d);setTimeout(()=>d.remove(),2000)}
function notify(body){sfx('msg');vib([30,60,30]);
 if(view==='lock'||view==='pin'){lockNotes.unshift({title:dn('周湘'),body,app:'wechat',time:t('now')});renderLock();saveState();const c=document.querySelector('.lk-notes .ncard');if(c)c.animate([{transform:'translateY(-30px) scale(.9)',opacity:0},{transform:'none',opacity:1}],{duration:500,easing:'cubic-bezier(.2,1.2,.4,1)'});return}
 OV.querySelectorAll('.banner').forEach(b=>b.remove());const b=document.createElement('div');b.className='banner';b.innerHTML=`<div class="ncard">${ncardHTML({title:dn('周湘'),body,app:'wechat',time:t('now')})}</div>`;OV.appendChild(b);
 b.animate([{transform:'translateY(-140%) scale(.96)'},{transform:'none'}],{duration:620,easing:'cubic-bezier(.2,1.25,.35,1)'});
 let y0=null,dy=0,mv=false;const hide=()=>{if(!b.isConnected)return;b.animate([{transform:`translateY(${Math.min(0,dy)}px)`},{transform:'translateY(-150%)'}],{duration:320,easing:'ease-in',fill:'forwards'}).onfinish=()=>b.remove()};
 const tm=setTimeout(hide,5600);
 b.addEventListener('pointerdown',e=>{y0=e.clientY;mv=false;b.setPointerCapture(e.pointerId)});
 b.addEventListener('pointermove',e=>{if(y0===null)return;dy=(e.clientY-y0)/SC;if(Math.abs(dy)>5)mv=true;b.style.transform=`translateY(${dy<0?dy:dy*.25}px)`});
 b.addEventListener('pointerup',()=>{if(y0===null)return;y0=null;clearTimeout(tm);if(dy<-30){hide();return}b.style.transform='';if(!mv){b.remove();openSohee(b)}})}
function openSohee(el){if(callState)return;chatId='周湘';if(view==='home'){openApp('chat',el.querySelector?el:null);return}if(view==='chat'&&chatId==='周湘')return;if(['lock','pin'].includes(view))return;push('chat')}

/* --- Safari --- */
VIEWS.safari=()=>{if(safSearch)return{cls:'saf',html:`<div style="position:absolute;top:54px;left:0;right:0;padding:6px 14px;display:flex;gap:12px;align-items:center;z-index:3"><div class="srch" style="margin:0;flex:1;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.08);height:40px">${G.search}<span style="color:#000">|</span><span>${t('searchWeb')}</span></div><button style="color:var(--blue);font-size:17px" onclick="safSearch=false;show('safari')">${t('cancel')}</button></div>
 <div class="scroll" style="padding-top:112px"><div style="display:flex;justify-content:space-between;margin:0 16px 8px"><b style="font-size:20px">${t('recentSearches')}</b><span style="color:var(--blue)">${t('clear')}</span></div><div class="group srec">${searches.map(s=>`<div class="row" style="--inset:44px">${G.clock.replace('<svg','<svg width="18" height="18" style="color:#8e8e93;flex:none"')}<span>${esc(s)}</span></div>`).join('')}</div></div>`,init:pg=>pg.querySelector('.srec').animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:300})};
 const fav=[['sf_portal','#2a5bd7'],['sf_acad','#1e8e5a'],['sf_lib','#8b5a2b'],['sf_elearn','#d9480f'],['sf_pe','#4b6cb7'],['sf_mail','#5e5ce6'],['sf_news','#34c759'],['app_maps','#ff9f0a']].map(([k,c])=>[[...t(k)][0].toUpperCase(),t(k),c]);
 return{cls:'saf',html:`<div class="scroll"><div class="sh" style="font-size:22px">${t('favoritesSf')}</div><div class="favs">${fav.map(f=>`<div class="fav"><i style="color:${f[2]}">${f[0]}</i>${f[1]}</div>`).join('')}</div>
 <div class="sh" style="font-size:22px;margin-top:28px">${t('privacyReport')}</div><div class="group" style="padding:14px 16px;display:flex;gap:12px;align-items:center;font-size:15px"><span style="font-size:26px">🛡️</span><span>${t('privacyText')}</span></div>
 <div class="sh" style="font-size:22px;margin-top:28px">${t('readingList')}</div><div class="group"><div class="row muted" style="font-size:15px">${t('readingEmpty')}</div></div></div>
 <div class="sbar"><button class="ad" style="width:100%" onclick="safSearch=true;show('safari')"><b>${t('aa')}</b><span style="flex:1;text-align:center">${t('searchWeb')}</span>${G.mic.replace('<svg','<svg width="18" height="18"')}</button><div class="tb">${G.chevLb.replace('<svg','<svg class="dis"')}${G.chevRb.replace('<svg','<svg class="dis"')}${G.share}${G.book}${G.tabs}</div></div>`}};

/* --- Mail --- */
function mailDate(s){const m=s.match(/^(\d+)\/(\d+)$/);if(m)return fmtNum(STORY.y,+m[1],+m[2]);return s}
VIEWS.mail=()=>({html:navHTML({title:t('inbox'),back:t('mailboxes'),backFn:'closeApp()',right:t('edit')})+`<div class="scroll"><h1 class="lt">${t('inbox')}</h1><div class="srch">${G.search}${t('search')}</div>
 ${emails.map((e,i)=>`<button class="mrw" onclick="mailId=${i};readMail.add(${i});push('maild')"><span class="dot ${i<2&&!readMail.has(i)?'':'r'}"></span><div class="bd"><div class="l1"><b>${esc(e[0])}</b><span>${mailDate(e[3])}${G.chevR}</span></div><div class="sj">${esc(e[1])}</div><div class="pv">${esc(e[2])}</div></div></button>`).join('')}</div>
 <div class="toolbar">${G.filter}<span style="color:#000;font-size:11px;text-align:center;align-self:center">${t('updatedNow')}</span>${G.compose}</div>`});
VIEWS.maild=()=>{const e=emails[mailId];const body=e[2];
 return{html:navHTML({title:'',back:t('inbox'),right:'',solid:false})+`<div class="scroll"><div class="mail-d"><div class="hd"><span class="ini">${esc(e[0][0])}</span><div style="flex:1"><b>${esc(e[0])}</b><small>${t('toMe')}</small></div><small class="muted">${mailDate(e[3])}</small></div><h2>${esc(e[1])}</h2><div class="bd">${esc(body)}</div></div></div><div class="toolbar">${G.trash}${G.bookmark}${G.share.replace('M12 3v12M8 7l4-4 4 4','M9 15 4 10l5-5M4 10h10a6 6 0 0 1 6 6v3')}${G.compose}</div>`}};


const allPhotos=[];photoSections.forEach(s=>s[1].forEach(n=>allPhotos.push({src:A('photos/'+n),sec:s[0],sub:s[2]})));
VIEWS.photos=()=>{let k=0;return{html:`<div class="nav"><span></span><div class="nb-title">${t('library')}</div><div class="nb-right">${G.search}<span>${t('select')}</span></div></div><div class="scroll" style="padding-bottom:120px"><h1 class="lt">${t('library')}</h1><div class="muted" style="margin:-6px 16px 10px;font-size:15px">${t('nPhotos',allPhotos.length)}</div>
 ${photoSections.map(s=>`<div class="ph-sec">${fmtLabel(s[0])}</div><div class="ph-grid">${s[1].map(n=>`<button data-pi="${k}" onclick="openViewer(${k++},this.firstElementChild)"><img src="${A('photos/'+n)}" alt=""></button>`).join('')}</div>`).join('')}</div>
 <div class="phtabs"><button>${t('years')}</button><button>${t('months')}</button><button class="on">${t('allPhotos')}</button></div>`,init:pg=>{const sc=pg.querySelector('.scroll');sc.scrollTop=0}}};

let vList=allPhotos,vIdx=0;
function fitRect(nw,nh){const W=SCREEN.clientWidth,H=SCREEN.clientHeight,s=Math.min(W/nw,H/nh);const w=nw*s,h=nh*s;return{x:(W-w)/2,y:(H-h)/2,w,h}}
function placeImg(img){const f=fitRect(img.naturalWidth||1,img.naturalHeight||1);Object.assign(img.style,{left:f.x+'px',top:f.y+'px',width:f.w+'px',height:f.h+'px'});return f}
function flipFrom(img,r,f){const s=Math.max(r.w/f.w,r.h/f.h),ix=Math.max(0,(f.w*s-r.w)/2/s),iy=Math.max(0,(f.h*s-r.h)/2/s);return{transform:`translate(${r.x+r.w/2-(f.x+f.w/2)}px,${r.y+r.h/2-(f.y+f.h/2)}px) scale(${s})`,clipPath:`inset(${iy}px ${ix}px round ${8/s}px)`}}
function openViewerSrc(src,el,sec,sub){vList=[{src,sec:sec||t('app_wechat'),sub:sub||t('photo')}];openViewer(0,el,true)}
async function openViewer(i,el,custom){if(!custom)vList=allPhotos;vIdx=i;const p=vList[i];const r=el?relRect(el):null;
 const v=document.createElement('div');v.className='viewer';v.innerHTML=`<div class="vbg"></div><img class="vi" src="${p.src}" alt=""><div class="vt"><button class="nb-back" onclick="closeViewer()">${G.chevL}</button><div class="ttl" id="vttl"></div><div class="nb-right" style="color:#fff">${t('edit')}</div></div><div class="vb">${G.share}${G.heart}${G.info}${G.trash}</div>`;OV.appendChild(v);setVTitle();setStatus(true);
 const img=v.querySelector('.vi');try{await img.decode()}catch(e){}const f=placeImg(img);
 if(r){img.animate([flipFrom(img,r,f),{transform:'none',clipPath:`inset(0px 0px round 0px)`}],{duration:420,easing:'cubic-bezier(.2,.9,.25,1)'})}
 v.querySelector('.vbg').animate([{opacity:0},{opacity:1}],{duration:300});[...v.querySelectorAll('.vt,.vb')].forEach(x=>x.animate([{opacity:0},{opacity:1}],{duration:400}));
 viewerGestures(v)}
function setVTitle(){const p=vList[vIdx];const T_=$('#vttl');if(T_)T_.innerHTML=`${esc(fmtLabel(p.sec))}<small>${esc(p.sub||t('photo'))}</small>`}
function closeViewer(){const v=OV.querySelector('.viewer');if(!v)return;const img=v.querySelector('.vi');const th=vList===allPhotos?document.querySelector(`[data-pi="${vIdx}"] img`):null;
 const f={x:parseFloat(img.style.left),y:parseFloat(img.style.top),w:parseFloat(img.style.width),h:parseFloat(img.style.height)};
 const cur=getComputedStyle(img).transform;
 if(th&&view==='photos'){th.scrollIntoView({block:'nearest'});const r=relRect(th);img.animate([{transform:cur==='none'?'none':cur},flipFrom(img,r,f)],{duration:380,easing:'cubic-bezier(.3,.8,.25,1)',fill:'forwards'})}
 else img.animate([{transform:cur==='none'?'none':cur,opacity:1},{transform:'scale(.85)',opacity:0}],{duration:300,fill:'forwards'});
 v.querySelector('.vbg').animate([{opacity:getComputedStyle(v.querySelector('.vbg')).opacity},{opacity:0}],{duration:360,fill:'forwards'});[...v.querySelectorAll('.vt,.vb')].forEach(x=>x.style.opacity=0);
 setTimeout(()=>{v.remove();setStatus(viewDark());updateIsland()},390)}
function viewerGestures(v){const img=v.querySelector('.vi'),bg=v.querySelector('.vbg');let x0=null,y0=0,dx=0,dy=0,mode=null;
 v.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;x0=e.clientX;y0=e.clientY;dx=dy=0;mode=null;v.setPointerCapture(e.pointerId)});
 v.addEventListener('pointermove',e=>{if(x0===null)return;dx=(e.clientX-x0)/SC;dy=(e.clientY-y0)/SC;if(!mode&&Math.hypot(dx,dy)>8)mode=Math.abs(dx)>Math.abs(dy)?'h':'v';
  if(mode==='h')img.style.transform=`translateX(${dx}px)`;if(mode==='v'){const k=Math.max(.6,1-Math.max(0,dy)/900);img.style.transform=`translate(${dx}px,${dy}px) scale(${k})`;bg.style.opacity=Math.max(0,1-Math.max(0,dy)/400)}});
 v.addEventListener('pointerup',async()=>{if(x0===null)return;x0=null;
  if(!mode){v.classList.toggle('bare');return}
  if(mode==='v'&&dy>110){closeViewer();return}
  if(mode==='h'&&Math.abs(dx)>70&&vList[vIdx+(dx<0?1:-1)]){const dir=dx<0?1:-1;img.animate([{transform:`translateX(${dx}px)`},{transform:`translateX(${-dir*110}%)`}],{duration:220,fill:'forwards'});
   setTimeout(async()=>{vIdx+=dir;img.getAnimations().forEach(a=>a.cancel());img.style.transform='';img.src=vList[vIdx].src;try{await img.decode()}catch(e){}placeImg(img);setVTitle();img.animate([{transform:`translateX(${dir*110}%)`},{transform:'none'}],{duration:280,easing:'cubic-bezier(.2,.9,.25,1)'})},210);return}
  img.animate([{transform:img.style.transform||'none'},{transform:'none'}],{duration:300,easing:'cubic-bezier(.2,1.2,.4,1)'});img.style.transform='';bg.style.opacity=1})}

function openVideo(src){const v=document.createElement('div');v.className='videoOv';v.innerHTML=`<video src="${src}" controls autoplay playsinline></video><button class="vclose" onclick="event.stopPropagation();closeVideo()">${G.chevL}</button>`;OV.appendChild(v);setStatus(true);v.animate([{opacity:0},{opacity:1}],{duration:240});v.addEventListener('click',e=>{if(e.target===v)closeVideo()})}
function closeVideo(){const v=OV.querySelector('.videoOv');if(!v)return;v.remove();setStatus(viewDark());updateIsland()}

/* --- 小红书 --- */
/* --- 小红书（图文，无视频） --- */
const XHS_AUTHOR='莱恩莱财莱一脚';
let xhsId=0,xhsQuery='';
function xhsCard(n,i){const media=n.img?`<div class="xhs-im" onclick="event.stopPropagation();openViewerSrc('${A(n.img)}',this.firstElementChild,'小红书')"><img src="${A(n.img)}" alt=""></div>`:`<div class="xhs-im"><div class="xhs-ph">图片待补</div></div>`;return `<div class="xhs-card" onclick="xhsId=${i};push('xhsPost')">${media}<div class="xhs-bd"><b>${esc(n.title)}</b><p>${esc(n.desc)}</p><div class="xhs-ft"><span>${esc(XHS_AUTHOR)}</span><span>❤ ${esc(n.likes)}</span></div></div></div>`}
VIEWS.xhs=()=>({cls:'ig',html:`<div class="ig-h"><b>小红书</b><span style="flex:1"></span><button class="ig-sbtn" onclick="xhsQuery='';push('xhsSearch')">${G.search}</button>${G.bell}</div>
 <div class="scroll" style="padding-top:98px;padding-bottom:110px">
  <div class="xhs-tabs"><span class="on">关注</span><span>发现</span><span>附近</span></div>
  <div class="xhs-feed">${xhsNotes.map((n,i)=>xhsCard(n,i)).join('')}</div>
 </div>
 <div class="tabbar"><button class="on">${G.home}<span>首页</span></button><button>${G.search}<span>购物</span></button><button>${G.comment}<span>消息</span></button><button onclick="push('xhsProfile')">${G.person}<span>我</span></button></div>`});
VIEWS.xhsSearch=()=>{const q=(xhsQuery||'').trim();const body=n=>(n.title+' '+n.desc+' '+(n.body||'')).toLowerCase();const res=q?xhsNotes.map((n,i)=>[n,i]).filter(([n])=>body(n).includes(q.toLowerCase())):[];
 return{cls:'ig',html:`<div class="ig-h"><b>搜索</b><span style="flex:1"></span><button onclick="back()" style="width:26px;color:#111">${G.chevL}</button></div>
 <div class="scroll" style="padding-top:100px;padding-bottom:40px">
  <div class="xs-bar">${G.search}<input id="xsq" placeholder="搜索笔记 / 用户" value="${esc(q)}" readonly>${q?`<button class="xs-clear" onclick="xhsQuery='';show('xhsSearch')">✕</button>`:''}</div>
  ${q?`<div class="xs-h">搜索结果</div>${res.length?`<div class="xhs-feed">${res.map(([n,i])=>xhsCard(n,i)).join('')}</div>`:`<div class="xs-empty">没有找到「${esc(q)}」相关笔记<br><small>换个词试试</small></div>`}`
   :`<div class="xs-h">搜索历史</div><div class="xs-tags">${XHS_SEARCH.map(k=>`<button class="xs-tag" onclick="xhsQuery='${esc(k)}';show('xhsSearch')">${esc(k)}</button>`).join('')}</div>`}
 </div>`}};
VIEWS.xhsProfile=()=>({cls:'ig',html:`<div class="ig-h"><b>我的主页</b><span style="flex:1"></span><button onclick="back()" style="width:26px;color:#111">${G.chevL}</button></div>
 <div class="scroll" style="padding-top:98px;padding-bottom:110px">
  <div class="igp"><div class="pp"><img src="${A('media/avatar_xhs.jpg')}" alt=""></div><div class="st"><span><b>${xhsNotes.length}</b>${t('posts')}</span><span><b>1.2万</b>${t('followers')}</span><span><b>36</b>${t('following')}</span></div></div>
  <div class="igbio"><b>莱恩莱财莱一脚</b><br>${t('bio')}<br><span style="color:#999;font-size:13px">小红书号：zysj0203</span></div>
  <div class="igbtn"><button class="primary">${t('followingBtn')}</button><button>${t('message')}</button><button class="sq">${G.person.replace('<svg','<svg width="18" height="18"')}</button></div>
  <div class="igtabs"><span class="on">笔记 ${xhsNotes.length}</span><span>收藏</span><span>赞过</span></div>
  <div class="iggrid">${xhsNotes.map(n=>n.img?`<button onclick="openViewerSrc('${A(n.img)}',this.firstElementChild,'小红书')"><img src="${A(n.img)}" alt=""><span class="vc">❤ ${esc(n.likes)}</span></button>`:`<button class="xhs-ph-btn"><span>图片待补</span><span class="vc">❤ ${esc(n.likes)}</span></button>`).join('')}</div>
 </div>
 <div class="tabbar"><button onclick="show('xhs')">${G.home}<span>首页</span></button><button>${G.search}<span>购物</span></button><button>${G.comment}<span>消息</span></button><button class="on">${G.person}<span>我</span></button></div>`});

VIEWS.xhsPost=()=>{const n=xhsNotes[xhsId]||xhsNotes[0];return{cls:'ig xp',html:`<div class="ig-h"><b>笔记</b><span style="flex:1"></span><button onclick="back()" style="width:26px;color:#111">${G.chevL}</button></div>
 <div class="scroll" style="padding-top:100px;padding-bottom:40px">
  <div class="xp-head"><img class="xp-av" src="${A('media/avatar_xhs.jpg')}" alt=""><div style="flex:1"><b>${esc(XHS_AUTHOR)}</b><small>${t('followingBtn')}</small></div><button class="xp-follow">+ 关注</button></div>
  ${n.img?`<div class="xp-im" onclick="openViewerSrc('${A(n.img)}',this.firstElementChild,'小红书')"><img src="${A(n.img)}" alt=""></div>`:''}
  <div class="xp-bd"><h2>${esc(n.title)}</h2><div class="xp-text">${esc(n.body||n.desc)}</div></div>
  <div class="xp-ft"><span class="xp-tag">${esc(n.tag||'#日常')}</span><span>❤ ${esc(n.likes)} · ${esc(t('likedBy',n.likes))}</span></div>
  <div class="xp-comment">${G.comment}<input placeholder="说点什么…" readonly></div>
 </div>
 <div class="tabbar"><button onclick="show('xhs')">${G.home}<span>首页</span></button><button>${G.search}<span>购物</span></button><button>${G.comment}<span>消息</span></button><button class="on">${G.person}<span>我</span></button></div>`}};

/* --- 抖音 --- */
function douyinList(){return (typeof DOUYIN_VIDEOS!=='undefined'&&DOUYIN_VIDEOS)?DOUYIN_VIDEOS:[]}
function dyItemHTML(v,i){return `<div class="dy-item" data-i="${i}"><video src="${A(v.file)}" muted loop playsinline preload="metadata"></video><div class="dy-mask"></div>
 <div class="dy-side"><div class="dy-av"><img src="${A(v.avatar||'media/avatar_youmiao.jpg')}" alt=""></div>
  <button class="dy-act" onclick="event.stopPropagation();dyLike(this)"><span class="dy-i">${G.heart}</span><small>${esc(v.likes||'1.2万')}</small></button>
  <button class="dy-act" onclick="event.stopPropagation()"><span class="dy-i">${G.comment}</span><small>${esc(v.comments||'286')}</small></button>
  <button class="dy-act" onclick="event.stopPropagation()"><span class="dy-i">${G.share}</span><small>${esc(v.shares||'1234')}</small></button>
  <div class="dy-disc">${G.musicNote}</div></div>
 <div class="dy-cap"><b>@${esc(v.user||'由淼')}</b><p>${esc(v.text||'')}</p><div class="dy-music">♫ ${esc(v.music||'原声 - 由淼')}</div></div>
 <div class="dy-play">${G.playF}</div></div>`}
function dyLike(b){if(!b)return;b.classList.toggle('liked');vib(10)}
function dyGo(dir){const feed=document.getElementById('dyfeed');if(!feed)return;const H=feed.clientHeight;const items=[...feed.querySelectorAll('.dy-item')];if(!items.length)return;let cur=Math.round(feed.scrollTop/H);cur=Math.max(0,Math.min(items.length-1,cur+dir));feed.scrollTo({top:cur*H,behavior:'smooth'})}
function dyInit(pg){const feed=pg.querySelector('#dyfeed');const items=[...pg.querySelectorAll('.dy-item')];if(!items.length)return;
 const io=new IntersectionObserver(es=>{es.forEach(e=>{const v=e.target.querySelector('video');if(!v)return;if(e.isIntersecting){v.muted=true;v.play().catch(()=>{});e.target.classList.remove('paused')}else{v.pause()}})},{root:feed,threshold:.55});
 items.forEach(it=>io.observe(it));
 let my=null,dragged=false,lastWheel=0;
 feed.addEventListener('wheel',e=>{e.preventDefault();const now=Date.now();if(now-lastWheel<420||Math.abs(e.deltaY)<8)return;lastWheel=now;dyGo(e.deltaY>0?1:-1)},{passive:false});
 feed.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;my=e.clientY;dragged=false});
 feed.addEventListener('pointermove',e=>{if(my===null)return;if(Math.abs(e.clientY-my)>6)dragged=true});
 feed.addEventListener('pointerup',e=>{if(my===null)return;const d=e.clientY-my;my=null;if(Math.abs(d)>45){dragged=true;dyGo(d<0?1:-1)}});
 feed.addEventListener('click',e=>{if(dragged){dragged=false;return}if(e.target.closest('button')||e.target.closest('.dy-av')||e.target.closest('.dy-side'))return;const it=e.target.closest('.dy-item');if(!it)return;const v=it.querySelector('video');if(v.paused){v.play().catch(()=>{});it.classList.remove('paused')}else{v.pause();it.classList.add('paused')}vib(6)});
 feed.addEventListener('dblclick',e=>{const it=e.target.closest('.dy-item');if(it)dyLike(it.querySelector('.dy-act'))});
 pg._cleanup=()=>io.disconnect()}
VIEWS.douyin=()=>{const list=douyinList();return{cls:'dyv',dark:true,html:`
 <div class="dy-top"><div class="dy-tabs"><span>关注</span><b class="on">推荐</b><span>同城</span></div><button class="dy-search">${G.search}</button></div>
 <div class="dy-feed" id="dyfeed">${list.length?list.map(dyItemHTML).join(''):`<div class="dy-empty"><b>还没有视频</b><span>把视频放进 media/douyin/ 后重新构建</span></div>`}</div>`,
 init:pg=>dyInit(pg)}};

const artStyle=i=>ART[i]?`background-image:url(${ART[i]})`:'';
VIEWS.music=()=>({html:navHTML({title:t('songs'),back:t('libraryMu'),backFn:'closeApp()',right:''})+`<div class="scroll" style="padding-bottom:180px"><h1 class="lt">${t('songs')}</h1>
 <div style="display:flex;gap:12px;margin:4px 16px 14px"><button onclick="playSong(0)" style="flex:1;background:#eeeef0;border-radius:10px;padding:12px;color:#fa2d48;font-weight:600;display:flex;justify-content:center;gap:6px;align-items:center">${G.playF.replace('<svg','<svg width="14" fill="#fa2d48"')}${t('play')}</button><button onclick="playSong(Math.floor(Math.random()*${songs.length}))" style="flex:1;background:#eeeef0;border-radius:10px;padding:12px;color:#fa2d48;font-weight:600">${t('shuffle')}</button></div>
 ${songs.map((s,i)=>`<button class="mrow" onclick="playSong(${i})"><span class="art" style="${artStyle(i)}">${ART[i]?'':G.musicNote}</span><span class="mt ${i===nowSong?'pl':''}">${esc(s[0])}<small>${ARTIST[i]}</small></span><span style="color:#8e8e93">${G.dotsH.replace('<svg','<svg width="20"')}</span></button>`).join('')}</div>
 ${miniHTML()}${tabbar([['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m10 8.5 5 3.5-5 3.5Z" fill="currentColor"/></svg>',t('listenNow')],['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',t('browse')],['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></svg>',t('radio')],['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4v16M10 4v16M14.5 4.5l5 15"/></svg>',t('libraryMu')],['search',t('search')]],3).replace(/class="on"/,'class="on" style="color:#fa2d48"')}`});
function miniHTML(){if(nowSong<0)return '';return `<div class="mini" onclick="openNP()"><span class="art" style="${artStyle(nowSong)}">${ART[nowSong]?'':G.musicNote}</span><b>${esc(songs[nowSong][0])}</b><button onclick="event.stopPropagation();toggleSong()">${PLAYER.paused?G.playF:G.pauseF}</button><button onclick="event.stopPropagation();nextSong(1)">${G.fwdF.replace('<svg','<svg width="30"')}</button></div>`}
function playSong(i){if(!songs[i]||!songs[i][1]){showToast('音源待补：请提供《'+songs[i][0]+'》的音频文件');return}nowSong=i;delete PLAYER.dataset.voice;PLAYER.src=A(songs[i][1]);PLAYER.onended=()=>nextSong(1);PLAYER.play().catch(()=>{});if(view==='music'){const sc=APP.querySelector('.scroll').scrollTop;const pg=show('music');pg.querySelector('.scroll').scrollTop=sc}refreshNP()}
function toggleSong(){if(PLAYER.paused)PLAYER.play().catch(()=>{});else PLAYER.pause();setTimeout(()=>{if(view==='music'){const m=APP.querySelector('.mini');if(m)m.outerHTML=miniHTML()}refreshNP();updateIsland()},30)}
function nextSong(d){playSong((nowSong+d+songs.length)%songs.length)}
function openNP(){if(nowSong<0)return;const n=document.createElement('div');n.className='np';OV.appendChild(n);refreshNP();setStatus(true);n.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:480,easing:'cubic-bezier(.2,.9,.25,1)'});
 let y0=null,dy=0;n.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;y0=e.clientY;dy=0;n.setPointerCapture(e.pointerId)});n.addEventListener('pointermove',e=>{if(y0===null)return;dy=Math.max(0,(e.clientY-y0)/SC);n.style.transform=`translateY(${dy}px)`});n.addEventListener('pointerup',()=>{if(y0===null)return;y0=null;if(dy>120)closeNP();else{n.animate([{transform:n.style.transform},{transform:'none'}],{duration:280,easing:'cubic-bezier(.2,1.2,.4,1)'});n.style.transform=''}})}
function refreshNP(){const n=OV.querySelector('.np');if(!n||nowSong<0)return;const a=ART[nowSong]?`url(${ART[nowSong]})`:'linear-gradient(135deg,#ff9a9e,#fa2d48)';n.classList.toggle('paused',PLAYER.paused);
 n.innerHTML=`<div class="bgart" style="background-image:${a}"></div><button class="grab" onclick="closeNP()"></button><div class="bigart" style="background-image:${a}"></div><div class="ti">${esc(songs[nowSong][0])}<small>${ARTIST[nowSong]}</small></div><div class="bar"><i id="npbar"></i></div><div class="tt"><span id="npc">0:00</span><span id="npr">-0:00</span></div>
 <div class="ctl"><button onclick="nextSong(-1)">${G.bwdF.replace('<svg','<svg width="44"')}</button><button onclick="toggleSong()">${(PLAYER.paused?G.playF:G.pauseF).replace('<svg','<svg width="46"')}</button><button onclick="nextSong(1)">${G.fwdF.replace('<svg','<svg width="44"')}</button></div>`}
function closeNP(){const n=OV.querySelector('.np');if(!n)return;n.animate([{transform:n.style.transform||'none'},{transform:'translateY(100%)'}],{duration:340,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'}).onfinish=()=>{n.remove();setStatus(viewDark());updateIsland()}}
const fmtT=s=>Math.floor(s/60)+':'+pad(Math.floor(s%60));
PLAYER.addEventListener('timeupdate',()=>{const b=$('#npbar');if(b&&PLAYER.duration){b.style.width=(PLAYER.currentTime/PLAYER.duration*100)+'%';$('#npc').textContent=fmtT(PLAYER.currentTime);$('#npr').textContent='-'+fmtT(PLAYER.duration-PLAYER.currentTime)}});
PLAYER.addEventListener('play',updateIsland);PLAYER.addEventListener('pause',updateIsland);



let mapSel=null,mapPos={x:-480,y:-640};
function mapSVG(){return `<svg width="900" height="1200" viewBox="0 0 900 1200" style="position:absolute;inset:0">
 <rect width="900" height="1200" fill="#f2efe9"/>
 <path d="M0 980C160 940 260 1010 380 1080S640 1150 900 1120V1200H0Z" fill="#b9dcf7"/>
 <path d="M60 700h260v230H60Z" fill="#cfe8c4" rx="20"/><path d="M820 0h80v380h-80Z" fill="#cfe8c4"/>
 <rect x="110" y="110" width="460" height="460" rx="18" fill="#ece3d6"/>
 <g fill="#ddd2c2"><rect x="160" y="180" width="110" height="90" rx="6"/><rect x="400" y="190" width="120" height="110" rx="6"/><rect x="270" y="380" width="130" height="80" rx="6"/><rect x="160" y="400" width="80" height="90" rx="6"/><rect x="440" y="400" width="80" height="110" rx="6"/></g>
 <g fill="#e6e1d8"><rect x="610" y="640" width="90" height="70" rx="4"/><rect x="720" y="640" width="120" height="60" rx="4"/><rect x="610" y="730" width="70" height="90" rx="4"/><rect x="790" y="730" width="80" height="70" rx="4"/><rect x="610" y="900" width="140" height="60" rx="4"/><rect x="770" y="860" width="100" height="90" rx="4"/><rect x="640" y="340" width="120" height="60" rx="4"/><rect x="640" y="470" width="100" height="70" rx="4"/></g>
 <g stroke="#d8d3ca" stroke-width="22" fill="none" stroke-linecap="round"><path d="M0 605H900"/><path d="M590 0V1200"/><path d="M590 760H900"/><path d="M590 450H820"/><path d="M340 570V1000"/><path d="M760 760V980"/></g>
 <g stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round"><path d="M590 0V1200"/><path d="M590 760H900"/><path d="M590 450H820"/><path d="M340 570V1000"/><path d="M760 760V980"/></g>
 <path d="M0 605H900" stroke="#ffe08a" stroke-width="20"/>
 <g stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="2 9"><path d="M120 340H560M340 120V560"/></g>
 <g font-family="-apple-system,PingFang SC,Microsoft YaHei,sans-serif" fill="#8a8578" font-size="13" font-weight="600" text-anchor="middle">
  <text x="340" y="152" font-size="16" fill="#7d6b55">${t('m_univ')}</text>
  <text x="450" y="598" fill="#9a7d2c">${t('m_road')}</text><text x="604" y="250" transform="rotate(90 604 250)">${t('m_back')}</text><text x="830" y="752">${t('m_alley')}</text>
  <text x="335" y="425" font-size="11">${t('m_union')}</text><text x="200" y="450" font-size="11">${t('m_lib')}</text><text x="340" y="582" font-size="11">${t('m_gate')}</text><text x="560" y="1110" fill="#5b8fbf">${t('m_stream')}</text>
 </g></svg>`}
const MG={home:'<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4Z"/>',cup:'<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5Z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v2M11 3v2"/>',pin:'<circle cx="12" cy="10" r="3"/><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/>',bag:'<path d="M5 8h14l-1 12H6Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',game:'<rect x="3" y="8" width="18" height="10" rx="5"/><path d="M8 11v4M6 13h4"/><circle cx="15.5" cy="12" r=".6"/><circle cx="17" cy="14.5" r=".6"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',bowl:'<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0Z"/><path d="M9 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',bus:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M8 18v2.5M16 18v2.5"/><circle cx="8.5" cy="14.5" r=".7"/><circle cx="15.5" cy="14.5" r=".7"/>'};
const mg=k=>`<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${MG[k]}</svg>`;
const placeById=id=>MAP_PLACES.find(p=>p.id===id)||MAP_PLACES.find(p=>p.name===id);
function mapSheet(){if(mapSel){const p=placeById(mapSel);return `<div class="grab"></div><div class="mdet"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h2>${esc(p.name)}</h2><div class="sb">${esc(p.sub)}</div></div><button onclick="selPlace(null)" style="width:30px;height:30px;border-radius:50%;background:#e3e3e8;color:#7c7c80;font-size:17px">✕</button></div>
  <div class="acts"><button class="pri">${G.send.replace('<svg','<svg style="color:#fff"')}${p.id==='home'?t('currentLoc'):t('walkMin',p.walk||12)}</button><button>${G.star}${p.fav?t('favorited'):t('favorite')}</button><button>${G.share}${t('share')}</button><button>${G.dotsH}${t('moreInfo')}</button></div>
  <div class="inf">${(p.info.length?p.info:[[t('info'),t('noInfo')]]).map(r=>`<div><small>${esc(r[0])}</small>${esc(r[1])}</div>`).join('')}</div></div>`}
 const favs=MAP_PLACES.filter(p=>p.fav);
 return `<div class="grab"></div><div class="srch" style="margin:0 0 14px;background:rgba(118,118,128,.14)">${G.search}${t('searchMaps')}</div>
 <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:600;color:var(--grey);margin-bottom:8px"><span>${t('favorites')}</span><span style="color:var(--blue);font-weight:500">${t('moreInfo')}</span></div>
 <div class="mfav">${favs.map(p=>`<button onclick="selPlace('${p.id}')"><span class="fc" style="background:${p.color}">${mg(p.glyph)}</span>${esc(p.name)}<small>${p.id==='home'?t('currentLoc'):t('minN',p.walk||9)}</small></button>`).join('')}<button><span class="fc" style="background:#e3e3e8"><svg viewBox="0 0 24 24" style="stroke:var(--blue)"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg></span>${t('add')}<small>&nbsp;</small></button></div>
 <div style="font-size:15px;font-weight:600;color:var(--grey);margin:16px 0 8px">${t('recentsMap')}</div><div class="group" style="margin:0">${MAP_RECENTS.map(r=>`<button class="row tap" style="--inset:58px;min-height:56px" onclick="selPlace('${placeById(r[0]).id}')"><span class="st-ic" style="background:${placeById(r[0]).color};border-radius:50%">${mg(placeById(r[0]).glyph).replace('<svg','<svg style="stroke:#fff;fill:none;stroke-width:2"')}</span><span style="flex:1"><div style="font-size:16px">${esc(r[0])}</div><div class="muted" style="font-size:13px">${esc(r[1])}</div></span></button>`).join('')}</div>`}
function mapCanvas(){const pins=MAP_PLACES.map(p=>`<div class="mpin ${p.fav?'':'small'} ${mapSel===p.id?'sel':''}" style="left:${p.x}px;top:${p.y}px" onclick="event.stopPropagation();selPlace('${p.id}')"><span class="pc" style="background:${p.color}">${mg(p.glyph)}</span>${esc(p.name)}</div>`).join('');
 const h=placeById('home');return mapSVG()+`<div class="me-dot" style="left:${h.x-26}px;top:${h.y+30}px"></div>`+pins}
function setMapPos(x,y,anim){const cv=$('#mapcv');if(!cv)return;const W=SCREEN.clientWidth,H=SCREEN.clientHeight;mapPos={x:Math.min(0,Math.max(W-900,x)),y:Math.min(0,Math.max(H-1200,y))};const t=`translate(${mapPos.x}px,${mapPos.y}px)`;if(anim)cv.animate([{transform:cv.style.transform||'none'},{transform:t}],{duration:450,easing:'cubic-bezier(.2,.9,.25,1)'});cv.style.transform=t}
function centerOn(p,anim){const W=SCREEN.clientWidth,H=SCREEN.clientHeight;setMapPos(W/2-p.x,H*.27-p.y,anim)}
function selPlace(id){mapSel=id;const s=$('#msheet');if(s){s.innerHTML=mapSheet();s.animate([{transform:'translateY(16px)',opacity:.6},{transform:'none',opacity:1}],{duration:260})}
 document.querySelectorAll('.mpin').forEach(el=>el.classList.remove('sel'));if(id){const p=placeById(id);const i=MAP_PLACES.indexOf(p);const el=document.querySelectorAll('.mpin')[i];if(el)el.classList.add('sel');centerOn(p,true);vib(8)}}
VIEWS.maps=()=>({cls:'mapv',html:`<div class="mapwrap" id="mapwrap"><div class="mapcv" id="mapcv">${mapCanvas()}</div></div>
 <div class="mbtns"><button>${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7l9-4 9 4-9 4Z"/><path d="m3 12 9 4 9-4M3 17l9 4 9-4"/></svg>'}</button><button onclick="centerOn(placeById('home'),true)">${'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5 3.5 10.6l7.2 2.7 2.7 7.2Z"/></svg>'}</button></div>
 <div class="msheet" id="msheet">${mapSheet()}</div>`,
 init:pg=>{centerOn(placeById(mapSel||'home'));const w=pg.querySelector('#mapwrap');let x0=null,y0=0,sx=0,sy=0,mv=false;
  w.addEventListener('pointerdown',e=>{x0=e.clientX;y0=e.clientY;sx=mapPos.x;sy=mapPos.y;mv=false});
  w.addEventListener('pointermove',e=>{if(x0===null)return;const dx=(e.clientX-x0)/SC,dy=(e.clientY-y0)/SC;if(Math.hypot(dx,dy)>4)mv=true;if(mv){w.style.cursor='grabbing';setMapPos(sx+dx,sy+dy)}});
  w.addEventListener('pointerup',()=>{x0=null;w.style.cursor=''})}});


VIEWS.weather=()=>{const h=new Date().getHours();const hrs=[];for(let i=0;i<12;i++){const hh=(h+i)%24,night=hh>=19||hh<6;const tp=Math.round(17+4*Math.sin((hh-9)/24*2*Math.PI));hrs.push(`<div><span>${i?fmtHour(hh):t('now')}</span>${night?G.moon:(hh%5===0?G.pcloud:G.sun)}<span>${i?tp:19}°</span></div>`)}
 const days=[[G.sun,15,22],[G.pcloud,14,21],[G.cloud,13,19],[G.sun,12,20],[G.sun,12,21],[G.pcloud,13,20],[G.cloud,11,17],[G.sun,10,18],[G.sun,11,19],[G.pcloud,12,20]].map((d,i)=>[i?wdShort(STORY.y,STORY.m,STORY.d+i):t('today'),...d]);
 return{cls:'wx',dark:true,html:`<div class="scroll"><div class="top"><div class="lc">${t('myLoc')}</div><div class="ct">${t('city')}</div><div class="tp">19°</div><div class="ds">${t('mostlySunny')}</div><div style="font-size:18px;font-weight:500">${t('hiLo')}</div></div>
 <div class="wcard"><div class="wh" style="border:0;padding-bottom:6px;opacity:1;font-size:14px;font-weight:500">${t('wxSummary')}</div><div style="border-top:.5px solid rgba(255,255,255,.25);padding-top:12px" class="hrs">${hrs.join('')}</div></div>
 <div class="wcard"><div class="wh">${G.calSm.replace('<svg','<svg width="14" height="14"')}${t('tenDay')}</div>${days.map(d=>`<div class="d10"><span>${d[0]}</span>${d[1]}<span class="lo">${d[2]}°</span><span class="rng"><i style="left:${(d[2]-7)/15*100}%;right:${(22-d[3])/15*100}%"></i></span><span>${d[3]}°</span></div>`).join('')}</div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 16px"><div class="wcard" style="margin:0"><div class="wh">${t('uv')}</div><b style="font-size:30px">3</b><div>${t('moderate')}</div></div><div class="wcard" style="margin:0"><div class="wh">${t('sunset')}</div><b style="font-size:26px">${fmtTime(17*60+14)}</b><div style="font-size:14px">${t('sunrise')}: ${fmtTime(6*60+52)}</div></div></div></div>
 <div class="tabbar" style="background:rgba(40,90,170,.5);box-shadow:none"><button style="color:#fff">🗺</button><button style="color:#fff;flex:2;flex-direction:row;justify-content:center;gap:6px"><i style="width:7px;height:7px;border-radius:50%;background:#fff;display:block"></i></button><button style="color:#fff">${G.list}</button></div>`}};


const sIc=(c,i)=>`<span class="st-ic" style="background:${c}">${(G[i]||i).replace('<svg','<svg style="color:#fff" width="18" height="18"')}</span>`;
const sRow=(c,i,t,r='',fn)=>`<div class="row ${fn?'tap':''}" style="--inset:57px;cursor:${fn?'pointer':'default'}" ${fn?`onclick="${fn}"`:''}>${sIc(c,i)}<span style="flex:1">${t}</span>${r.startsWith('<button')?r:`<span class="muted" style="font-size:17px">${r}</span>${G.chevR}`}</div>`;
VIEWS.settings=()=>({cls:'grouped',html:navHTML({title:t('app_settings')})+`<div class="scroll"><h1 class="lt">${t('app_settings')}</h1><div class="srch">${G.search}${t('search')}</div>
 <div class="group" style="margin-bottom:22px"><div class="row" style="min-height:76px"><img src="${A('media/avatar_youmiao.jpg')}" style="width:58px;height:58px;border-radius:50%;object-fit:cover;flex:none"><div style="flex:1"><b style="font-size:20px;font-weight:500">由淼</b><div class="muted" style="font-size:13px">${t('acct')}</div></div>${G.chevR}</div></div>
 <div class="group" style="margin-bottom:22px">${sRow('#ff9500','<svg viewBox="0 0 24 24"><path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0v5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5Z" fill="#fff"/></svg>',t('airplane'),sw(false))}${sRow('#007aff','<svg viewBox="0 0 16 12"><path fill="#fff" d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.2A10.3 10.3 0 0 0 8 .6 10.3 10.3 0 0 0 .8 3.5L2 4.7a8.6 8.6 0 0 1 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.2A6.8 6.8 0 0 0 8 4a6.8 6.8 0 0 0-4.8 1.9l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Zm0 3.4c-.6 0-1.2.2-1.6.6L8 11.3l1.6-1.6c-.4-.4-1-.6-1.6-.6Z"/></svg>','无线局域网',t('wifiName'))}${sRow('#007aff','<svg viewBox="0 0 24 24"><path d="m7 7 10 10-5 4V3l5 4L7 17" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>','蓝牙',t('on'))}${sRow('#34c759','<svg viewBox="0 0 24 24"><path d="M12 4v16M7 9v11M17 7v13M2 13v7M22 11v9" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',t('cellular'))}${sRow('#34c759','<svg viewBox="0 0 24 24"><rect x="3" y="7" width="16" height="10" rx="2.5" fill="none" stroke="#fff" stroke-width="2"/><rect x="5.5" y="9.5" width="8" height="5" rx="1" fill="#fff"/></svg>',t('battery'),'64%')}</div>
 <div class="group" style="margin-bottom:22px">${sRow('#8e8e93','gear',t('general'))}${sRow('#007aff','person',t('access'))}${sRow('#8e8e93','camera',t('camera'))}${sRow('#32ade6','photo',t('wallpaper'))}${sRow('#8e8e93','search',t('search'))}</div>
 <div class="group" style="margin-bottom:22px">${sRow('#ff3b30','bellF',t('notif'))}${sRow('#ff2d55','speaker',t('sound'))}${sRow('#5856d6','<svg viewBox="0 0 24 24"><path d="M15.5 3.5A8.5 8.5 0 1 0 20.5 15 7 7 0 0 1 15.5 3.5Z" fill="#fff"/></svg>',t('focus'))}${sRow('#5856d6','<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9h-9Z" fill="#fff"/><path d="M14 3.2V10h6.8A9 9 0 0 0 14 3.2Z" fill="#fff" opacity=".7"/></svg>',t('screenTime'),'',"push('screentime')")}</div>
 <div class="group" style="margin-bottom:22px">${sRow('#34c759','<svg viewBox="0 0 24 24"><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 16c1.5 1 3.5 1 5 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',t('faceid'))}${sRow('#007aff','<svg viewBox="0 0 24 24"><path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="#fff" stroke-width="2"/><rect x="5" y="11" width="14" height="10" rx="2" fill="#fff"/></svg>',t('privacy'))}</div><div class="group" style="margin-bottom:22px">${sRow('#ff3b30','trash',t('resetProgress'),'',"resetProgress()")}</div></div>`});
VIEWS.screentime=()=>{const apps=[['wechat',t('hm',2,41),100],['xhs',t('hm',1,52),70],['music',t('mOnly',58),36],['photos',t('mOnly',31),19],['safari',t('mOnly',22),14]].map(a=>[a[0],t('app_'+a[0]),a[1],a[2]]);
 return{cls:'grouped',html:navHTML({title:t('screenTime'),back:t('app_settings')})+`<div class="scroll"><h1 class="lt">${t('screenTime')}</h1>
 <div class="gh" style="margin-top:8px">${t('youmiaoIphone')}</div><div class="group" style="padding:14px 16px"><div class="muted" style="font-size:13px">${t('dailyAvg')}</div><div style="font-size:28px;font-weight:600">${t('hm',6,48)}</div><div class="muted" style="font-size:13px">${t('upPct',32)}</div>
 <div class="bars">${[55,62,48,70,83,77,92].map(v=>`<i style="height:${v}%"></i>`).join('')}</div><div style="display:flex;justify-content:space-between;padding:4px 16px 0;font-size:11px;color:#8e8e93">${wdNarrow().map(d=>`<span>${d}</span>`).join('')}</div></div>
 <div class="gh">${t('mostUsed')}</div><div class="group">${apps.map(a=>`<div class="row" style="--inset:58px;min-height:54px"><span style="width:30px;height:30px;border-radius:7px;overflow:hidden;flex:none">${appIcon(a[0])}</span><div style="flex:1"><div style="font-size:16px">${a[1]}</div><div style="height:5px;border-radius:3px;background:#007aff;width:${a[3]}%;margin-top:5px;opacity:.85"></div></div><span class="muted" style="font-size:15px">${a[2]}</span></div>`).join('')}</div>
 <div class="gh">${t('pickups')}</div><div class="group"><div class="row"><span style="flex:1">${t('firstPickup')}</span><span class="muted">${fmtTime(7*60+2)}</span></div><div class="row"><span style="flex:1">${t('avgPickups')}</span><span class="muted">${t('pickN',143)}</span></div><div class="row"><span style="flex:1">${t('firstUsed')}</span><span class="muted">小红书</span></div></div>
 <div class="gh">${t('notifSec')}</div><div class="group"><div class="row"><span style="flex:1">${t('app_wechat')}</span><span class="muted">${t('perDay',41)}</span></div></div><div style="height:30px"></div></div>`}};


let toneIv=null,ringA=null;
function stopToneRing(){clearInterval(toneIv);toneIv=null}
function fallbackRing(){stopToneRing();ringOnce();toneIv=setInterval(ringOnce,2600)}
function startRing(){vib([400,250,400]);clearInterval(ringIv);ringIv=setInterval(()=>vib([400,250,400]),2600);
 try{ringA=ringA||new Audio(A('media/ringtone.mp3'));ringA.pause();ringA.currentTime=0;ringA.volume=1;const pr=ringA.play();if(pr&&pr.catch)pr.catch(()=>fallbackRing())}catch(e){fallbackRing()}}
function stopRing(){clearInterval(ringIv);ringIv=null;clearTimeout(ringTo);stopToneRing();if(ringA){try{ringA.pause();ringA.currentTime=0}catch(e){}}try{navigator.vibrate&&navigator.vibrate(0)}catch(e){}}
function incomingCall(){callName='周湘';callDir='in';callPrev=view;callState='ring';if(nowSong>=0||PLAYER.dataset.voice)PLAYER.pause();APP.querySelectorAll('video').forEach(v=>v.pause());OV.querySelectorAll('.banner').forEach(b=>b.remove());renderCall();startRing();ringTo=setTimeout(missCall,15000);saveState()}
function callTop(){const isZ=callName==='周湘';const av=isZ?`<div class="wav"><img src="${A('media/avatar_zhouxiang.jpg')}" alt=""></div>`:`<div class="wav"><span style="width:100%;height:100%;display:grid;place-items:center;background:linear-gradient(#a5abb6,#7f858f)">${/^[0-9*-]+$/.test(callName)?G.sil.replace('<svg','<svg width="64"'):`<b style="font-size:40px;color:#fff;font-weight:500">${esc([...dn(callName)][0])}</b>`}</span></div>`;return av+`<div class="wnm">${esc(dn(callName))}</div>`}
function renderCall(){let c=OV.querySelector('.call');if(!c){c=document.createElement('div');c.className='call wxc';OV.appendChild(c);c.animate([{opacity:0,transform:'scale(1.05)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.9,.25,1)'})}
 setStatus(true);const dl=callState==='dialing';
 if(callState==='ring'){c.innerHTML=`<div class="wtop">${t('wechatCall')}</div>${callTop()}<div class="wsub">${t('inviteVoice')}</div><div class="wact"><button class="wbtn red" onclick="declineCall()"><i><span class="handset">${G.handset}</span></i>${t('decline')}</button><button class="wbtn grn ringing" onclick="answerCall()"><i>${G.handset}</i>${t('accept')}</button></div>`}
 else{c.innerHTML=`<div class="wtop">${t('wechatCall')}</div>${callTop()}<div class="wtime" id="ctime">${dl?t('calling'):'00:00'}</div>${dl?'':`<div class="wcap" id="cap"><small>${t('liveCap')}</small>…</div>`}<div class="wctl"><button class="wbtn" onclick="this.classList.toggle('on');vib(8)"><i>${G.muteF}</i>${t('mute')}</button><button class="wbtn" onclick="this.classList.toggle('on');vib(8)"><i>${G.speaker}</i>${t('speaker')}</button><button class="wbtn hang" onclick="endCall()"><i><span class="handset">${G.handset}</span></i>${t('endCall')}</button></div>`}}
function answerCall(){if(callDir==='in'){curScript=speech;isEnding=true}stopRing();stopRingback();vib(20);callState='active';callStart=Date.now();capIdx=-1;renderCall();saveState()}
function declineCall(){stopRing();callState='';declined++;extraCalls.unshift(['周湘','今天 '+fmtTime(22*60+44+extraCalls.length),'未接']);branchAfter('decline');closeCallUI();saveState()}
function missCall(){if(callState!=='ring')return;stopRing();callState='';declined++;extraCalls.unshift(['周湘','今天 '+fmtTime(22*60+44+extraCalls.length),'未接']);branchAfter('miss');closeCallUI();if(['lock','pin'].includes(view)){lockNotes.unshift({title:t('missedCall'),body:dn('周湘'),app:'phone',time:t('now')});renderLock()}saveState()}
function endCall(){if(callState==='dialing'){clearCallTimers();stopRingback();callState='';extraCalls.unshift([callName,'今天 '+fmtTime(22*60+44+extraCalls.length),'拨出']);closeCallUI();if(view==='phone')show('phone');saveState();return}
 if(callState!=='active')return;callState='ended';vib(15);const tEl=$('#ctime');if(tEl)tEl.textContent=t_('callEnded');const c=OV.querySelector('.call');c&&c.querySelectorAll('.wbtn').forEach(b=>b.style.opacity=.4);
 extraCalls.unshift([callName,'今天 '+fmtTime(22*60+44+extraCalls.length),callDir==='out'?'拨出':'接听']);if(isEnding)phoneDone=true;isEnding=false;saveState();setTimeout(()=>{callState='';closeCallUI();if(view==='phone')show('phone');afterCallTopics()},1100)}
let callDir='in',curScript=null,isEnding=false;
function clearCallTimers(){callTimers.forEach(clearTimeout);callTimers=[]}
function startRingback(){const r=()=>{tone(440,0,1,.05);tone(480,0,1,.05)};r();clearInterval(rbIv);rbIv=setInterval(r,3000)}
function stopRingback(){clearInterval(rbIv);rbIv=null}
function dial(name){if(callState)return;callName=name;callDir='out';callPrev=view;callState='dialing';if(nowSong>=0||PLAYER.dataset.voice)PLAYER.pause();renderCall();startRingback();vib(10);
 const pick=(sc,ms,end)=>{callTimers.push(setTimeout(()=>{if(callState!=='dialing')return;curScript=sc;isEnding=!!end;answerCall()},ms))};
 if(name==='周湘'&&!phoneDone&&callTriggered)pick(speech,4200,true);
 else if(name==='周湘'&&phoneDone)pick(SOHEE_AFTER,6000);
 else if(name==='周湘'){callTimers.push(setTimeout(()=>{if(callState!=='dialing')return;rejectOut(t('callEnded'));if(!busySent){busySent=true;['你在忙吗','那我等你忙完','先不打扰你啦'].forEach((m,k)=>setTimeout(()=>deliverSohee(m),2500+k*2600))}},3500))}
 else if(OTHER_CALLS[name])pick(OTHER_CALLS[name],/^0/.test(name)?1800:3000+Math.random()*3000);
 else{callTimers.push(setTimeout(()=>{if(callState==='dialing')rejectOut(t('noAnswer'))},9000))}}
function rejectOut(msg){stopRingback();clearCallTimers();const tEl=$('#ctime');if(tEl)tEl.textContent=msg;tone(480,0,.25,.05);tone(480,.35,.25,.05);tone(480,.7,.25,.05);extraCalls.unshift([callName,'今天 '+fmtTime(22*60+44+extraCalls.length),'拨出']);callState='ended';
 const c=OV.querySelector('.call');c&&c.querySelectorAll('.wbtn').forEach(b=>b.style.opacity=.4);saveState();setTimeout(()=>{callState='';closeCallUI();if(view==='phone')show('phone')},1300)}
function closeCallUI(){const c=OV.querySelector('.call');if(!c)return;c.animate([{opacity:1},{opacity:0,transform:'scale(1.04)'}],{duration:320,fill:'forwards'}).onfinish=()=>{c.remove();setStatus(viewDark());updateIsland();if(view==='home')renderHome()}}


let lastMin=-1;
function tick(){typeof updateCrumb==="function"&&updateCrumb();const now=new Date();$('#sbt').textContent=clock12();const lk=$('#lkt');if(lk)lk.textContent=clock12();
 if(now.getMinutes()!==lastMin){lastMin=now.getMinutes();if(view==='home'&&!HOME.getAnimations().length)renderHome()}
 const e=elapsed();
 if(!callTriggered&&e>=60){callTriggered=true;saveState();if(!callState&&!phoneDone&&!declined)incomingCall()}
 if(callState==='active'){const sec=Math.floor((Date.now()-callStart)/1000);const tm=$('#ctime');if(tm)tm.textContent=pad(Math.floor(sec/60))+':'+pad(sec%60);
  const S=curScript||speech;const idx=Math.min(S.length-1,Math.floor(sec/3));if(idx!==capIdx){capIdx=idx;const cap=$('#cap');if(cap){cap.animate([{opacity:.2,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:280});cap.innerHTML=`<small>${esc(dn(S[idx][0]))}</small>${esc(S[idx][1])}`}}
  if(sec>S.length*3+2)endCall()}}

function fit(){const ph=$('#phone');const mob=innerWidth<=540;ph.classList.toggle('mob',mob);ph.classList.toggle('short',mob&&innerHeight<740);if(mob){ph.style.width=innerWidth+'px';ph.style.height=innerHeight+'px';ph.style.transform='';SC=1}else{ph.style.width='393px';ph.style.height='852px';SC=Math.min((innerHeight-40)/852,(innerWidth-40)/393,1.1);ph.style.transform=`scale(${SC})`}}
const SAVE_KEY='youmiao_phone_v6';
let unlocked=false;
function saveState(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({v:7,unlocked:unlocked,todayChat:todayChat,chatStage:chatStage,doneKeys:doneKeys,autoMsgDone:autoMsgDone,callTriggered:callTriggered,callBranch:callBranch,phoneDone:phoneDone,declined:declined,extraCalls:extraCalls,readMail:[...readMail],alarmStates:alarmStates,lockNotes:lockNotes}))}catch(e){}}
function loadState(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(!s||s.v!==7)return false;
 unlocked=!!s.unlocked;todayChat=s.todayChat||[];chatStage=s.chatStage||'pre';doneKeys=s.doneKeys||{};autoMsgDone=!!s.autoMsgDone;callTriggered=!!s.callTriggered;callBranch=s.callBranch||'';phoneDone=!!s.phoneDone;declined=s.declined||0;extraCalls=s.extraCalls||[];if(s.readMail)readMail=new Set(s.readMail);if(s.alarmStates)alarmStates=s.alarmStates;if(s.lockNotes)lockNotes=s.lockNotes;
 return true}catch(e){return false}}
function resetProgress(){try{localStorage.removeItem(SAVE_KEY)}catch(e){}location.reload()}

addEventListener('resize',fit);fit();
const restored=loadState();
renderLock();renderHome();setStatus(true);
if(restored&&unlocked){view='home';LOCK.style.visibility='hidden';$('#pinL').style.display='none';$('#wall').classList.remove('dim');HOME.style.visibility='visible';renderHome();setStatus(true)}
setInterval(tick,250);tick();
