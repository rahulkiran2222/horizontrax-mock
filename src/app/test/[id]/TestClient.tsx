"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { Clock, LogOut, ShieldAlert, CheckCircle2, Bookmark, BookmarkCheck } from "lucide-react";

export default function TestClient({ id }: { id: string }) {
  const router = useRouter();
  const test = examData[id as keyof typeof examData];
  
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({}); // NEW: Mark for Review state
  const [timeLeft, setTimeLeft] = useState(1800);
  const [strikes, setStrikes] = useState(0);

  const submitExam = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    router.push(`/test/${id}/result`);
  }, [id, answers, router]);

  useEffect(() => {
    if (showInstructions || !test) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          submitExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const handleViolation = () => {
      setStrikes((prev) => {
        const newStrikes = prev + 1;
        if (newStrikes === 1) {
          alert("PROCTORING WARNING (1/2): Tab switching or minimizing is not allowed.");
        } else if (newStrikes === 2) {
          alert("FINAL WARNING (2/2): One more violation and your exam will be terminated!");
        } else if (newStrikes >= 3) {
          submitExam();
        }
        return newStrikes;
      });
    };

    const handleVisibilityChange = () => { if (document.hidden) handleViolation(); };
    const handleBlur = () => handleViolation();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [showInstructions, test, submitExam]);

  const toggleMarkForReview = () => {
    setMarked((prev) => ({
      ...prev,
      [currentIdx]: !prev[currentIdx]
    }));
  };

  if (!test) return <div className="p-20 text-center">Exam data not found.</div>;

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50 text-slate-900">
        <div className="bg-white rounded-[2rem] max-w-2xl w-full p-10 shadow-2xl">
          <h2 className="text-3xl font-black mb-2 text-green-600 italic uppercase">HORIZONTRAX</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8 border-b pb-4">Proctored Assessment Portal</p>
          <ul className="space-y-6 text-slate-700 mb-12 text-lg">
            <li>1. Exam Duration: <span className="font-bold">30 Minutes</span></li>
            <li className="text-red-500 font-bold bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
              2. SECURITY: 3 Strikes (Tab switch/Minimize) = Auto Submission.
            </li>
            <li>3. Use the <span className="text-indigo-600 font-bold">"Mark for Review"</span> button to revisit questions later.</li>
          </ul>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition-all shadow-xl shadow-green-100">
            Start Mock Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-16 bg-white border-b px-8 flex justify-between items-center shrink-0 shadow-sm">
        <span className="font-black text-green-600 text-xl tracking-tighter italic uppercase">HORIZONTRAX</span>
        
        <div className="flex gap-6 items-center">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold ${strikes > 0 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-green-50 border-green-200 text-green-600"}`}>
                <ShieldAlert size={14} /> SECURITY STRIKES: {strikes} / 2
            </div>
            <span className="font-mono text-xl font-bold text-slate-700">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
            <LogOut onClick={submitExam} className="cursor-pointer text-slate-300 hover:text-red-500 transition-colors" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR PALETTE */}
        <aside className="w-72 bg-white border-r p-6 overflow-y-auto hidden md:block">
          <h3 className="font-bold mb-6 text-xs text-slate-400 uppercase tracking-widest">Question Map</h3>
          <div className="grid grid-cols-4 gap-3">
            {test.questions.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentIdx(i)} 
                className={`h-11 rounded-xl font-bold border transition-all relative ${
                    currentIdx === i ? "ring-2 ring-green-600 ring-offset-2 scale-105" : ""
                } ${
                    marked[i] ? "bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100" :
                    answers[i] ? "bg-green-600 border-green-700 text-white shadow-lg shadow-green-100" : 
                    "bg-slate-50 text-slate-300 border-slate-100"
                }`}
              >
                {i + 1}
                {marked[i] && answers[i] && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-10 space-y-3 pt-6 border-t border-slate-100 text-[10px] font-bold uppercase text-slate-400">
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded" /> Answered</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-600 rounded" /> Marked for Review</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 border rounded" /> Unvisited</div>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-16 overflow-y-auto bg-green-50/5">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
                <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Question {currentIdx + 1}</span>
                <h1 className="text-2xl md:text-3xl font-bold mt-2 text-slate-800 leading-tight">{test.questions[currentIdx].text}</h1>
            </div>
            
            <div className="space-y-4">
              {test.questions[currentIdx].options.map(opt => (
                <button 
                  key={opt} 
                  onClick={() => setAnswers({...answers, [currentIdx]: opt})} 
                  className={`w-full p-6 rounded-2xl border-2 text-left font-semibold transition-all flex justify-between items-center group ${
                    answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900" : "bg-white border-slate-100 hover:border-green-100 shadow-sm"
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-5 h-5 rounded-full border-2 ${answers[currentIdx] === opt ? "bg-green-600 border-green-600" : "border-slate-200"}`} />
                </button>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t flex justify-between items-center">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0 px-4 transition-colors hover:text-slate-800 text-sm">← PREVIOUS</button>
                <div className="flex gap-4">
                   <button 
                    onClick={toggleMarkForReview} 
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                        marked[currentIdx] ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "bg-white border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-400"
                    }`}
                   >
                     {marked[currentIdx] ? <BookmarkCheck size={18} /> : <Bookmark size={18} />} 
                     {marked[currentIdx] ? "MARKED" : "MARK FOR REVIEW"}
                   </button>
                   
                   <button onClick={() => setCurrentIdx(i => i + 1)} className="text-slate-400 font-bold hover:text-slate-800 px-4 text-sm uppercase">Skip</button>
                   
                   <button 
                        onClick={() => currentIdx === test.questions.length - 1 ? submitExam() : setCurrentIdx(i => i + 1)} 
                        className="bg-green-600 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-green-100 hover:bg-green-700 hover:scale-105 transition-all"
                    >
                      {currentIdx === test.questions.length - 1 ? "FINISH EXAM" : "SAVE & NEXT"}
                   </button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
