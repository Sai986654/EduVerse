export interface User {
  fullName: string;
  email: string;
  role: string;
  interests: string[];
  streakDays: number;
  totalPoints: number;
  hoursSpent: number;
  coursesCompleted: number;
  skillsMastered: number;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  progressPercent: number;
  totalDuration: string;
  timeRemaining: string;
  image: string;
  isPopular?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  codeBlock?: string;
}

export interface StudyPlan {
  todayFocus: string;
  tasks: {
    title: string;
    done: boolean;
  }[];
}

export const initialUser: User = {
  fullName: "Alex Rivera",
  email: "alex@eduverse.ai",
  role: "STUDENT",
  interests: ["Software Engineering", "AI & Machine Learning", "UI/UX Design"],
  streakDays: 15,
  totalPoints: 8450,
  hoursSpent: 142,
  coursesCompleted: 12,
  skillsMastered: 34
};

export const coursesList: Course[] = [
  {
    id: "advanced-ui-architecture",
    title: "Advanced UI Architecture",
    subtitle: "Module 4: Component Systems",
    description: "Learn component composition, advanced states, and structural design systems.",
    instructorName: "Sarah Jenkins",
    instructorTitle: "Lead Designer at Figma",
    instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLF9R9j7LqVtN9bRB1Amunau6ZO3TZSOVZO4dQYxswuLpZBkbnS6W96Q6uOWKsvipWzS65C1nUdHlbf9f0uSdVHyoegEeMqGNSKxUJebxpY-KRd-jMPZjC1WQbyaHWtXwcB5bJJt97tg_GkmuM60nb_IAB7-XmyCk_thdrhcmczjQ4l78MO5PbJH2ZHQTB-MV0e-P0TAoTyF-1d9XZ_5in7GEP9hGOGcK7iMWlCmZSVjyQGg2_RjCk",
    progressPercent: 68,
    totalDuration: "8h 30m",
    timeRemaining: "2h 15m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqQk35VhH6iUQasBCbjNub4nlHpRmqBdjyLOunSaKFV79NsyrNZmHWQjppi3EFTsHFog-am3xvC2n84rrZzJ9MR9jBiTH0Bt9ffdhn1GB8AYuW3nQvn25GS1P0sYVu0zaRWV5pCGwYljHMIy43qY61sF8TBTjZS29CwK-hVTckRT-TNUoajxzqXrO-JPoP9Z2820FJSRLZ_T3NQAjYNJ-N46G1pRDtU5f9z1lndrkfmzJyQEroZAUZ",
    isPopular: true
  },
  {
    id: "micro-interactions",
    title: "Micro-Interactions Masterclass",
    subtitle: "Module 2: Spring Physics",
    description: "Create playful, high-performance interactions using physical animations.",
    instructorName: "Dr. Chen Wei",
    instructorTitle: "Interaction Specialist, Apple",
    instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYVlGvmNrRXFjDw2XrwpoM2w9Mj-uMODGpebZIp1DXUYcUKIEQGGrywC2D6gnEcRh299gD8yroJO4oy2ODVkz9swtBafWdFKLGmhmbkdsxIjM64jfws3cRWaAZRXCe-5oRQPt0aIC2uhm4EaOeE3ocO1jVCuIz096pDt7On7J0nK8ym2jE-w-E3lDpJoa_48iyWxHwsDy_VD-Dy0_-l68C56RQXK-qreXRkuT5zjpoDeEx2S74XW_6",
    progressPercent: 32,
    totalDuration: "6h 45m",
    timeRemaining: "4h 30m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWu3clluizf7YySy6XFC8kesVULFojRDhc8Yf6CUBOr3G1WLhkthcvWsL2sTS9D893Ipp-rLW89LzfjMzEmfIbiNJKunx7PN50mAaQO_tekFArQcrVwso9ZxzZMAaC1Ndb8TgVBOfKYfcWxvIlohdUyBMZVW8wk-D_zp5R79Dtl9hWuRQQlKxltROcSkwitqAYe9bKupEMWrmhyQGbpw3AGO6Md8rRyWqRsnNt1VNIifEm2TIOEFMx"
  },
  {
    id: "advanced-neural-architectures",
    title: "Advanced Neural Architectures",
    subtitle: "Module 3 • Lesson 4",
    description: "Deep dive into recurrent neural networks, gradient optimization, and sequence models.",
    instructorName: "Dr. Elena Rostova",
    instructorTitle: "Ex-AI Lead at OpenAI",
    instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYVlGvmNrRXFjDw2XrwpoM2w9Mj-uMODGpebZIp1DXUYcUKIEQGGrywC2D6gnEcRh299gD8yroJO4oy2ODVkz9swtBafWdFKLGmhmbkdsxIjM64jfws3cRWaAZRXCe-5oRQPt0aIC2uhm4EaOeE3ocO1jVCuIz096pDt7On7J0nK8ym2jE-w-E3lDpJoa_48iyWxHwsDy_VD-Dy0_-l68C56RQXK-qreXRkuT5zjpoDeEx2S74XW_6",
    progressPercent: 45,
    totalDuration: "12h 00m",
    timeRemaining: "6h 35m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwa1K0iUi32WYb2kKSEoBAbYbhZAsO0hBV-HdXMZclDDxJ1p7DHHLeNEkIHO4LSFoR6R4k08wIiLCx2t_7o7xP3MDGOIr1MWboTkVX68Cd34HhebvhEpOMmARQULlXY5L4WjpBbILwxJ5KlbWNWhJXPJw1r0OCWwTeEihMGYJDFT8f6_k1_Hn2IYWmaXub08ypUfLSPD5kdhmloJDgtQo0hm53gaQLyUqeL0EM4uCd6rSOmnoW117H"
  },
  {
    id: "spatial-design",
    title: "Spatial Design Principles for Web",
    subtitle: "Module 1: 3D Layouts",
    description: "Incorporate spatial layout and translucent overlays to construct depth and hierarchy.",
    instructorName: "Sarah Jenkins",
    instructorTitle: "Lead Designer at Figma",
    instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLF9R9j7LqVtN9bRB1Amunau6ZO3TZSOVZO4dQYxswuLpZBkbnS6W96Q6uOWKsvipWzS65C1nUdHlbf9f0uSdVHyoegEeMqGNSKxUJebxpY-KRd-jMPZjC1WQbyaHWtXwcB5bJJt97tg_GkmuM60nb_IAB7-XmyCk_thdrhcmczjQ4l78MO5PbJH2ZHQTB-MV0e-P0TAoTyF-1d9XZ_5in7GEP9hGOGcK7iMWlCmZSVjyQGg2_RjCk",
    progressPercent: 15,
    totalDuration: "5h 15m",
    timeRemaining: "4h 30m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvHxob7OAphWKS8AFw2by803IGI17N1m61ChYoW0zjMnLQP11b15WL63IB6_iJJwkpRxRjjQMI59bwU02gTLvyPEcg3yn6G1f8gIbvFszY1IsyXq-cWI-Zpt6HCCihkaF2WrsSxy0y5vdXZzEDuZ1kvTzqc1939CMeAa4ggYVEvQfYmwzAkoLMtBiNx6yio-08FPaA11FmjZQkBuJkDlH7Y0Ggs7UBle1TBsD2J6IG4Kd-Cw1dH5yN"
  },
  {
    id: "ai-workflows",
    title: "Integrating AI into Workflows",
    subtitle: "Module 3: Copilot Design",
    description: "Best practices for human-AI interaction design and system feedback loops.",
    instructorName: "Dr. Chen Wei",
    instructorTitle: "Interaction Specialist, Apple",
    instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYVlGvmNrRXFjDw2XrwpoM2w9Mj-uMODGpebZIp1DXUYcUKIEQGGrywC2D6gnEcRh299gD8yroJO4oy2ODVkz9swtBafWdFKLGmhmbkdsxIjM64jfws3cRWaAZRXCe-5oRQPt0aIC2uhm4EaOeE3ocO1jVCuIz096pDt7On7J0nK8ym2jE-w-E3lDpJoa_48iyWxHwsDy_VD-Dy0_-l68C56RQXK-qreXRkuT5zjpoDeEx2S74XW_6",
    progressPercent: 88,
    totalDuration: "7h 20m",
    timeRemaining: "55m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDev7lW4UL7Ux5EjAGtb4Bxnf9s2_4rtKCdrXrLJkJO2kxFFHfFo33KpgWd9k06ziZ0YBj30o_auIfQBQZZTwBkIlQSRzH-pecoMS22yLR1merw4xvKxH3u3p68qINoSLlZJQ_7Aku4sQddNOrU186b5gQa2vr3EyvvzvSF2JdplLVA9B-IL6OQJR7wZUfyGt-CAR0YXBOdTgxeQkGmqSuf8kH6x1ZbCOSoDbtwtCeFzT9ZiIc6zfrj"
  },
  {
    id: "ai-first-product-design",
    title: "AI-First Product Design",
    subtitle: "Bento Masterclass",
    description: "Learn to integrate LLMs into consumer experiences seamlessly.",
    instructorName: "Dr. Elena Rostova",
    instructorTitle: "Ex-Design Lead, Nexus",
    instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLF9R9j7LqVtN9bRB1Amunau6ZO3TZSOVZO4dQYxswuLpZBkbnS6W96Q6uOWKsvipWzS65C1nUdHlbf9f0uSdVHyoegEeMqGNSKxUJebxpY-KRd-jMPZjC1WQbyaHWtXwcB5bJJt97tg_GkmuM60nb_IAB7-XmyCk_thdrhcmczjQ4l78MO5PbJH2ZHQTB-MV0e-P0TAoTyF-1d9XZ_5in7GEP9hGOGcK7iMWlCmZSVjyQGg2_RjCk",
    progressPercent: 5,
    totalDuration: "14h 00m",
    timeRemaining: "13h 15m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdM8-t_B1AyPJjeCjjeiNN6fl1rV-RvAfqXsLSO1rYWZ8r86XyRTMRGzX_86fQmGkfXrw1fuHvfBfkdzWcWyxlNYsY6PU2XCEOvs6qgXzDXRNILKCBdxm3rEPSi0s_ekrWhM77V_Tp71KxtRml6YyJCQkyHm7RFW1BxyOb9US_gX2bkB-AmVCqvzWw3_-xfn4abL3GpPryGuFxuZ3Zg2MAncrrmKbfjm5Y5GGWPZv3rP-9pQeUGDVc",
    isPopular: true
  },
  {
    id: "quantum-computing",
    title: "Quantum Computing for Creators",
    subtitle: "Masterclass Edition",
    description: "Demystifying qubits for practical high-performance applications.",
    instructorName: "Dr. Chen Wei",
    instructorTitle: "Quantum Specialist",
    instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYVlGvmNrRXFjDw2XrwpoM2w9Mj-uMODGpebZIp1DXUYcUKIEQGGrywC2D6gnEcRh299gD8yroJO4oy2ODVkz9swtBafWdFKLGmhmbkdsxIjM64jfws3cRWaAZRXCe-5oRQPt0aIC2uhm4EaOeE3ocO1jVCuIz096pDt7On7J0nK8ym2jE-w-E3lDpJoa_48iyWxHwsDy_VD-Dy0_-l68C56RQXK-qreXRkuT5zjpoDeEx2S74XW_6",
    progressPercent: 0,
    totalDuration: "9h 30m",
    timeRemaining: "9h 30m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEZR7LYSscsjNc00bMW-BQ-FS86SmqtIOTDHUHKjtmmw-wyvObuVLoGo8o96ILmVFUaEedVB5bD9GubDTqcupu5UHQCR3lGBct97TAAfXq_pYT8QIrACDxIu1OCXGpWAj1cJWxnkVeWb16_LcLmI_OO1l5YxwslgVkCQS6fJFLUTYgLEA_8YSwIRNHoYiRluJszf0KRjJFSJ_Po7XaF02Yg4IzA7OmduAGAB0VJyPEU5yAjuFG28lC"
  },
  {
    id: "algorithmic-trading",
    title: "Algorithmic Trading Fundamentals",
    subtitle: "Quantitative Finance",
    description: "Master the math and computational architectures behind modern financial markets.",
    instructorName: "Sarah Jenkins",
    instructorTitle: "Quantitative Analyst",
    instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLF9R9j7LqVtN9bRB1Amunau6ZO3TZSOVZO4dQYxswuLpZBkbnS6W96Q6uOWKsvipWzS65C1nUdHlbf9f0uSdVHyoegEeMqGNSKxUJebxpY-KRd-jMPZjC1WQbyaHWtXwcB5bJJt97tg_GkmuM60nb_IAB7-XmyCk_thdrhcmczjQ4l78MO5PbJH2ZHQTB-MV0e-P0TAoTyF-1d9XZ_5in7GEP9hGOGcK7iMWlCmZSVjyQGg2_RjCk",
    progressPercent: 0,
    totalDuration: "11h 00m",
    timeRemaining: "11h 00m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFQ51KjUgk5qdyve14uAlArrpXgxVQmltNTG7J2dlNou_Mq80JHCYkPsFrWJWYIalGU4Y44u4lQhMAIFoi6LilqpKzrW2W0QlVrVcrr56UUtrk0n8XIT43Lce_DtfLBwhQ86zU6hqs1-_83ORQSrFz6Mf7BcpcHOOkZrKxV3BDe6fyHdW66xGI4vS7c4C3S2zbqtDgdMVqGBBw_XrYNPZyz6nCMiOY67JDCYe9lTIm6YctZblasJD_"
  }
];

export const initialChatHistory: ChatMessage[] = [
  {
    id: "w1",
    sender: "ai",
    text: "I see we're looking at Recurrent Neural Networks (RNNs) right now. Do you have any questions about how the hidden state is updated in this specific diagram?",
    timestamp: "12:45"
  },
  {
    id: "u1",
    sender: "user",
    text: "Yeah, why does it suffer from the vanishing gradient problem more than CNNs?",
    timestamp: "12:46"
  },
  {
    id: "w2",
    sender: "ai",
    text: "Excellent question. Because RNNs process sequences step-by-step, the gradients must be propagated back through time (BPTT).\n\nIf the sequence is long, multiplying small gradients repeatedly causes them to \"vanish\" exponentially.",
    codeBlock: "# Simplified gradient update\ndL_dh = np.dot(W_hh.T, dL_dh_next)\n# Repeated multiplication -> 0",
    timestamp: "12:47"
  }
];

export const defaultStudyPlan: StudyPlan = {
  todayFocus: "Master the Figma Pen Tool",
  tasks: [
    { title: "Review Bezier curve basics", done: true },
    { title: "Complete vector manipulation exercise", done: false },
    { title: "Take AI-generated pop quiz", done: false }
  ]
};
