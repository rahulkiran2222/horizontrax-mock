"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { LogOut, ShieldAlert, BookmarkCheck, Bookmark, Clock, ChevronRight } from "lucide-react";

export default function TestClient({ id }: { id: string }) {
  const router = useRouter();
  const test = examData[id as keyof typeof examData];
  
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [strikes, setStrikes] = useState(0);

  const handleFinish = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    router.replace(`/test/${id}/result`);
  }, [id, answers, router]);

  const handleTerminate = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem("ht_security_msg", "EXAM TERMINATED: Security violation detected (3 Strikes).");
    router.replace("/");
  }, [router]);

  useEffect(() => {
    // ONLY track strikes and timer IF the exam has started
    if (showInstructions || !test) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { handleFinish(); return 0; } return t - 1; });
    }, 1000);

    const triggerStrike = () => {
      setStrikes((prev) => {
        const next = prev + 1;
        if (next === 1) alert("SECURITY WARNING (1/2): Tab switching detected. Close all other tabs!");
        else if (next === 2) alert("FINAL WARNING (2/2): Next violation will terminate your session.");
        else if (next >= 3) handleTerminate();
        return next;
      });
    };

    const handleBlur = () => triggerStrike();
    const handleVisible = () => { if (document.hidden) triggerStrike(); };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisible);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      clearInterval(timer);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, [showInstructions, test, handleFinish, handleTerminate]);

  if (!test) return <div className="p-20 text-center">Exam Not Found</div>;

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-[3rem] max-w-2xl w-full p-10 md:p-14 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl italic">H</div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">HorizonTrax</h2>
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-700">Mock Test Instructions</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-8 border-b pb-4">Protocol Version 1.4</p>
          <ul className="space-y-5 text-slate-600 mb-12 text-lg">
            <li className="flex gap-4"><span>1.</span> Questions: <span className="font-bold text-slate-900">30</span> | Time: <span className="font-bold text-slate-900">30 Mins</span></li>
            <li className="flex gap-4 text-red-600 font-bold bg-red-50 p-5 rounded-[2rem] border-l-8 border-red-500 leading-snug">
              2. SECURITY: 3 strikes for switching tabs or minimizing will result in immediate termination.
            </li>
            <li className="flex gap-4"><span>3.</span> Close all other browser tabs and apps before starting.</li>
          </ul>
          <button 
            onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} 
            className="w-full bg-green-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-green-700 transition-all shadow-xl shadow-green-100 uppercase tracking-widest"
          >
            Start Proctored Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-20 bg-white border-b px-8 flex justify-between items-center shrink-0 shadow-sm z-50">
        <span className="font-black text-green-600 text-2xl italic tracking-tighter">HORIZONTRAX</span>
        <div className="flex gap-6 items-center font-bold">
            <div className={`px-4 py-1.5 rounded-full border-2 text-[10px] font-black tracking-widest ${strikes > 0 ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-green-50 text-green-600 border-green-100"}`}>STRIKES: {strikes}/2</div>
            <div className="h-8 w-px bg-slate-100" />
            <span className="font-mono text-2xl text-slate-700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            <LogOut onClick={handleFinish} className="cursor-pointer text-slate-300 hover:text-red-500 transition-colors" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-white border-r p-8 overflow-y-auto hidden md:block shrink-0 custom-scrollbar">
          <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.3em] mb-8">Question Palette</h3>
          <div className="grid grid-cols-4 gap-3">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-12 rounded-2xl text-sm font-black transition-all ${currentIdx === i ? "ring-4 ring-green-100 border-green-600 border-2" : ""} ${marked[i] ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : answers[i] ? "bg-green-600 text-white shadow-lg shadow-green-100" : "bg-slate-50 text-slate-300 border-slate-100 border-2"}`}>{i + 1}</button>
            ))}
          </div>
          <div className="mt-12 space-y-4 pt-8 border-t text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <div className="flex items-center gap-3"><div className="w-4 h-4 bg-green-600 rounded-lg" /> Answered</div>
             <div className="flex items-center gap-3"><div className="w-4 h-4 bg-indigo-600 rounded-lg" /> Marked</div>
             <div className="flex items-center gap-3"><div className="w-4 h-4 bg-slate-100 rounded-lg border-2" /> Unvisited</div>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-16 overflow-y-auto bg-green-50/10">
          <div className="max-w-4xl mx-auto flex flex-col h-full">
            <div className="mb-12">
                <span className="text-green-600 font-black uppercase tracking-[0.3em] text-[10px] bg-green-100 px-3 py-1 rounded-full mb-6 inline-block">Question {currentIdx + 1} of 30</span>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight">{test.questions[currentIdx].text}</h1>
            </div>
            
            <div className="space-y-4 mb-16">
              {test.questions[currentIdx].options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-6 md:p-8 rounded-[2rem] border-2 text-left font-bold text-lg transition-all flex justify-between items-center group ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900 shadow-xl shadow-green-50" : "bg-white border-slate-50 hover:border-green-200"}`}>
                   <span>{opt}</span>
                   <div className={`w-6 h-6 rounded-full border-2 transition-all ${answers[currentIdx] === opt ? "bg-green-600 border-green-600" : "border-slate-200 group-hover:border-green-300"}`} />
                </button>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-slate-200 flex justify-between items-center bg-[#F0FDF4] sticky bottom-0 py-6">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-black tracking-widest text-xs disabled:opacity-0 px-6 uppercase">← Back</button>
                <div className="flex gap-4">
                   <button onClick={() => setMarked({...marked, [currentIdx]: !marked[currentIdx]})} className={`px-6 py-3 rounded-2xl font-black text-xs border-2 tracking-widest transition-all ${marked[currentIdx] ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "border-slate-100 text-slate-400 uppercase"}`}>
                      {marked[currentIdx] ? <BookmarkCheck size={18} /> : "Review Later"}
                   </button>
                   <button onClick={() => currentIdx === 29 ? handleFinish() : setCurrentIdx(i => i + 1)} className="bg-green-600 text-white px-12 py-4 rounded-3xl font-black shadow-2xl shadow-green-200 hover:scale-105 transition-all uppercase tracking-widest text-sm">
                      {currentIdx === 29 ? "Final Submit" : "Save & Next →"}
                   </button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
