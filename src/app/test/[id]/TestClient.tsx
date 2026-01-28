"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { LogOut, ShieldAlert, BookmarkCheck, Bookmark, Clock } from "lucide-react";

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

  useEffect(() => {
    // PIC 2 FIX: Proctortig ONLY starts IF instructions are closed
    if (showInstructions || !test) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { handleFinish(); return 0; } return t - 1; });
    }, 1000);

    const triggerStrike = () => {
      setStrikes((prev) => {
        const next = prev + 1;
        if (next === 1) alert("SECURITY WARNING (1/2): Tab switching detected! Close all other tabs.");
        else if (next === 2) alert("FINAL WARNING (2/2): Next violation will terminate the exam.");
        else if (next >= 3) {
            localStorage.setItem("ht_security_msg", "Exam terminated after 3 security strikes.");
            router.replace("/");
        }
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
  }, [showInstructions, test, handleFinish, router]);

  if (!test) return null;

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center p-4 z-[200]">
        <div className="bg-white rounded-[2rem] max-w-xl w-full p-8 shadow-2xl border border-slate-100">
          <h2 className="text-3xl font-black text-green-600 mb-6 uppercase italic">HorizonTrax</h2>
          <ul className="space-y-4 mb-10 text-slate-600">
            <li className="flex gap-3"><span>•</span> Total Questions: <span className="font-bold text-slate-900">30</span></li>
            <li className="flex gap-3"><span>•</span> Duration: <span className="font-bold text-slate-900">30 Minutes</span></li>
            <li className="text-red-600 font-bold p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm">
              STRICT PROCTORING: 3 tab switches or window blurs will result in immediate disqualification.
            </li>
            <li className="flex gap-3 text-sm italic"><span>•</span> Please close all other browser windows before starting.</li>
          </ul>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all">
            Start Proctored Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-16 bg-white border-b px-6 flex justify-between items-center shrink-0 shadow-sm z-50">
        <span className="font-black text-green-600 text-xl italic uppercase tracking-tighter">HorizonTrax</span>
        <div className="flex gap-6 items-center">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${strikes > 0 ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-green-50 text-green-600 border-green-100"}`}>STRIKES: {strikes}/2</div>
            <span className="font-mono font-bold text-lg">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            <LogOut onClick={handleFinish} size={18} className="cursor-pointer text-slate-300 hover:text-red-500" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Palette */}
        <aside className="w-20 md:w-64 bg-white border-r p-4 md:p-6 overflow-y-auto shrink-0 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-10 rounded-lg text-xs font-bold border transition-all ${currentIdx === i ? "ring-2 ring-green-600 ring-offset-1" : ""} ${marked[i] ? "bg-indigo-600 text-white" : answers[i] ? "bg-green-600 text-white shadow-sm" : "bg-slate-50 text-slate-400 border-slate-100"}`}>{i + 1}</button>
            ))}
          </div>
        </aside>

        {/* PIC 1 FIX: Container Capped at max-w-4xl to stop Over-Zoom */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="mb-8">
                <span className="text-green-600 font-bold uppercase tracking-[0.2em] text-[10px] bg-green-100 px-3 py-1 rounded-full mb-4 inline-block">Question {currentIdx + 1} / 30</span>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">{test.questions[currentIdx].text}</h1>
            </div>
            
            <div className="space-y-3 mb-10">
              {test.questions[currentIdx].options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-4 md:p-5 rounded-2xl border-2 text-left font-semibold transition-all ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900" : "bg-white border-slate-50 hover:border-green-100 shadow-sm"}`}>{opt}</button>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center bg-[#F0FDF4] sticky bottom-0 py-4">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0 px-4">← PREV</button>
                <div className="flex gap-3 md:gap-4">
                   <button onClick={() => setMarked({...marked, [currentIdx]: !marked[currentIdx]})} className={`px-4 py-2 rounded-xl font-bold text-[10px] border-2 transition-all ${marked[currentIdx] ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "border-slate-100 text-slate-400"}`}>
                      {marked[currentIdx] ? "MARKED" : "REVIEW LATER"}
                   </button>
                   <button onClick={() => currentIdx === 29 ? handleFinish() : setCurrentIdx(i => i + 1)} className="bg-green-600 text-white px-8 md:px-10 py-3 rounded-full font-bold shadow-lg shadow-green-100 text-sm uppercase tracking-widest">
                      {currentIdx === 29 ? "Submit Exam" : "Save & Next"}
                   </button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
