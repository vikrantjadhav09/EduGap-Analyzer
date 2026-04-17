/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ResumeUpload } from "./components/ResumeUpload";
import { AnalysisResults } from "./components/AnalysisResults";
import { analyzeResume, AnalysisResult } from "./services/geminiService";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { BrainCircuit, Sparkles, Target, ArrowRight, Loader2, FileText, LayoutDashboard, LogIn, LogOut, History, User as UserIcon, Trash2, Calendar } from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  handleFirestoreError,
  OperationType
} from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<(AnalysisResult & { id: string, createdAt: any })[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);

      if (currentUser) {
        // Ensure user document exists
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            displayName: currentUser.displayName || "Anonymous",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",
            role: "user"
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && isAuthReady) {
      const q = query(
        collection(db, "analyses"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any;
        setHistory(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "analyses");
      });

      return () => unsubscribe();
    }
  }, [user, isAuthReady]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error("Login error:", error);
      const msg = error?.message || error?.code || error?.toString() || "Unknown error";
      toast.error(`Failed to login: ${msg}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      reset();
    } catch (error: any) {
      console.error("Logout error:", error);
      const msg = error?.message || error?.code || error?.toString() || "Unknown error";
      toast.error(`Failed to logout: ${msg}`);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) {
      toast.error("Please upload your resume first.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please provide a job description or target role.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeResume(resumeText, jobDescription);
      setResults(analysis);

      if (user) {
        // Save to history
        await addDoc(collection(db, "analyses"), {
          uid: user.uid,
          resumeText,
          jobDescription,
          ...analysis,
          createdAt: Timestamp.now()
        });
      }

      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      const msg = error?.message || error?.toString() || "Unknown error";
      toast.error(`Failed to analyze resume: ${msg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResumeText(null);
    setJobDescription("");
    setResults(null);
    setShowHistory(false);
  };

  const selectFromHistory = (item: any) => {
    setResults(item);
    setShowHistory(false);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Toaster position="top-center" richColors />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="bg-blue-600 p-2 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">EduGap-Analyzer</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <History className="w-4 h-4" /> History
                </button>
                <div className="h-6 w-px bg-gray-200 mx-2" />
                <div className="flex items-center gap-3">
                  <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-8 h-8 rounded-full border border-gray-200" />
                  <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Login with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <History className="w-6 h-6 text-blue-600" /> Your Analysis History
                </h2>
                <button onClick={() => setShowHistory(false)} className="text-sm font-medium text-gray-500 hover:text-gray-900">Back to Analyzer</button>
              </div>

              <div className="grid gap-4">
                {history.length > 0 ? (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => selectFromHistory(item)}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-md">
                            {item.jobDescription.substring(0, 60)}...
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> {item.createdAt?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{item.matchPercentage}%</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Match Score</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No history found. Start analyzing to see your progress!</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : !results ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100"
                >
                  <Sparkles className="w-4 h-4" /> Powered by Gemini 3 Flash
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                  Bridge the gap between your <span className="text-blue-600">Resume</span> and your <span className="text-blue-600">Dream Job</span>
                </h1>
                <p className="text-xl text-gray-500 font-medium">
                  Upload your resume, paste a job description, and get a personalized 7-day's to 30-day's learning roadmap to land the role.
                </p>
              </div>

              {/* Input Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Resume Upload Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold">1. Your Resume</h2>
                  </div>
                  <ResumeUpload onUpload={setResumeText} />
                </div>

                {/* Job Description Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold">2. Target Role / JD</h2>
                  </div>
                  <div className="space-y-4">
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the LinkedIn Job Description or type your target role (e.g., 'Senior Frontend Engineer at Google')..."
                      className="w-full h-[150px] p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm font-medium placeholder:text-gray-400"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Company (e.g., Google)"
                        id="company-name"
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Role (e.g., Java Dev)"
                        id="role-name"
                        className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        onClick={async () => {
                          const company = (document.getElementById("company-name") as HTMLInputElement).value;
                          const role = (document.getElementById("role-name") as HTMLInputElement).value;
                          if (!company || !role) {
                            toast.error("Please provide both company and role.");
                            return;
                          }
                          toast.info(`Fetching job description for ${role} at ${company}...`);
                          try {
                            const jd = await (await import("./services/geminiService")).fetchJobDescription(company, role);
                            setJobDescription(jd);
                            toast.success("Job description fetched!");
                          } catch (err: any) {
                            console.error("Fetch JD error:", err);
                            const msg = err?.message || err?.toString() || "Unknown error";
                            toast.error(`Failed to fetch job description: ${msg}`);
                          }
                        }}
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
                      >
                        Fetch JD
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !resumeText || !jobDescription.trim()}
                  className={cn(
                    "group relative flex items-center gap-3 px-10 py-5 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
                    isAnalyzing ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" /> Analyzing your profile...
                    </>
                  ) : (
                    <>
                      Generate My Roadmap <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between max-w-5xl mx-auto px-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Career Roadmap</h1>
                </div>
                <button
                  onClick={reset}
                  className="text-sm font-bold text-gray-500 hover:text-gray-900 bg-white px-6 py-2.5 rounded-full border border-gray-200 shadow-sm transition-all"
                >
                  Start Over
                </button>
              </div>
              <AnalysisResults results={results} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BrainCircuit className="w-5 h-5 text-blue-600" />
            <span className="font-bold">EduGap-Analyzer</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">© 2026 EduGap-Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

