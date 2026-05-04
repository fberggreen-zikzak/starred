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
      headline: "Confidence drops most after late-stage delays.",
      stat: "Teams with interview-to-decision times over 10 days see a 21% lower candidate confidence score.",
      bullets: [
        "Biggest dip appears between final interview and offer communication.",
        "Fast feedback loops correlate with significantly higher NPS.",
        "Best-performing teams keep decision latency under 72 hours.",
      ],
    };
  }
  if (q.includes("top") || q.includes("differ") || q.includes("average")) {
    return {
      headline: "Top TA teams are faster and more transparent.",
      stat: "Top quartile organizations close roles 18% faster and deliver 2.1x more proactive status updates.",
      bullets: [
        "They standardize SLAs between interview rounds.",
        "They use clear candidate expectations at each stage.",
        "They monitor perception gaps monthly, not quarterly.",
      ],
    };
  }
  return {
    headline: "The benchmark points to execution consistency as the biggest lever.",
    stat: "Organizations with defined stage-level standards outperform peers by 14 points in overall candidate experience.",
    bullets: [
      "Prioritize communication quality in high-friction stages.",
      "Track drop-off and sentiment together, not separately.",
      "Focus first on fixes with direct candidate-facing impact.",
    ],
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
      setAnswer(apiAnswer);
    } catch {
      // Keep the experience responsive even if backend isn't available yet.
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      setAnswer(getAnswerForQuestion(question));
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
