"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { Clock, LogOut, CheckCircle2 } from "lucide-react";

export default function TestClient({ id }: { id: string }) {
  const router = useRouter();
  const test = examData[id as keyof typeof examData];
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    if (showInstructions || !test) return;
    const timer = setInterval(() => setTimeLeft((t) => (t <= 0 ? 0 : t - 1)), 1000);
    const handleSec = () => { if (document.hidden) alert("HorizonTrax Security: Tab switch detected!"); };
    document.addEventListener("visibilitychange", handleSec);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", handleSec); };
  }, [showInstructions, test]);

  if (!test) return <div className="p-20 text-center text-slate-900">Exam not found.</div>;

  const submitExam = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    router.push(`/test/${id}/result`);
  };

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50 text-slate-900 leading-normal">
        <div className="bg-white rounded-[2rem] max-w-2xl w-full p-10 shadow-2xl">
          <h2 className="text-3xl font-black mb-2 text-green-600">HORIZONTRAX</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8 border-b pb-4">Mock Test Instructions</p>
          <ul className="space-y-6 text-slate-700 mb-12 text-lg">
            <li className="flex gap-4"><span>1.</span> The mock test contains a total of <span className="font-bold text-slate-900">30 questions</span>.</li>
            <li className="flex gap-4"><span>2.</span> You will have <span className="font-bold text-slate-900">30 minutes</span> to complete all questions.</li>
            <li className="flex gap-4 text-red-500 font-medium italic"><span>3.</span> Avoid switching tabs during the test to avoid being disqualified.</li>
            <li className="flex gap-4"><span>4.</span> Ensure a stable internet connection and a distraction-free environment.</li>
          </ul>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition-all shadow-xl shadow-green-100">
            Start Mock Test Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-16 bg-white border-b px-8 flex justify-between items-center shrink-0">
        <span className="font-black text-green-600 text-xl tracking-tighter italic">HORIZONTRAX</span>
        <div className="flex gap-6 items-center">
            <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs font-bold border border-green-100 uppercase">Q {currentIdx + 1}/30</span>
            <span className="font-mono text-xl font-bold text-slate-700">Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            <LogOut onClick={submitExam} className="cursor-pointer text-slate-300 hover:text-red-500 transition-colors" />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white border-r p-6 overflow-y-auto hidden md:block shadow-sm">
          <h3 className="font-bold mb-6 text-xs text-slate-400 uppercase tracking-widest">Question Map</h3>
          <div className="grid grid-cols-4 gap-3">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-11 rounded-xl font-bold border transition-all ${currentIdx === i ? "bg-green-600 text-white border-green-600 shadow-md" : answers[i] ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-50 text-slate-300 border-slate-100"}`}>{i + 1}</button>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8 md:p-16 overflow-y-auto bg-green-50/10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-12 text-slate-800 leading-tight">Q{currentIdx + 1}. {test.questions[currentIdx].text}</h1>
            <div className="space-y-4">
              {test.questions[currentIdx].options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-6 rounded-2xl border-2 text-left font-semibold transition-all ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900 ring-1 ring-green-600 shadow-sm" : "bg-white border-slate-100 hover:border-green-100"}`}>{opt}</button>
              ))}
            </div>
            <div className="mt-16 pt-8 border-t flex justify-between items-center">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0 px-6 py-2">← Back</button>
                <div className="flex gap-4">
                   <button onClick={() => setCurrentIdx(i => i + 1)} className="text-slate-400 font-bold hover:text-slate-800 px-6">Skip</button>
                   <button onClick={() => currentIdx === 29 ? submitExam() : setCurrentIdx(i => i + 1)} className="bg-green-600 text-white px-12 py-4 rounded-full font-bold shadow-xl shadow-green-100 hover:scale-105 transition-all">{currentIdx === 29 ? "Submit Exam" : "Next Question →"}</button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
