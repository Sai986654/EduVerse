import React, { useState, useEffect } from "react";
import { Screen, User, Course } from "./types";
import { initialUser, coursesList } from "./data";
import LandingView from "./components/LandingView";
import OnboardingView from "./components/OnboardingView";
import DashboardView from "./components/DashboardView";
import LearningPlayerView from "./components/LearningPlayerView";
import { getApiUrl } from "./utils/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Landing);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [selectedCourse, setSelectedCourse] = useState<Course>(coursesList[2]); // Default to Neural Arch

  // Load user profile on mount or email changes
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const response = await fetch(getApiUrl(`/api/user?email=${currentUser.email}`));
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    }
    loadUserProfile();
  }, [currentUser.email]);

  // Complete onboarding
  const handleOnboardingComplete = async (newUser: User) => {
    try {
      const response = await fetch(getApiUrl("/api/user"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          interests: newUser.interests,
          avatarUrl: (newUser as any).avatarUrl || ""
        })
      });
      if (response.ok) {
        const savedUser = await response.json();
        setCurrentUser(savedUser);
      } else {
        setCurrentUser(newUser);
      }
    } catch (err) {
      console.error("Failed to save onboarding user:", err);
      setCurrentUser(newUser);
    }
    setCurrentScreen(Screen.Dashboard);
  };

  // Navigating back to landing
  const handleBackToLanding = () => {
    setCurrentScreen(Screen.Landing);
  };

  // Selecting a course from the dashboard
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentScreen(Screen.LearningPlayer);
  };

  // Logging out
  const handleSignOut = () => {
    setCurrentUser(initialUser);
    setCurrentScreen(Screen.Landing);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {currentScreen === Screen.Landing && (
        <LandingView onNavigate={setCurrentScreen} />
      )}
      
      {currentScreen === Screen.Onboarding && (
        <OnboardingView 
          onComplete={handleOnboardingComplete} 
          onBackToLanding={handleBackToLanding} 
        />
      )}
      
      {currentScreen === Screen.Dashboard && (
        <DashboardView 
          user={currentUser} 
          onSelectCourse={handleSelectCourse} 
          onSignOut={handleSignOut} 
        />
      )}
      
      {currentScreen === Screen.LearningPlayer && (
        <LearningPlayerView 
          course={selectedCourse} 
          user={currentUser}
          onBackToDashboard={() => setCurrentScreen(Screen.Dashboard)} 
        />
      )}
    </div>
  );
}
