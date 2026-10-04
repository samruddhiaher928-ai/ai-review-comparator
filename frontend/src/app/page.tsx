"use client";

import { useState } from "react";

type SummaryResult = {
  product: string;
  pros: string[];
  cons: string[];
  sentiment: "positive" | "mixed" | "negative";
  summary: string;
};

type CompareResult = {
  product_a: string;
  product_b: string;
  verdict: string;
  recommendation: string;
};

export default function Home() {
  const [tab, setTab] = useState<"single" | "compare">("single");
  const [product, setProduct] = useState("");
  const [reviews, setReviews] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [context, setContext] = useState("");
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [comparison, setComparison] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  async function callSummarize() {
    setLoading(true);
    setError("");
    setSummary(null);
    setComparison(null);
    try {
      const res = await fetch(`${API}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, reviews }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSummary(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function callCompare() {
    setLoading(true);
    setError("");
    setSummary(null);
    setComparison(null);
    try {
      const res = await fetch(`${API}/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_a: a, product_b: b, context }),
      });
      if (!res.ok) throw new Error(await res.text());
      setComparison(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    setProduct("iPhone 15");
    setReviews(
      "Great camera. Battery lasts all day. Expensive though. Screen scratches easily."
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">🔎 AI Review Comparator</h1>
          <p className="text-slate-500 text-sm mt-1">
            Instant AI-powered product insights
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setTab("single");
              setSummary(null);
              setComparison(null);
              setError("");
            }}
            className={`px-4 py-2 rounded font-medium ${
              tab === "single"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-300"
            }`}
          >
            Summarize
          </button>
          <button
            onClick={() => {
              setTab("compare");
              setSummary(null);
              setComparison(null);
              setError("");
            }}
            className={`px-4 py-2 rounded font-medium ${
              tab === "compare"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-300"
            }`}
          >
            Compare
          </button>
        </div>

        {tab === "single" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              callSummarize();
            }}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4"
          >
            <div className="flex justify-between items-center">
              <label className="font-medium">Product name</label>
              <button
                type="button"
                onClick={loadExample}
                className="text-blue-600 text-sm underline"
              >
                Try example
              </button>
            </div>
            <input
              className="w-full border border-slate-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. iPhone 15"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
            />
            <label className="font-medium">Reviews</label>
            <textarea
              className="w-full border border-slate-300 rounded p-3 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste reviews here..."
              value={reviews}
              onChange={(e) => setReviews(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>
        )}

        {tab === "compare" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              callCompare();
            }}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                className="border border-slate-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product A"
                value={a}
                onChange={(e) => setA(e.target.value)}
                required
              />
              <input
                className="border border-slate-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product B"
                value={b}
                onChange={(e) => setB(e.target.value)}
                required
              />
            </div>
            <textarea
              className="w-full border border-slate-300 rounded p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Context / review notes..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Comparing..." : "Compare"}
            </button>
          </form>
        )}

        {loading && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200 animate-pulse space-y-3">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{summary.product}</h2>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  summary.sentiment === "positive"
                    ? "bg-green-100 text-green-700"
                    : summary.sentiment === "negative"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {summary.sentiment}
              </span>
            </div>
            <p className="text-slate-700">{summary.summary}</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <h3 className="font-semibold text-green-700 mb-2">✅ Pros</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {summary.pros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-700 mb-2">❌ Cons</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {summary.cons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {comparison && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-2xl font-semibold">
              {comparison.product_a} vs {comparison.product_b}
            </h2>
            <div>
              <h3 className="font-semibold text-slate-700 mb-1">Verdict</h3>
              <p className="text-slate-700">{comparison.verdict}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-1">
                Recommendation
              </h3>
              <p className="text-slate-700">{comparison.recommendation}</p>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center text-slate-400 text-sm py-8 mt-12 border-t border-slate-200">
        Built with FastAPI + Next.js + Gemini
      </footer>
    </main>
  );
}