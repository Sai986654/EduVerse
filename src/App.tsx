import React, { useState } from "react";
import { Screen, User, Course } from "./types";
import { initialUser, coursesList } from "./data";
import LandingView from "./components/LandingView";
import OnboardingView from "./components/OnboardingView";
import DashboardView from "./components/DashboardView";
import LearningPlayerView from "./components/LearningPlayerView";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Landing);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [selectedCourse, setSelectedCourse] = useState<Course>(coursesList[2]); // Default to Neural Arch

  // Complete onboarding
  const handleOnboardingComplete = (newUser: User) => {
    setCurrentUser(newUser);
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
          onBackToDashboard={() => setCurrentScreen(Screen.Dashboard)} 
        />
      )}
    </div>
  );
}
