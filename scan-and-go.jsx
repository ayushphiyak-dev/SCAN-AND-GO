import { useState, useEffect } from "react";

const T = {
  cream:"#FDFAF4", paper:"#FFFFFF", ink:"#111118", ink2:"#3D3D4E", ink3:"#8888A0",
  border:"#E8E4DC", border2:"#F0EDE6",
  orange:"#FF6B00", orangeL:"#FFF0E6", orangeM:"#FFD6B3",
  indigo:"#1B2CC1", indigoL:"#EEF0FC",
  green:"#16A34A", greenL:"#DCFCE7",
  yellow:"#D97706", yellowL:"#FEF3C7",
  red:"#DC2626", redL:"#FEE2E2",
  sh:"0 1px 3px rgba(17,17,24,0.06), 0 4px 16px rgba(17,17,24,0.04)",
  shM:"0 4px 20px rgba(17,17,24,0.10), 0 1px 4px rgba(17,17,24,0.06)",
  shL:"0 12px 40px rgba(17,17,24,0.14)",
};

const PRODUCTS = [
  {id:"P01",name:"Full Cream Milk 1L",     price:68,  emoji:"🥛",cat:"Dairy",  age:false},
  {id:"P02",name:"Multigrain Bread",        price:149, emoji:"🍞",cat:"Bakery", age:false},
  {id:"P03",name:"Amul Cheddar 200g",       price:349, emoji:"🧀",cat:"Dairy",  age:false},
  {id:"P04",name:"Shimla Apples 6pk",       price:199, emoji:"🍎",cat:"Produce",age:false},
  {id:"P05",name:"Real Orange Juice 1L",    price:135, emoji:"🍊",cat:"Drinks", age:false},
  {id:"P06",name:"Penne Pasta 500g",        price:89,  emoji:"🍝",cat:"Pantry", age:false},
  {id:"P07",name:"Del Monte Tomato Sauce",  price:95,  emoji:"🍅",cat:"Pantry", age:false},
  {id:"P08",name:"Epigamia Greek Yogurt",   price:199, emoji:"🥣",cat:"Dairy",  age:false},
  {id:"P09",name:"Blue Tokai Coffee 250g",  price:499, emoji:"☕",cat:"Drinks", age:false},
  {id:"P10",name:"Country Eggs x12",        price:168, emoji:"🥚",cat:"Dairy",  age:false},
  {id:"P11",name:"Himalaya Sparkling 6pk",  price:249, emoji:"💧",cat:"Drinks", age:false},
  {id:"P12",name:"Kingfisher Premium 4pk",  price:620, emoji:"🍺",cat:"Alcohol",age:true },
  {id:"P13",name:"Baby Spinach 150g",       price:79,  emoji:"🥬",cat:"Produce",age:false},
  {id:"P14",name:"Quaker Oats 1kg",         price:299, emoji:"🌾",cat:"Pantry", age:false},
  {id:"P15",name:"Amul Dark Choc 100g",     price:185, emoji:"🍫",cat:"Snacks", age:false},
];

const TXNS = [
  {id:"#3821",name:"Priya S.", items:7, total:1840,status:"exited",    trust:94,time:"2m"},
  {id:"#3820",name:"Arjun M.",items:12,total:4107,status:"spot-check",trust:61,time:"6m"},
  {id:"#3819",name:"Kavya R.",items:4, total:876, status:"exited",    trust:91,time:"9m"},
  {id:"#3818",name:"Rohan P.",items:19,total:8744,status:"age-check", trust:78,time:"13m"},
  {id:"#3817",name:"Sneha T.",items:6, total:2218,status:"exited",    trust:97,time:"17m"},
  {id:"#3816",name:"Dev K.",  items:3, total:947, status:"flagged",   trust:28,time:"21m"},
];

const inr = n => "₹" + n.toLocaleString("en-IN");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const genToken = () => Array.from({length:8},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join("");

function QRDisplay({token, expired, ageFlag}) {
  const [frame,setFrame]=useState(0);
  useEffect(()=>{
    if(expired)return;
    const id=setInterval(()=>setFrame(f=>f+1),900);
    return()=>clearInterval(id);
  },[expired]);
  const sz=19;
  const seed=token.split("").reduce((a,c,i)=>a+c.charCodeAt(0)*(i+1),0);
  const cell=(r,c)=>((seed*(r*31+c*17)+frame*3)%7)<3?1:0;
  const isCorner=(r,c)=>(r<7&&c<7)||(r<7&&c>=sz-7)||(r>=sz-7&&c<7);
  const accent=expired?"#C4C4C4":ageFlag?T.yellow:T.indigo;
  return(
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
      {!expired&&<div style={{position:"absolute",inset:-12,borderRadius:20,border:`2px solid ${accent}22`,animation:"ringPulse 2s ease-in-out infinite"}}/>}
      <div style={{background:expired?"#F5F5F5":T.paper,border:`2px solid ${expired?"#E0E0E0":accent+"44"}`,borderRadius:16,padding:16,boxShadow:expired?"none":`0 0 0 4px ${accent}11, ${T.shM}`}}>
        <svg width={148} height={148} viewBox={`0 0 ${sz} ${sz}`} style={{display:"block",opacity:expired?0.3:1}}>
          {Array.from({length:sz},(_,r)=>Array.from({length:sz},(_,c)=>{
            if(isCorner(r,c))return null;
            return cell(r,c)?<rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={accent} opacity={0.9}/>:null;
          }))}
          {[[0,0],[0,sz-7],[sz-7,0]].map(([br,bc],i)=>(
            <g key={i}>
              <rect x={bc} y={br} width={7} height={7} fill="none" stroke={accent} strokeWidth={0.6}/>
              <rect x={bc+1.5} y={br+1.5} width={4} height={4} fill={accent} opacity={0.12}/>
              <rect x={bc+2} y={br+2} width={3} height={3} fill={accent}/>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function TrustPill({score}){
  const color=score>=80?T.green:score>=50?T.yellow:T.red;
  const bg=score>=80?T.greenL:score>=50?T.yellowL:T.redL;
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:5,background:bg,border:`1px solid ${color}33`,borderRadius:20,padding:"3px 10px"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:color,display:"inline-block"}}/>
      <span style={{color,fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{score}</span>
    </span>
  );
}

function StatusBadge({status}){
  const m={
    "exited":    {bg:T.greenL, color:T.green, label:"Exited"},
    "spot-check":{bg:T.yellowL,color:T.yellow,label:"Spot Check"},
    "age-check": {bg:T.yellowL,color:T.yellow,label:"Age Check"},
    "flagged":   {bg:T.redL,   color:T.red,   label:"Flagged"},
  };
  const s=m[status]||{bg:"#eee",color:"#888",label:status};
  return(
    <span style={{background:s.bg,color:s.color,border:`1px solid ${s.color}33`,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700,letterSpacing:0.3}}>{s.label}</span>
  );
}

function Scanner({onScan,scanned}){
  const [line,setLine]=useState(20);
  const [dir,setDir]=useState(1);
  const [flash,setFlash]=useState(null);
  const [busy,setBusy]=useState(false);
  const avail=PRODUCTS.filter(p=>!scanned.has(p.id));
  useEffect(()=>{
    const id=setInterval(()=>setLine(l=>{
      const n=l+dir*1.6;
      if(n>=88){setDir(-1);return 88;}
      if(n<=12){setDir(1);return 12;}
      return n;
    }),18);
    return()=>clearInterval(id);
  },[dir]);
  const tap=async p=>{
    if(busy)return;
    setBusy(true);setFlash(p);
    await sleep(900);
    onScan(p);setFlash(null);setBusy(false);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{position:"relative",height:176,background:"#0C0C18",borderRadius:16,overflow:"hidden",boxShadow:T.shM}}>
        <div style={{position:"absolute",left:20,right:20,top:`${line}%`,height:2,background:"linear-gradient(90deg,transparent 0%,#FF6B00 20%,#FF6B00 80%,transparent 100%)",boxShadow:"0 0 12px #FF6B00CC",transition:"top 0.018s linear"}}/>
        {[["top:14px","left:14px","borderTop","borderLeft"],["top:14px","right:14px","borderTop","borderRight"],["bottom:14px","left:14px","borderBottom","borderLeft"],["bottom:14px","right:14px","borderBottom","borderRight"]].map(([v,h,b1,b2],i)=>(
          <div key={i} style={{position:"absolute",width:22,height:22,[v.split(":")[0]]:v.split(":")[1],[h.split(":")[0]]:h.split(":")[1],[b1]:"2.5px solid #FF6B00",[b2]:"2.5px solid #FF6B00",borderRadius:i===0?"4px 0 0 0":i===1?"0 4px 0 0":i===2?"0 0 0 4px":"0 0 4px 0"}}/>
        ))}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {flash?(
            <div style={{textAlign:"center",animation:"popIn 0.25s cubic-bezier(.34,1.56,.64,1)"}}>
              <div style={{fontSize:36,lineHeight:1}}>{flash.emoji}</div>
              <div style={{color:"#FF6B00",fontWeight:800,fontSize:12,marginTop:6,fontFamily:"'Syne',sans-serif",letterSpacing:1}}>✓ ADDED</div>
              <div style={{color:"#ffffff88",fontSize:11,marginTop:2}}>{flash.name}</div>
            </div>
          ):(
            <div style={{color:"#ffffff22",fontSize:11,letterSpacing:3,fontFamily:"'Syne',sans-serif"}}>TAP BELOW TO SCAN</div>
          )}
        </div>
        <div style={{position:"absolute",top:10,right:10,display:"flex",alignItems:"center",gap:5,background:"#00000066",borderRadius:20,padding:"4px 10px"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#FF6B00",animation:"blink 1s infinite"}}/>
          <span style={{color:"#FF6B0099",fontSize:9,fontWeight:700,letterSpacing:1,fontFamily:"'Syne',sans-serif"}}>LIVE</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxHeight:200,overflowY:"auto",paddingBottom:4}}>
        {avail.map(p=>(
          <button key={p.id} onClick={()=>tap(p)} style={{background:T.paper,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"11px 12px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",textAlign:"left",boxShadow:T.sh,transition:"all 0.15s ease"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.orange;e.currentTarget.style.boxShadow=T.shM;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow=T.sh;}}>
            <span style={{fontSize:22,lineHeight:1}}>{p.emoji}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:T.ink,fontSize:11.5,fontWeight:600,lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.name}{p.age?" 🔞":""}</div>
              <div style={{color:T.orange,fontWeight:800,fontSize:13,marginTop:3,fontFamily:"'Syne',sans-serif"}}>{inr(p.price)}</div>
            </div>
          </button>
        ))}
        {avail.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"28px 0",color:T.ink3,fontSize:13}}>All items scanned ✓</div>}
      </div>
    </div>
  );
}

function ShopperApp(){
  const [screen,setScreen]=useState("home");
  const [cart,setCart]=useState([]);
  const [seen,setSeen]=useState(new Set());
  const [paying,setPaying]=useState(false);
  const [paid,setPaid]=useState(false);
  const [token,setToken]=useState(null);
  const [expired,setExpired]=useState(false);
  const [timeLeft,setTimeLeft]=useState(300);
  const trust=87;

  useEffect(()=>{
    if(screen!=="qr"||expired)return;
    const id=setInterval(()=>setTimeLeft(t=>{if(t<=1){setExpired(true);return 0;}return t-1;}),1000);
    return()=>clearInterval(id);
  },[screen,expired]);

  const addItem=p=>{setSeen(s=>new Set([...s,p.id]));setCart(c=>[...c,{...p,qty:1,cid:Date.now()+Math.random()}]);};
  const chgQty=(cid,d)=>setCart(c=>c.map(i=>i.cid===cid?{...i,qty:Math.max(1,i.qty+d)}:i));
  const del=cid=>{const it=cart.find(i=>i.cid===cid);setCart(c=>c.filter(i=>i.cid!==cid));setSeen(s=>{const n=new Set(s);n.delete(it.id);return n;});};
  const sub=cart.reduce((a,i)=>a+i.price*i.qty,0);
  const gst=Math.round(sub*0.05);
  const total=sub+gst;
  const items=cart.reduce((a,i)=>a+i.qty,0);
  const hasAge=cart.some(i=>i.age);
  const pay=async()=>{
    setPaying(true);await sleep(2100);setPaid(true);await sleep(700);
    setToken(genToken());setTimeLeft(300);setExpired(false);setScreen("qr");setPaying(false);setPaid(false);
  };
  const reset=()=>{setCart([]);setSeen(new Set());setToken(null);setExpired(false);setScreen("home");};

  if(screen==="home")return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{background:"linear-gradient(135deg,#FF6B00 0%,#FF9A00 100%)",borderRadius:20,padding:"22px 22px 20px",position:"relative",overflow:"hidden",boxShadow:"0 6px 24px #FF6B0033"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,borderRadius:"50%",background:"#FFFFFF11"}}/>
        <div style={{position:"absolute",right:20,top:20,width:60,height:60,borderRadius:"50%",background:"#FFFFFF11"}}/>
        <div style={{color:"#FFFFFF99",fontSize:11,fontWeight:700,letterSpacing:2,fontFamily:"'Syne',sans-serif"}}>WELCOME BACK</div>
        <div style={{color:"#FFF",fontSize:22,fontWeight:800,marginTop:4,fontFamily:"'Syne',sans-serif",lineHeight:1.2}}>Skip the queue,<br/>scan & go 🛒</div>
        <div style={{marginTop:14,display:"flex",alignItems:"center",gap:8}}>
          <div style={{background:"#FFFFFF22",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:12}}>🏆</span>
            <span style={{color:"#FFF",fontSize:11,fontWeight:700}}>Trust Score: {trust}/100</span>
          </div>
          <div style={{background:"#FFFFFF22",borderRadius:20,padding:"5px 12px"}}>
            <span style={{color:"#FFF",fontSize:11,fontWeight:700}}>✓ Verified</span>
          </div>
        </div>
      </div>
      <div style={{background:T.paper,borderRadius:16,border:`1px solid ${T.border}`,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:T.sh}}>
        <div style={{width:42,height:42,borderRadius:12,background:T.orangeL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏬</div>
        <div>
          <div style={{color:T.ink,fontWeight:700,fontSize:14}}>Phoenix Palassio</div>
          <div style={{color:T.ink3,fontSize:11,marginTop:1}}>Lucknow · Hypermarket Floor 2</div>
        </div>
        <div style={{marginLeft:"auto"}}>
          <div style={{color:T.green,fontSize:10,fontWeight:700,background:T.greenL,borderRadius:20,padding:"3px 10px"}}>● Open</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[{icon:"🕐",label:"Avg Time",value:"4 min"},{icon:"📦",label:"Txns Today",value:"1,284"},{icon:"⚡",label:"Queues",value:"Zero"}].map(s=>(
          <div key={s.label} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,padding:"14px 10px",textAlign:"center",boxShadow:T.sh}}>
            <div style={{fontSize:20}}>{s.icon}</div>
            <div style={{color:T.ink,fontWeight:900,fontSize:13,marginTop:6,fontFamily:"'Syne',sans-serif"}}>{s.value}</div>
            <div style={{color:T.ink3,fontSize:10,marginTop:2}}>{s.label}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>setScreen("scan")} style={{background:T.ink,color:"#FFF",border:"none",borderRadius:14,padding:"17px",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"'Syne',sans-serif",letterSpacing:0.5,boxShadow:"0 6px 20px rgba(17,17,24,0.25)",transition:"transform 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
        onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
        Start Scanning →
      </button>
    </div>
  );

  if(screen==="scan")return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{color:T.ink,fontWeight:800,fontSize:18,fontFamily:"'Syne',sans-serif"}}>Scan Items</div>
          <div style={{color:T.ink3,fontSize:12,marginTop:1}}>{items} items · {inr(sub)}</div>
        </div>
        <button onClick={()=>setScreen("cart")} disabled={!cart.length} style={{background:cart.length?T.orange:T.border,color:cart.length?"#FFF":T.ink3,border:"none",borderRadius:10,padding:"9px 16px",fontWeight:700,fontSize:12,cursor:cart.length?"pointer":"not-allowed",fontFamily:"'Syne',sans-serif"}}>
          Cart ({items}) →
        </button>
      </div>
      <Scanner onScan={addItem} scanned={seen}/>
      {cart.length>0&&(
        <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",boxShadow:T.sh}}>
          <div style={{padding:"9px 14px",borderBottom:`1px solid ${T.border2}`}}>
            <span style={{color:T.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>JUST ADDED</span>
          </div>
          {cart.slice(-3).reverse().map(it=>(
            <div key={it.cid} style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${T.border2}`,animation:"slideIn 0.2s ease"}}>
              <span style={{fontSize:20}}>{it.emoji}</span>
              <span style={{flex:1,color:T.ink,fontSize:13}}>{it.name}</span>
              <span style={{color:T.orange,fontWeight:700,fontSize:13,fontFamily:"'Syne',sans-serif"}}>{inr(it.price)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if(screen==="cart")return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>setScreen("scan")} style={{background:T.paper,border:`1px solid ${T.border}`,color:T.ink2,borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>← Back</button>
        <div style={{color:T.ink,fontWeight:800,fontSize:18,fontFamily:"'Syne',sans-serif"}}>Your Cart</div>
        <span style={{background:T.orangeL,color:T.orange,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{items}</span>
      </div>
      {hasAge&&(
        <div style={{background:T.yellowL,border:`1px solid ${T.yellow}33`,borderRadius:12,padding:"12px 14px",display:"flex",gap:10}}>
          <span>⚠️</span>
          <div>
            <div style={{color:T.yellow,fontWeight:700,fontSize:13}}>Age Verification at Exit</div>
            <div style={{color:T.yellow,fontSize:11,opacity:0.8,marginTop:2}}>Your QR will show YELLOW — carry a valid ID</div>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:280,overflowY:"auto"}}>
        {cart.map(it=>(
          <div key={it.cid} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:12,boxShadow:T.sh}}>
            <span style={{fontSize:26}}>{it.emoji}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:T.ink,fontSize:13,fontWeight:600}}>{it.name}</div>
              <div style={{color:T.ink3,fontSize:11,marginTop:1}}>{inr(it.price)} each</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <button onClick={()=>chgQty(it.cid,-1)} style={{width:26,height:26,borderRadius:8,background:T.border2,border:"none",color:T.ink,cursor:"pointer",fontWeight:700,fontSize:15}}>−</button>
              <span style={{color:T.ink,fontWeight:800,fontSize:14,minWidth:20,textAlign:"center",fontFamily:"'Syne',sans-serif"}}>{it.qty}</span>
              <button onClick={()=>chgQty(it.cid, 1)} style={{width:26,height:26,borderRadius:8,background:T.border2,border:"none",color:T.ink,cursor:"pointer",fontWeight:700,fontSize:15}}>+</button>
              <button onClick={()=>del(it.cid)} style={{width:26,height:26,borderRadius:8,background:T.redL,border:"none",color:T.red,cursor:"pointer",fontSize:14}}>✕</button>
            </div>
            <div style={{color:T.orange,fontWeight:800,fontSize:14,minWidth:54,textAlign:"right",fontFamily:"'Syne',sans-serif"}}>{inr(it.price*it.qty)}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:T.sh}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border2}`}}>
          <span style={{color:T.ink2,fontWeight:700,fontSize:11,letterSpacing:0.5}}>BILL SUMMARY</span>
        </div>
        <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:T.ink3,fontSize:13}}>MRP Total</span>
            <span style={{color:T.ink,fontSize:13,fontWeight:600}}>{inr(sub)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:T.ink3,fontSize:13}}>GST (5%)</span>
            <span style={{color:T.ink,fontSize:13,fontWeight:600}}>{inr(gst)}</span>
          </div>
          <div style={{borderTop:`1px dashed ${T.border}`,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
            <span style={{color:T.ink,fontWeight:800,fontSize:16,fontFamily:"'Syne',sans-serif"}}>To Pay</span>
            <span style={{color:T.orange,fontWeight:900,fontSize:20,fontFamily:"'Syne',sans-serif"}}>{inr(total)}</span>
          </div>
        </div>
      </div>
      <button onClick={()=>setScreen("pay")} style={{background:T.orange,color:"#FFF",border:"none",borderRadius:14,padding:"17px",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"'Syne',sans-serif",boxShadow:"0 6px 20px #FF6B0033"}}>
        Proceed to Pay {inr(total)} →
      </button>
    </div>
  );

  if(screen==="pay")return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>setScreen("cart")} style={{background:T.paper,border:`1px solid ${T.border}`,color:T.ink2,borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>← Back</button>
        <div style={{color:T.ink,fontWeight:800,fontSize:18,fontFamily:"'Syne',sans-serif"}}>Payment</div>
      </div>
      <div style={{background:"linear-gradient(135deg,#1B2CC1,#2D3EE0)",borderRadius:20,padding:"24px",textAlign:"center",boxShadow:"0 8px 28px #1B2CC133"}}>
        <div style={{color:"#FFFFFF88",fontSize:12,fontWeight:600}}>Total Amount</div>
        <div style={{color:"#FFF",fontSize:44,fontWeight:900,fontFamily:"'Syne',sans-serif",letterSpacing:-1,lineHeight:1.1}}>{inr(total)}</div>
        <div style={{color:"#FFFFFF66",fontSize:12,marginTop:6}}>{items} items · GST included</div>
      </div>
      {paying?(
        <div style={{textAlign:"center",padding:"32px 0"}}>
          <div style={{width:52,height:52,borderRadius:"50%",border:`3px solid ${T.orange}`,borderTopColor:"transparent",margin:"0 auto 16px",animation:"spin 0.9s linear infinite"}}/>
          <div style={{color:T.ink,fontWeight:700,fontSize:15}}>Processing Payment…</div>
          <div style={{color:T.ink3,fontSize:12,marginTop:4}}>Connecting to your bank</div>
        </div>
      ):paid?(
        <div style={{textAlign:"center",padding:"24px 0"}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:T.greenL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28}}>✓</div>
          <div style={{color:T.green,fontWeight:800,fontSize:16}}>Payment Successful!</div>
          <div style={{color:T.ink3,fontSize:12,marginTop:4}}>Generating exit pass…</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{color:T.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>CHOOSE PAYMENT METHOD</div>
          {[
            {id:"upi",  icon:"⚡",label:"UPI / PhonePe / GPay",sub:"Instant, zero charges",bg:"#E8F5E9",fg:T.ink},
            {id:"apple",icon:"🍎",label:"Apple Pay",           sub:"Tap to pay",           bg:T.ink,   fg:"#FFF"},
            {id:"card", icon:"💳",label:"Credit / Debit Card", sub:"Visa · Mastercard · RuPay",bg:T.paper,fg:T.ink},
            {id:"wlt",  icon:"👛",label:"Paytm / Amazon Pay",  sub:"Wallet balance",       bg:"#FFF7E6",fg:T.ink},
          ].map(m=>(
            <button key={m.id} onClick={pay} style={{background:m.bg,border:`1.5px solid ${m.id==="card"?T.border:m.bg}`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",textAlign:"left",boxShadow:T.sh,transition:"transform 0.12s, box-shadow 0.12s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=T.shM;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=T.sh;}}>
              <span style={{fontSize:22}}>{m.icon}</span>
              <div>
                <div style={{color:m.fg,fontWeight:700,fontSize:14}}>{m.label}</div>
                <div style={{color:m.fg,opacity:0.55,fontSize:11,marginTop:2}}>{m.sub}</div>
              </div>
              <span style={{marginLeft:"auto",color:m.fg,opacity:0.4,fontSize:18}}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if(screen==="qr")return(
    <div style={{display:"flex",flexDirection:"column",gap:16,alignItems:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{color:T.ink,fontWeight:900,fontSize:20,fontFamily:"'Syne',sans-serif"}}>Exit Pass</div>
        <div style={{color:T.ink3,fontSize:12,marginTop:3}}>{hasAge?"⚠️ Show valid ID at exit":"Walk to any exit and scan"}</div>
      </div>
      <div style={{background:T.paper,border:`1.5px solid ${hasAge?T.yellow+"66":T.indigo+"33"}`,borderRadius:24,padding:"28px 24px",textAlign:"center",width:"100%",boxShadow:hasAge?`0 8px 32px ${T.yellow}22`:`0 8px 32px ${T.indigo}18`}}>
        <QRDisplay token={token||"PREVIEW"} expired={expired} ageFlag={hasAge}/>
        <div style={{marginTop:16,fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:900,letterSpacing:5,color:expired?T.ink3:hasAge?T.yellow:T.indigo}}>{token}</div>
        <div style={{marginTop:6,fontSize:10,color:T.ink3,letterSpacing:1}}>ONE-TIME USE · ENCRYPTED TOKEN</div>
      </div>
      {!expired?(
        <div style={{width:"100%",background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:T.sh}}>
          <span style={{fontSize:18}}>⏱</span>
          <div style={{flex:1}}>
            <div style={{color:T.ink,fontSize:13,fontWeight:700}}>Expires in {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}</div>
            <div style={{height:4,background:T.border,borderRadius:2,marginTop:6,overflow:"hidden"}}>
              <div style={{height:"100%",background:`linear-gradient(90deg,${T.indigo},${T.orange})`,borderRadius:2,width:`${(timeLeft/300)*100}%`,transition:"width 1s linear"}}/>
            </div>
          </div>
        </div>
      ):(
        <div style={{width:"100%",background:T.redL,border:`1px solid ${T.red}33`,borderRadius:14,padding:"14px 16px",textAlign:"center"}}>
          <div style={{color:T.red,fontWeight:800,fontSize:14}}>🔴 Token Expired</div>
          <div style={{color:T.red,fontSize:11,opacity:0.7,marginTop:4}}>This code has been used or timed out</div>
        </div>
      )}
      <div style={{width:"100%",background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden",boxShadow:T.sh}}>
        <div style={{padding:"9px 16px",background:T.cream,borderBottom:`1px solid ${T.border}`}}>
          <span style={{color:T.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>PAYMENT RECEIPT</span>
        </div>
        <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.ink3,fontSize:13}}>Items</span><span style={{color:T.ink,fontWeight:600,fontSize:13}}>{items}</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.ink3,fontSize:13}}>Amount Paid</span><span style={{color:T.green,fontWeight:800,fontSize:15,fontFamily:"'Syne',sans-serif"}}>{inr(total)} ✓</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:T.ink3,fontSize:13}}>Store</span><span style={{color:T.ink2,fontSize:12}}>Phoenix Palassio, Lucknow</span></div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,width:"100%"}}>
        <button onClick={reset} style={{flex:1,padding:"13px 0",background:T.paper,border:`1.5px solid ${T.border}`,borderRadius:12,color:T.ink2,fontWeight:700,fontSize:13,cursor:"pointer"}}>New Cart</button>
        <button onClick={()=>setExpired(true)} disabled={expired} style={{flex:2,padding:"13px 0",background:expired?T.border:T.ink,border:"none",borderRadius:12,color:expired?T.ink3:"#FFF",fontWeight:700,fontSize:13,cursor:expired?"not-allowed":"pointer",fontFamily:"'Syne',sans-serif"}}>
          {expired?"Token Used":"Simulate Guard Scan"}
        </button>
      </div>
    </div>
  );
}

function GuardApp(){
  const [mode,setMode]=useState("ready");
  const [result,setResult]=useState(null);
  const RS={
    green: {bg:"#EDFAF3",border:T.green, text:T.green, icon:"✓",glow:"#16A34A22"},
    yellow:{bg:"#FFFBEB",border:T.yellow,text:T.yellow,icon:"⚠",glow:"#D9770622"},
    red:   {bg:"#FEF2F2",border:T.red,   text:T.red,   icon:"✕",glow:"#DC262622"},
  };
  const cases=[
    {label:"Valid — no alcohol",    sub:"Trust 94 · 8 items", status:"green", items:8, total:2340,user:"Priya Sharma",  trust:94,msg:"CLEARED TO EXIT",       detail:""},
    {label:"Age-restricted item",   sub:"Kingfisher in cart", status:"yellow",items:11,total:5188,user:"Rohan Mehta",   trust:78,msg:"CHECK PHOTO ID",         detail:"Verify age ≥ 25. Accept Aadhaar, PAN, DL."},
    {label:"Random spot check",     sub:"Trust 58 · new user",status:"yellow",items:5, total:1840,user:"Ananya Verma",  trust:58,msg:"CHECK 2 ITEMS IN BAG",   detail:"Open bag, verify any 2 items match the receipt."},
    {label:"Expired token",         sub:"Already scanned",    status:"red",   items:0, total:0,   user:"—",             trust:0, msg:"TOKEN EXPIRED",          detail:"QR already used. Do not allow exit."},
    {label:"Device mismatch / fraud",sub:"Different device",  status:"red",   items:0, total:0,   user:"—",             trust:0, msg:"FRAUD ALERT",            detail:"Token generated on different device. Detain & call supervisor."},
  ];
  const scan=async c=>{setMode("scanning");await sleep(1700);setResult(c);setMode("result");};
  const rs=result?RS[result.status]:null;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:T.ink,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:"#FFFFFF15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛡️</div>
        <div>
          <div style={{color:"#FFF",fontWeight:700,fontSize:14}}>Gate 3 · Exit B</div>
          <div style={{color:"#FFFFFF66",fontSize:11,marginTop:1}}>Phoenix Palassio · Lucknow</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:"#4ADE80",animation:"blink 1.5s infinite"}}/>
          <span style={{color:"#4ADE80",fontSize:11,fontWeight:700}}>ONLINE</span>
        </div>
      </div>

      {mode==="scanning"&&(
        <div style={{textAlign:"center",padding:"48px 0",background:T.paper,borderRadius:16,border:`1px solid ${T.border}`,boxShadow:T.sh}}>
          <div style={{width:56,height:56,borderRadius:"50%",border:`3px solid ${T.orange}`,borderTopColor:"transparent",margin:"0 auto 18px",animation:"spin 0.8s linear infinite"}}/>
          <div style={{color:T.ink,fontWeight:700,fontSize:15,fontFamily:"'Syne',sans-serif"}}>Verifying Token…</div>
          <div style={{color:T.ink3,fontSize:12,marginTop:4}}>Checking secure database</div>
        </div>
      )}

      {mode==="result"&&result&&rs&&(
        <div style={{animation:"popIn 0.3s cubic-bezier(.34,1.56,.64,1)",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:rs.bg,border:`2px solid ${rs.border}`,borderRadius:24,padding:"32px 24px",textAlign:"center",boxShadow:`0 8px 40px ${rs.glow}`}}>
            <div style={{fontSize:56,lineHeight:1}}>{rs.icon}</div>
            <div style={{color:rs.text,fontSize:32,fontWeight:900,fontFamily:"'Syne',sans-serif",marginTop:10,letterSpacing:1}}>{result.status.toUpperCase()}</div>
            <div style={{color:rs.text,fontSize:14,fontWeight:600,marginTop:6,opacity:0.85}}>{result.msg}</div>
          </div>
          {result.status!=="red"&&(
            <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:T.sh}}>
              <div style={{padding:"10px 16px",background:T.cream,borderBottom:`1px solid ${T.border}`}}>
                <span style={{color:T.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>CUSTOMER DETAILS</span>
              </div>
              <div style={{padding:"14px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Customer",result.user],["Items",result.items],["Amount Paid",inr(result.total)],["Trust Score",null]].map(([k,v])=>(
                  <div key={k}>
                    <div style={{color:T.ink3,fontSize:10,fontWeight:700,letterSpacing:0.3,textTransform:"uppercase"}}>{k}</div>
                    <div style={{marginTop:3}}>{k==="Trust Score"?<TrustPill score={result.trust}/>:<span style={{color:T.ink,fontWeight:700,fontSize:14,fontFamily:"'Syne',sans-serif"}}>{v}</span>}</div>
                  </div>
                ))}
              </div>
              {result.detail&&<div style={{margin:"0 16px 14px",background:T.yellowL,border:`1px solid ${T.yellow}33`,borderRadius:10,padding:"10px 12px"}}><div style={{color:T.yellow,fontSize:12,fontWeight:600}}>{result.detail}</div></div>}
              {result.status==="yellow"&&<div style={{padding:"0 16px 16px",display:"flex",gap:10}}>
                <button style={{flex:1,padding:"12px 0",background:T.greenL,border:`1px solid ${T.green}44`,borderRadius:12,color:T.green,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>✓ Approve</button>
                <button style={{flex:1,padding:"12px 0",background:T.redL,  border:`1px solid ${T.red}44`,  borderRadius:12,color:T.red,  fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Syne',sans-serif"}}>✕ Detain</button>
              </div>}
            </div>
          )}
          {result.status==="red"&&<div style={{background:T.redL,border:`1px solid ${T.red}33`,borderRadius:14,padding:"14px 16px",fontWeight:600,color:T.red,fontSize:13}}>🚨 {result.detail}</div>}
          <button onClick={()=>{setMode("ready");setResult(null);}} style={{padding:"14px",background:T.paper,border:`1.5px solid ${T.border}`,borderRadius:12,color:T.ink2,fontWeight:700,fontSize:13,cursor:"pointer"}}>← Ready for Next Customer</button>
        </div>
      )}

      {mode==="ready"&&(
        <>
          <div style={{background:T.paper,border:`2px dashed ${T.border}`,borderRadius:16,padding:"36px",textAlign:"center",boxShadow:T.sh}}>
            <div style={{fontSize:44}}>📷</div>
            <div style={{color:T.ink3,fontSize:14,marginTop:10,fontWeight:500}}>Point at customer's QR code</div>
            <div style={{color:T.border,fontSize:11,marginTop:4}}>Or simulate a scenario below</div>
          </div>
          <div style={{color:T.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>SIMULATE SCAN</div>
          {cases.map((c,i)=>(
            <button key={i} onClick={()=>scan(c)} style={{background:T.paper,border:`1.5px solid ${T.border}`,borderRadius:12,padding:"13px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",textAlign:"left",boxShadow:T.sh,transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=RS[c.status].border;e.currentTarget.style.boxShadow=T.shM;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow=T.sh;}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:RS[c.status].border,flexShrink:0,boxShadow:`0 0 5px ${RS[c.status].border}`}}/>
              <div style={{flex:1}}>
                <div style={{color:T.ink,fontSize:13,fontWeight:600}}>{c.label}</div>
                <div style={{color:T.ink3,fontSize:11,marginTop:1}}>{c.sub}</div>
              </div>
              <span style={{color:RS[c.status].border,fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{c.status.toUpperCase()}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

function Dashboard(){
  const [live,setLive]=useState(true);
  const [count,setCount]=useState(1284);
  const [rev,setRev]=useState(4922600);
  useEffect(()=>{
    if(!live)return;
    const id=setInterval(()=>{setCount(c=>c+Math.floor(Math.random()*2+1));setRev(r=>r+Math.floor(Math.random()*2200+800));},3500);
    return()=>clearInterval(id);
  },[live]);
  const kpis=[
    {label:"Transactions",  value:count.toLocaleString("en-IN"),                                      icon:"📊",delta:"+11%"},
    {label:"Active Now",    value:"47",                                                                icon:"🛒",delta:"Live"},
    {label:"Revenue Today", value:"₹"+Math.round(rev/100).toLocaleString("en-IN"),                   icon:"💰",delta:"+₹3.2k"},
    {label:"Fraud Stopped", value:"3",                                                                icon:"🛡️",delta:"-2 vs yday"},
  ];
  const dist=[{r:"90–100",n:312,c:T.green},{r:"70–89",n:284,c:"#65A30D"},{r:"50–69",n:163,c:T.yellow},{r:"< 50",n:88,c:T.red}];
  const mx=Math.max(...dist.map(d=>d.n));
  const SM={
    "exited":    {bg:T.greenL, color:T.green, label:"Exited"},
    "spot-check":{bg:T.yellowL,color:T.yellow,label:"Spot Check"},
    "age-check": {bg:T.yellowL,color:T.yellow,label:"Age Check"},
    "flagged":   {bg:T.redL,   color:T.red,   label:"Flagged"},
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:T.ink,fontWeight:900,fontSize:18,fontFamily:"'Syne',sans-serif"}}>Dashboard</div>
          <div style={{color:T.ink3,fontSize:12,marginTop:1}}>Phoenix Palassio · Today</div>
        </div>
        <button onClick={()=>setLive(l=>!l)} style={{background:live?T.greenL:T.border2,border:`1px solid ${live?T.green+"44":T.border}`,borderRadius:20,padding:"7px 14px",display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:live?T.green:T.ink3,animation:live?"blink 1.5s infinite":"none"}}/>
          <span style={{color:live?T.green:T.ink3,fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{live?"LIVE":"PAUSED"}</span>
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {kpis.map(k=>(
          <div key={k.label} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px",boxShadow:T.sh}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <span style={{fontSize:22}}>{k.icon}</span>
              <span style={{color:T.green,fontSize:10,fontWeight:700,background:T.greenL,borderRadius:20,padding:"2px 8px"}}>↑ {k.delta}</span>
            </div>
            <div style={{color:T.ink,fontWeight:900,fontSize:20,marginTop:10,fontFamily:"'Syne',sans-serif",letterSpacing:-0.5}}>{k.value}</div>
            <div style={{color:T.ink3,fontSize:11,marginTop:3}}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:T.sh}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border2}`}}>
          <div style={{color:T.ink,fontWeight:700,fontSize:13}}>Trust Score Distribution</div>
          <div style={{color:T.ink3,fontSize:11,marginTop:1}}>847 active shoppers this session</div>
        </div>
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
          {dist.map(d=>(
            <div key={d.r} style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{color:T.ink3,fontSize:11,fontFamily:"'Syne',sans-serif",fontWeight:700,minWidth:44}}>{d.r}</span>
              <div style={{flex:1,height:22,background:T.cream,borderRadius:6,overflow:"hidden"}}>
                <div style={{width:`${(d.n/mx)*100}%`,height:"100%",background:`linear-gradient(90deg,${d.c}44,${d.c}88)`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8,transition:"width 0.6s ease"}}>
                  <span style={{color:d.c,fontSize:11,fontWeight:800,fontFamily:"'Syne',sans-serif"}}>{d.n}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:T.sh}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border2}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{color:T.ink,fontWeight:700,fontSize:13}}>Live Transaction Feed</div>
          {live&&<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:T.orange,animation:"blink 1s infinite"}}/><span style={{color:T.orange,fontSize:10,fontWeight:700}}>Updating</span></div>}
        </div>
        {TXNS.map((tx,i)=>{
          const s=SM[tx.status]||{bg:"#eee",color:"#888",label:tx.status};
          return(
            <div key={tx.id} style={{padding:"11px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:i<TXNS.length-1?`1px solid ${T.border2}`:"none"}}>
              <div style={{width:34,height:34,borderRadius:10,background:T.cream,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                {tx.status==="exited"?"✓":tx.status==="flagged"?"🚨":"⚠"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:T.ink,fontSize:13,fontWeight:700}}>{tx.name}</span>
                  <span style={{color:T.orange,fontWeight:800,fontSize:13,fontFamily:"'Syne',sans-serif"}}>₹{tx.total.toLocaleString("en-IN")}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:3}}>
                  <span style={{color:T.ink3,fontSize:11}}>{tx.id} · {tx.items} items · {tx.time} ago</span>
                  <span style={{background:s.bg,color:s.color,border:`1px solid ${s.color}33`,borderRadius:20,padding:"2px 9px",fontSize:10,fontWeight:700}}>{s.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden",boxShadow:T.sh}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border2}`}}>
          <div style={{color:T.ink,fontWeight:700,fontSize:13}}>Security Rules</div>
        </div>
        <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
          {[
            {label:"Spot Check Rate",  value:"15%",       note:"New & low-trust users"},
            {label:"Mandatory Check",  value:"Score < 40",note:"Always stopped"},
            {label:"Age Verification", value:"All Items", note:"Alcohol, tobacco"},
          ].map(r=>(
            <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:T.cream,borderRadius:10}}>
              <div>
                <div style={{color:T.ink,fontSize:13,fontWeight:600}}>{r.label}</div>
                <div style={{color:T.ink3,fontSize:11,marginTop:1}}>{r.note}</div>
              </div>
              <span style={{background:T.indigoL,color:T.indigo,border:`1px solid ${T.indigo}22`,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:800,fontFamily:"'Syne',sans-serif"}}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [tab,setTab]=useState("shopper");
  const tabs=[{id:"shopper",label:"Shopper",icon:"🛒"},{id:"guard",label:"Guard",icon:"🛡️"},{id:"manager",label:"Dashboard",icon:"📊"}];
  return(
    <div style={{minHeight:"100vh",background:T.cream,fontFamily:"'DM Sans',sans-serif",color:T.ink}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        @keyframes blink    {0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        @keyframes ringPulse{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.04)}}
        @keyframes popIn    {from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
        @keyframes slideIn  {from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#E0D9CE;border-radius:2px}
        button{font-family:'DM Sans',sans-serif}
      `}</style>
      <div style={{maxWidth:480,margin:"0 auto",padding:"18px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:T.orange,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 4px 12px ${T.orange}44`}}>🛒</div>
          <div>
            <div style={{fontWeight:900,fontSize:16,fontFamily:"'Syne',sans-serif",letterSpacing:-0.3,color:T.ink}}>ScanGo</div>
            <div style={{fontSize:9,color:T.ink3,letterSpacing:2,fontWeight:600,textTransform:"uppercase"}}>Retail OS · India</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7,background:T.greenL,border:`1px solid ${T.green}33`,borderRadius:20,padding:"5px 12px"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"blink 2s infinite"}}/>
          <span style={{color:T.green,fontSize:10,fontWeight:700}}>All Systems OK</span>
        </div>
      </div>
      <div style={{maxWidth:480,margin:"14px auto 0",padding:"0 20px",position:"sticky",top:0,zIndex:50}}>
        <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,padding:5,display:"flex",gap:4,boxShadow:T.sh}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 4px",background:tab===t.id?T.ink:"transparent",border:"none",borderRadius:10,cursor:"pointer",color:tab===t.id?"#FFF":T.ink3,fontWeight:tab===t.id?700:500,fontSize:12,transition:"all 0.18s ease",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <span style={{fontSize:16}}>{t.icon}</span>
              <span style={{fontFamily:"'DM Sans',sans-serif"}}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{maxWidth:480,margin:"0 auto",padding:"16px 20px 48px"}}>
        {tab==="shopper"&&<ShopperApp/>}
        {tab==="guard"  &&<GuardApp/>}
        {tab==="manager"&&<Dashboard/>}
      </div>
    </div>
  );
}
