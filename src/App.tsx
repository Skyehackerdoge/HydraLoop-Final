
import React, { useState, useEffect, useMemo } from 'react';

const CUP_OPTIONS = [100,250,350,500];
const today = () => new Date().toISOString().slice(0,10);

function launchConfetti(){
  const duration = 1500;
  const end = Date.now() + duration;
  (function frame(){
    const colors=['#FFC700','#FF0000','#2E3192','#41BBC7'];
    const piece=document.createElement('div');
    Object.assign(piece.style,{
      position:'fixed',top:'0px',left:Math.random()*window.innerWidth+'px',
      width:'10px',height:'10px',backgroundColor:colors[Math.floor(Math.random()*colors.length)],
      borderRadius:'50%',pointerEvents:'none',zIndex:9999
    });
    document.body.appendChild(piece);
    let y=0;
    const fall=setInterval(()=>{
      y+=12;
      piece.style.transform=`translateY(${y}px) rotate(${y*5}deg)`;
      if(y>window.innerHeight){ piece.remove(); clearInterval(fall);}
    },16);
    if(Date.now()<end) requestAnimationFrame(frame);
  })();
}

export default function App(){
  const [dark,setDark]=useState(()=>localStorage.getItem('darkMode')==='true');
  const [weight,setWeight]=useState(()=>localStorage.getItem('weight')||"70");
  const numericWeight = Number(weight||0);
  const totalMl = numericWeight * 35;
  const [cupSize,setCupSize]=useState(()=>Number(localStorage.getItem('cupSize')||250));
  const [cupsTaken,setCupsTaken]=useState(()=>Number(localStorage.getItem('cupsTaken')||0));
  const [streak,setStreak]=useState(()=>Number(localStorage.getItem('streak')||0));
  const [lastGoalMet,setLastGoalMet]=useState(()=>localStorage.getItem('lastGoalMet')||"");
  const [about,setAbout]=useState(false);
  const [faq,setFAQ]=useState(false);

  useEffect(()=>{
    if(dark){ document.getElementById('body').classList.add('dark'); }
    else{ document.getElementById('body').classList.remove('dark'); }
    localStorage.setItem('darkMode',String(dark));
  },[dark]);

  const cupsGoal = useMemo(()=>Math.max(1,Math.round(totalMl/cupSize)),[totalMl,cupSize]);
  const percent = useMemo(()=>Math.min(100,Math.round((cupsTaken/cupsGoal)*100)),[cupsTaken,cupsGoal]);

  useEffect(()=>{
    localStorage.setItem("weight",weight);
    localStorage.setItem("cupSize",String(cupSize));
    localStorage.setItem("cupsTaken",String(cupsTaken));
    localStorage.setItem("streak",String(streak));
    localStorage.setItem("lastGoalMet",lastGoalMet);
  },[weight,cupSize,cupsTaken,streak,lastGoalMet]);

  function addCup(){
    const next=cupsTaken+1;
    setCupsTaken(next);
    if(next>=cupsGoal){
      if(lastGoalMet!==today()){
        setStreak(s=>s+1);
        setLastGoalMet(today());
      }
      launchConfetti();
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 transition-colors'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>HydraLoop 💧</h1>
          <button onClick={()=>setDark(!dark)} className='border px-3 py-1 rounded'>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <div className='p-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex flex-col gap-3 items-center'>
          <input value={weight}
            onChange={e=>{ if(e.target.value===''||/^[0-9]*$/.test(e.target.value)) setWeight(e.target.value);}}
            className='border p-2 rounded w-32 text-center dark:bg-gray-600'
            placeholder='Weight (kg)'
          />
          <div className='text-xs text-gray-600 dark:text-gray-300'>Daily goal: {totalMl} mL</div>

          <div className='flex gap-2 mt-2'>
            {CUP_OPTIONS.map(c=>(
              <button key={c} onClick={()=>setCupSize(c)}
                className={`px-3 py-1 rounded-full border ${cupSize===c?'bg-blue-500 text-white':'bg-white dark:bg-gray-600'}`}>
                {c} mL
              </button>
            ))}
          </div>

          <div className='text-6xl'>
            {['🌱','🌿','🍃','🌾','🌳'][Math.floor(percent/25)]}
          </div>

          <div className='bg-amber-200 dark:bg-amber-600 px-3 py-1 rounded-full font-semibold text-amber-900 dark:text-white'>
            🔥 {streak}-day streak
          </div>

          <p>{cupsTaken}/{cupsGoal} cups today</p>

          <div className='w-full bg-gray-300 dark:bg-gray-600 h-3 rounded'>
            <div className='h-3 bg-green-500 dark:bg-green-300 rounded' style={{width:`${percent}%`}}></div>
          </div>

          <button onClick={addCup} className='w-full bg-blue-600 text-white px-4 py-2 rounded mt-2'>
            + Log {cupSize} mL
          </button>

          <button onClick={()=>setCupsTaken(0)} className='w-full border px-4 py-2 rounded dark:border-gray-400'>
            Reset
          </button>
        </div>

        <div className='flex justify-between mt-4 text-sm'>
          <button onClick={()=>setFAQ(true)} className='underline'>FAQ</button>
          <div className='flex gap-3 items-center'>
            <span>© {new Date().getFullYear()}</span>
            <button onClick={()=>setAbout(true)} className='border px-2 py-1 rounded'>i</button>
          </div>
        </div>

        {about && (
          <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto'>
              <h2 className='text-lg font-bold mb-2'>About</h2>
              <p className="whitespace-normal break-words break-normal leading-relaxed mb-3">
                I made this app to remind myself to drink water regularly — in the daily hustle I often forget the simplest yet most crucial part of being healthy: staying hydrated. This app helps by nudging you, tracking progress, and celebrating small wins.
              </p>
              <button onClick={()=>setAbout(false)} className='mt-3 bg-blue-500 text-white px-4 py-1 rounded'>Close</button>
            </div>
          </div>
        )}

        {faq && (
          <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto'>
              <h2 className='text-lg font-bold mb-2'>FAQ</h2>
              <p className="whitespace-normal break-words break-normal leading-relaxed mb-3">
                <strong>Q:</strong> Why is weight required? 
                <strong>A:</strong> Your daily water need roughly scales with body mass. The app uses a simple heuristic of <strong>35 mL per kg</strong> to compute a reasonable daily target.
              </p>
              
              <p className="whitespace-normal break-words break-normal leading-relaxed mb-3">
                <strong>Q:</strong> Why track your water intake? 
                <strong>A:</strong> Tracking helps consistency and builds a positive habit loop.
              </p>

              <button onClick={()=>setFAQ(false)} className='mt-3 bg-blue-500 text-white px-4 py-1 rounded'>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
