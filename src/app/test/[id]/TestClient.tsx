"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { examData } from "@/data/questions";
import { LogOut, ShieldAlert, BookmarkCheck, Bookmark } from "lucide-react";

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

  const handleTerminate = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    localStorage.setItem("ht_security_msg", "Security Violation: Exam terminated after 3 strikes.");
    router.replace("/");
  }, [router]);

  useEffect(() => {
    if (showInstructions || !test) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => { if (t <= 1) { handleFinish(); return 0; } return t - 1; });
    }, 1000);

    const triggerStrike = () => {
      setStrikes((prev) => {
        const next = prev + 1;
        if (next === 1) alert("WARNING (1/2): Tab switch detected. Close all other tabs!");
        else if (next === 2) alert("FINAL WARNING (2/2): Next violation will terminate the exam.");
        else if (next >= 3) handleTerminate();
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
  }, [showInstructions, test, handleFinish, handleTerminate]);

  if (!test) return null;

  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-10 shadow-2xl text-slate-800">
          <h2 className="text-3xl font-black text-green-600 mb-6 uppercase">HorizonTrax</h2>
          <ul className="space-y-4 mb-10 text-lg leading-relaxed">
            <li>• Questions: <span className="font-bold">30</span> | Time: <span className="font-bold">30 Mins</span></li>
            <li className="text-red-600 font-bold p-4 bg-red-50 rounded-2xl border-l-4 border-red-500">
              SECURITY: 3 strikes for switching tabs or minimizing results in immediate disqualification.
            </li>
            <li>• Close all other tabs before starting.</li>
          </ul>
          <button onClick={() => { setShowInstructions(false); document.documentElement.requestFullscreen().catch(() => {}); }} className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-green-700 transition-all">Start Exam</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden text-slate-900">
      <header className="h-16 bg-white border-b px-6 flex justify-between items-center shrink-0">
        <span className="font-black text-green-600 italic">HORIZONTRAX</span>
        <div className="flex gap-6 items-center">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${strikes > 0 ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"}`}>STRIKES: {strikes}/2</div>
            <span className="font-mono font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            <LogOut onClick={handleFinish} className="cursor-pointer text-slate-300 hover:text-red-500" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-20 md:w-72 bg-white border-r p-4 overflow-y-auto shrink-0 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)} className={`h-10 rounded-xl text-sm font-bold border transition-all ${currentIdx === i ? "ring-2 ring-green-600 ring-offset-2" : ""} ${marked[i] ? "bg-indigo-600 text-white" : answers[i] ? "bg-green-600 text-white" : "bg-slate-50 text-slate-300 border-slate-100"}`}>{i + 1}</button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="mb-10">
                <p className="text-green-600 font-bold uppercase tracking-widest text-[10px] mb-2">Question {currentIdx + 1} / 30</p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">{test.questions[currentIdx].text}</h1>
            </div>
            
            <div className="space-y-4 mb-10">
              {test.questions[currentIdx].options.map(opt => (
                <button key={opt} onClick={() => setAnswers({...answers, [currentIdx]: opt})} className={`w-full p-5 rounded-2xl border-2 text-left font-semibold transition-all ${answers[currentIdx] === opt ? "border-green-600 bg-green-50 text-green-900 shadow-sm font-bold" : "bg-white border-slate-50 shadow-sm"}`}>{opt}</button>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t flex justify-between items-center bg-[#F0FDF4] sticky bottom-0 py-4">
                <button onClick={() => setCurrentIdx(i => i - 1)} disabled={currentIdx === 0} className="text-slate-400 font-bold disabled:opacity-0">← PREV</button>
                <div className="flex gap-4">
                   <button onClick={() => setMarked({...marked, [currentIdx]: !marked[currentIdx]})} className={`px-4 py-2 rounded-xl font-bold text-xs border-2 transition-all ${marked[currentIdx] ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "border-slate-100 text-slate-400"}`}>
                      {marked[currentIdx] ? <BookmarkCheck size={16} /> : "MARK FOR REVIEW"}
                   </button>
                   <button onClick={() => currentIdx === 29 ? handleFinish() : setCurrentIdx(i => i + 1)} className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-100 uppercase text-sm">
                      {currentIdx === 29 ? "Submit Exam" : "Next →"}
                   </button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
