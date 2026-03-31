import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Calendar, FileText, ArrowRight, Target, BrainCircuit, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AnalysisResult } from "@/src/services/geminiService";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";

interface AnalysisResultsProps {
  results: AnalysisResult;
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);

  const chartData = [
    { name: "Match", value: results.matchPercentage },
    { name: "Gap", value: 100 - results.matchPercentage },
  ];

  const COLORS = ["#3b82f6", "#e5e7eb"];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(results.optimizedResume);
      setCopied(true);
      toast.success("Optimized points copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy text. Please try again.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-12 px-4">
      {/* Scorecard Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/3 h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold text-gray-900">{results.matchPercentage}%</span>
            <span className="text-sm text-gray-500 font-medium">Match Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800 uppercase tracking-wider">Skills Found</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-green-700 text-xs font-medium rounded-md border border-green-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-800 uppercase tracking-wider">Skill Gaps</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.gaps.map((gap, i) => (
                  <span key={i} className="px-2 py-1 bg-white text-red-700 text-xs font-medium rounded-md border border-red-200">
                    {gap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Roadmap</h2>
        </div>
        <div className="prose prose-blue max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
          <ReactMarkdown>{results.roadmap}</ReactMarkdown>
        </div>
      </section>

      {/* Optimized Resume Section */}
      <section className="bg-gray-900 rounded-3xl p-8 shadow-xl text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-500 p-2 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Optimized Resume Points</h2>
        </div>
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-li:text-gray-300">
            <ReactMarkdown>{results.optimizedResume}</ReactMarkdown>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all shadow-lg",
              copied 
                ? "bg-green-600 text-white shadow-green-500/20" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
            )}
          >
            {copied ? (
              <>
                Copied! <Check className="w-5 h-5" />
              </>
            ) : (
              <>
                Copy Optimized Points <Copy className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
