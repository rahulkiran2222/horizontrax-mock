"use client";
import Link from 'next/link';
import { ShieldCheck, BookOpen, Zap, Award, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const tests = [
    { 
      id: 'cpp-oops', 
      title: 'C++ OOPS Professional', 
      desc: 'Master Virtual Functions, Abstraction, and Polymorphism.',
      icon: <BookOpen className="text-green-600" />,
      difficulty: 'Intermediate'
    },
    { 
      id: 'java-oops', 
      title: 'Java OOPS Professional', 
      desc: 'Deep dive into Interfaces, Inheritance, and Collections.',
      icon: <Zap className="text-amber-500" />,
      difficulty: 'Advanced'
    },
    { 
      id: 'aptitude', 
      title: 'Quantitative Aptitude', 
      desc: 'Speed math, Logical reasoning, and Pattern matching.',
      icon: <Award className="text-emerald-500" />,
      difficulty: 'Essential'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-slate-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-green-200">
            H
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-slate-800">
            Horizon<span className="text-green-600">Trax</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#" className="hover:text-green-600 transition-colors">Resources</a>
          <a href="#" className="hover:text-green-600 transition-colors">Practice</a>
          <button className="bg-green-600 text-white px-6 py-2.5 rounded-full hover:bg-green-700 transition-all shadow-md shadow-green-100">
            Student Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs md:text-sm font-black mb-8 border border-green-200 tracking-widest uppercase">
          <ShieldCheck size={16} /> Placement Readiness Portal
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-800 leading-[1.1]">
          Master your <span className="text-green-600">Technical Interviews.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Experience real-world MNC examination environments with our AI-proctored mock test platform. 
          Designed to build confidence and accuracy for HorizonTrax students.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-20 text-sm font-bold text-slate-500">
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100"><CheckCircle size={16} className="text-green-500" /> AI Proctoring</span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100"><CheckCircle size={16} className="text-green-500" /> Real-time Analytics</span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100"><CheckCircle size={16} className="text-green-500" /> Professional PDF Reports</span>
        </div>

        {/* Exam Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto px-2">
          {tests.map((test) => (
            <div key={test.id} className="group bg-white p-8 rounded-[2.5rem] border border-transparent hover:border-green-600 hover:shadow-2xl hover:shadow-green-100 transition-all duration-500 cursor-pointer flex flex-col h-full">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                {test.icon}
              </div>
              
              <div className="mb-4">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 bg-green-50 px-2 py-1 rounded-md">{test.difficulty}</span>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-green-700 transition-colors leading-tight">
                {test.title}
              </h3>
              
              <p className="text-slate-500 mb-8 flex-grow leading-relaxed">
                {test.desc}
              </p>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                 <span className="text-xs font-bold text-slate-400">30 Questions • 30 Mins</span>
                 <Link 
                    href={`/test/${test.id}`} 
                    className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-300"
                  >
                    <ArrowRight size={20} />
                  </Link>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Encouragement Section */}
      <section className="bg-white py-20 mt-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-black mb-6 text-slate-800 tracking-tight italic">"The best way to predict the future is to create it."</h2>
              <p className="text-slate-500 leading-relaxed italic">Prepare today with HorizonTrax mock assessments and land your dream job in the world's leading tech companies.</p>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 border-t border-green-50 bg-[#F0FDF4]">
        <div className="flex justify-center items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="w-6 h-6 bg-slate-400 rounded-lg text-white flex items-center justify-center font-bold text-xs italic">H</div>
          <span className="text-sm font-black tracking-tighter uppercase">HorizonTrax</span>
        </div>
        <p className="text-xs font-medium px-6">© {new Date().getFullYear()} HorizonTrax Educational Portal. Designed for professional interview excellence.</p>
      </footer>
    </div>
  );
}