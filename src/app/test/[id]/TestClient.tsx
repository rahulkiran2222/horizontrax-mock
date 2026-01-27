"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { Clock, LogOut, ShieldCheck } from "lucide-react";

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
    const handleSec = () => { if (document.hidden) alert("Security Warning: Tab switch!"); };
    document.addEventListener("visibilitychange", handleSec);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", handleSec); };
  }, [showInstructions, test]);

  if (!test) return <div className="p-20 text-center">Exam Not Found</div>;

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50 text-slate-900">
        <div className="bg-white rounded-3xl max-w-xl p-10 shadow-2xl">
          <h2 className="text-3xl font-black mb-4 text-green-600 italic">HORIZONTRAX</h2>
          <p className="text-slate-500 mb-6 font-bold uppercase tracking-widest text-sm">Placement Readiness Portal</p>
          <ul className="space-y-4 mb-10 text-lg">
            <li>• 30 Questions | 30 Minutes</li>
            <li className="text-red-500 font-bold">• Fullscreen & Proctoring Enabled</li>
          </ul>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700">Start Test Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-16 bg-white border-b px-8 flex justify-between items-center shrink-0">
        <span className="font-black text-green-600 text-xl tracking-tighter">HORIZONTRAX</span>
        <div className="flex gap-6 items-center">
            <span className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs font-bold border border-green-100 uppercase">Q {currentIdx + 1}/30</span>
            <span className="font-mono text-xl font-bold text-slate-700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            <LogOut onClick={() => router.push(`/test/${id}/result`)} className="cursor-pointer text-slate-400 hover:text-red-500" />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 bg-white border-r p-6 overflow-y-auto hidden md:block">
          <h3 className="font-bold mb-4 text-xs text-slate-400 uppercase tracking-widest">Question Map</h3>
          <div className="grid grid-cols-4 gap-2">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-11 rounded-xl font-bold border transition-all ${currentIdx === i ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-100" : answers[i] ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-50 text-slate-300 border-slate-100"}`}>{i + 1}</button>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8 md:p-16 overflow-y-auto bg-green-50/10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-12 text-slate-800 leading-tight">{test.questions[currentIdx].text}</h1>
            <div className="space-y-4">
              {test.questions[currentIdx].options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-6 rounded-2xl border-2 text-left font-semibold transition-all ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900 ring-1 ring-green-600" : "bg-white border-slate-100 hover:border-green-100"}`}>{opt}</button>
              ))}
            </div>
            <div className="mt-16 pt-8 border-t flex justify-between">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0 px-6 py-2">← Back</button>
                <button onClick={() => currentIdx === 29 ? router.push(`/test/${id}/result`) : setCurrentIdx(i => i + 1)} className="bg-green-600 text-white px-12 py-4 rounded-full font-bold shadow-xl shadow-green-100 hover:scale-105 transition-all">{currentIdx === 29 ? "Submit Result" : "Next Question →"}</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
