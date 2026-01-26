"use client";
import * as React from "react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, LogOut, ShieldCheck } from "lucide-react";

type Params = Promise<{ id: string }>;

export default function TestEngine(props: { params: Params }) {
  const router = useRouter();
  const params = use(props.params);
  const id = params.id;
  const test = examData[id as keyof typeof examData];

  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (showInstructions || !test) return;
    const timer = setInterval(() => setTimeLeft((t) => (t <= 0 ? 0 : t - 1)), 1000);
    
    const handleSecurity = () => {
      if (document.hidden) alert("HorizonTrax Security: Tab switch detected!");
    };
    document.addEventListener("visibilitychange", handleSecurity);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleSecurity);
    };
  }, [showInstructions, test]);

  if (!test) return <div className="p-20 text-center">Exam not found in data/questions.ts</div>;

  const submitExam = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    router.push(`/test/${id}/result`);
  };

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2 leading-tight">Mock Test Instructions</h2>
          <p className="text-slate-500 mb-8 border-b pb-4">HorizonTrax Professional Readiness Portal</p>
          <ul className="space-y-4 text-slate-600 mb-10 text-lg">
            <li className="flex gap-3">1. Total Questions: <span className="font-bold text-slate-900">30 Questions</span></li>
            <li className="flex gap-3">2. Time Duration: <span className="font-bold text-slate-900">30 Minutes</span></li>
            <li className="flex gap-3 text-red-500 font-medium italic">3. Strict Proctoring: No tab switching allowed.</li>
            <li className="flex gap-3">4. Do not exit full-screen until completion.</li>
          </ul>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition-all">
            Start Mock Test Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-lg text-white flex items-center justify-center font-bold text-xl">H</div>
          <span className="font-black text-slate-800 tracking-tighter text-xl uppercase">HORIZONTRAX</span>
        </div>
        <div className="flex items-center gap-8">
            <div className="bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs font-bold border border-green-100">MCQ Question {currentIdx + 1} of 30</div>
            <div className="text-slate-600 font-mono text-sm">Time Left: <span className="font-bold text-slate-900">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></div>
            <LogOut className="text-slate-400 cursor-pointer hover:text-red-500" size={20} onClick={submitExam} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable Side Panel */}
        <aside className="w-72 bg-white border-r flex flex-col p-6 overflow-y-auto shrink-0 shadow-sm custom-scrollbar">
          <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-widest">Question Palette</h3>
          <div className="grid grid-cols-4 gap-3">
            {test.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`h-12 rounded-xl text-sm font-bold transition-all border ${
                  currentIdx === i ? "border-green-600 bg-green-600 text-white" : 
                  answers[i] ? "border-green-200 bg-green-50 text-green-600" : "border-slate-100 text-slate-400 bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>

        {/* Exam Body */}
        <main className="flex-1 p-8 md:p-16 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
                <h2 className="text-sm font-black text-green-600 uppercase mb-3 tracking-[0.25em]">{test.title}</h2>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">{test.questions[currentIdx].text}</h1>
            </div>
            
            <div className="space-y-4">
              {test.questions[currentIdx].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers({...answers, [currentIdx]: opt})}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-5 ${
                    answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900" : "border-white bg-white hover:border-green-50 shadow-sm"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentIdx] === opt ? "border-green-600 bg-green-600" : "border-slate-200"}`}>
                    {answers[currentIdx] === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-lg font-semibold text-slate-700">{opt}</span>
                </button>
              ))}
            </div>

            <div className="mt-20 pt-10 border-t border-slate-200 flex justify-between items-center">
               <button onClick={() => setCurrentIdx(v => v - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold hover:text-slate-800 disabled:opacity-0 transition-all">← Previous Question</button>
               <div className="flex gap-6 items-center">
                  <button className="text-slate-400 font-bold hover:text-slate-800" onClick={() => setCurrentIdx(v => v + 1)}>Skip</button>
                  <button onClick={() => currentIdx === 29 ? submitExam() : setCurrentIdx(v => v + 1)} className="bg-green-600 text-white px-12 py-4 rounded-full font-bold shadow-lg shadow-green-100 hover:scale-105 transition-all">
                      {currentIdx === 29 ? "Submit Exam" : "Next Question →"}
                  </button>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
