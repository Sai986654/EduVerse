import React, { useState } from "react";
import { Screen, Role, User } from "../types";

interface OnboardingViewProps {
  onComplete: (user: User) => void;
  onBackToLanding: () => void;
}

export default function OnboardingView({ onComplete, onBackToLanding }: OnboardingViewProps) {
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>(Role.Student);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Sample interests
  const techInterests = ["Software Engineering", "Data Science", "AI & Machine Learning"];
  const designInterests = ["UI/UX Design", "Graphic Design", "3D Modeling"];
  const businessInterests = ["Product Management", "Marketing", "Entrepreneurship"];

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Completed, trigger onComplete
      onComplete({
        fullName: fullName || "Alex Rivera",
        email: email || "alex@eduverse.ai",
        role: selectedRole,
        interests: selectedInterests.length > 0 ? selectedInterests : ["Software Engineering", "AI & Machine Learning"],
        streakDays: 15,
        totalPoints: 8450,
        hoursSpent: 142,
        coursesCompleted: 12,
        skillsMastered: 34
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBackToLanding();
    }
  };

  return (
    <div id="onboarding-view" className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 md:p-8 font-sans">
      <main className="w-full max-w-[1100px] h-[800px] max-h-[90vh] bg-white rounded-2xl shadow-lg border border-slate-200/80 flex flex-col md:flex-row overflow-hidden relative z-10">
        
        {/* Left Persistent Brand Sidebar */}
        <aside className="hidden md:flex w-[400px] bg-slate-50 flex-col justify-between p-12 border-r border-slate-200/80 relative overflow-hidden">
          {/* Ambient gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-35">
            <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <span className="material-symbols-outlined text-4xl text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
              <span className="font-sans text-3xl text-slate-900 font-bold tracking-tight">EduVerse</span>
            </div>
            <h1 className="font-sans text-[40px] leading-tight text-slate-900 mb-6 font-bold tracking-tight">
              Your journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">mastery</span> begins here.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Join an AI-native ecosystem designed for cognitive clarity and accelerated learning.
            </p>
          </div>

          <div className="relative z-10 rounded-xl overflow-hidden border border-slate-200 aspect-square mt-8 shadow-sm">
            <img 
              alt="EduVerse Concept Illustration" 
              className="w-full h-full object-cover opacity-90 transition-all duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3luqUwJD09GntbGNqMjBg-T_0zkELiirtS84oXruAldvkN6QIPA7gkWc7G28jz4DAdyeBqwOLDuR8wNzjx3C8TYCediGh4RxH4l8KCme8p8Jxhpq3MsP_1Hu9AU2oHon04M6r6sVccpaHFUtvMS21PhQdgkJJdSVK67JNeBeEL2GZmJnIoDOQJViDL4BVy8fyUIbGr-0DQBmbGN10ZS7kmxZhB9wl7g1sX_1AvRM08ICASuHRqXvI" 
            />
          </div>
        </aside>

        {/* Dynamic Form Area (Right) */}
        <section className="flex-1 flex flex-col relative bg-white">
          
          {/* Mobile Header */}
          <div className="md:hidden p-6 border-b border-slate-200 flex items-center justify-center gap-2 bg-slate-50">
            <span className="material-symbols-outlined text-2xl text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            <span className="font-sans text-2xl font-bold text-slate-900">EduVerse</span>
          </div>

          {/* Progress Indicator */}
          <div className="px-8 md:px-16 pt-12 pb-6 w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-100 z-0 rounded-full" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-blue-600 z-0 rounded-full transition-all duration-500 shadow-sm" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />

              {/* Steps */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-4 ring-white transition-all duration-300 ${step >= 1 ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-400"}`}>1</div>
                <span className={`absolute -bottom-6 text-[11px] font-medium tracking-wide transition-colors ${step >= 1 ? "text-blue-600 font-semibold" : "text-slate-400"}`}>Account</span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-4 ring-white transition-all duration-300 ${step >= 2 ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-400"}`}>2</div>
                <span className={`absolute -bottom-6 text-[11px] font-medium tracking-wide transition-colors ${step >= 2 ? "text-blue-600 font-semibold" : "text-slate-400"}`}>Role</span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-4 ring-white transition-all duration-300 ${step >= 3 ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-400"}`}>3</div>
                <span className={`absolute -bottom-6 text-[11px] font-medium tracking-wide transition-colors ${step >= 3 ? "text-blue-600 font-semibold" : "text-slate-400"}`}>Skills</span>
              </div>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto px-8 md:px-16 py-8 custom-scrollbar">
            <div className="w-full max-w-md mx-auto">
              
              {/* STEP 1: Account Setup */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 font-sans">Create Account</h2>
                    <p className="text-sm text-slate-500 mb-6">Enter your details to access the platform.</p>
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="min-input w-full py-3 text-slate-900 placeholder:text-slate-400" 
                        placeholder="Jane Doe" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="min-input w-full py-3 text-slate-900 placeholder:text-slate-400" 
                        placeholder="jane@example.com" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="min-input w-full py-3 text-slate-900 placeholder:text-slate-400" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-white text-slate-400 font-medium uppercase tracking-wider text-[10px]">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => { setFullName("Alex Rivera"); setEmail("alex@eduverse.ai"); }}
                      className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 spring-hover shadow-sm bg-white"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Google
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setFullName("Alex Rivera"); setEmail("alex@eduverse.ai"); }}
                      className="flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 spring-hover shadow-sm bg-white"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.126 3.802 3.064 1.52-.061 2.096-.983 3.935-.983 1.838 0 2.378.983 3.96.953 1.636-.026 2.65-1.503 3.65-2.96 1.154-1.685 1.629-3.322 1.651-3.407-.037-.015-3.189-1.222-3.218-4.858-.024-3.04 2.483-4.496 2.597-4.567-1.429-2.09-3.646-2.374-4.436-2.408-2.072-.224-4.133 1.102-5.099 1.102zm-1.64-5.385c.83-.997 1.39-2.38 1.238-3.763-1.183.047-2.628.788-3.483 1.802-.76.852-1.433 2.274-1.258 3.626 1.319.102 2.671-.667 3.503-1.665z" />
                      </svg>
                      Apple
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Path/Goal Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 font-sans">Select your path</h2>
                    <p className="text-sm text-slate-500 mb-6">How do you plan to use EduVerse primarily?</p>
                  </div>
                  <div className="space-y-4">
                    {/* Student Card */}
                    <div 
                      onClick={() => setSelectedRole(Role.Student)}
                      className={`relative p-6 rounded-xl cursor-pointer border transition-all duration-300 flex items-start gap-4 ${selectedRole === Role.Student ? "bg-blue-50/50 border-blue-500 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"}`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base mb-1">Student</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">I want to master new skills through AI-guided learning pathways.</p>
                      </div>
                      <div className="absolute top-6 right-6 w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center">
                        {selectedRole === Role.Student && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                      </div>
                    </div>

                    {/* Instructor Card */}
                    <div 
                      onClick={() => setSelectedRole(Role.Instructor)}
                      className={`relative p-6 rounded-xl cursor-pointer border transition-all duration-300 flex items-start gap-4 ${selectedRole === Role.Instructor ? "bg-amber-50/50 border-amber-500 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"}`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>co_present</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base mb-1">Instructor</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">I want to create courses and leverage AI tools for my students.</p>
                      </div>
                      <div className="absolute top-6 right-6 w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center">
                        {selectedRole === Role.Instructor && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Skill Selection */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 font-sans">Areas of Interest</h2>
                    <p className="text-sm text-slate-500 mb-6">Select topics to personalize your AI tutor's recommendations.</p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Tech Category */}
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Technology</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {techInterests.map((interest) => {
                          const isSelected = selectedInterests.includes(interest);
                          return (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => handleInterestToggle(interest)}
                              className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all ${isSelected ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 bg-white"}`}
                            >
                              {interest}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Design Category */}
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Design</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {designInterests.map((interest) => {
                          const isSelected = selectedInterests.includes(interest);
                          return (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => handleInterestToggle(interest)}
                              className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all ${isSelected ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 bg-white"}`}
                            >
                              {interest}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Business Category */}
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Business</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {businessInterests.map((interest) => {
                          const isSelected = selectedInterests.includes(interest);
                          return (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => handleInterestToggle(interest)}
                              className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all ${isSelected ? "bg-blue-50 border-blue-500 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 bg-white"}`}
                            >
                              {interest}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-6 md:px-16 md:py-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button 
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
            >
              Back
            </button>
            <button 
              type="button"
              onClick={handleContinue}
              className="px-8 py-3 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 spring-hover ml-auto"
            >
              {step === 3 ? "Complete Setup" : "Continue"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
