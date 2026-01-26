"use client";
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
    return () => clearInterval(timer);
  }, [showInstructions, test]);

  if (!test) return <div className="p-20 text-center">Exam Loading...</div>;

  const submitExam = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    router.push(`/test/${id}/result`);
  };

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-10 shadow-2xl text-slate-900">
          <h2 className="text-3xl font-black text-green-600 mb-4 tracking-tight">Instructions</h2>
          <ul className="space-y-4 mb-10 text-slate-600 font-medium">
             <li>• 30 Questions | 30 Minutes</li>
             <li>• Fullscreen mode will be activated</li>
             <li className="text-red-500 font-bold">• Do not switch tabs or exit fullscreen</li>
          </ul>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(()=>{}); }} className="w-full bg-green-600 text-white py-5 rounded-3xl font-bold text-xl shadow-lg shadow-green-100">
            Start Mock Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-16 bg-white border-b px-8 flex justify-between items-center shrink-0">
        <span className="font-black text-green-600 text-xl tracking-tighter">HORIZONTRAX</span>
        <div className="font-mono bg-slate-900 text-white px-4 py-1 rounded-lg">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r p-6 overflow-y-auto shrink-0">
          <div className="grid grid-cols-4 gap-2">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-10 rounded-xl border font-bold ${currentIdx === i ? "bg-green-600 border-green-600 text-white" : "border-slate-100 text-slate-400"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-12 overflow-y-auto bg-white">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-10 leading-snug">{test.questions[currentIdx].text}</h2>
              <div className="space-y-4">
                {test.questions[currentIdx].options.map(opt => (
                  <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-5 text-left border-2 rounded-2xl font-semibold transition-all ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-800" : "border-slate-50 hover:border-green-100"}`}>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="mt-20 pt-8 border-t flex justify-between">
                <button onClick={() => setCurrentIdx(prev => prev - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0">← Prev</button>
                <button onClick={() => currentIdx === test.questions.length - 1 ? submitExam() : setCurrentIdx(prev => prev + 1)} className="bg-green-600 text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-green-100">
                  {currentIdx === test.questions.length - 1 ? "Submit Exam" : "Save & Next →"}
                </button>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}
