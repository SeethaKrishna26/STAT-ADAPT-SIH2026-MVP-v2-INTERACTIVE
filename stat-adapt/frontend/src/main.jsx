import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {LayoutDashboard, ClipboardCheck, BookOpen, Sparkles, BarChart3, Upload, Menu, X, ShieldCheck} from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App(){
  const [page,setPage]=useState("dashboard");
  window.goToAssessment=()=>setPage("assessment");
  window.goToLearning=()=>setPage("learning");
  window.goToQuiz=()=>setPage("quiz");
  window.goToAdmin=()=>setPage("admin");
  const [mobile,setMobile]=useState(false);
  const [dashboard,setDashboard]=useState(null);
  const [courses,setCourses]=useState([]);
  const [quiz,setQuiz]=useState(null);
  const [uploading,setUploading]=useState(false);

  useEffect(()=>{fetch(API+"/api/dashboard").then(r=>r.json()).then(setDashboard).catch(()=>{}); fetch(API+"/api/courses").then(r=>r.json()).then(setCourses).catch(()=>{});},[]);

  const nav=[
    ["dashboard","Dashboard",LayoutDashboard],
    ["assessment","Assessment",ClipboardCheck],
    ["learning","Learning Path",BookOpen],
    ["quiz","AI Quiz Generator",Sparkles],
    ["admin","Admin Analytics",BarChart3]
  ];
  const navigate=p=>{setPage(p);setMobile(false)};

  async function upload(e){
    const file=e.target.files?.[0]; if(!file)return;
    setUploading(true); setQuiz(null);
    const fd=new FormData(); fd.append("file",file);
    try{const r=await fetch(API+"/api/generate-quiz",{method:"POST",body:fd}); setQuiz(await r.json());}
    catch(err){setQuiz({error:"Backend unavailable. Start the FastAPI server first."})}
    setUploading(false);
  }

  return <div className="app">
    <aside className={mobile?"sidebar open":"sidebar"}>
      <div className="brand"><div className="brandmark">SA</div><div><b>STAT-ADAPT</b><small>Official Statistics</small></div></div>
      <div className="nav">{nav.map(([id,label,Icon])=><button className={page===id?"active":""} onClick={()=>navigate(id)} key={id}><Icon size={18}/>{label}</button>)}</div>
      <div className="sidebottom"><ShieldCheck size={18}/><span>Secure • Role-based</span></div>
    </aside>
    {mobile && <div className="overlay" onClick={()=>setMobile(false)}/>}
    <main className="main">
      <header><button className="menu" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button><div><span className="eyebrow">MO SPI • CAPACITY BUILDING</span><h1>{nav.find(x=>x[0]===page)?.[1]}</h1></div><div className="user"><div className="avatar">IK</div><span>Demo Learner</span></div></header>
      <section className="content">
        {page==="dashboard" && <Dashboard d={dashboard}/>}
        {page==="assessment" && <Assessment/>}
        {page==="learning" && <Learning courses={courses}/>}
        {page==="quiz" && <Quiz upload={upload} uploading={uploading} quiz={quiz}/>}
        {page==="admin" && <Admin d={dashboard}/>}
      </section>
    </main>
  </div>
}


function Journey({current="dashboard"}){
 const steps=[
  ["assessment","1","Competency Assessment","Measure current skills"],
  ["gap","2","Competency Gap","Identify skill gaps"],
  ["learning","3","iGOT Karmayogi","Get relevant resources"],
  ["learning","4","User Learns","Follow the personalized path"],
  ["admin","5","Admin + RAG","Use organizational content"],
  ["quiz","6","Query / Practice","Generate & attempt quizzes"],
  ["assessment","7","Re-assess","Measure competency again"]
 ];
 return <div className="journey card">
   <div className="journeytitle"><div><span className="pill">YOUR LEARNING JOURNEY</span><h3>From assessment to measurable improvement</h3></div><span className="journeystatus">Interactive workflow</span></div>
   <div className="journeysteps">
    {steps.map(([target,n,title,desc],i)=><React.Fragment key={n}>
      <button className={"journeystep "+(current===target?"current":"")} onClick={()=>{if(target==="assessment")window.goToAssessment();else if(target==="learning")window.goToLearning();else if(target==="quiz")window.goToQuiz();else if(target==="admin")window.goToAdmin();}}>
       <span className="stepcircle">{n}</span><span><b>{title}</b><small>{desc}</small></span>
      </button>
      {i<steps.length-1 && <span className="journeyarrow">→</span>}
    </React.Fragment>)}
   </div>
 </div>
}

function Dashboard({d}){
 return <><div className="hero"><div><span className="pill">PERSONALIZED LEARNING</span><h2>Build stronger statistical capabilities.</h2><p>STAT-ADAPT identifies competency gaps and turns them into an actionable learning journey.</p><button className="primary" onClick={()=>window.goToAssessment()}>Take assessment →</button></div><div className="hero-orb"><Sparkles size={48}/></div></div>
 <div className="grid four">{[
 ["Overall competency",d?.overall??68,"%","↑ 8% this month"],
 ["Learning progress",d?.progress??61,"%","3 courses active"],
 ["Quiz average",d?.quiz_average??78,"%","12 quizzes"],
 ["Courses completed",d?.courses_completed??3,"","This quarter"]
 ].map((x,i)=><div className="card stat" key={i}><span>{x[0]}</span><strong>{x[1]}{x[2]}</strong><small>{x[3]}</small></div>)}</div>
 <div className="grid two"><div className="card"><div className="cardhead"><h3>Competency gaps</h3><span>Priority</span></div>{(d?.gaps||[]).map(g=><div className="barrow" key={g.domain}><div><b>{g.domain}</b><span>{g.score}%</span></div><div className="bar"><i style={{width:g.score+"%"}}/></div>)}</div><div className="card"><div className="cardhead"><h3>Your next steps</h3></div><div className="steps"><div><b>01</b><span><strong>Complete assessment</strong><small>Refresh your competency profile</small></span></div><div><b>02</b><span><strong>Learn priority skills</strong><small>Focus on Machine Learning</small></span></div><div><b>03</b><span><strong>Practice with AI quizzes</strong><small>Generate questions from materials</small></span></div></div></div></div></>
}

function Assessment(){
 const [done,setDone]=useState(false), [result,setResult]=useState(null);
 const qs=[["Python",70],["Statistical Analysis",85],["Data Visualization",55],["Machine Learning",40],["Python",60],["Data Visualization",50]];
 async function submit(){const r=await fetch(API+"/api/assessment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:qs.map(([domain,score])=>({domain,score}))})});setResult(await r.json());setDone(true)}
 return <><Journey current="assessment"/><div className="card assessment"><span className="pill">DIAGNOSTIC ASSESSMENT</span><h2>Discover your competency gaps</h2><p>Answer the diagnostic questions to create a role-aware competency profile.</p>
 {!done?<><div className="question"><span>Question 1 of 6</span><h3>Which approach is most appropriate when preparing a dataset for statistical analysis?</h3>{["Remove all missing values without checking context","Inspect, clean and document missing values and outliers","Delete every categorical variable","Train a model before examining the data"].map((x,i)=><button className="option" key={i}>{x}<span>{String.fromCharCode(65+i)}</span></button>)}</div><button className="primary" onClick={submit}>Complete diagnostic →</button></>:<div className="result"><div className="score">{result.overall}%<small>overall competency</small></div><h3>Assessment complete</h3><p>Your learning path can now prioritize the largest competency gaps.</p>{result.gaps.map(g=><div className="resultrow" key={g.domain}><b>{g.domain}</b><span>{g.score}%</span><em>{g.score<60?"Priority gap":"On track"}</em></div>)}</div>}</div></>}

function Learning({courses}){
 return <><div className="sectionintro"><span className="pill">AI-RECOMMENDED</span><h2>Your personalized learning path</h2><p>Resources are ranked against your competency gaps and role goals.</p></div><div className="coursegrid">{courses.map(c=><div className="course card" key={c.id}><div className="courseicon"><BookOpen/></div><span className="tag">{c.level}</span><h3>{c.title}</h3><p>{c.provider}</p><div className="coursemeta"><span>{c.duration}</span><button>View course →</button></div></div>)}</div></>
}

function Quiz({upload,uploading,quiz}){
 return <><div className="sectionintro"><span className="pill">RAG + AI</span><h2>Generate grounded MCQs</h2><p>Upload learning material and generate practice questions grounded in the source content.</p></div>
 <label className="upload card"><input type="file" accept=".pdf,.txt" onChange={upload}/><div className="uploadicon"><Upload/></div><h3>{uploading?"Generating quiz…":"Upload PDF or TXT material"}</h3><p>Drag and drop or click to browse</p><small>Source evidence is shown with each question.</small></label>
 {quiz?.error&&<div className="alert">{quiz.error}</div>}
 {quiz?.questions&&<div className="quizresults"><div className="card"><b>Generated from:</b> {quiz.filename} <span className="sourcechars">{quiz.source_chars} source characters</span></div>{quiz.questions.map((q,i)=><div className="card qcard" key={q.id}><span className="qnum">QUESTION {i+1} • {q.difficulty}</span><h3>{q.question}</h3>{q.options.map((o,j)=><div className="qoption" key={j}><span>{String.fromCharCode(65+j)}</span>{o}</div>)}<div className="answer"><b>Answer:</b> {q.answer}<br/><small>{q.explanation}</small><div className="evidence">Source evidence: {q.source}</div></div></div>)}</div>}
 </>}
}

function Admin({d}){
 return <><div className="grid four">{[["Learners","1,248"],["Avg competency",`${d?.overall||68}%`],["Active learning","824"],["Gaps closed","37%"]].map(x=><div className="card stat"><span>{x[0]}</span><strong>{x[1]}</strong><small>Current cohort</small></div>)}</div><div className="grid two"><div className="card"><h3>Competency heatmap</h3><div className="heat">{["Python","Statistical Analysis","Data Visualization","Machine Learning","Research Methods","Communication"].map((x,i)=><div><span>{x}</span><i className={"heat"+(i%4)}>{[72,81,55,42,68,76][i]}%</i></div>)}</div></div><div className="card"><h3>Programme demand</h3><div className="demand">{[["Data Analytics",82],["Python",74],["ML Fundamentals",61],["Visualization",55]].map(x=><div><span>{x[0]}</span><b>{x[1]}</b><div className="bar"><i style={{width:x[1]+"%"}}/></div>)}</div></div></div></>
}
createRoot(document.getElementById("root")).render(<App/>);
