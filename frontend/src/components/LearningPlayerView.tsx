import React, { useState, useEffect, useRef } from "react";
import { Course, ChatMessage, Screen, User } from "../types";
import { initialChatHistory } from "../data";
import { getApiUrl } from "../utils/api";

interface LearningPlayerViewProps {
  course: Course;
  user: User;
  onBackToDashboard: () => void;
}

export default function LearningPlayerView({ course, user, onBackToDashboard }: LearningPlayerViewProps) {
  // Navigation states
  const [activeTab, setActiveTab] = useState<"notes" | "syllabus" | "transcript">("notes");
  
  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(765); // 12m 45s in seconds
  const totalDuration = 1920; // 32 minutes in seconds
  const [lectureContext, setLectureContext] = useState("RNN Backpropagation Through Time");

  // AI Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatHistory);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiLoading]);

  // Format time (seconds -> MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  // Convert current time to a context label
  useEffect(() => {
    if (currentTime < 400) {
      setLectureContext("Introduction to Recurrent Sequence Models");
    } else if (currentTime < 800) {
      setLectureContext("RNN Hidden State Transitions and Hidden Layers");
    } else if (currentTime < 1200) {
      setLectureContext("Unfolding RNN Cells Through Time");
    } else {
      setLectureContext("Backpropagation Through Time and Vanishing Gradients");
    }
  }, [currentTime]);

  // Load chat messages from database
  useEffect(() => {
    async function loadChatMessages() {
      if (!user.email || !course.id) return;
      try {
        const response = await fetch(getApiUrl(`/api/chat/${course.id}?email=${user.email}`));
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setChatMessages(data);
          } else {
            setChatMessages(initialChatHistory);
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }
    loadChatMessages();
  }, [course.id, user.email]);

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle Scrubber Change
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseInt(e.target.value));
  };

  // Pre-populated Quick Questions
  const quickQuestions = [
    "What is BPTT and how does it work?",
    "Why do gradients vanish in deep RNNs?",
    "How do LSTMs solve the vanishing gradient?"
  ];

  // Send message to Gemini API and persist in DB
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: formatTime(currentTime)
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const response = await fetch(getApiUrl(`/api/chat/${course.id}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          message: textToSend,
          context: `${lectureContext} at timestamp ${formatTime(currentTime)}`
        })
      });

      if (response.ok) {
        const aiMsg = await response.json();
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Failed to contact tutor API");
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: "ai",
        text: "I experienced an error connecting to the Gemini ecosystem. Please check your internet or API credentials.",
        timestamp: formatTime(currentTime)
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleBack = async () => {
    try {
      await fetch(getApiUrl(`/api/courses/${course.id}/progress`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressPercent: course.progressPercent })
      });
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
    onBackToDashboard();
  };

  // Syllabus list
  const syllabusItems = [
    { title: "Course Introduction & Setup", duration: "12m 45s", isCompleted: true, active: false, timestamp: 0 },
    { title: "Foundations of Sequence Data", duration: "24m 10s", isCompleted: true, active: false, timestamp: 300 },
    { title: "The Hidden Recurrence Equation", duration: "32m 00s", isCompleted: false, active: true, timestamp: 765 },
    { title: "Backpropagation Through Time", duration: "18m 55s", isCompleted: false, active: false, timestamp: 1200 },
    { title: "Gated Architectures (GRU & LSTM)", duration: "45m 20s", isCompleted: false, active: false, timestamp: 1600 }
  ];

  // Transcript items
  const transcriptItems = [
    { time: "11:15", text: "When we look at standard feedforward nets, they process elements independently.", sec: 675 },
    { time: "11:45", text: "In sequences, however, each token has a conditional dependence on the past.", sec: 705 },
    { time: "12:15", text: "To model this, we introduce a recurrence hidden state h_t which acts as memory.", sec: 735 },
    { time: "12:45", text: "Now let's look at how h_t-1 propagates forward combined with active input x_t.", sec: 765 },
    { time: "13:30", text: "We apply a non-linear activation tanh on the combined weighted components.", sec: 810 },
    { time: "14:15", text: "This step is repeated sequentially, causing a very long chain of matrix multiplication.", sec: 855 }
  ];

  return (
    <div id="learning-player-view" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{course.subtitle}</span>
            <h1 className="font-sans text-lg text-slate-900 font-bold truncate max-w-md">{course.title}</h1>
          </div>
        </div>

        {/* Course overall progress */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-500">Course Progress</span>
            <span className="text-xs font-semibold text-slate-900">{course.progressPercent}% Completed</span>
          </div>
          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: `${course.progressPercent}%` }} />
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-h-[calc(100vh-69px)]">
        
        {/* Left Hand: Video Player & Notebooks */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
          
          {/* Custom Interactive Video Player Mock */}
          <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative group flex flex-col justify-between p-4 shadow-2xl">
            
            {/* Playback Title & Info Overlay */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-start w-full relative z-10">
              <span className="bg-slate-900/90 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-800/80 backdrop-blur-md">
                Current topic: <span className="text-blue-400 font-bold">{lectureContext}</span>
              </span>
              <span className="bg-slate-900/90 text-slate-200 font-mono text-xs px-2.5 py-1 rounded border border-slate-800/80">1080p AI High-Fi</span>
            </div>

            {/* Neural Network Abstract Visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden bg-slate-950">
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
              
              {/* Graphic math overlay or neural network flow */}
              <div className="relative w-96 h-48 flex items-center justify-between px-12">
                <div className={`w-16 h-16 rounded-full border-2 border-dashed ${isPlaying ? "border-blue-400 animate-spin" : "border-slate-800"} flex items-center justify-center`}>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-mono text-xs">x_t</div>
                </div>
                
                {/* Connecting arrow line */}
                <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-500/40 to-amber-500/40 relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_8px_#3b82f6] ${isPlaying ? "animate-ping left-1/2" : "left-1/4"}`} />
                </div>

                <div className="w-20 h-20 rounded-full border-2 border-amber-500/80 flex items-center justify-center bg-amber-500/5 relative shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <div className="text-center">
                    <p className="font-mono text-xs text-white">h_t</p>
                    <p className="text-[8px] text-amber-400 uppercase tracking-wider font-bold">tanh</p>
                  </div>
                  <div className="absolute -top-6 -right-6 w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400">h_t-1</div>
                </div>
              </div>
            </div>

            {/* Interactive play center button (hidden when playing) */}
            {!isPlaying && (
              <button 
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-blue-500/30 pl-1 z-20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-3xl">play_arrow</span>
              </button>
            )}

            {/* Custom Bottom Video Controls HUD */}
            <div className="bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-xl p-4 space-y-3 w-full relative z-10">
              
              {/* Timeline scrubber slider */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-300 w-10 shrink-0">{formatTime(currentTime)}</span>
                <input 
                  type="range" 
                  min="0" 
                  max={totalDuration} 
                  value={currentTime} 
                  onChange={handleScrubberChange}
                  className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
                <span className="font-mono text-[11px] text-slate-300 w-10 text-right shrink-0">{formatTime(totalDuration)}</span>
              </div>

              {/* HUD Buttons */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="text-slate-300 hover:text-white transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[24px]">
                      {isPlaying ? "pause_circle" : "play_circle"}
                    </span>
                  </button>
                  <button className="text-slate-300 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">volume_up</span>
                  </button>
                  <div className="h-4 w-[1px] bg-slate-700" />
                  <span className="text-xs text-slate-300 font-medium hidden sm:inline">Module 3 • RNN Hidden Nodes</span>
                </div>

                <div className="flex items-center gap-4">
                  <button className="text-slate-300 hover:text-white text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded">1.25x</button>
                  <button className="text-slate-300 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">closed_caption</span>
                  </button>
                  <button className="text-slate-300 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Lower tabs segment (Lecture Notes, Syllabus, Transcript) */}
          <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setActiveTab("notes")}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === "notes" ? "border-blue-600 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Lecture Notes
              </button>
              <button 
                onClick={() => setActiveTab("syllabus")}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === "syllabus" ? "border-blue-600 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Course Syllabus
              </button>
              <button 
                onClick={() => setActiveTab("transcript")}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === "transcript" ? "border-blue-600 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Live Transcript
              </button>
            </div>

            <div className="p-6 h-64 overflow-y-auto">
              
              {/* lecture notes tab */}
              {activeTab === "notes" && (
                <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-sans">
                  <h3 className="font-sans text-lg text-slate-900 font-bold">Syllabus Insights: Recurrent Weights</h3>
                  <p>
                    Recurrent Neural Networks (RNNs) are uniquely constructed to model sequential dependencies. 
                    Unlike feedforward systems that multiply each sample with an isolated weight matrix, RNNs maintain a persistent internal hidden state $h_t$.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-xs text-blue-700">
                    h_t = tanh(W_hh * h_(t-1) + W_xh * x_t + b_h)
                  </div>
                  <p>
                    <strong>Why gradients vanish:</strong> When computing backpropagation through time (BPTT), the derivative of $h_T$ with respect to $h_t$ is a product of Jacobians. If the recurrent weight eigenvalues are smaller than 1, the gradients collapse exponentially back to zero as sequences grow.
                  </p>
                </div>
              )}

              {/* interactive syllabus tab */}
              {activeTab === "syllabus" && (
                <div className="space-y-3">
                  {syllabusItems.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => setCurrentTime(item.timestamp)}
                      className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${item.active ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100 hover:border-slate-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-sm ${item.isCompleted ? "text-blue-600 fill-1" : "text-slate-400"}`}>
                          {item.isCompleted ? "check_circle" : "radio_button_unchecked"}
                        </span>
                        <span className={`text-xs font-bold ${item.active ? "text-slate-900" : "text-slate-700"}`}>{item.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded font-mono border border-slate-100/50">{item.duration}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Live transcript tab */}
              {activeTab === "transcript" && (
                <div className="space-y-4">
                  {transcriptItems.map((item, index) => {
                    const isPassed = currentTime >= item.sec;
                    return (
                      <div 
                        key={index} 
                        onClick={() => setCurrentTime(item.sec)}
                        className={`flex gap-4 p-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-all ${isPassed ? "text-slate-900 bg-blue-50/50 font-medium" : "text-slate-400/80"}`}
                      >
                        <span className="font-mono text-xs font-bold text-blue-600 shrink-0">{item.time}</span>
                        <p className="text-xs">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right Hand Side: Conversational AI Tutor Co-pilot */}
        <aside className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200/80 flex flex-col justify-between">
          
          {/* AI Header */}
          <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 animate-pulse">spark</span>
              <div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">AI Tutor co-pilot</h3>
                <span className="text-[9px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping" />
                  Gemini 3.5 Flash Active
                </span>
              </div>
            </div>
            
            {/* Quick action info */}
            <span className="text-[9px] font-mono bg-slate-50 text-slate-500 border border-slate-100 px-2 py-1 rounded font-semibold">Context synced</span>
          </div>

          {/* Conversations output chat container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
            
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div 
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === "user" ? "bg-blue-600 text-white font-medium rounded-tr-none" : "bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm"}`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {msg.codeBlock && (
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                      <pre>{msg.codeBlock}</pre>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1.5 font-mono px-1">At {msg.timestamp}</span>
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isAiLoading && (
              <div className="flex flex-col mr-auto items-start max-w-[85%]">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-100 rounded-tl-none flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Prompt inputs or suggested prompt pills */}
          <div className="p-4 border-t border-slate-100 bg-white space-y-4">
            
            {/* Suggested Question Pills */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-1">Suggested Questions</span>
              <div className="flex flex-col gap-1">
                {quickQuestions.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="text-left px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-100 text-[10px] font-medium text-slate-600 truncate transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input bar */}
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(chatInput);
                }}
                placeholder="Ask the co-pilot tutor..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <button 
                onClick={() => handleSendMessage(chatInput)}
                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10 hover:scale-105 transition-all"
              >
                <span className="material-symbols-outlined text-sm font-bold">send</span>
              </button>
            </div>

          </div>

        </aside>

      </div>
    </div>
  );
}
