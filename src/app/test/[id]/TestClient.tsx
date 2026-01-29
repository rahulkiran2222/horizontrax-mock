"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { Clock, LogOut, ShieldAlert, CheckCircle2, Bookmark, BookmarkCheck, ShieldCheck } from "lucide-react";

export default function TestClient({ id }: { id: string }) {
  const router = useRouter();
  const test = examData[id as keyof typeof examData];
  
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [strikes, setStrikes] = useState(0);

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
        if (next === 1) alert("SECURITY WARNING (1/2): Tab switching or minimizing is not allowed. Close all other tabs.");
        else if (next === 2) alert("FINAL WARNING (2/2): One more violation and your exam will be auto-submitted!");
        else if (next >= 3) { alert("EXAM TERMINATED: Strike 3 reached."); submitExam(); }
        return next;
      });
    };

    document.addEventListener("visibilitychange", () => { if (document.hidden) handleViolation(); });
    window.addEventListener("blur", handleViolation);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => clearInterval(timer);
  }, [showInstructions, test, submitExam]);

  if (!test) return <div className="p-20 text-center">Exam Not Found</div>;

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-6 z-50 overflow-y-auto">
        <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl italic">H</div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">HORIZONTRAX</h2>
          </div>
          <h3 className="text-xl font-bold mb-2">Mock Test Instructions</h3>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-8 border-b pb-4">Please read carefully before starting</p>
          <ul className="space-y-5 text-slate-600 mb-10 text-lg leading-relaxed">
            <li className="flex gap-4"><span>1.</span> Total Questions: <span className="font-bold text-slate-900">30 Questions</span></li>
            <li className="flex gap-4"><span>2.</span> Time Duration: <span className="font-bold text-slate-900">30 Minutes</span></li>
            <li className="flex gap-4 text-red-500 font-bold bg-red-50 p-4 rounded-2xl border-l-4 border-red-500">
               <span>3.</span> SECURITY: 3 strikes (Switching tabs/minimizing) will lead to disqualification. Please close all other tabs now.
            </li>
            <li className="flex gap-4"><span>4.</span> Ensure a stable connection and stay in full-screen mode.</li>
          </ul>
          <button 
            onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }}
            className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition-all shadow-xl shadow-green-100"
          >
            Start Mock Test Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-16 bg-white border-b px-8 flex justify-between items-center shrink-0">
        <span className="font-black text-green-600 text-xl italic tracking-tighter uppercase">HORIZONTRAX</span>
        <div className="flex gap-6 items-center">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold ${strikes > 0 ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-green-50 text-green-600 border-green-100"}`}>
                <ShieldAlert size={14} /> STRIKES: {strikes} / 2
            </div>
            <span className="font-mono text-xl font-bold text-slate-700">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
            <LogOut onClick={submitExam} className="cursor-pointer text-slate-300 hover:text-red-500 transition-colors" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white border-r p-6 overflow-y-auto hidden md:block shrink-0">
          <h3 className="font-bold mb-6 text-xs text-slate-400 uppercase tracking-widest">Question Map</h3>
          <div className="grid grid-cols-4 gap-3">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-11 rounded-xl font-bold border transition-all ${currentIdx === i ? "ring-2 ring-green-600 ring-offset-2" : ""} ${marked[i] ? "bg-indigo-600 border-indigo-700 text-white" : answers[i] ? "bg-green-600 border-green-700 text-white" : "bg-slate-50 text-slate-300 border-slate-100"}`}>{i + 1}</button>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t space-y-3 text-[10px] font-bold text-slate-400 uppercase">
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded" /> Answered</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-600 rounded" /> Marked</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 rounded border" /> Not Visited</div>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-16 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-12 text-slate-800 leading-tight">Q{currentIdx+1}. {test.questions[currentIdx].text}</h1>
            <div className="space-y-4">
              {test.questions[currentIdx].options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-6 rounded-2xl border-2 text-left font-semibold transition-all ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900" : "bg-white border-slate-100 hover:border-green-100 shadow-sm"}`}>{opt}</button>
              ))}
            </div>
            <div className="mt-16 pt-8 border-t flex justify-between items-center">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0 px-4">← Previous</button>
                <div className="flex gap-4">
                   <button onClick={() => setMarked({...marked, [currentIdx]: !marked[currentIdx]})} className={`px-6 py-2 rounded-xl font-bold text-sm border-2 ${marked[currentIdx] ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "border-slate-200 text-slate-400"}`}>
                      {marked[currentIdx] ? <BookmarkCheck size={18} /> : "MARK FOR REVIEW"}
                   </button>
                   <button onClick={() => currentIdx === 29 ? submitExam() : setCurrentIdx(i => i + 1)} className="bg-green-600 text-white px-12 py-4 rounded-full font-bold shadow-xl shadow-green-100 hover:bg-green-700 hover:scale-105 transition-all">
                      {currentIdx === 29 ? "Submit Exam" : "Save & Next →"}
                   </button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
