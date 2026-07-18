import React, { useState, useEffect } from "react";
import { Screen, User, Course, StudyPlan } from "../types";
import { coursesList, defaultStudyPlan } from "../data";

interface DashboardViewProps {
  user: User;
  onSelectCourse: (course: Course) => void;
  onSignOut: () => void;
}

export default function DashboardView({ user, onSelectCourse, onSignOut }: DashboardViewProps) {
  const [courses, setCourses] = useState<Course[]>(coursesList);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // AI Planner state
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(defaultStudyPlan);
  const [plannerInput, setPlannerInput] = useState("");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Sync planner input with user interests initially
  useEffect(() => {
    if (user.interests && user.interests.length > 0) {
      setPlannerInput(user.interests[0]);
    }
  }, [user]);

  // AI Search with Gemini
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Generate customized study plan via Gemini API
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focus: plannerInput || "Advanced Software Engineering",
          interests: user.interests
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.todayFocus && data.tasks) {
          setStudyPlan(data);
        }
      }
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const toggleTaskDone = (index: number) => {
    const updatedTasks = [...studyPlan.tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setStudyPlan({ ...studyPlan, tasks: updatedTasks });
  };

  return (
    <div id="dashboard-view" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Left Navigation Rail */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <span className="material-symbols-outlined text-3xl text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            <span className="font-sans text-xl font-bold text-slate-900 tracking-wide">EduVerse</span>
          </div>

          {/* Nav list */}
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 text-left transition-all">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-950 hover:bg-slate-50 text-left transition-all">
              <span className="material-symbols-outlined text-[20px]">school</span>
              My Library
            </button>
            <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-950 hover:bg-slate-50 text-left transition-all">
              <span className="material-symbols-outlined text-[20px]">chat</span>
              AI Co-pilot
            </button>
            <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-950 hover:bg-slate-50 text-left transition-all">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              Saved Notes
            </button>
            <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-950 hover:bg-slate-50 text-left transition-all">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
              Analytics
            </button>
          </nav>
        </div>

        {/* User Account info / Logout */}
        <div className="border-t border-slate-100 pt-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user.fullName.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{user.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 bg-white shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        
        {/* Header with Search */}
        <header className="px-8 py-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/85 backdrop-blur-xl sticky top-0 z-40">
          <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search courses or ask curriculum questions..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) setShowSearchResults(false);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-24 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Ask AI
            </button>
          </form>

          {/* Welcome profile */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs text-slate-500">Level 14 Cognitive Engineer</span>
              <span className="text-xs font-semibold text-blue-600">{user.totalPoints.toLocaleString()} XP</span>
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center font-bold text-slate-800 shadow-sm">
              {user.fullName[0]}
            </div>
          </div>
        </header>

        {/* Dashboard Grid Container */}
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* AI Search Overlay Results */}
          {showSearchResults && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4 animate-fade-in relative">
              <button 
                onClick={() => setShowSearchResults(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="flex items-center gap-2 text-blue-600">
                <span className="material-symbols-outlined text-[20px] animate-pulse">explore</span>
                <h3 className="font-sans text-lg font-bold text-slate-900">AI Search Recommendations</h3>
              </div>
              
              {isSearching ? (
                <div className="flex items-center gap-3 py-4 text-slate-500">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  <span className="text-sm">Gemini is finding perfect courses...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResults.length > 0 ? (
                    searchResults.map((result: any, i: number) => (
                      <div 
                        key={i} 
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-blue-500 hover:bg-white transition-all cursor-pointer"
                        onClick={() => {
                          // Try to match search results with local courses
                          const matched = courses.find(c => c.title.toLowerCase().includes(result.title.toLowerCase()) || result.title.toLowerCase().includes(c.title.toLowerCase()));
                          if (matched) {
                            onSelectCourse(matched);
                          } else {
                            // Select Advanced Neural Architecture as default
                            onSelectCourse(courses[2]);
                          }
                          setShowSearchResults(false);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-blue-600">{result.matchPercent}% Match</span>
                          <span className="text-[10px] text-blue-700 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded-full">{result.module}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{result.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{result.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-4 text-center text-xs text-slate-500">
                      No custom AI suggestions found. Try searching for "Neural Networks" or "Figma Design"!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Top Row: Hero and AI Study Planner Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
             {/* Streak Hero Card (lg:col-span-8) */}
             <div className="lg:col-span-8 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/80 p-8 relative overflow-hidden flex flex-col justify-between md:flex-row gap-6 shadow-sm">
               {/* Decorative elements */}
               <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-50/30 rounded-full blur-[80px]" />
               
               <div className="relative z-10 space-y-6 md:max-w-md">
                 <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-3.5 py-1.5 rounded-full">
                   <span className="material-symbols-outlined text-[18px] fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                   <span className="text-xs font-bold tracking-wider uppercase">{user.streakDays} Days Streak</span>
                 </div>
                 <div className="space-y-2">
                   <h2 className="font-sans text-3xl md:text-4xl text-slate-900 font-bold">Ready to learn, <span className="text-blue-600">{user.fullName.split(" ")[0]}</span>?</h2>
                   <p className="text-sm text-slate-600 leading-relaxed font-sans">
                     "Intelligence is the ability to adapt to change." Today is a beautiful day to model hidden units and master components.
                   </p>
                 </div>
               </div>

               {/* Progress Ring Widget */}
               <div className="relative z-10 flex flex-col items-center justify-center shrink-0">
                 <div className="relative w-36 h-36 flex items-center justify-center">
                   {/* SVG circular track */}
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                     <circle cx="72" cy="72" r="58" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                     <circle 
                       cx="72" 
                       cy="72" 
                       r="58" 
                       stroke="#2563eb" 
                       strokeWidth="8" 
                       fill="transparent" 
                       strokeDasharray="364" 
                       strokeDashoffset={364 - (364 * 45) / 60} 
                       strokeLinecap="round"
                       className="transition-all duration-1000"
                     />
                   </svg>
                   <div className="text-center">
                     <span className="text-2xl font-bold text-slate-900">45</span>
                     <span className="text-xs text-slate-500">/60m</span>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Daily Goal</p>
                   </div>
                 </div>
               </div>
             </div>

             {/* AI Study Planner Widget (lg:col-span-4) */}
             <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/60 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-blue-600">task_alt</span>
                     <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">AI Co-pilot Plan</h3>
                   </div>
                   <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">Dynamic</span>
                 </div>

                 <div className="border-t border-slate-100 pt-4">
                   <p className="text-xs text-slate-400 mb-1">Current Focus:</p>
                   <p className="text-sm font-bold text-slate-900 mb-4">{studyPlan.todayFocus}</p>
                 </div>

                 <div className="space-y-3">
                   {studyPlan.tasks.map((task, index) => (
                     <div 
                       key={index}
                       onClick={() => toggleTaskDone(index)}
                       className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/40 cursor-pointer hover:border-blue-500 hover:bg-white transition-all"
                     >
                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.done ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"}`}>
                         {task.done && <span className="material-symbols-outlined text-white text-xs font-bold">check</span>}
                       </div>
                       <span className={`text-xs ${task.done ? "line-through text-slate-400" : "text-slate-800 font-medium"}`}>{task.title}</span>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Regenerate Panel */}
               <div className="mt-6 border-t border-slate-100 pt-4">
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={plannerInput}
                     onChange={(e) => setPlannerInput(e.target.value)}
                     placeholder="Focus e.g. Figma curves, RNNs"
                     className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                   />
                   <button 
                     onClick={handleGeneratePlan}
                     disabled={isGeneratingPlan}
                     className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                   >
                     {isGeneratingPlan ? (
                       <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : (
                       <>
                         <span className="material-symbols-outlined text-sm font-bold">sync</span>
                         Create
                       </>
                     )}
                   </button>
                 </div>
               </div>

             </div>

          </div>

          {/* Stats Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl bg-white border border-slate-200/60 p-6 flex items-center gap-4 hover:border-blue-300 transition-colors shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-[26px]">schedule</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Hours Spent</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{user.hoursSpent} hrs</h4>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200/60 p-6 flex items-center gap-4 hover:border-amber-300 transition-colors shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined text-[26px]">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Completed</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{user.coursesCompleted} Courses</h4>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-slate-200/60 p-6 flex items-center gap-4 hover:border-indigo-300 transition-colors shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <span className="material-symbols-outlined text-[26px]">military_tech</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Skills Mastered</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{user.skillsMastered} Badges</h4>
              </div>
            </div>
          </div>

          {/* Continue Learning */}
          <section className="space-y-4">
            <h3 className="font-sans text-2xl font-bold text-slate-900">Continue Learning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.filter(c => c.progressPercent > 0).map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => onSelectCourse(course)}
                  className="rounded-xl bg-white border border-slate-200/60 p-6 flex flex-col justify-between hover:border-blue-500 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{course.subtitle}</span>
                      <h4 className="font-sans text-xl text-slate-900 font-bold mt-1 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                    </div>
                    <span className="material-symbols-outlined text-sm text-slate-600 bg-slate-50 p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 border border-slate-100 transition-colors">play_arrow</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{course.progressPercent}% Completed</span>
                      <span>{course.timeRemaining} remaining</span>
                    </div>
                    {/* Progress slider */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${course.progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended for You */}
          <section className="space-y-4">
            <h3 className="font-sans text-2xl font-bold text-slate-900">Recommended for You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(c => c.progressPercent === 0).map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => onSelectCourse(course)}
                  className="rounded-xl bg-white border border-slate-200/60 overflow-hidden hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
                >
                  <div 
                    className="h-40 bg-cover bg-center relative opacity-90 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: `url('${course.image}')` }}
                  >
                    {course.isPopular && (
                      <span className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">Popular</span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{course.subtitle}</span>
                      <h4 className="font-bold text-base text-slate-900 mt-1 group-hover:text-blue-600 transition-colors line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <img className="w-6 h-6 rounded-full object-cover" src={course.instructorAvatar} alt={course.instructorName} />
                        <span className="text-[10px] text-slate-700 font-medium">{course.instructorName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded font-mono">{course.totalDuration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
