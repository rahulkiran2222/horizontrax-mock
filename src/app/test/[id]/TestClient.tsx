"use client";
import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { LogOut, ShieldAlert, BookmarkCheck, Clock } from "lucide-react";

export default function TestClient({ id }: { id: string }) {
  const router = useRouter();
  const test = examData[id as keyof typeof examData];
  const isTerminated = useRef(false); // NEW: Permanent kill switch for alerts

  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [strikes, setStrikes] = useState(0);

  const cleanupAndRedirect = useCallback((path: string, msg?: string) => {
    isTerminated.current = true; // Stop all alerts immediately
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    if (msg) localStorage.setItem("ht_security_msg", msg);
    router.replace(path);
  }, [id, answers, router]);

  useEffect(() => {
    if (showInstructions || !test || isTerminated.current) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { cleanupAndRedirect(`/test/${id}/result`); return 0; } return t - 1; });
    }, 1000);

    const triggerStrike = () => {
      if (isTerminated.current) return; // Logic block for post-submission alerts
      setStrikes((prev) => {
        const next = prev + 1;
        if (next === 1) alert("SECURITY WARNING (1/2): Tab switching detected!");
        else if (next === 2) alert("FINAL WARNING (2/2): Terminating on next violation.");
        else if (next >= 3) cleanupAndRedirect("/", "Disqualified: 3 Security Strikes.");
        return next;
      });
    };

    const handleVisible = () => { if (document.hidden) triggerStrike(); };
    window.addEventListener("blur", triggerStrike);
    document.addEventListener("visibilitychange", handleVisible);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      clearInterval(timer);
      window.removeEventListener("blur", triggerStrike);
      document.removeEventListener("visibilitychange", handleVisible);
    };
  }, [showInstructions, test, id, cleanupAndRedirect]);

  if (!test) return null;

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-[2rem] max-w-xl w-full p-8 md:p-12 shadow-2xl border border-slate-100 text-center">
          <h2 className="text-3xl font-black text-green-600 mb-6 uppercase italic">HorizonTrax</h2>
          <div className="space-y-4 mb-10 text-left text-slate-600 max-w-md mx-auto">
            <p>• Questions: <b>30</b> | Time: <b>30 Mins</b></p>
            <p className="text-red-600 font-bold bg-red-50 p-4 rounded-xl border-l-4 border-red-500 text-sm">
              SECURITY: 3 strikes for switching tabs results in termination.
            </p>
          </div>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all uppercase tracking-widest">
            Start Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-16 bg-white border-b px-6 flex justify-between items-center shrink-0">
        <span className="font-black text-green-600 text-xl italic uppercase tracking-tighter">HorizonTrax</span>
        <div className="flex gap-6 items-center">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${strikes > 0 ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-green-50 text-green-600 border-green-100"}`}>STRIKES: {strikes}/2</div>
            <span className="font-mono font-bold text-lg">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            <LogOut onClick={() => cleanupAndRedirect(`/test/${id}/result`)} size={18} className="cursor-pointer text-slate-300 hover:text-red-500" />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-20 md:w-64 bg-white border-r p-4 md:p-6 overflow-y-auto shrink-0 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-10 rounded-lg text-xs font-bold border transition-all ${currentIdx === i ? "ring-2 ring-green-600 ring-offset-1" : ""} ${marked[i] ? "bg-indigo-600 text-white" : answers[i] ? "bg-green-600 text-white shadow-sm" : "bg-slate-50 text-slate-400 border-slate-100"}`}>{i + 1}</button>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="mb-8">
                <span className="text-green-600 font-bold uppercase text-[10px] bg-green-100 px-3 py-1 rounded-full mb-4 inline-block tracking-widest">Question {currentIdx + 1} / 30</span>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">{test.questions[currentIdx]?.text}</h1>
            </div>
            <div className="space-y-3 mb-10">
              {test.questions[currentIdx]?.options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-4 md:p-5 rounded-2xl border-2 text-left font-semibold transition-all ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900" : "bg-white border-slate-50 hover:border-green-100 shadow-sm"}`}>{opt}</button>
              ))}
            </div>
            <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center bg-[#F0FDF4] sticky bottom-0 py-4">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0 px-4">← PREV</button>
                <div className="flex gap-4">
                   <button onClick={() => setMarked({...marked, [currentIdx]: !marked[currentIdx]})} className={`px-4 py-2 rounded-xl font-bold text-[10px] border-2 transition-all ${marked[currentIdx] ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "border-slate-100 text-slate-400"}`}>
                      {marked[currentIdx] ? <BookmarkCheck size={16} /> : "REVIEW LATER"}
                   </button>
                   <button onClick={() => currentIdx === test.questions.length - 1 ? cleanupAndRedirect(`/test/${id}/result`) : setCurrentIdx(v => v + 1)} className="bg-green-600 text-white px-8 md:px-10 py-3 rounded-full font-bold shadow-lg shadow-green-100 text-sm uppercase">
                      {currentIdx === test.questions.length - 1 ? "Submit" : "Next →"}
                   </button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
