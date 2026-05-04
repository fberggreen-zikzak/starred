import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const API_URL = window.AI_ASK_ENDPOINT || "/api/ask";

const QUESTION_BANK = [
  {
    text: "Which candidate experience metrics improved most this year?",
    tags: ["improved", "metrics", "year", "trend"],
  },
  {
    text: "Where are companies losing candidates in the hiring journey?",
    tags: ["losing", "journey", "drop", "funnel", "stage"],
  },
  {
    text: "How do top-performing TA teams differ from the benchmark average?",
    tags: ["top", "teams", "average", "performance"],
  },
  {
    text: "What are the biggest gaps between recruiter and candidate perception?",
    tags: ["gaps", "perception", "recruiter", "candidate"],
  },
  {
    text: "Which benchmark findings should a Head of Talent act on first?",
    tags: ["head", "talent", "priority", "first"],
  },
  {
    text: "What predicts a future drop in candidate confidence?",
    tags: ["predict", "confidence", "risk"],
  },
  {
    text: "Which interview stages show the highest negative sentiment?",
    tags: ["interview", "stages", "sentiment"],
  },
];

function getAnswerForQuestion(question) {
  const q = question.toLowerCase();
  if (q.includes("confidence") || q.includes("losing") || q.includes("drop")) {
    return {
      headline: "Late-stage delays are the sharpest confidence risk.",
      bullets: [
        "Confidence drops most between final interview and decision communication.",
        "Teams with decision latency above 10 days report materially lower candidate trust.",
        "Faster decision updates consistently correlate with better acceptance outcomes.",
      ],
      takeaway:
        "For TA leaders: set a final-stage SLA and enforce manager response times before changing tooling.",
    };
  }
  if (q.includes("top") || q.includes("differ") || q.includes("average")) {
    return {
      headline: "Top-performing TA teams win on execution consistency.",
      bullets: [
        "They run tighter stage-to-stage SLAs and fewer handoff delays.",
        "They deliver more proactive candidate communication at each stage.",
        "They review recruiter-candidate perception gaps monthly and act quickly.",
      ],
      takeaway:
        "For TA leaders: prioritize operational discipline first; process clarity drives more uplift than new process complexity.",
    };
  }
  return {
    headline: "Execution consistency is the strongest cross-benchmark lever.",
    bullets: [
      "Teams with stage-level standards outperform peers on candidate experience.",
      "The largest performance gaps appear in communication speed and expectation setting.",
      "Candidate sentiment and funnel conversion move together when stage execution improves.",
    ],
    takeaway:
      "For TA leaders: start with one high-friction stage, set clear standards, and track sentiment plus conversion together.",
  };
}

function normalizeApiAnswer(payload) {
  if (!payload || typeof payload !== "object") return null;
  const headline = payload.headline || payload.title || payload.insight;
  const bullets = Array.isArray(payload.bullets) ? payload.bullets : payload.points;
  const takeaway = payload.takeaway || payload.action || payload.nextStep;

  if (!headline || !Array.isArray(bullets) || !takeaway) return null;
  return { headline, bullets: bullets.slice(0, 3), takeaway };
}

async function fetchBenchmarkAnswer(question) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  const payload = await response.json();
  const normalized = normalizeApiAnswer(payload);

  if (!normalized) {
    throw new Error("API response shape is invalid");
  }

  return normalized;
}

function SuggestionList({ suggestions, onSelect }) {
  return React.createElement(
    "div",
    { className: "suggestions-popover" },
    suggestions.map((item) =>
      React.createElement(
        "button",
        {
          key: item.text,
          type: "button",
          className: "suggestion-item",
          onClick: () => onSelect(item.text),
        },
        item.text,
      ),
    ),
  );
}

function AnswerCard({ answer }) {
  const question = (answer.question || "").toLowerCase();
  let ctaText = "Try Starred for free \u2192";
  let ctaVariant = "default";
  let ctaIcon = "\u2726";

  if (question.includes("confidence") || question.includes("drop") || question.includes("losing")) {
    ctaText = "See how Starred helps reduce candidate drop-off \u2192";
    ctaVariant = "risk";
    ctaIcon = "\u26A0";
  } else if (
    question.includes("recruiter") ||
    question.includes("candidate perception") ||
    question.includes("gap")
  ) {
    ctaText = "See how Starred surfaces perception gaps \u2192";
    ctaVariant = "gap";
    ctaIcon = "\u25C8";
  } else if (
    question.includes("top") ||
    question.includes("average") ||
    question.includes("benchmark")
  ) {
    ctaText = "See how Starred benchmarks your hiring performance \u2192";
    ctaVariant = "benchmark";
    ctaIcon = "\u25A5";
  } else if (question.includes("head of talent") || question.includes("prioritize")) {
    ctaText = "See how Starred helps prioritize TA actions \u2192";
    ctaVariant = "priority";
    ctaIcon = "\u2713";
  }

  return React.createElement(
    "section",
    { className: "answer-card" },
    React.createElement("p", { className: "answer-label" }, "Benchmark answer"),
    React.createElement("h3", { className: "answer-headline" }, answer.headline),
    React.createElement(
      "ul",
      { className: "answer-list" },
      answer.bullets.map((item) => React.createElement("li", { key: item }, item)),
    ),
    React.createElement(
      "p",
      { className: "answer-takeaway" },
      React.createElement("strong", null, "Practical takeaway: "),
      answer.takeaway,
    ),
    React.createElement(
      "a",
      {
        className: `answer-cta answer-cta--${ctaVariant}`,
        href: "https://www.starred.com/request-a-demo",
        target: "_blank",
        rel: "noreferrer",
      },
      `${ctaIcon} ${ctaText}`,
    ),
  );
}

function App() {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState(null);

  const isTyping = input.trim().length > 0;
  const isActive = focused || isLoading;
  const isResultsMode = Boolean(submittedQuestion);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedInput(input.trim().toLowerCase()), 200);
    return () => clearTimeout(timeout);
  }, [input]);

  const suggestions = useMemo(() => {
    if (!debouncedInput) return [];
    const words = debouncedInput.split(/\s+/).filter(Boolean);
    return QUESTION_BANK.map((item) => {
      const text = item.text.toLowerCase();
      const scoreFromText = words.reduce(
        (acc, word) => acc + (text.includes(word) ? 2 : 0),
        0,
      );
      const scoreFromTags = words.reduce(
        (acc, word) => acc + (item.tags.some((tag) => tag.includes(word)) ? 1 : 0),
        0,
      );
      return { ...item, score: scoreFromText + scoreFromTags };
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [debouncedInput]);

  const showSuggestions = focused && isTyping && !isLoading && suggestions.length > 0;
  const showHelper = focused && isTyping;

  const handleSubmit = (value) => {
    void (async () => {
    const question = (value ?? input).trim();
    if (!question) return;
    setInput(question);
    setSubmittedQuestion(question);
    setIsLoading(true);
    setAnswer(null);

    try {
      const apiAnswer = await fetchBenchmarkAnswer(question);
      setAnswer({ ...apiAnswer, question });
    } catch {
      // Keep the experience responsive even if backend isn't available yet.
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      setAnswer({ ...getAnswerForQuestion(question), question });
    } finally {
      setIsLoading(false);
    }
    })();
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "hero-copy" },
      React.createElement("div", { className: "pill" }, "AI CO-PILOT"),
      React.createElement(
        "h1",
        null,
        "Get answers from the",
        React.createElement("br"),
        React.createElement("span", { className: "gradient-word" }, "2026 Benchmark Report"),
      ),
      React.createElement(
        "p",
        { className: "subtitle" },
        "Explore insights from our annual Candidate Experience Benchmark Report",
      ),
    ),
    React.createElement(
      "div",
      { className: `query-zone ${isResultsMode ? "results-mode" : ""}` },
      React.createElement(
        "form",
        {
          className: `search-wrap ${isActive ? "is-active" : ""} ${isTyping ? "is-typing" : ""}`,
          onSubmit: (event) => {
            event.preventDefault();
            handleSubmit();
          },
        },
        React.createElement("input", {
          className: "search-input",
          type: "text",
          value: input,
          placeholder: "Ask a question about benchmark trends, gaps, or top performers...",
          "aria-label": "Ask a question",
          onFocus: () => setFocused(true),
          onBlur: () => {
            window.setTimeout(() => setFocused(false), 120);
          },
          onChange: (event) => setInput(event.target.value),
        }),
        React.createElement(
          "button",
          { className: "send-btn", type: "submit", "aria-label": "Send question" },
          "\u27A4",
        ),
      ),
      showHelper &&
        React.createElement("p", { className: "helper-text" }, "Based on 2026 Benchmark data"),
      showSuggestions &&
        React.createElement(SuggestionList, {
          suggestions,
          onSelect: (text) => handleSubmit(text),
        }),
      isLoading &&
        React.createElement(
          "div",
          { className: "loading-indicator" },
          React.createElement("span", { className: "loading-dot" }),
          React.createElement("span", { className: "loading-dot" }),
          React.createElement("span", { className: "loading-dot" }),
        ),
      answer && React.createElement(AnswerCard, { answer }),
    ),
    React.createElement(
      "div",
      { className: `try-asking ${showSuggestions ? "dimmed" : ""}` },
      "Try asking:",
    ),
    React.createElement(
      "section",
      { className: `questions ${showSuggestions ? "dimmed" : ""}` },
      QUESTION_BANK.slice(0, 5).map((item, idx) =>
        React.createElement(
          "article",
          { className: "card", key: item.text },
          React.createElement(
            "span",
            {
              className: `icon ${
                ["purple", "green", "amber", "blue", "pink"][idx % 5]
              }`,
            },
            ["\u2301", "\u23F1", "\u25B3", "\u25A5", "\u2727"][idx % 5],
          ),
          React.createElement("p", null, item.text),
        ),
      ),
    ),
    React.createElement(
      "footer",
      { className: "hero-footer" },
      React.createElement("p", null, "Ready to ask better questions about your hiring experience?"),
      React.createElement("a", { href: "#" }, "See Starred AI Co-Pilot in action \u2192"),
    ),
  );
}

const root = createRoot(document.getElementById("ai-experience"));
root.render(React.createElement(App));
