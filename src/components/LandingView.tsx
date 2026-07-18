import React, { useEffect, useRef, useState } from "react";
import { Screen } from "../types";

interface LandingViewProps {
  onNavigate: (screen: Screen) => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    // Adjust canvas size
    const resizeCanvas = () => {
      const width = canvas.clientWidth || 1280;
      const height = canvas.clientHeight || 720;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;
        vec2 mouse = u_mouse / u_resolution;
        float t = u_time * 0.2;
        
        vec3 color1 = vec3(0.95, 0.96, 0.98); 
        vec3 color2 = vec3(0.15, 0.45, 0.95); 
        vec3 color3 = vec3(0.98, 0.98, 0.99); 
        
        float noise1 = sin(uv.x * 3.0 + t) * cos(uv.y * 2.0 - t * 0.5);
        float noise2 = sin(uv.y * 4.0 - t * 0.8) * cos(uv.x * 3.5 + t * 0.3);
        
        float dist = distance(uv, mouse);
        float mouseInfluence = smoothstep(0.4, 0.0, dist) * 0.5;
        
        float mixFactor = smoothstep(-1.0, 1.0, noise1 + noise2 + mouseInfluence);
        
        vec3 finalColor = mix(color1, color2, mixFactor * 0.6);
        finalColor = mix(finalColor, color3, mixFactor * 0.2);
        
        float glow = (1.0 - uv.y) * 0.15;
        finalColor += color2 * glow;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = 1.0 - (e.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const render = (time: number) => {
      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, time * 0.001);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div id="landing-view" className="min-h-screen flex flex-col bg-slate-50 text-slate-900 select-none font-sans">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition-all duration-200">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="font-sans text-2xl font-bold text-slate-900 flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <span className="material-symbols-outlined text-blue-600 fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            EduVerse
          </div>
          
          {/* Links */}
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
            <a href="#courses" className="text-slate-500 hover:text-slate-950 transition-colors hover:scale-105">Courses</a>
            <a href="#mentors" className="text-slate-500 hover:text-slate-950 transition-colors hover:scale-105">Mentors</a>
            <a href="#pathways" className="text-slate-500 hover:text-slate-950 transition-colors hover:scale-105">Pathways</a>
            <a href="#community" className="text-slate-500 hover:text-slate-950 transition-colors hover:scale-105">Community</a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate(Screen.Dashboard)}
              className="hidden md:block text-xs font-semibold text-slate-500 hover:text-slate-950 transition-all uppercase tracking-wider hover:scale-105 duration-200"
            >
              Demo Workspace
            </button>
            <button 
              onClick={() => onNavigate(Screen.Onboarding)}
              className="bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-blue-500 transition-colors shadow-sm hover:scale-105 transition-transform duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with canvas shader */}
      <section className="relative min-h-[820px] flex items-center justify-center overflow-hidden px-6 pt-24">
        {/* Background shader */}
        <div className="absolute inset-0 w-full h-full opacity-60">
          <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 px-4">
          <h1 className="font-sans text-5xl md:text-7xl text-slate-900 leading-tight font-bold tracking-tight">
            The Future of Learning, <br />
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Experience an immersive, personalized path to mastery with world-class instructors. 
            Adaptive learning algorithms tailor every lesson to your pace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
            <button 
              onClick={() => onNavigate(Screen.Onboarding)}
              className="w-full sm:w-auto bg-blue-600 text-white font-bold text-sm px-8 py-4 rounded-full hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-100"
            >
              Get Started for Free
            </button>
            <button 
              onClick={() => setShowDemo(true)}
              className="w-full sm:w-auto border border-slate-200 text-slate-700 bg-white font-semibold text-sm px-8 py-4 rounded-full hover:bg-slate-50 transition-all hover:scale-105 duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">play_circle</span> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-xs font-semibold text-slate-400 mb-8 uppercase tracking-widest">Trusted by visionary teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 text-2xl md:text-3xl font-sans text-slate-600 font-bold">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Acme Corp</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">GlobalTech</span>
            <span className="hover:text-amber-600 transition-colors cursor-pointer">Innova</span>
            <span className="hover:text-cyan-600 transition-colors cursor-pointer">Nexus</span>
          </div>
        </div>
      </section>

      {/* Featured Courses (Bento Grid) */}
      <section id="courses" className="py-32 px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="font-sans text-4xl text-slate-900 font-bold tracking-tight mb-4">Masterclass Exclusives</h2>
          <p className="text-lg text-slate-500 max-w-2xl font-light">Curated pathways designed by industry leaders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Large Card */}
          <div className="md:col-span-8 rounded-2xl bg-white border border-slate-200/60 overflow-hidden group hover:border-blue-500 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between">
            <div 
              className="h-64 md:h-80 bg-cover bg-center relative opacity-80 group-hover:opacity-100 transition-opacity" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdM8-t_B1AyPJjeCjjeiNN6fl1rV-RvAfqXsLSO1rYWZ8r86XyRTMRGzX_86fQmGkfXrw1fuHvfBfkdzWcWyxlNYsY6PU2XCEOvs6qgXzDXRNILKCBdxm3rEPSi0s_ekrWhM77V_Tp71KxtRml6YyJCQkyHm7RFW1BxyOb9US_gX2bkB-AmVCqvzWw3_-xfn4abL3GpPryGuFxuZ3Zg2MAncrrmKbfjm5Y5GGWPZv3rP-9pQeUGDVc')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="p-8 relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide">Most Popular</span>
                  <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600">bookmark_border</span>
                </div>
                <h3 className="font-sans text-2xl text-slate-900 mb-2 font-bold group-hover:text-blue-600 transition-colors">AI-First Product Design</h3>
                <p className="text-sm text-slate-500 mb-6">Learn to integrate LLMs into consumer experiences seamlessly.</p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLF9R9j7LqVtN9bRB1Amunau6ZO3TZSOVZO4dQYxswuLpZBkbnS6W96Q6uOWKsvipWzS65C1nUdHlbf9f0uSdVHyoegEeMqGNSKxUJebxpY-KRd-jMPZjC1WQbyaHWtXwcB5bJJt97tg_GkmuM60nb_IAB7-XmyCk_thdrhcmczjQ4l78MO5PbJH2ZHQTB-MV0e-P0TAoTyF-1d9XZ_5in7GEP9hGOGcK7iMWlCmZSVjyQGg2_RjCk" 
                  alt="Dr. Elena Rostova" 
                />
                <div>
                  <p className="font-semibold text-sm text-slate-800">Dr. Elena Rostova</p>
                  <p className="text-xs text-slate-500">Ex-Design Lead, Nexus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Small Card 1 */}
          <div className="md:col-span-4 rounded-2xl bg-white border border-slate-200/60 overflow-hidden group hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col">
            <div 
              className="h-44 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEZR7LYSscsjNc00bMW-BQ-FS86SmqtIOTDHUHKjtmmw-wyvObuVLoGo8o96ILmVFUaEedVB5bD9GubDTqcupu5UHQCR3lGBct97TAAfXq_pYT8QIrACDxIu1OCXGpWAj1cJWxnkVeWb16_LcLmI_OO1l5YxwslgVkCQS6fJFLUTYgLEA_8YSwIRNHoYiRluJszf0KRjJFSJ_Po7XaF02Yg4IzA7OmduAGAB0VJyPEU5yAjuFG28lC')` }}
            />
            <div className="p-6 flex-1 flex flex-col justify-center bg-white">
              <h3 className="font-sans text-xl text-slate-900 mb-2 font-bold group-hover:text-blue-600 transition-colors">Quantum Computing for Creators</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Demystifying qubits for practical applications and computation models.</p>
            </div>
          </div>

          {/* Small Card 2 */}
          <div className="md:col-span-4 rounded-2xl bg-white border border-slate-200/60 overflow-hidden group hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col">
            <div 
              className="h-44 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBK1GTb7RhtT6oMDf881e5SZKjIgg1D9rzIKa0IauOWW2rbCITImIDZaofDHH_l0JbFQmO8Wh3ukewPCRgkRCE7MJVC6NvYCFUfIjXzSasxX3-cdAiN_SBub5qp8RyIVQLIsN1tVXKcG_pe8dTDR2WKQxbsV__X6cUYWQ-83IbMjlboAuXmh_H31yV3IwW3SmVFNu9qRyPBjVCaGwIhxrqwEt74SG4jlRzORNHjVteFp4gZ7vT53toG')` }}
            />
            <div className="p-6 flex-1 flex flex-col justify-center bg-white">
              <h3 className="font-sans text-xl text-slate-900 mb-2 font-bold group-hover:text-blue-600 transition-colors">Neural Architecture</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Building robust models, recurrent optimization loops, and BPTT.</p>
            </div>
          </div>

          {/* Small Card 3 */}
          <div className="md:col-span-8 rounded-2xl bg-white border border-slate-200/60 overflow-hidden group hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div 
              className="h-44 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAFQ51KjUgk5qdyve14uAlArrpXgxVQmltNTG7J2dlNou_Mq80JHCYkPsFrWJWYIalGU4Y44u4lQhMAIFoi6LilqpKzrW2W0QlVrVcrr56UUtrk0n8XIT43Lce_DtfLBwhQ86zU6hqs1-_83ORQSrFz6Mf7BcpcHOOkZrKxV3BDe6fyHdW66xGI4vS7c4C3S2zbqtDgdMVqGBBw_XrYNPZyz6nCMiOY67JDCYe9lTIm6YctZblasJD_')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="p-8 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white">
              <div>
                <h3 className="font-sans text-xl text-slate-900 mb-2 font-bold group-hover:text-blue-600 transition-colors">Algorithmic Trading Fundamentals</h3>
                <p className="text-xs text-slate-500 max-w-md">Master the math behind modern financial markets with custom deep neural learning models.</p>
              </div>
              <button 
                onClick={() => onNavigate(Screen.Dashboard)}
                className="material-symbols-outlined text-blue-600 bg-blue-50 p-3.5 rounded-full hover:bg-blue-100 transition-all spring-hover flex-shrink-0"
              >
                arrow_forward
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-20 max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="font-sans text-2xl text-blue-600 font-bold">EduVerse</div>
            <p className="text-sm text-slate-500 max-w-sm">© 2026 EduVerse AI. Intelligence in Education. Crafted for cognitive clarity.</p>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <a href="#privacy" className="text-slate-500 hover:text-slate-900 transition-colors underline decoration-blue-200 underline-offset-4">Privacy Policy</a>
            <a href="#terms" className="text-slate-500 hover:text-slate-900 transition-colors underline decoration-blue-200 underline-offset-4">Terms of Service</a>
            <a href="#cookie" className="text-slate-500 hover:text-slate-900 transition-colors underline decoration-blue-200 underline-offset-4">Cookie Policy</a>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <a href="#accessibility" className="text-slate-500 hover:text-slate-900 transition-colors underline decoration-blue-200 underline-offset-4">Accessibility</a>
            <a href="#support" className="text-slate-500 hover:text-slate-900 transition-colors underline decoration-blue-200 underline-offset-4">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* Watch Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-sans text-2xl text-slate-900 font-bold mb-4">EduVerse Platform Tour</h3>
            <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden relative flex items-center justify-center border border-slate-200">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdM8-t_B1AyPJjeCjjeiNN6fl1rV-RvAfqXsLSO1rYWZ8r86XyRTMRGzX_86fQmGkfXrw1fuHvfBfkdzWcWyxlNYsY6PU2XCEOvs6qgXzDXRNILKCBdxm3rEPSi0s_ekrWhM77V_Tp71KxtRml6YyJCQkyHm7RFW1BxyOb9US_gX2bkB-AmVCqvzWw3_-xfn4abL3GpPryGuFxuZ3Zg2MAncrrmKbfjm5Y5GGWPZv3rP-9pQeUGDVc" 
                alt="Demo Thumbnail" 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
              />
              <button 
                onClick={() => {
                  setShowDemo(false);
                  onNavigate(Screen.Dashboard);
                }}
                className="relative z-10 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-200 pl-1"
              >
                <span className="material-symbols-outlined text-3xl">play_arrow</span>
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Explore our AI Tutor panel, custom progress widgets, and dynamic syllabus planners that will keep you motivated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
