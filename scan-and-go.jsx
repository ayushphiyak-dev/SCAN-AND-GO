import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const C = {
  blue:      "#2563EB", blueL:    "#EFF6FF", blueD:   "#1D4ED8",
  violet:    "#7C3AED", violetL:  "#F5F3FF",
  teal:      "#0D9488", tealL:    "#F0FDFA",
  green:     "#16A34A", greenL:   "#DCFCE7",
  amber:     "#D97706", amberL:   "#FEF3C7",
  red:       "#DC2626", redL:     "#FEE2E2",
  bg:        "#F1F5FF",
  surface:   "#FFFFFF",
  surfaceAlt:"#F8FAFF",
  ink:       "#0F172A", ink2:    "#334155", ink3:    "#64748B", ink4:    "#94A3B8",
  border:    "#E2E8F0", borderD: "#CBD5E1",
  sh:   "0 1px 3px rgba(15,23,42,.06),0 2px 8px rgba(15,23,42,.06)",
  shM:  "0 4px 16px rgba(15,23,42,.10),0 2px 6px rgba(15,23,42,.04)",
  shL:  "0 12px 40px rgba(15,23,42,.14)",
};

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════ */
const inr = n => "₹" + n.toLocaleString("en-IN");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const genToken = () => Array.from({length:8},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join("");

/* ═══════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════ */
function TrustBadge({ score }) {
  const cfg = score >= 80
    ? { color: C.green,  bg: C.greenL,  label: "High Trust" }
    : score >= 50
    ? { color: C.amber,  bg: C.amberL,  label: "Med Trust" }
    : { color: C.red,    bg: C.redL,    label: "Low Trust" };
  return (
    <span
      role="status"
      aria-label={`Trust score ${score} — ${cfg.label}`}
      style={{
        display:"inline-flex",alignItems:"center",gap:5,
        background:cfg.bg,border:`1px solid ${cfg.color}33`,
        borderRadius:20,padding:"3px 10px",
      }}
    >
      <span style={{width:6,height:6,borderRadius:"50%",background:cfg.color,display:"inline-block",flexShrink:0}}/>
      <span style={{color:cfg.color,fontSize:11,fontWeight:700,fontFamily:"inherit"}}>{score}</span>
    </span>
  );
}

function StatusBadge({ status }) {
  const MAP = {
    "exited":    {bg:C.greenL, color:C.green, label:"Exited"},
    "spot-check":{bg:C.amberL,color:C.amber, label:"Spot Check"},
    "age-check": {bg:C.amberL,color:C.amber, label:"Age Check"},
    "flagged":   {bg:C.redL,   color:C.red,   label:"Flagged"},
  };
  const s = MAP[status] || {bg:"#F1F5F9",color:C.ink3,label:status};
  return (
    <span
      role="status"
      style={{
        background:s.bg,color:s.color,border:`1px solid ${s.color}33`,
        borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,letterSpacing:0.3,
        whiteSpace:"nowrap",
      }}
    >{s.label}</span>
  );
}

function Skeleton({ width="100%", height=16, radius=6 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,height,borderRadius:radius,
        background:"linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%)",
        backgroundSize:"200% 100%",
        animation:"skelShimmer 1.4s ease infinite",
      }}
    />
  );
}

function Alert({ type="info", children }) {
  const MAP = {
    info:    {bg:C.blueL,   border:`${C.blue}33`,   color:C.blueD,   icon:"ℹ️"},
    warning: {bg:C.amberL,  border:`${C.amber}33`,  color:C.amber,   icon:"⚠️"},
    error:   {bg:C.redL,    border:`${C.red}33`,    color:C.red,     icon:"🔴"},
    success: {bg:C.greenL,  border:`${C.green}33`,  color:C.green,   icon:"✅"},
  };
  const s = MAP[type];
  return (
    <div role="alert" style={{
      background:s.bg,border:`1px solid ${s.border}`,borderRadius:12,
      padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start",
    }}>
      <span style={{fontSize:16,flexShrink:0}}>{s.icon}</span>
      <div style={{color:s.color,fontSize:13,lineHeight:1.5}}>{children}</div>
    </div>
  );
}

function Card({ children, style={}, pad="16px", onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:C.surface,border:`1px solid ${C.border}`,
        borderRadius:16,padding:pad,boxShadow:C.sh,
        ...(onClick && {cursor:"pointer",transition:"box-shadow .15s,transform .15s"}),
        ...style,
      }}
      onMouseEnter={onClick ? e=>{e.currentTarget.style.boxShadow=C.shM;e.currentTarget.style.transform="translateY(-1px)";} : undefined}
      onMouseLeave={onClick ? e=>{e.currentTarget.style.boxShadow=C.sh;e.currentTarget.style.transform="translateY(0)";} : undefined}
    >{children}</div>
  );
}

function Btn({ children, onClick, variant="primary", size="md", disabled=false, fullWidth=false, style={}, ariaLabel }) {
  const variants = {
    primary:  {bg:`linear-gradient(135deg,${C.blue},${C.blueD})`,color:"#FFF",border:"none",shadow:`0 4px 14px ${C.blue}33`},
    secondary:{bg:C.surface,color:C.ink2,border:`1.5px solid ${C.border}`,shadow:C.sh},
    danger:   {bg:C.redL,   color:C.red, border:`1px solid ${C.red}33`,   shadow:"none"},
    success:  {bg:C.greenL, color:C.green,border:`1px solid ${C.green}33`,shadow:"none"},
    ghost:    {bg:"transparent",color:C.ink3,border:"none",shadow:"none"},
  };
  const sizes = {
    sm:{padding:"7px 14px",fontSize:12,borderRadius:10},
    md:{padding:"12px 20px",fontSize:14,borderRadius:12},
    lg:{padding:"16px 24px",fontSize:15,borderRadius:14},
  };
  const v = variants[variant];
  const s = sizes[size];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        background:disabled?"#E2E8F0":v.bg,
        color:disabled?C.ink4:v.color,
        border:v.border,
        borderRadius:s.borderRadius,
        padding:s.padding,
        fontSize:s.fontSize,
        fontWeight:700,
        cursor:disabled?"not-allowed":"pointer",
        width:fullWidth?"100%":"auto",
        boxShadow:disabled?"none":v.shadow,
        transition:"all .15s ease",
        fontFamily:"inherit",
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
        ...style,
      }}
      onMouseEnter={disabled ? undefined : e=>{if(variant==="primary"){e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.filter="brightness(1.06)";}}}
      onMouseLeave={disabled ? undefined : e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.filter="none";}}
    >{children}</button>
  );
}

/* ═══════════════════════════════════════════════
   QR DISPLAY
═══════════════════════════════════════════════ */
function QRDisplay({ token, expired, ageFlag }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => setFrame(f => f + 1), 900);
    return () => clearInterval(id);
  }, [expired]);
  const sz = 19;
  const seed = token.split("").reduce((a,c,i) => a + c.charCodeAt(0) * (i + 1), 0);
  const cell = (r,c) => ((seed*(r*31+c*17)+frame*3) % 7) < 3 ? 1 : 0;
  const isCorner = (r,c) => (r<7&&c<7)||(r<7&&c>=sz-7)||(r>=sz-7&&c<7);
  const accent = expired ? "#CBD5E1" : ageFlag ? C.amber : C.blue;
  return (
    <div
      role="img"
      aria-label={expired ? "Expired QR code" : "Active exit QR code"}
      style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}
    >
      {!expired && (
        <div style={{position:"absolute",inset:-14,borderRadius:22,border:`2px solid ${accent}22`,animation:"ringPulse 2s ease-in-out infinite"}}/>
      )}
      <div style={{
        background:expired ? "#F8FAFC" : C.surface,
        border:`2px solid ${expired ? C.border : accent+"55"}`,
        borderRadius:18,padding:18,
        boxShadow:expired ? "none" : `0 0 0 6px ${accent}0D,${C.shM}`,
      }}>
        <svg width={152} height={152} viewBox={`0 0 ${sz} ${sz}`} style={{display:"block",opacity:expired?0.25:1}}>
          {Array.from({length:sz},(_,r) => Array.from({length:sz},(_,c) => {
            if (isCorner(r,c)) return null;
            return cell(r,c) ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={accent} opacity={0.9}/> : null;
          }))}
          {[[0,0],[0,sz-7],[sz-7,0]].map(([br,bc],i) => (
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

/* ═══════════════════════════════════════════════
   SCANNER COMPONENT
═══════════════════════════════════════════════ */
function Scanner({ onScan, scanned }) {
  const [line, setLine] = useState(20);
  const [dir, setDir] = useState(1);
  const [flash, setFlash] = useState(null);
  const [busy, setBusy] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const avail = PRODUCTS.filter(p => !scanned.has(p.id));
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.cat))];
  const visible = activeCat === "All" ? avail : avail.filter(p => p.cat === activeCat);

  useEffect(() => {
    const id = setInterval(() => setLine(l => {
      const n = l + dir * 1.6;
      if (n >= 88) { setDir(-1); return 88; }
      if (n <= 12) { setDir(1); return 12; }
      return n;
    }), 18);
    return () => clearInterval(id);
  }, [dir]);

  const tap = async p => {
    if (busy) return;
    setBusy(true); setFlash(p);
    await sleep(900);
    onScan(p); setFlash(null); setBusy(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div
        role="region"
        aria-label="Barcode scanner viewport"
        style={{position:"relative",height:180,background:"#0A0E1A",borderRadius:18,overflow:"hidden",boxShadow:C.shM}}
      >
        <div style={{
          position:"absolute",left:20,right:20,top:`${line}%`,height:2,
          background:"linear-gradient(90deg,transparent,#2563EB 20%,#7C3AED 80%,transparent)",
          boxShadow:"0 0 16px #2563EBCC",
          transition:"top 0.018s linear",
        }}/>
        {[["top:14px","left:14px","borderTop","borderLeft"],["top:14px","right:14px","borderTop","borderRight"],["bottom:14px","left:14px","borderBottom","borderLeft"],["bottom:14px","right:14px","borderBottom","borderRight"]].map(([v,h,b1,b2],i) => (
          <div key={i} style={{
            position:"absolute",width:24,height:24,
            [v.split(":")[0]]:v.split(":")[1],[h.split(":")[0]]:h.split(":")[1],
            [b1]:"2.5px solid #2563EB",[b2]:"2.5px solid #2563EB",
            borderRadius:i===0?"4px 0 0 0":i===1?"0 4px 0 0":i===2?"0 0 0 4px":"0 0 4px 0",
          }}/>
        ))}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {flash ? (
            <div style={{textAlign:"center",animation:"popIn .25s cubic-bezier(.34,1.56,.64,1)"}}>
              <div style={{fontSize:40,lineHeight:1}}>{flash.emoji}</div>
              <div style={{color:"#2563EB",fontWeight:800,fontSize:12,marginTop:6,letterSpacing:1}}>✓ ADDED</div>
              <div style={{color:"#ffffff99",fontSize:11,marginTop:2}}>{flash.name}</div>
            </div>
          ) : (
            <div style={{color:"#ffffff33",fontSize:11,letterSpacing:3,textTransform:"uppercase"}}>Tap a product to scan</div>
          )}
        </div>
        <div style={{position:"absolute",top:10,right:10,display:"flex",alignItems:"center",gap:5,background:"#00000066",borderRadius:20,padding:"4px 10px"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#2563EB",animation:"blink 1s infinite"}}/>
          <span style={{color:"#2563EB99",fontSize:9,fontWeight:700,letterSpacing:1}}>LIVE</span>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Product categories"
        style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none"}}
      >
        {cats.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCat===cat}
            onClick={() => setActiveCat(cat)}
            style={{
              padding:"5px 14px",borderRadius:20,border:`1px solid ${activeCat===cat ? C.blue : C.border}`,
              background:activeCat===cat ? C.blueL : C.surface,
              color:activeCat===cat ? C.blue : C.ink3,
              fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",
              transition:"all .15s",fontFamily:"inherit",
            }}
          >{cat}</button>
        ))}
      </div>

      <div
        role="list"
        aria-label="Available products"
        style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxHeight:220,overflowY:"auto",paddingBottom:4}}
      >
        {visible.map(p => (
          <button
            key={p.id}
            role="listitem"
            onClick={() => tap(p)}
            aria-label={`Scan ${p.name}, ${inr(p.price)}${p.age ? ", age restricted" : ""}`}
            style={{
              background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:13,
              padding:"11px 12px",display:"flex",alignItems:"center",gap:10,
              cursor:"pointer",textAlign:"left",boxShadow:C.sh,
              transition:"all .15s ease",fontFamily:"inherit",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.boxShadow=C.shM;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow=C.sh;}}
          >
            <span style={{fontSize:24,lineHeight:1}}>{p.emoji}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:C.ink,fontSize:11.5,fontWeight:600,lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                {p.name}{p.age ? " 🔞" : ""}
              </div>
              <div style={{color:C.blue,fontWeight:800,fontSize:13,marginTop:3}}>{inr(p.price)}</div>
            </div>
          </button>
        ))}
        {visible.length === 0 && (
          <div style={{gridColumn:"1/-1",textAlign:"center",padding:"32px 0"}}>
            <div style={{fontSize:32,marginBottom:8}}>🎉</div>
            <div style={{color:C.ink3,fontSize:13,fontWeight:600}}>All items scanned!</div>
            <div style={{color:C.ink4,fontSize:11,marginTop:4}}>Head to your cart to pay</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SHOPPER APP
═══════════════════════════════════════════════ */
function ShopperApp() {
  const [screen, setScreen] = useState("home");
  const [cart, setCart] = useState([]);
  const [seen, setSeen] = useState(new Set());
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [token, setToken] = useState(null);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const trust = 87;

  useEffect(() => {
    if (screen !== "qr" || expired) return;
    const id = setInterval(() => setTimeLeft(t => {
      if (t <= 1) { setExpired(true); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [screen, expired]);

  const addItem = useCallback(p => {
    setSeen(s => new Set([...s, p.id]));
    setCart(c => [...c, {...p, qty:1, cid:Date.now()+Math.random()}]);
  }, []);
  const chgQty = (cid, d) => setCart(c => c.map(i => i.cid===cid ? {...i,qty:Math.max(1,i.qty+d)} : i));
  const del = cid => {
    const it = cart.find(i => i.cid===cid);
    setCart(c => c.filter(i => i.cid!==cid));
    setSeen(s => { const n=new Set(s); n.delete(it.id); return n; });
  };
  const sub = cart.reduce((a,i) => a + i.price*i.qty, 0);
  const gst = Math.round(sub * 0.05);
  const total = sub + gst;
  const items = cart.reduce((a,i) => a + i.qty, 0);
  const hasAge = cart.some(i => i.age);

  const pay = async () => {
    setPaying(true);
    await sleep(2100);
    setPaid(true);
    await sleep(700);
    setToken(genToken());
    setTimeLeft(300);
    setExpired(false);
    setScreen("qr");
    setPaying(false);
    setPaid(false);
  };

  const reset = () => { setCart([]); setSeen(new Set()); setToken(null); setExpired(false); setScreen("home"); };

  if (screen === "home") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}} role="main" aria-label="Shopper home screen">
      <div style={{
        background:"linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)",
        borderRadius:22,padding:"24px",position:"relative",overflow:"hidden",
        boxShadow:`0 8px 28px ${C.blue}44`,
      }}>
        <div style={{position:"absolute",right:-30,top:-30,width:140,height:140,borderRadius:"50%",background:"#FFFFFF0D"}}/>
        <div style={{position:"absolute",right:30,bottom:-20,width:80,height:80,borderRadius:"50%",background:"#FFFFFF0D"}}/>
        <div style={{color:"#FFFFFFAA",fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"} 👋</div>
        <div style={{color:"#FFF",fontSize:22,fontWeight:800,marginTop:6,lineHeight:1.25}}>Skip the queue,<br/>scan &amp; go 🛒</div>
        <div style={{marginTop:14,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{background:"#FFFFFF22",backdropFilter:"blur(4px)",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:12}}>🏆</span>
            <span style={{color:"#FFF",fontSize:11,fontWeight:700}}>Trust Score: {trust}/100</span>
          </div>
          <div style={{background:"#FFFFFF22",backdropFilter:"blur(4px)",borderRadius:20,padding:"5px 12px"}}>
            <span style={{color:"#FFF",fontSize:11,fontWeight:700}}>✓ Verified</span>
          </div>
        </div>
      </div>

      <Card pad="14px 16px" style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:12,background:C.blueL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🏬</div>
        <div style={{flex:1}}>
          <div style={{color:C.ink,fontWeight:700,fontSize:14}}>Phoenix Palassio</div>
          <div style={{color:C.ink3,fontSize:11,marginTop:1}}>Lucknow · Hypermarket Floor 2</div>
        </div>
        <div style={{color:C.green,fontSize:10,fontWeight:700,background:C.greenL,borderRadius:20,padding:"4px 12px",border:`1px solid ${C.green}22`}}>● Open</div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}} role="region" aria-label="Store statistics">
        {[
          {icon:"🕐",label:"Avg Time",value:"4 min"},
          {icon:"📦",label:"Txns Today",value:"1,284"},
          {icon:"⚡",label:"Queues",value:"Zero"},
        ].map(s => (
          <Card key={s.label} pad="14px 10px" style={{textAlign:"center"}}>
            <div style={{fontSize:20}}>{s.icon}</div>
            <div style={{color:C.ink,fontWeight:800,fontSize:13,marginTop:6}}>{s.value}</div>
            <div style={{color:C.ink3,fontSize:10,marginTop:2}}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card pad="16px">
        <div style={{color:C.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5,marginBottom:12}}>HOW IT WORKS</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          {[["📱","Scan","Pick items & scan barcodes"],["💳","Pay","Choose any payment method"],["🚪","Exit","Show QR at the gate"]].map(([icon,step,desc],i) => (
            <div key={step} style={{flex:1,textAlign:"center",position:"relative"}}>
              <div style={{fontSize:22,marginBottom:5}}>{icon}</div>
              <div style={{color:C.ink,fontWeight:700,fontSize:12}}>{step}</div>
              <div style={{color:C.ink4,fontSize:10,marginTop:2,lineHeight:1.3}}>{desc}</div>
              {i < 2 && <div style={{position:"absolute",right:0,top:12,color:C.border,fontSize:18}}>›</div>}
            </div>
          ))}
        </div>
      </Card>

      <Btn onClick={() => setScreen("scan")} size="lg" fullWidth ariaLabel="Start scanning products">
        Start Scanning →
      </Btn>
    </div>
  );

  if (screen === "scan") return (
    <div style={{display:"flex",flexDirection:"column",gap:14}} role="main" aria-label="Scan products screen">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{color:C.ink,fontWeight:800,fontSize:18}}>Scan Items</div>
          <div style={{color:C.ink3,fontSize:12,marginTop:1}}>{items > 0 ? `${items} items · ${inr(sub)}` : "Tap a product to add it"}</div>
        </div>
        <Btn onClick={() => setScreen("cart")} disabled={!cart.length} size="sm" ariaLabel={`View cart with ${items} items`}>
          Cart ({items}) →
        </Btn>
      </div>

      <Scanner onScan={addItem} scanned={seen}/>

      {cart.length > 0 && (
        <Card pad="0" style={{overflow:"hidden"}}>
          <div style={{padding:"9px 16px",borderBottom:`1px solid ${C.border}`}}>
            <span style={{color:C.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>JUST ADDED</span>
          </div>
          {cart.slice(-3).reverse().map(it => (
            <div key={it.cid} style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.border}`,animation:"slideIn .2s ease"}}>
              <span style={{fontSize:20}}>{it.emoji}</span>
              <span style={{flex:1,color:C.ink,fontSize:13,fontWeight:500}}>{it.name}</span>
              <span style={{color:C.blue,fontWeight:700,fontSize:13}}>{inr(it.price)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );

  if (screen === "cart") return (
    <div style={{display:"flex",flexDirection:"column",gap:14}} role="main" aria-label="Shopping cart">
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Btn onClick={() => setScreen("scan")} variant="secondary" size="sm" ariaLabel="Back to scanning">← Back</Btn>
        <div style={{color:C.ink,fontWeight:800,fontSize:18}}>Your Cart</div>
        <span style={{background:C.blueL,color:C.blue,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:2}}>{items}</span>
      </div>

      {hasAge && (
        <Alert type="warning">
          <strong>Age Verification at Exit</strong>
          <div style={{marginTop:3,fontSize:12}}>Your QR will show amber — please carry a valid photo ID (Aadhaar / PAN / DL).</div>
        </Alert>
      )}

      {cart.length === 0 ? (
        <Card style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:40,marginBottom:12}}>🛒</div>
          <div style={{color:C.ink3,fontWeight:600,fontSize:14}}>Your cart is empty</div>
          <div style={{color:C.ink4,fontSize:12,marginTop:4}}>Go back and scan some products</div>
        </Card>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:300,overflowY:"auto"}} role="list" aria-label="Cart items">
          {cart.map(it => (
            <Card key={it.cid} pad="12px 14px" style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:26,flexShrink:0}}>{it.emoji}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:C.ink,fontSize:13,fontWeight:600,lineHeight:1.3}}>{it.name}</div>
                <div style={{color:C.ink3,fontSize:11,marginTop:1}}>{inr(it.price)} each</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={() => chgQty(it.cid,-1)} disabled={it.qty === 1} aria-label={`Decrease quantity of ${it.name}`} style={{width:28,height:28,borderRadius:8,background:C.surfaceAlt,border:`1px solid ${C.border}`,color:it.qty===1?C.ink4:C.ink,cursor:it.qty===1?"not-allowed":"pointer",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>−</button>
                <span style={{color:C.ink,fontWeight:800,fontSize:14,minWidth:22,textAlign:"center"}} aria-label={`Quantity: ${it.qty}`}>{it.qty}</span>
                <button onClick={() => chgQty(it.cid, 1)} aria-label={`Increase quantity of ${it.name}`} style={{width:28,height:28,borderRadius:8,background:C.surfaceAlt,border:`1px solid ${C.border}`,color:C.ink,cursor:"pointer",fontWeight:700,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>+</button>
                <button onClick={() => del(it.cid)} aria-label={`Remove ${it.name} from cart`} style={{width:28,height:28,borderRadius:8,background:C.redL,border:`1px solid ${C.red}22`,color:C.red,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✕</button>
              </div>
              <div style={{color:C.blue,fontWeight:800,fontSize:14,minWidth:58,textAlign:"right"}}>{inr(it.price*it.qty)}</div>
            </Card>
          ))}
        </div>
      )}

      <Card pad="0" style={{overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.surfaceAlt}}>
          <span style={{color:C.ink3,fontWeight:700,fontSize:11,letterSpacing:0.5}}>BILL SUMMARY</span>
        </div>
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:C.ink3,fontSize:13}}>MRP Total</span>
            <span style={{color:C.ink,fontSize:13,fontWeight:600}}>{inr(sub)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{color:C.ink3,fontSize:13}}>GST (5%)</span>
            <span style={{color:C.ink,fontSize:13,fontWeight:600}}>{inr(gst)}</span>
          </div>
          <div style={{borderTop:`1.5px dashed ${C.border}`,paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:C.ink,fontWeight:800,fontSize:16}}>To Pay</span>
            <span style={{color:C.blue,fontWeight:900,fontSize:22}}>{inr(total)}</span>
          </div>
        </div>
      </Card>

      <Btn onClick={() => setScreen("pay")} size="lg" fullWidth disabled={!cart.length} ariaLabel={`Proceed to pay ${inr(total)}`}>
        Proceed to Pay {inr(total)} →
      </Btn>
    </div>
  );

  if (screen === "pay") return (
    <div style={{display:"flex",flexDirection:"column",gap:18}} role="main" aria-label="Payment screen">
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Btn onClick={() => setScreen("cart")} variant="secondary" size="sm" ariaLabel="Back to cart">← Back</Btn>
        <div style={{color:C.ink,fontWeight:800,fontSize:18}}>Payment</div>
      </div>

      <div style={{
        background:"linear-gradient(135deg,#1D4ED8 0%,#7C3AED 100%)",
        borderRadius:20,padding:"24px",textAlign:"center",
        boxShadow:`0 8px 28px ${C.blue}33`,
      }}>
        <div style={{color:"#FFFFFF99",fontSize:12,fontWeight:600}}>Total Amount</div>
        <div style={{color:"#FFF",fontSize:46,fontWeight:900,letterSpacing:-1,lineHeight:1.1,marginTop:4}}>{inr(total)}</div>
        <div style={{color:"#FFFFFF66",fontSize:12,marginTop:6}}>{items} items · GST included</div>
      </div>

      {paying ? (
        <div style={{textAlign:"center",padding:"40px 0"}} role="status" aria-live="polite">
          <div style={{width:56,height:56,borderRadius:"50%",border:`3px solid ${C.blue}`,borderTopColor:"transparent",margin:"0 auto 16px",animation:"spin .9s linear infinite"}} aria-hidden="true"/>
          <div style={{color:C.ink,fontWeight:700,fontSize:15}}>Processing Payment…</div>
          <div style={{color:C.ink3,fontSize:12,marginTop:4}}>Connecting to your bank securely</div>
        </div>
      ) : paid ? (
        <div style={{textAlign:"center",padding:"28px 0"}} role="status" aria-live="polite">
          <div style={{width:64,height:64,borderRadius:"50%",background:C.greenL,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:28,border:`2px solid ${C.green}33`}}>✓</div>
          <div style={{color:C.green,fontWeight:800,fontSize:16}}>Payment Successful!</div>
          <div style={{color:C.ink3,fontSize:12,marginTop:4}}>Generating your exit pass…</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{color:C.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>CHOOSE PAYMENT METHOD</div>
          {[
            {id:"upi",   icon:"⚡", label:"UPI / PhonePe / GPay",  sub:"Instant, zero charges",        bg:`linear-gradient(135deg,#E8F5E9,#F0FDF4)`, fg:C.ink, border:C.border},
            {id:"apple", icon:"🍎", label:"Apple Pay",              sub:"Tap to pay",                    bg:C.ink,         fg:"#FFF",  border:C.ink},
            {id:"card",  icon:"💳", label:"Credit / Debit Card",    sub:"Visa · Mastercard · RuPay",     bg:C.surface,     fg:C.ink,   border:C.border},
            {id:"wallet",icon:"👛", label:"Paytm / Amazon Pay",     sub:"Wallet balance",                bg:`linear-gradient(135deg,#FFF7E6,#FEF3C7)`, fg:C.ink, border:C.border},
          ].map(m => (
            <button
              key={m.id}
              onClick={pay}
              aria-label={`Pay with ${m.label}`}
              style={{
                background:m.bg,border:`1.5px solid ${m.border}`,borderRadius:14,
                padding:"14px 16px",display:"flex",alignItems:"center",gap:14,
                cursor:"pointer",textAlign:"left",boxShadow:C.sh,
                transition:"transform .12s,box-shadow .12s",fontFamily:"inherit",width:"100%",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=C.shM;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=C.sh;}}
            >
              <span style={{fontSize:22}}>{m.icon}</span>
              <div style={{flex:1}}>
                <div style={{color:m.fg,fontWeight:700,fontSize:14}}>{m.label}</div>
                <div style={{color:m.fg,opacity:0.55,fontSize:11,marginTop:2}}>{m.sub}</div>
              </div>
              <span style={{color:m.fg,opacity:0.4,fontSize:20}}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (screen === "qr") return (
    <div style={{display:"flex",flexDirection:"column",gap:16,alignItems:"center"}} role="main" aria-label="Exit pass screen">
      <div style={{textAlign:"center"}}>
        <div style={{color:C.ink,fontWeight:900,fontSize:22}}>Exit Pass</div>
        <div style={{color:C.ink3,fontSize:12,marginTop:3}}>
          {hasAge ? "⚠️ Show valid photo ID at the exit gate" : "Walk to any exit and scan your QR code"}
        </div>
      </div>

      <Card pad="28px 24px" style={{
        textAlign:"center",width:"100%",
        border:`1.5px solid ${hasAge ? C.amber+"66" : C.blue+"33"}`,
        boxShadow:hasAge ? `0 8px 32px ${C.amber}22` : `0 8px 32px ${C.blue}18`,
      }}>
        <QRDisplay token={token||"PREVIEW"} expired={expired} ageFlag={hasAge}/>
        <div style={{
          marginTop:18,fontSize:22,fontWeight:900,letterSpacing:5,
          color:expired ? C.ink4 : hasAge ? C.amber : C.blue,
          fontVariantNumeric:"tabular-nums",
        }}>{token}</div>
        <div style={{marginTop:6,fontSize:10,color:C.ink4,letterSpacing:1}}>ONE-TIME USE · ENCRYPTED TOKEN</div>
      </Card>

      {!expired ? (
        <Card pad="12px 16px" style={{width:"100%",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:18}} aria-hidden="true">⏱</span>
          <div style={{flex:1}}>
            <div style={{color:C.ink,fontSize:13,fontWeight:700}}>
              Expires in {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}
            </div>
            <div style={{height:5,background:C.border,borderRadius:3,marginTop:8,overflow:"hidden"}}>
              <div style={{
                height:"100%",
                background:`linear-gradient(90deg,${C.blue},${C.violet})`,
                borderRadius:3,
                width:`${(timeLeft/300)*100}%`,
                transition:"width 1s linear",
              }} role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={300} aria-label="Time remaining"/>
            </div>
          </div>
        </Card>
      ) : (
        <Alert type="error">
          <strong>Token Expired</strong>
          <div style={{marginTop:3,fontSize:12}}>This code has been used or timed out. Please start a new cart.</div>
        </Alert>
      )}

      <Card pad="0" style={{width:"100%",overflow:"hidden"}}>
        <div style={{padding:"9px 16px",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}`}}>
          <span style={{color:C.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>PAYMENT RECEIPT</span>
        </div>
        <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.ink3,fontSize:13}}>Items</span><span style={{color:C.ink,fontWeight:600,fontSize:13}}>{items}</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.ink3,fontSize:13}}>Amount Paid</span><span style={{color:C.green,fontWeight:800,fontSize:15}}>{inr(total)} ✓</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.ink3,fontSize:13}}>Store</span><span style={{color:C.ink2,fontSize:12}}>Phoenix Palassio, Lucknow</span></div>
        </div>
      </Card>

      <div style={{display:"flex",gap:10,width:"100%"}}>
        <Btn onClick={reset} variant="secondary" style={{flex:1}} ariaLabel="Start new cart">New Cart</Btn>
        <Btn onClick={() => setExpired(true)} disabled={expired} style={{flex:2}} ariaLabel="Simulate guard scanning QR code">
          {expired ? "Token Used" : "Simulate Guard Scan"}
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GUARD APP
═══════════════════════════════════════════════ */
function GuardApp() {
  const [mode, setMode] = useState("ready");
  const [result, setResult] = useState(null);

  const RS = {
    green:  {bg:"#F0FDF4",border:C.green,  text:C.green,  icon:"✓", glow:`${C.green}22`},
    yellow: {bg:"#FFFBEB",border:C.amber,  text:C.amber,  icon:"⚠", glow:`${C.amber}22`},
    red:    {bg:"#FFF1F2",border:C.red,    text:C.red,    icon:"✕", glow:`${C.red}22`},
  };

  const cases = [
    {label:"Valid — no alcohol",     sub:"Trust 94 · 8 items",  status:"green",  items:8,  total:2340,user:"Priya Sharma", trust:94, msg:"CLEARED TO EXIT",     detail:""},
    {label:"Age-restricted item",    sub:"Kingfisher in cart",  status:"yellow", items:11, total:5188,user:"Rohan Mehta",  trust:78, msg:"CHECK PHOTO ID",      detail:"Verify age ≥ 25. Accept Aadhaar, PAN, DL."},
    {label:"Random spot check",      sub:"Trust 58 · new user", status:"yellow", items:5,  total:1840,user:"Ananya Verma", trust:58, msg:"CHECK 2 ITEMS IN BAG",detail:"Open bag, verify any 2 items match the receipt."},
    {label:"Expired token",          sub:"Already scanned",     status:"red",    items:0,  total:0,   user:"—",           trust:0,  msg:"TOKEN EXPIRED",       detail:"QR already used. Do not allow exit."},
    {label:"Device mismatch / fraud",sub:"Different device",    status:"red",    items:0,  total:0,   user:"—",           trust:0,  msg:"FRAUD ALERT",         detail:"Token generated on different device. Detain & call supervisor."},
  ];

  const scan = async c => {
    setMode("scanning");
    await sleep(1700);
    setResult(c);
    setMode("result");
  };

  const rs = result ? RS[result.status] : null;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}} role="main" aria-label="Guard verification screen">
      <div style={{
        background:C.ink,borderRadius:16,padding:"14px 16px",
        display:"flex",alignItems:"center",gap:12,
      }}>
        <div style={{width:42,height:42,borderRadius:12,background:"#FFFFFF15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🛡️</div>
        <div style={{flex:1}}>
          <div style={{color:"#FFF",fontWeight:700,fontSize:14}}>Gate 3 · Exit B</div>
          <div style={{color:"#FFFFFF66",fontSize:11,marginTop:1}}>Phoenix Palassio · Lucknow</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}} role="status" aria-label="System online">
          <div style={{width:7,height:7,borderRadius:"50%",background:"#4ADE80",animation:"blink 1.5s infinite"}} aria-hidden="true"/>
          <span style={{color:"#4ADE80",fontSize:11,fontWeight:700}}>ONLINE</span>
        </div>
      </div>

      {mode === "scanning" && (
        <Card style={{textAlign:"center",padding:"52px 0"}} role="status" aria-live="polite">
          <div style={{width:60,height:60,borderRadius:"50%",border:`3px solid ${C.blue}`,borderTopColor:"transparent",margin:"0 auto 18px",animation:"spin .8s linear infinite"}} aria-hidden="true"/>
          <div style={{color:C.ink,fontWeight:700,fontSize:15}}>Verifying Token…</div>
          <div style={{color:C.ink3,fontSize:12,marginTop:4}}>Checking secure database</div>
        </Card>
      )}

      {mode === "result" && result && rs && (
        <div style={{animation:"popIn .3s cubic-bezier(.34,1.56,.64,1)",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{
            background:rs.bg,border:`2px solid ${rs.border}`,borderRadius:24,
            padding:"32px 24px",textAlign:"center",
            boxShadow:`0 8px 40px ${rs.glow}`,
          }} role="alert" aria-live="assertive">
            <div style={{fontSize:60,lineHeight:1}}>{rs.icon}</div>
            <div style={{color:rs.text,fontSize:30,fontWeight:900,marginTop:10,letterSpacing:1}}>{result.status.toUpperCase()}</div>
            <div style={{color:rs.text,fontSize:14,fontWeight:600,marginTop:6,opacity:0.85}}>{result.msg}</div>
          </div>

          {result.status !== "red" && (
            <Card pad="0" style={{overflow:"hidden"}}>
              <div style={{padding:"10px 16px",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}`}}>
                <span style={{color:C.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>CUSTOMER DETAILS</span>
              </div>
              <div style={{padding:"14px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Customer",result.user],["Items",result.items],["Amount Paid",inr(result.total)],["Trust Score",null]].map(([k,v]) => (
                  <div key={k}>
                    <div style={{color:C.ink3,fontSize:10,fontWeight:700,letterSpacing:0.3,textTransform:"uppercase"}}>{k}</div>
                    <div style={{marginTop:4}}>
                      {k === "Trust Score"
                        ? <TrustBadge score={result.trust}/>
                        : <span style={{color:C.ink,fontWeight:700,fontSize:14}}>{v}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
              {result.detail && (
                <div style={{margin:"0 16px 14px"}}>
                  <Alert type="warning">
                    <strong>Action Required: </strong>{result.detail}
                  </Alert>
                </div>
              )}
              {result.status === "yellow" && (
                <div style={{padding:"0 16px 16px",display:"flex",gap:10}}>
                  <Btn variant="success" style={{flex:1}} ariaLabel="Approve customer exit">✓ Approve</Btn>
                  <Btn variant="danger"  style={{flex:1}} ariaLabel="Detain customer">✕ Detain</Btn>
                </div>
              )}
            </Card>
          )}

          {result.status === "red" && (
            <Alert type="error">
              <strong>Security Alert: </strong>{result.detail}
            </Alert>
          )}

          <Btn onClick={() => {setMode("ready");setResult(null);}} variant="secondary" fullWidth ariaLabel="Ready for next customer">
            ← Ready for Next Customer
          </Btn>
        </div>
      )}

      {mode === "ready" && (
        <>
          <div style={{
            background:C.surface,border:`2px dashed ${C.border}`,borderRadius:18,
            padding:"40px 24px",textAlign:"center",boxShadow:C.sh,
          }} role="region" aria-label="Scanner ready">
            <div style={{fontSize:48,marginBottom:10}}>📷</div>
            <div style={{color:C.ink3,fontSize:14,fontWeight:600}}>Point at customer's QR code</div>
            <div style={{color:C.ink4,fontSize:11,marginTop:4}}>Or simulate a scenario below to test</div>
          </div>

          <div style={{color:C.ink3,fontSize:10,fontWeight:700,letterSpacing:0.5}}>SIMULATE SCAN</div>

          {cases.map((c,i) => (
            <button
              key={i}
              onClick={() => scan(c)}
              aria-label={`Simulate: ${c.label}`}
              style={{
                background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:12,
                padding:"13px 14px",display:"flex",alignItems:"center",gap:12,
                cursor:"pointer",textAlign:"left",boxShadow:C.sh,
                transition:"all .15s",fontFamily:"inherit",width:"100%",
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=RS[c.status].border;e.currentTarget.style.boxShadow=C.shM;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow=C.sh;}}
            >
              <div style={{width:10,height:10,borderRadius:"50%",background:RS[c.status].border,flexShrink:0,boxShadow:`0 0 6px ${RS[c.status].border}`}} aria-hidden="true"/>
              <div style={{flex:1}}>
                <div style={{color:C.ink,fontSize:13,fontWeight:600}}>{c.label}</div>
                <div style={{color:C.ink3,fontSize:11,marginTop:1}}>{c.sub}</div>
              </div>
              <span style={{color:RS[c.status].border,fontSize:11,fontWeight:700}}>{c.status.toUpperCase()}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════ */
function Dashboard() {
  const [live, setLive] = useState(true);
  const [count, setCount] = useState(1284);
  const [rev, setRev] = useState(4922600);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setCount(c => c + Math.floor(Math.random()*2+1));
      setRev(r => r + Math.floor(Math.random()*2200+800));
    }, 3500);
    return () => clearInterval(id);
  }, [live]);

  const kpis = [
    {label:"Transactions",   value:count.toLocaleString("en-IN"), icon:"📊", delta:"+11%",  up:true},
    {label:"Active Now",     value:"47",                          icon:"🛒", delta:"Live",   up:true},
    {label:"Revenue Today",  value:"₹"+Math.round(rev/100).toLocaleString("en-IN"), icon:"💰", delta:"+₹3.2k", up:true},
    {label:"Fraud Stopped",  value:"3",                           icon:"🛡️", delta:"-2 vs yday", up:false},
  ];
  const dist = [
    {r:"90–100",n:312,c:C.green},
    {r:"70–89", n:284,c:"#65A30D"},
    {r:"50–69", n:163,c:C.amber},
    {r:"< 50",  n:88, c:C.red},
  ];
  const mx = Math.max(...dist.map(d => d.n));
  const SM = {
    "exited":    {bg:C.greenL, color:C.green, label:"Exited"},
    "spot-check":{bg:C.amberL,color:C.amber, label:"Spot Check"},
    "age-check": {bg:C.amberL,color:C.amber, label:"Age Check"},
    "flagged":   {bg:C.redL,   color:C.red,   label:"Flagged"},
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}} role="main" aria-label="Manager dashboard">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{color:C.ink,fontWeight:900,fontSize:20}}>Dashboard</div>
          <div style={{color:C.ink3,fontSize:12,marginTop:2}}>Phoenix Palassio · Today</div>
        </div>
        <button
          onClick={() => setLive(l => !l)}
          aria-pressed={live}
          aria-label={live ? "Pause live updates" : "Resume live updates"}
          style={{
            background:live ? C.greenL : C.surfaceAlt,
            border:`1px solid ${live ? C.green+"44" : C.border}`,
            borderRadius:20,padding:"7px 16px",
            display:"flex",alignItems:"center",gap:7,cursor:"pointer",
            fontFamily:"inherit",
          }}
        >
          <div style={{width:7,height:7,borderRadius:"50%",background:live?C.green:C.ink4,animation:live?"blink 1.5s infinite":"none"}} aria-hidden="true"/>
          <span style={{color:live?C.green:C.ink4,fontSize:11,fontWeight:700}}>{live?"LIVE":"PAUSED"}</span>
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}} role="region" aria-label="Key performance indicators">
        {kpis.map(k => (
          <Card key={k.label} pad="16px">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <span style={{fontSize:22}}>{k.icon}</span>
              <span style={{
                color:k.up?C.green:C.amber,fontSize:10,fontWeight:700,
                background:k.up?C.greenL:C.amberL,borderRadius:20,padding:"2px 8px",
              }}>{k.up?"↑":""} {k.delta}</span>
            </div>
            <div style={{color:C.ink,fontWeight:900,fontSize:20,marginTop:10,letterSpacing:-0.5}}>{k.value}</div>
            <div style={{color:C.ink3,fontSize:11,marginTop:3}}>{k.label}</div>
          </Card>
        ))}
      </div>

      <Card pad="0" style={{overflow:"hidden"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{color:C.ink,fontWeight:700,fontSize:13}}>Trust Score Distribution</div>
          <div style={{color:C.ink3,fontSize:11,marginTop:1}}>847 active shoppers this session</div>
        </div>
        <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}} role="list" aria-label="Trust score distribution">
          {dist.map(d => (
            <div key={d.r} style={{display:"flex",alignItems:"center",gap:10}} role="listitem">
              <span style={{color:C.ink3,fontSize:11,fontWeight:700,minWidth:46,flexShrink:0}}>{d.r}</span>
              <div style={{flex:1,height:24,background:C.surfaceAlt,borderRadius:7,overflow:"hidden"}}>
                <div style={{
                  width:`${(d.n/mx)*100}%`,height:"100%",
                  background:`linear-gradient(90deg,${d.c}55,${d.c}99)`,
                  borderRadius:7,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8,
                  transition:"width .7s cubic-bezier(.4,0,.2,1)",
                }}>
                  <span style={{color:d.c,fontSize:11,fontWeight:800}}>{d.n}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card pad="0" style={{overflow:"hidden"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{color:C.ink,fontWeight:700,fontSize:13}}>Live Transaction Feed</div>
          {live && (
            <div style={{display:"flex",alignItems:"center",gap:5}} role="status" aria-label="Feed updating">
              <div style={{width:6,height:6,borderRadius:"50%",background:C.blue,animation:"blink 1s infinite"}} aria-hidden="true"/>
              <span style={{color:C.blue,fontSize:10,fontWeight:700}}>Updating</span>
            </div>
          )}
        </div>
        {TXNS.map((tx, i) => {
          const s = SM[tx.status] || {bg:"#F1F5F9",color:C.ink3,label:tx.status};
          return (
            <div key={tx.id} style={{
              padding:"11px 16px",display:"flex",alignItems:"center",gap:10,
              borderBottom:i < TXNS.length-1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                width:36,height:36,borderRadius:10,background:C.surfaceAlt,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,
              }} aria-hidden="true">
                {tx.status==="exited"?"✓":tx.status==="flagged"?"🚨":"⚠"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.ink,fontSize:13,fontWeight:700}}>{tx.name}</span>
                  <span style={{color:C.blue,fontWeight:800,fontSize:13}}>₹{tx.total.toLocaleString("en-IN")}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:3}}>
                  <span style={{color:C.ink3,fontSize:11}}>{tx.id} · {tx.items} items · {tx.time} ago</span>
                  <StatusBadge status={tx.status}/>
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <Card pad="0" style={{overflow:"hidden"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{color:C.ink,fontWeight:700,fontSize:13}}>Security Rules</div>
        </div>
        <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
          {[
            {label:"Spot Check Rate",  value:"15%",       note:"New & low-trust users"},
            {label:"Mandatory Check",  value:"Score < 40",note:"Always stopped"},
            {label:"Age Verification", value:"All Items", note:"Alcohol, tobacco"},
          ].map(r => (
            <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:C.surfaceAlt,borderRadius:10}}>
              <div>
                <div style={{color:C.ink,fontSize:13,fontWeight:600}}>{r.label}</div>
                <div style={{color:C.ink3,fontSize:11,marginTop:1}}>{r.note}</div>
              </div>
              <span style={{
                background:C.blueL,color:C.blue,
                border:`1px solid ${C.blue}22`,borderRadius:8,
                padding:"4px 10px",fontSize:11,fontWeight:800,
              }}>{r.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState("shopper");
  const tabs = [
    {id:"shopper",  label:"Shopper",   icon:"🛒"},
    {id:"guard",    label:"Guard",     icon:"🛡️"},
    {id:"manager",  label:"Dashboard", icon:"📊"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Inter','DM Sans',system-ui,sans-serif",color:C.ink}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        @keyframes blink      {0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes spin       {to{transform:rotate(360deg)}}
        @keyframes ringPulse  {0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.7;transform:scale(1.04)}}
        @keyframes popIn      {from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
        @keyframes slideIn    {from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes skelShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp     {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:2px}
        button:focus-visible,a:focus-visible{outline:2px solid ${C.blue};outline-offset:2px;border-radius:4px;}
        button{font-family:'Inter','DM Sans',system-ui,sans-serif;}
        input{font-family:'Inter','DM Sans',system-ui,sans-serif;}
      `}</style>

      <header
        style={{
          maxWidth:520,margin:"0 auto",padding:"16px 20px 0",
          display:"flex",alignItems:"center",justifyContent:"space-between",
        }}
        role="banner"
      >
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{
            width:36,height:36,borderRadius:10,
            background:`linear-gradient(135deg,${C.blue},${C.violet})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
            boxShadow:`0 4px 12px ${C.blue}44`,
          }} aria-hidden="true">🛒</div>
          <div>
            <div style={{fontWeight:900,fontSize:16,fontFamily:"'Plus Jakarta Sans','Inter',sans-serif",letterSpacing:-0.3,color:C.ink}} role="heading" aria-level={1}>ScanGo</div>
            <div style={{fontSize:9,color:C.ink4,letterSpacing:2,fontWeight:600,textTransform:"uppercase"}}>Retail OS · India</div>
          </div>
        </div>
        <div
          style={{
            display:"flex",alignItems:"center",gap:7,
            background:C.greenL,border:`1px solid ${C.green}33`,
            borderRadius:20,padding:"5px 12px",
          }}
          role="status"
          aria-label="All systems operational"
        >
          <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"blink 2s infinite"}} aria-hidden="true"/>
          <span style={{color:C.green,fontSize:10,fontWeight:700}}>All Systems OK</span>
        </div>
      </header>

      <nav
        role="tablist"
        aria-label="Main navigation"
        style={{
          maxWidth:520,margin:"14px auto 0",padding:"0 20px",
          position:"sticky",top:0,zIndex:50,
        }}
      >
        <div style={{
          background:`${C.surface}E8`,
          backdropFilter:"blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
          border:`1px solid ${C.border}`,
          borderRadius:16,padding:5,
          display:"flex",gap:4,
          boxShadow:C.shM,
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab===t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              style={{
                flex:1,padding:"9px 4px",
                background:tab===t.id ? `linear-gradient(135deg,${C.blue},${C.violet})` : "transparent",
                border:"none",borderRadius:11,cursor:"pointer",
                color:tab===t.id ? "#FFF" : C.ink3,
                fontWeight:tab===t.id ? 700 : 500,fontSize:12,
                transition:"all .2s ease",
                display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                fontFamily:"inherit",
              }}
            >
              <span style={{fontSize:16}} aria-hidden="true">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main
        id={`panel-${tab}`}
        role="tabpanel"
        aria-label={tabs.find(t=>t.id===tab)?.label}
        style={{maxWidth:520,margin:"0 auto",padding:"16px 20px 80px",animation:"fadeUp .25s ease"}}
      >
        {tab === "shopper"  && <ShopperApp/>}
        {tab === "guard"    && <GuardApp/>}
        {tab === "manager"  && <Dashboard/>}
      </main>
    </div>
  );
}
