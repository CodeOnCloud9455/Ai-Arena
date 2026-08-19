import ReactMarkdown from "react-markdown";
import {
  User,
  Cpu,
  Scale,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function SolutionCard({ title, content, score, isWinner }) {
  return (
    <div
      className={`flex flex-col flex-1 rounded-xl overflow-hidden border ${isWinner
        ? "border-snitch-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]"
        : "border-snitch-border"
        } bg-snitch-gray-light`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${isWinner
          ? "border-snitch-gold/30 bg-snitch-gold/5"
          : "border-snitch-border bg-snitch-gray"
          }`}
      >
        <div className="flex items-center gap-2">
          <Cpu
            className={`w-5 h-5 ${isWinner ? "text-snitch-gold" : "text-gray-400"
              }`}
          />

          <h3
            className={`font-semibold ${isWinner ? "text-snitch-gold" : "text-gray-200"
              }`}
          >
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isWinner && (
            <span className="text-xs font-bold text-snitch-dark bg-snitch-gold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Winner
            </span>
          )}

          <div
            className={`text-lg font-bold ${isWinner ? "text-snitch-gold" : "text-gray-300"
              }`}
          >
            {score}/10
          </div>
        </div>
      </div>

      {/* Solution Content */}
      <div className="p-5 overflow-y-auto max-h-[400px] text-sm text-gray-300 scrollbar-thin scrollbar-thumb-snitch-border scrollbar-track-transparent">
        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-snitch-darker prose-pre:border prose-pre:border-snitch-border prose-pre:rounded-lg max-w-none">
          <ReactMarkdown>
            {content || "No solution generated."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default function MessageBlock({ data }) {
  // ==========================================
  // SAFETY CHECK
  // ==========================================

  if (!data) {
    return null;
  }

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (data.status === "loading") {
    return (
      <div className="w-full max-w-6xl mx-auto py-8 px-4 flex flex-col gap-6 animate-pulse">
        <div className="self-end max-w-3xl bg-snitch-gray border border-snitch-border rounded-2xl rounded-tr-sm p-5 shadow-md">
          <p className="text-gray-200 whitespace-pre-wrap">
            {data.problem || "Processing..."}
          </p>
        </div>

        <div className="self-start flex items-center gap-3 text-snitch-gold">
          <Cpu className="w-5 h-5 animate-spin-slow" />

          <span className="text-sm font-medium tracking-wide">
            Generating competing solutions & judging...
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (data.status === "error") {
    return (
      <div className="w-full max-w-6xl mx-auto py-8 px-4 flex flex-col gap-6">
        {/* User Problem */}
        <div className="self-end max-w-3xl bg-snitch-gray-light border border-snitch-border rounded-2xl rounded-tr-sm p-6 shadow-md flex gap-4 items-start">
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Prompt
            </h4>

            <p className="text-gray-100 whitespace-pre-wrap text-[15px] leading-relaxed">
              {data.problem || "No problem provided."}
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-snitch-dark flex items-center justify-center flex-shrink-0 border border-snitch-border">
            <User className="w-4 h-4 text-snitch-gold" />
          </div>
        </div>

        {/* Error */}
        <div className="self-start flex items-center gap-3 text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-lg max-w-2xl">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />

          <span className="text-sm font-medium">
            {data.error || "An error occurred during generation."}
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // GRAPH DATA
  // ==========================================

  const problem = data.problem || "";
  const solution_1 = data.solution_1 || "";
  const solution_2 = data.solution_2 || "";

  const judge = data.judge;

  // ==========================================
  // SAFE JUDGE VALUES
  // ==========================================

  const solution1Score = judge?.solution_1_score ?? 0;
  const solution2Score = judge?.solution_2_score ?? 0;

  const solution1Reasoning =
    judge?.solution_1_reasoning || "No reasoning available.";

  const solution2Reasoning =
    judge?.solution_2_reasoning || "No reasoning available.";

  // ==========================================
  // WINNER LOGIC
  // ==========================================

  const s1Winner = solution1Score > solution2Score;
  const s2Winner = solution2Score > solution1Score;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col gap-8">
      {/* ==========================================
          USER PROBLEM
      ========================================== */}

      <div className="self-end max-w-3xl bg-snitch-gray-light border border-snitch-border rounded-2xl rounded-tr-sm p-6 shadow-md flex gap-4 items-start">
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Prompt
          </h4>

          <p className="text-gray-100 whitespace-pre-wrap text-[15px] leading-relaxed">
            {problem || "No problem provided."}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-snitch-dark flex items-center justify-center flex-shrink-0 border border-snitch-border">
          <User className="w-4 h-4 text-snitch-gold" />
        </div>
      </div>

      {/* ==========================================
          ARENA
      ========================================== */}

      <div className="w-full flex flex-col gap-6">
        {/* Arena Heading */}

        <div className="flex items-center gap-3 ml-2">
          <Scale className="w-5 h-5 text-snitch-gold" />

          <h3 className="text-lg font-medium text-gray-200 tracking-wide">
            Arena Evaluation
          </h3>
        </div>

        {/* ==========================================
            SOLUTIONS
        ========================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SolutionCard
            title="Solution Alpha"
            content={solution_1}
            score={solution1Score}
            isWinner={s1Winner}
          />

          <SolutionCard
            title="Solution Beta"
            content={solution_2}
            score={solution2Score}
            isWinner={s2Winner}
          />
        </div>

        {/* ==========================================
            JUDGE VERDICT
        ========================================== */}

        <div className="bg-snitch-darker border border-snitch-border rounded-xl p-6 mt-2 relative overflow-hidden">
          {/* Gold Line */}

          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-snitch-gold/50 to-transparent"></div>

          {/* Heading */}

          <h4 className="text-sm font-semibold text-snitch-gold uppercase tracking-widest mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />

            Judge Verdict
          </h4>

          {/* Reasoning */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
            {/* Solution 1 */}

            <div className="flex flex-col gap-2">
              <span className="text-gray-500 font-medium tracking-wide">
                Alpha Reasoning
              </span>

              <p className="text-gray-300 leading-relaxed bg-snitch-gray p-4 rounded-lg border border-snitch-border/50">
                {solution1Reasoning}
              </p>
            </div>

            {/* Solution 2 */}

            <div className="flex flex-col gap-2">
              <span className="text-gray-500 font-medium tracking-wide">
                Beta Reasoning
              </span>

              <p className="text-gray-300 leading-relaxed bg-snitch-gray p-4 rounded-lg border border-snitch-border/50">
                {solution2Reasoning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}