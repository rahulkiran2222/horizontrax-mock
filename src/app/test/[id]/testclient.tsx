"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, LogOut, ShieldCheck } from "lucide-react";

export default function TestClient({ id }: { id: string }) {
  const router = useRouter();
  const test = examData[id as keyof typeof examData];

  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (showInstructions || !test) return;
    const timer = setInterval(() => setTimeLeft((t) => (t <= 0 ? 0 : t - 1)), 1000);
    const handleSecurity = () => { if (document.hidden) alert("Tab switch detected!"); };
    document.addEventListener("visibilitychange", handleSecurity);
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleSecurity);
    };
  }, [showInstructions, test]);

  if (!test) return <div className="p-20 text-center">Exam not found.</div>;

  const submitExam = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    router.push(`/test/${id}/result`);
  };

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-10 shadow-2xl">
          <ShieldCheck className="text-green-600 mb-4" size={48} />
          <h2 className="text-3xl font-black mb-4">Instructions</h2>
          <ul className="space-y-4 mb-10 text-lg text-slate-600">
            <li>• 30 Questions | 30 Minutes</li>
            <li className="text-red-500">• Strict Proctoring Active</li>
          </ul>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl">Start Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden">
      <header className="h-16 bg-white border-b px-6 flex justify-between items-center">
        <span className="font-black text-green-600">HORIZONTRAX</span>
        <div className="flex gap-4 items-center">
            <span className="bg-green-50 px-3 py-1 rounded-full text-xs font-bold">Q {currentIdx + 1}/30</span>
            <span className="font-mono text-slate-600">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            <LogOut onClick={submitExam} className="cursor-pointer" />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r p-6 overflow-y-auto hidden md:block">
          <div className="grid grid-cols-4 gap-2">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-10 rounded-lg font-bold border ${currentIdx === i ? "bg-green-600 text-white" : "bg-slate-50 text-slate-400"}`}>{i + 1}</button>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8 md:p-16 overflow-y-auto bg-green-50/20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-10">{test.questions[currentIdx].text}</h1>
            <div className="space-y-4">
              {test.questions[currentIdx].options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-6 rounded-2xl border-2 text-left ${answers[currentIdx] === opt ? "border-green-600 bg-green-50" : "bg-white"}`}>{opt}</button>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0}>Previous</button>
                <button onClick={() => currentIdx === 29 ? submitExam() : setCurrentIdx(i => i + 1)} className="bg-green-600 text-white px-10 py-3 rounded-full font-bold">{currentIdx === 29 ? "Submit" : "Next"}</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
