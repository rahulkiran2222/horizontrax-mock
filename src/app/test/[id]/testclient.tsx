"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { examData } from "../../../data/questions"; // This uses the shortcut we fixed in Step 1
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, LogOut, ShieldCheck } from "lucide-react";

export default function TestClient({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const test = examData[id as keyof typeof examData];

  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    if (showInstructions) return;
    const timer = setInterval(() => setTimeLeft((t) => (t <= 0 ? 0 : t - 1)), 1000);
    return () => clearInterval(timer);
  }, [showInstructions]);

  if (!test) return null;

  const submitExam = () => {
    localStorage.setItem(`submission-${id}`, JSON.stringify(answers));
    router.push(`/test/${id}/result`);
  };

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-[2rem] max-w-xl w-full p-10 shadow-2xl">
          <h2 className="text-3xl font-black text-green-600 mb-4">Instructions</h2>
          <p className="mb-8 text-slate-500 font-bold uppercase tracking-widest text-xs">HorizonTrax Mock Platform</p>
          <ul className="space-y-4 mb-10 text-slate-600">
             <li>• 30 Questions | 30 Minutes</li>
             <li className="text-red-500 font-bold">• Switching tabs will be recorded</li>
          </ul>
          <button onClick={() => setShowInstructions(false)} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg">
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900 font-sans">
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
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-10 rounded-lg border font-bold ${currentIdx === i ? "bg-green-600 border-green-600 text-white" : "border-slate-100 text-slate-400"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-12 overflow-y-auto bg-white">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-10">{test.questions[currentIdx].text}</h2>
              <div className="space-y-4">
                {test.questions[currentIdx].options.map(opt => (
                  <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-5 text-left border-2 rounded-2xl font-semibold transition-all ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-800" : "border-slate-50 hover:border-green-100"}`}>
                    {opt}
                  </button>
                ))}
              </div>
              <div className="mt-20 pt-8 border-t flex justify-between">
                <button onClick={() => setCurrentIdx(prev => prev - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0">Prev</button>
                <button onClick={() => currentIdx === 29 ? submitExam() : setCurrentIdx(prev => prev + 1)} className="bg-green-600 text-white px-10 py-3 rounded-full font-bold shadow-lg shadow-green-100">
                  {currentIdx === 29 ? "Submit" : "Save & Next"}
                </button>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}
