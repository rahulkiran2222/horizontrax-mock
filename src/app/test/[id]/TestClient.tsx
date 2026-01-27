"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { LogOut, ShieldAlert, CheckCircle2, BookmarkCheck, Bookmark } from "lucide-react";

export default function TestClient({ id }: { id: string }) {
  const router = useRouter();
  const test = examData[id as keyof typeof examData];
  
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [strikes, setStrikes] = useState(0);

  const terminateExam = useCallback((reason: string) => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    localStorage.setItem("ht_notice", reason);
    router.push("/");
  }, [id, answers, router]);

  const submitExam = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    router.push(`/test/${id}/result`);
  }, [id, answers, router]);

  useEffect(() => {
    if (showInstructions || !test) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { submitExam(); return 0; } return t - 1; });
    }, 1000);

    const handleViolation = () => {
      setStrikes((prev) => {
        const next = prev + 1;
        if (next === 1) alert("WARNING 1/2: Tab switching detected! Close all other tabs.");
        else if (next === 2) alert("FINAL WARNING 2/2: The next violation will submit your exam.");
        else if (next >= 3) terminateExam("EXAM CLOSED: Multiple security violations detected.");
        return next;
      });
    };

    const handleVisibility = () => { if (document.hidden) handleViolation(); };
    window.addEventListener("blur", handleViolation);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      clearInterval(timer);
      window.removeEventListener("blur", handleViolation);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [showInstructions, test, submitExam, terminateExam]);

  if (!test) return <div className="p-20 text-center">Exam Not Found</div>;

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-8 md:p-12 shadow-2xl border border-slate-100">
          <h2 className="text-4xl font-black mb-2 text-green-600 italic tracking-tighter uppercase">HorizonTrax</h2>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-8 border-b pb-4">Security Protocol Check</p>
          <ul className="space-y-6 text-slate-700 mb-10 text-base md:text-lg">
            <li className="flex gap-4"><span>•</span> Total Questions: <span className="font-bold">30</span></li>
            <li className="flex gap-4"><span>•</span> Duration: <span className="font-bold">30 Minutes</span></li>
            <li className="flex gap-4 text-red-600 font-bold bg-red-50 p-4 rounded-2xl border-l-4 border-red-500">
              IMPORTANT: Switching tabs, minimizing, or clicking outside will trigger warnings. 3 Strikes = Auto Disqualification.
            </li>
            <li className="flex gap-4"><span>•</span> Please close all other applications and tabs before clicking below.</li>
          </ul>
          <button 
            onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }}
            className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition-all shadow-xl shadow-green-100 uppercase"
          >
            Start Proctored Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900 text-sm md:text-base">
      <header className="h-16 bg-white border-b px-4 md:px-8 flex justify-between items-center shrink-0 shadow-sm z-10">
        <span className="font-black text-green-600 text-lg md:text-xl tracking-tighter uppercase italic">HorizonTrax</span>
        <div className="flex gap-4 md:gap-8 items-center">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black ${strikes > 0 ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-green-50 text-green-600 border-green-100"}`}>
                <ShieldAlert size={12} /> {strikes === 0 ? "SECURE" : `STRIKES: ${strikes}/2`}
            </div>
            <span className="font-mono font-bold text-slate-700 whitespace-nowrap">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
            <LogOut onClick={submitExam} size={20} className="cursor-pointer text-slate-300 hover:text-red-500 transition-colors" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-20 md:w-72 bg-white border-r p-4 md:p-6 overflow-y-auto shrink-0 shadow-sm">
          <h3 className="font-bold mb-6 text-[10px] text-slate-400 uppercase tracking-[0.2em] hidden md:block">Question Grid</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-10 md:h-11 rounded-xl text-xs md:text-sm font-bold border transition-all ${currentIdx === i ? "ring-2 ring-green-600 ring-offset-2" : ""} ${marked[i] ? "bg-indigo-600 border-indigo-700 text-white" : answers[i] ? "bg-green-600 border-green-700 text-white shadow-md" : "bg-slate-50 text-slate-300 border-slate-100"}`}>{i + 1}</button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="mb-10">
                <p className="text-green-600 font-bold uppercase tracking-widest text-[10px] mb-2">Question {currentIdx + 1} of 30</p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">{test.questions[currentIdx].text}</h1>
            </div>
            
            <div className="space-y-4 mb-10">
              {test.questions[currentIdx].options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-5 md:p-6 rounded-3xl border-2 text-left font-semibold transition-all flex justify-between items-center group ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900 shadow-sm" : "bg-white border-slate-50 hover:border-green-100 shadow-sm"}`}>
                  <span>{opt}</span>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all ${answers[currentIdx] === opt ? "bg-green-600 border-green-600" : "border-slate-200"}`} />
                </button>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center bg-[#F0FDF4] sticky bottom-0 py-4">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0 px-4 transition-colors hover:text-slate-800">← PREV</button>
                <div className="flex gap-3 md:gap-6 items-center">
                   <button onClick={() => setMarked({...marked, [currentIdx]: !marked[currentIdx]})} className={`px-4 md:px-6 py-2 rounded-xl font-bold text-xs border-2 transition-all ${marked[currentIdx] ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "border-slate-100 text-slate-400"}`}>
                      {marked[currentIdx] ? "MARKED" : "REVIEW LATER"}
                   </button>
                   <button onClick={() => currentIdx === 29 ? submitExam() : setCurrentIdx(i => i + 1)} className="bg-green-600 text-white px-8 md:px-12 py-3 rounded-full font-bold shadow-xl shadow-green-100 hover:scale-105 transition-all text-sm uppercase">
                      {currentIdx === 29 ? "Finish Exam" : "Save & Next"}
                   </button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
