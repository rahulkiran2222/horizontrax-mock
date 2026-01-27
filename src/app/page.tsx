"use client";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { BookOpen, ShieldAlert, Award, Zap } from 'lucide-react';

export default function LandingPage() {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const msg = localStorage.getItem("ht_security_msg");
    if (msg) {
      setNotice(msg);
      localStorage.removeItem("ht_security_msg");
      setTimeout(() => setNotice(null), 10000);
    }
  }, []);

  const tests = [
    { id: 'cpp-oops', title: 'C++ OOPS Professional', desc: 'Core OOPs, Pointers, and Memory Management.' },
    { id: 'java-oops', title: 'Java OOPS Professional', desc: 'JVM, Collections, and Multi-threading basics.' },
    { id: 'aptitude', title: 'Quantitative Aptitude', desc: 'Logical reasoning and numerical ability.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {notice && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 text-center font-bold z-[100] shadow-2xl animate-in slide-in-from-top duration-500">
          ⚠️ {notice}
        </div>
      )}

      <nav className="flex justify-between items-center px-10 py-6 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-green-100 italic">H</div>
          <span className="text-2xl font-black uppercase tracking-tighter text-slate-800">HorizonTrax</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-black mb-8 uppercase tracking-[0.2em]">
           Placement Readiness Portal
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900 leading-[0.9]">
          Master your <br/><span className="text-green-600 italic font-serif">Technical Interviews.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 font-medium">
          Industry-grade mock tests designed to help you clear MNC interviews with confidence.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {tests.map((t) => (
            <div key={t.id} className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-green-500 hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">{t.title}</h3>
              <p className="text-slate-400 mb-10 leading-relaxed font-medium">{t.desc}</p>
              <Link href={`/test/${t.id}`} className="inline-flex items-center gap-2 font-black text-green-600 uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                Start Mock Test →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
