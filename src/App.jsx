import { useState, useEffect, useRef } from "react";

const AMBER = "#E8A030";
const AMBER_DIM = "#A06818";
const AMBER_GLOW = "#F0B84020";
const BG = "#0F0E0C";
const BG2 = "#181610";
const BG3 = "#221F18";
const BG4 = "#2C2820";
const BORDER = "#3A3428";
const BORDER_LIT = "#5A4E38";
const TEXT = "#F0EAD8";
const TEXT_DIM = "#8A7E68";
const TEXT_MUTED = "#4A4438";
const GREEN = "#4EC994";
const GREEN_DIM = "#1A5C3A";
const RED = "#E05545";
const BLUE = "#4A9EE0";
const PURPLE = "#9B72CF";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${BG};color:${TEXT};font-family:'Syne',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:${BG2};}
  ::-webkit-scrollbar-thumb{background:${BORDER_LIT};border-radius:2px;}
  .mono{font-family:'DM Mono',monospace;}
  .bebas{font-family:'Bebas Neue',sans-serif;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
  @keyframes slideIn{from{transform:translateY(-8px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  @keyframes flash{0%,100%{background:${BG3};}50%{background:${AMBER_GLOW};}}
  @keyframes tickerScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  @keyframes ripple{0%{transform:scale(1);opacity:0.6;}100%{transform:scale(2.4);opacity:0;}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
  .ticker-wrap{overflow:hidden;white-space:nowrap;border-bottom:1px solid ${BORDER};}
  .ticker-inner{display:inline-flex;animation:tickerScroll 28s linear infinite;}
  .ticker-inner:hover{animation-play-state:paused;}
  .btn-bid{background:${AMBER};color:#0F0E0C;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;border:none;cursor:pointer;padding:10px 20px;width:100%;transition:all 0.15s;}
  .btn-bid:hover{background:#F0C060;transform:translateY(-1px);}
  .btn-bid:active{transform:scale(0.97);}
  .btn-bid.locked{background:${GREEN};color:#0F0E0C;}
  .btn-outline{background:transparent;color:${TEXT_DIM};font-family:'DM Mono',monospace;font-size:11px;border:1px solid ${BORDER};cursor:pointer;padding:6px 12px;transition:all 0.15s;letter-spacing:0.5px;}
  .btn-outline:hover{border-color:${AMBER};color:${AMBER};}
  .tab{background:transparent;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;font-weight:600;padding:8px 16px;color:${TEXT_DIM};transition:all 0.15s;border-bottom:2px solid transparent;letter-spacing:0.5px;}
  .tab.active{color:${AMBER};border-bottom-color:${AMBER};}
  .tab:hover:not(.active){color:${TEXT};}
  .card{background:${BG2};border:1px solid ${BORDER};transition:border-color 0.2s,transform 0.2s;}
  .card:hover{border-color:${BORDER_LIT};transform:translateY(-2px);}
  .card.featured{border-color:${AMBER_DIM};}
  .card.featured:hover{border-color:${AMBER};}
  .timer-red{color:${RED} !important;animation:pulse 1s ease-in-out infinite;}
  .timer-yellow{color:${AMBER} !important;}
  .feed-item{animation:fadeUp 0.3s ease;}
  .presale-bar{height:3px;background:${BG4};overflow:hidden;}
  .presale-fill{height:100%;background:linear-gradient(90deg,${AMBER_DIM},${AMBER});transition:width 0.5s;}
  .badge{display:inline-flex;align-items:center;gap:4px;font-family:'DM Mono',monospace;font-size:10px;padding:3px 7px;font-weight:500;letter-spacing:0.3px;}
  .dot{width:6px;height:6px;border-radius:50%;display:inline-block;}
  .dot.green{background:${GREEN};}
  .dot.amber{background:${AMBER};}
  .dot.red{background:${RED};}
  .dot.blue{background:${BLUE};}
  .dot.pulse{animation:pulse 1.2s ease infinite;}
  .live-dot{position:relative;display:inline-flex;align-items:center;justify-content:center;}
  .live-dot::after{content:'';position:absolute;width:10px;height:10px;border-radius:50%;background:${GREEN};animation:ripple 1.5s ease infinite;}
  input[type=text],input[type=number],select{background:${BG3};border:1px solid ${BORDER};color:${TEXT};font-family:'DM Mono',monospace;font-size:13px;padding:8px 12px;width:100%;outline:none;}
  input:focus,select:focus{border-color:${AMBER};}
  select option{background:${BG3};}
`;

const CATEGORIES = ["ALL", "PHYSICAL", "DIGITAL", "AGENT"];
const SORT_OPTIONS = ["ENDING SOON", "MOST BIDS", "HOTTEST", "NEWEST"];

const initialListings = [
  {id:1,title:"Vintage Leica M6 + 35mm Summicron",cat:"PHYSICAL",seller:"kenji_atl",sellerType:"human",price:1240,topBid:1580,bids:23,watchers:87,timeLeft:312,presale:100,presaleGoal:100,condition:"EX+",featured:true,hot:true,verified:"verified",score:94,tags:["CAMERA","ANALOG"],img:"📷",shipping:"RAPID$ SHIPS",desc:"Near-mint condition. Original box, strap, lens caps. Light meter calibrated 2023.",agentCompatible:true},
  {id:2,title:"GPT-4 Fine-Tune Dataset — 50K Fashion QA",cat:"DIGITAL",seller:"agent_synth_v2",sellerType:"agent",price:320,topBid:490,bids:41,watchers:134,timeLeft:88,presale:100,presaleGoal:100,condition:"DIGITAL",featured:true,hot:true,verified:"verified",score:99,tags:["AI","DATASET"],img:"🧠",shipping:"INSTANT DL",desc:"Curated 50,000 fashion Q&A pairs. JSONL format. Validated, deduplicated, production-ready.",agentCompatible:true},
  {id:3,title:"Supreme FW23 Box Logo Hoodie — XL",cat:"PHYSICAL",seller:"drip_resell",sellerType:"human",price:480,topBid:510,bids:9,watchers:56,timeLeft:1840,presale:68,presaleGoal:100,condition:"DS",featured:false,hot:false,verified:"scanning",score:null,tags:["STREETWEAR"],img:"👕",shipping:"SELLER SHIPS",desc:"Deadstock, original receipt. Ships from NYC within 24h.",agentCompatible:false},
  {id:4,title:"3x Ethereum Validator Key Export Bundle",cat:"DIGITAL",seller:"0xVault",sellerType:"human",price:2100,topBid:2100,bids:2,watchers:29,timeLeft:5400,presale:40,presaleGoal:80,condition:"DIGITAL",featured:false,hot:false,verified:"flagged",score:42,tags:["CRYPTO","ETH"],img:"🔐",shipping:"SECURE TRANSFER",desc:"Active validators. Includes full withdrawal key export. Presale closes if < 80 engaged.",agentCompatible:true},
  {id:5,title:"Brutalist Ceramic Lamp — One of One",cat:"PHYSICAL",seller:"studio_haus",sellerType:"human",price:890,topBid:1150,bids:17,watchers:62,timeLeft:720,presale:100,presaleGoal:100,condition:"NEW",featured:true,hot:false,verified:"verified",score:88,tags:["ART","HOME"],img:"🏺",shipping:"RAPID$ SHIPS",desc:"Handcast cement + glaze. Signed underside. Ships insured.",agentCompatible:false},
  {id:6,title:"Autonomous Sourcing Agent — Licence x12mo",cat:"DIGITAL",seller:"agent_flux_3",sellerType:"agent",price:799,topBid:960,bids:34,watchers:201,timeLeft:199,presale:100,presaleGoal:100,condition:"DIGITAL",featured:true,hot:true,verified:"verified",score:97,tags:["AGENT","SAAS"],img:"⚡",shipping:"API KEY",desc:"Full-stack sourcing agent. Integrates Shopify, Amazon, eBay. 98.2% uptime SLA.",agentCompatible:true},
];

const feedEvents = [
  {type:"bid",user:"phantom_99",item:"GPT-4 Fine-Tune Dataset",amount:490,ago:3},
  {type:"watch",user:"agent_mkv1",item:"Autonomous Sourcing Agent",ago:5},
  {type:"bid",user:"0xRoller",item:"Leica M6",amount:1580,ago:11},
  {type:"sold",user:"drip_resell",item:"Nike SB Fragment",amount:780,ago:22},
  {type:"bid",user:"FLUX_BUYER",item:"Autonomous Sourcing Agent",amount:960,ago:34},
  {type:"watch",user:"kenji_atl",item:"Supreme Hoodie",ago:40},
  {type:"bid",user:"agent_arb9",item:"Brutalist Lamp",amount:1150,ago:55},
  {type:"new",user:"studio_neo",item:"Arc'teryx LEAF Alpha",ago:78},
];

const newFeedItems = [
  {type:"bid",user:"ghost_buyer",item:"Leica M6",amount:1600},
  {type:"watch",user:"agent_flux_4",item:"GPT-4 Dataset"},
  {type:"bid",user:"resell_matrix",item:"Supreme Hoodie",amount:540},
  {type:"new",user:"agent_syn",item:"Claude Prompt Pack v4"},
  {type:"sold",user:"phantom_99",item:"Vintage Rolex",amount:4200},
  {type:"bid",user:"0xLane",item:"ETH Validators",amount:2350},
  {type:"watch",user:"human_x",item:"Autonomous Agent"},
];

function formatTime(secs) {
  if (secs <= 0) return "ENDED";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s.toString().padStart(2,"0")}s`;
  return `${s}s`;
}

function VerifiedBadge({ status, score }) {
  if (status === "verified") return (
    <span className="badge" style={{background:"#0A2818",color:GREEN,border:`1px solid ${GREEN_DIM}`}}>
      <span>✓</span> AI VERIFIED {score && <span style={{color:"#2A8A5A"}}>· {score}</span>}
    </span>
  );
  if (status === "scanning") return (
    <span className="badge" style={{background:"#0A1828",color:BLUE,border:`1px solid #1A3858`}}>
      <span className="dot blue pulse" style={{width:5,height:5}} /> SCANNING
    </span>
  );
  return (
    <span className="badge" style={{background:"#280A0A",color:RED,border:`1px solid #5A1818`}}>
      ⚠ FLAGGED
    </span>
  );
}

function TimerDisplay({ secs }) {
  const cls = secs < 120 ? "timer-red mono bebas" : secs < 600 ? "timer-yellow mono bebas" : "mono bebas";
  return <span className={cls} style={{fontSize:22,letterSpacing:1}}>{formatTime(secs)}</span>;
}

function ListingCard({ listing, onBid }) {
  const [bidState, setBidState] = useState("idle");
  const isAgent = listing.sellerType === "agent";
  const presalePct = Math.min(100, (listing.presale / listing.presaleGoal) * 100);
  const presaleMet = presalePct >= 100;

  const handleBid = () => {
    setBidState("confirm");
    setTimeout(() => { setBidState("locked"); onBid(listing.id); setTimeout(() => setBidState("idle"), 2000); }, 1200);
  };

  return (
    <div className={`card ${listing.featured ? "featured" : ""}`} style={{borderRadius:4,overflow:"hidden",position:"relative"}}>
      {listing.featured && (
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${AMBER_DIM},${AMBER},${AMBER_DIM})`}} />
      )}
      <div style={{padding:"14px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {listing.featured && (
              <span className="badge bebas" style={{background:AMBER_GLOW,color:AMBER,border:`1px solid ${AMBER_DIM}`,fontSize:11,letterSpacing:1}}>
                ⚡ FEATURED
              </span>
            )}
            {listing.hot && (
              <span className="badge" style={{background:"#280A0A",color:RED,border:`1px solid #5A1818`,fontSize:10}}>
                🔥 HOT
              </span>
            )}
            {isAgent && (
              <span className="badge" style={{background:"#0A0A28",color:PURPLE,border:`1px solid #2A1A5A`,fontSize:10}}>
                ⚡ AGENT
              </span>
            )}
          </div>
          <VerifiedBadge status={listing.verified} score={listing.score} />
        </div>

        <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
          <div style={{fontSize:32,lineHeight:1,flexShrink:0}}>{listing.img}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="bebas" style={{fontSize:18,letterSpacing:0.5,lineHeight:1.1,marginBottom:3,color:TEXT}}>{listing.title}</div>
            <div style={{fontSize:11,color:TEXT_MUTED,fontFamily:"DM Mono,monospace"}}>{listing.desc.slice(0,60)}…</div>
          </div>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {listing.tags.map(t => (
            <span key={t} className="mono" style={{fontSize:10,padding:"2px 6px",background:BG4,color:TEXT_DIM,border:`1px solid ${BORDER}`,letterSpacing:0.5}}>{t}</span>
          ))}
          <span className="mono" style={{fontSize:10,padding:"2px 6px",background:BG4,color:TEXT_DIM,border:`1px solid ${BORDER}`}}>{listing.condition}</span>
        </div>
      </div>

      <div style={{padding:"0 16px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:8}}>
          <div>
            <div className="mono" style={{fontSize:10,color:TEXT_MUTED,marginBottom:2}}>TOP BID</div>
            <div className="bebas" style={{fontSize:28,color:AMBER,letterSpacing:1}}>${listing.topBid.toLocaleString()}</div>
            <div className="mono" style={{fontSize:10,color:TEXT_DIM}}>floor ${listing.price.toLocaleString()} · {listing.bids} bids</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="mono" style={{fontSize:10,color:TEXT_MUTED,marginBottom:2}}>ENDS IN</div>
            <TimerDisplay secs={listing.timeLeft} />
            <div className="mono" style={{fontSize:10,color:TEXT_DIM,marginTop:1}}>{listing.watchers} watching</div>
          </div>
        </div>

        {!presaleMet && (
          <div style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span className="mono" style={{fontSize:10,color:TEXT_MUTED}}>PRESALE GATE</span>
              <span className="mono" style={{fontSize:10,color:presalePct > 60 ? AMBER : RED}}>{presalePct.toFixed(0)}% / {listing.presaleGoal}%</span>
            </div>
            <div className="presale-bar"><div className="presale-fill" style={{width:`${presalePct}%`}} /></div>
            <div className="mono" style={{fontSize:9,color:TEXT_MUTED,marginTop:3}}>seller may cancel if gate not met</div>
          </div>
        )}

        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
          <div className="dot" style={{width:5,height:5,background:isAgent?PURPLE:"#8A7E68",borderRadius:"50%",flexShrink:0}} />
          <span className="mono" style={{fontSize:10,color:TEXT_DIM}}>@{listing.seller}</span>
          <span style={{flex:1}} />
          <span className="mono" style={{fontSize:10,color:TEXT_DIM,padding:"2px 6px",border:`1px solid ${BORDER}`}}>{listing.shipping}</span>
          {listing.agentCompatible && (
            <span className="mono" style={{fontSize:9,color:PURPLE,padding:"2px 6px",border:`1px solid #2A1A5A`}}>API ✓</span>
          )}
        </div>

        <button
          className={`btn-bid ${bidState === "locked" ? "locked" : ""}`}
          onClick={handleBid}
          style={{borderRadius:2}}
        >
          {bidState === "idle" && "BID NOW"}
          {bidState === "confirm" && "⚡ LOCKING IN..."}
          {bidState === "locked" && "✓ BID PLACED"}
        </button>
      </div>
    </div>
  );
}

function FeedItem({ item }) {
  const icons = {bid:"↑",watch:"👁",sold:"✓",new:"+"};
  const colors = {bid:AMBER,watch:TEXT_DIM,sold:GREEN,new:BLUE};
  return (
    <div className="feed-item" style={{display:"flex",gap:8,padding:"7px 0",borderBottom:`1px solid ${BG4}`,alignItems:"flex-start"}}>
      <span style={{fontFamily:"DM Mono,monospace",fontSize:12,color:colors[item.type],flexShrink:0,width:14,textAlign:"center"}}>{icons[item.type]}</span>
      <div style={{flex:1,minWidth:0}}>
        <span className="mono" style={{fontSize:11,color:TEXT_DIM}}>{item.user} </span>
        <span className="mono" style={{fontSize:11,color:TEXT_MUTED}}>
          {item.type==="bid" && `bid $${item.amount?.toLocaleString()} on `}
          {item.type==="watch" && "watching "}
          {item.type==="sold" && `sold for $${item.amount?.toLocaleString()} `}
          {item.type==="new" && "listed "}
        </span>
        <span className="mono" style={{fontSize:11,color:TEXT,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.item}</span>
      </div>
      {item.ago && <span className="mono" style={{fontSize:10,color:TEXT_MUTED,flexShrink:0}}>{item.ago}s</span>}
    </div>
  );
}

const tickerData = [
  "⚡ LEICA M6 → $1,580","🔥 GPT-4 DATASET → $490","✓ FRAGMENT DUNK → SOLD $780",
  "⚡ ARC'TERYX LEAF → $1,200","🔥 AUTONOMOUS AGENT → $960","+ CLAUDE PACK V4 → LISTED",
  "⚡ ETH VALIDATORS → $2,350","✓ BRUTALIST LAMP → $1,150","🔥 SUPREME FW23 → GATE 68%",
];

export default function RapidsApp() {
  const [listings, setListings] = useState(initialListings);
  const [feed, setFeed] = useState(feedEvents);
  const [activeTab, setActiveTab] = useState("ALL");
  const [sort, setSort] = useState("ENDING SOON");
  const [liveCount, setLiveCount] = useState(1847);
  const [showSearch, setShowSearch] = useState(false);
  const feedRef = useRef(null);
  const feedIdx = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setListings(prev => prev.map(l => ({ ...l, timeLeft: Math.max(0, l.timeLeft - 1) })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 7) - 3);
      const nextItem = newFeedItems[feedIdx.current % newFeedItems.length];
      feedIdx.current++;
      setFeed(prev => [{ ...nextItem, ago: null }, ...prev.slice(0, 18)]);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleBid = (id) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, bids: l.bids + 1, topBid: l.topBid + Math.floor(Math.random() * 40 + 10) } : l));
  };

  const filtered = listings
    .filter(l => activeTab === "ALL" || (activeTab === "AGENT" ? l.sellerType === "agent" : l.cat === activeTab))
    .sort((a, b) => {
      if (sort === "ENDING SOON") return a.timeLeft - b.timeLeft;
      if (sort === "MOST BIDS") return b.bids - a.bids;
      if (sort === "HOTTEST") return (b.hot ? 1 : 0) - (a.hot ? 1 : 0);
      return b.id - a.id;
    });

  const totalVolume = listings.reduce((s, l) => s + l.topBid, 0);

  return (
    <div style={{minHeight:"100vh",background:BG,color:TEXT}}>
      <style>{css}</style>

      {/* Ticker */}
      <div className="ticker-wrap" style={{background:BG2,padding:"6px 0"}}>
        <div className="ticker-inner">
          {[...tickerData, ...tickerData].map((t, i) => (
            <span key={i} className="mono" style={{fontSize:11,color:TEXT_DIM,padding:"0 28px",borderRight:`1px solid ${BG4}`}}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header style={{background:BG2,borderBottom:`1px solid ${BORDER}`,padding:"0 24px"}}>
        <div style={{maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",gap:20,height:60}}>
          <div style={{display:"flex",alignItems:"baseline",gap:4}}>
            <span className="bebas" style={{fontSize:32,color:AMBER,letterSpacing:2}}>RAPID</span>
            <span className="bebas" style={{fontSize:32,color:GREEN,letterSpacing:1}}>$</span>
          </div>
          <div style={{width:1,height:28,background:BORDER}} />
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div className="live-dot">
              <div style={{width:8,height:8,borderRadius:"50%",background:GREEN,position:"relative",zIndex:1}} />
            </div>
            <span className="mono" style={{fontSize:11,color:GREEN}}>{liveCount.toLocaleString()} LIVE</span>
          </div>
          <div style={{flex:1}} />
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div className="mono" style={{fontSize:11,color:TEXT_DIM,padding:"6px 12px",border:`1px solid ${BORDER}`,borderRadius:2}}>
              VOL 24H · <span style={{color:AMBER}}>${totalVolume.toLocaleString()}</span>
            </div>
            <button className="btn-outline" onClick={() => setShowSearch(!showSearch)} style={{borderRadius:2}}>⌕ SEARCH</button>
            <button className="btn-bid" style={{width:"auto",padding:"8px 20px",borderRadius:2,fontSize:14}}>+ LIST NOW</button>
          </div>
        </div>
      </header>

      <div style={{maxWidth:1280,margin:"0 auto",padding:"20px 24px",display:"grid",gridTemplateColumns:"1fr 280px",gap:20}}>

        {/* Main */}
        <div>
          {/* Search bar */}
          {showSearch && (
            <div style={{marginBottom:16,animation:"slideIn 0.2s ease"}}>
              <input type="text" placeholder="search listings, agents, categories…" style={{borderRadius:2,fontSize:13}} />
            </div>
          )}

          {/* Controls */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,borderBottom:`1px solid ${BORDER}`}}>
            <div style={{display:"flex",gap:0}}>
              {CATEGORIES.map(cat => (
                <button key={cat} className={`tab ${activeTab === cat ? "active" : ""}`} onClick={() => setActiveTab(cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{width:"auto",borderRadius:2,fontSize:11,padding:"5px 10px",color:TEXT_DIM}}>
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
            {[
              {label:"ACTIVE LOTS",value:filtered.length,color:TEXT},
              {label:"HOT RIGHT NOW",value:filtered.filter(l=>l.hot).length,color:RED},
              {label:"AGENT LISTINGS",value:listings.filter(l=>l.sellerType==="agent").length,color:PURPLE},
              {label:"CLOSING <5m",value:listings.filter(l=>l.timeLeft<300).length,color:AMBER},
            ].map(stat => (
              <div key={stat.label} style={{background:BG3,border:`1px solid ${BORDER}`,padding:"10px 14px",borderRadius:2}}>
                <div className="mono" style={{fontSize:9,color:TEXT_MUTED,marginBottom:4,letterSpacing:0.5}}>{stat.label}</div>
                <div className="bebas" style={{fontSize:26,color:stat.color,letterSpacing:1}}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
            {filtered.map(l => <ListingCard key={l.id} listing={l} onBid={handleBid} />)}
          </div>

          {filtered.length === 0 && (
            <div style={{textAlign:"center",padding:"60px 0",color:TEXT_MUTED}}>
              <div className="bebas" style={{fontSize:32,letterSpacing:2}}>NO LOTS FOUND</div>
              <div className="mono" style={{fontSize:12,marginTop:8}}>try a different category</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {/* Agent API promo */}
          <div style={{background:BG2,border:`1px solid #2A1A5A`,borderRadius:2,padding:"14px 16px",borderLeft:`3px solid ${PURPLE}`}}>
            <div className="bebas" style={{fontSize:16,color:PURPLE,letterSpacing:1,marginBottom:6}}>AGENT ACCESS</div>
            <div className="mono" style={{fontSize:11,color:TEXT_DIM,lineHeight:1.6,marginBottom:12}}>
              Integrate Rapid$ into your agent pipeline. Bid, list, and close programmatically via REST API.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {["POST /bid","GET /listings","POST /list","WS /live-feed"].map(ep => (
                <div key={ep} className="mono" style={{fontSize:10,color:PURPLE,padding:"4px 8px",background:"#0A0A20",border:`1px solid #1A1040`}}>{ep}</div>
              ))}
            </div>
            <button className="btn-outline" style={{width:"100%",marginTop:12,borderColor:"#2A1A5A",color:PURPLE,borderRadius:2,fontSize:10}}>GET API KEY ↗</button>
          </div>

          {/* Live Feed */}
          <div style={{background:BG2,border:`1px solid ${BORDER}`,borderRadius:2,flex:1}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:GREEN,animation:"pulse 1.2s ease infinite"}} />
              <span className="bebas" style={{fontSize:15,letterSpacing:1,color:TEXT}}>LIVE FEED</span>
              <span style={{flex:1}} />
              <span className="mono" style={{fontSize:9,color:TEXT_MUTED}}>AUTO-UPDATES</span>
            </div>
            <div ref={feedRef} style={{padding:"4px 16px",maxHeight:400,overflowY:"auto"}}>
              {feed.map((item, i) => <FeedItem key={i} item={item} />)}
            </div>
          </div>

          {/* Featured promo */}
          <div style={{background:BG2,border:`1px solid ${AMBER_DIM}`,borderRadius:2,padding:"14px 16px"}}>
            <div className="bebas" style={{fontSize:14,color:AMBER,letterSpacing:1,marginBottom:6}}>BOOST YOUR LISTING</div>
            <div className="mono" style={{fontSize:11,color:TEXT_DIM,lineHeight:1.6,marginBottom:10}}>
              Feature your item on the homepage, ticker, and agent feed. Avg. 3.2× more bids.
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              {[{plan:"24H",price:"$9"},{plan:"72H",price:"$19"},{plan:"7D",price:"$39"}].map(p => (
                <div key={p.plan} style={{flex:1,margin:"0 3px",background:BG4,border:`1px solid ${BORDER}`,padding:"8px 6px",textAlign:"center",cursor:"pointer",borderRadius:2}} className="btn-outline">
                  <div className="bebas" style={{fontSize:16,color:AMBER,letterSpacing:1}}>{p.plan}</div>
                  <div className="mono" style={{fontSize:10,color:TEXT_DIM}}>{p.price}</div>
                </div>
              ))}
            </div>
            <button className="btn-bid" style={{borderRadius:2,fontSize:13}}>FEATURE NOW</button>
          </div>

          {/* Fee info */}
          <div style={{background:BG3,border:`1px solid ${BORDER}`,borderRadius:2,padding:"12px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span className="mono" style={{fontSize:10,color:TEXT_MUTED}}>PLATFORM FEE</span>
              <span className="bebas" style={{fontSize:22,color:AMBER}}>7%</span>
            </div>
            <div className="mono" style={{fontSize:10,color:TEXT_MUTED,lineHeight:1.6}}>
              Only on closed deals. No listing fees. No subscriptions. Agents billed via API invoice.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
