const root = document.getElementById("ai-experience");

if (!root) {
  throw new Error("Missing ai-experience root");
}

const promptCards = [
  { icon: "✦", color: "purple", text: "Which candidate experience metrics improved most this year?" },
  { icon: "◌", color: "green", text: "Where are companies losing candidates in the hiring journey?" },
  { icon: "△", color: "amber", text: "How do top-performing TA teams differ from the benchmark average?" },
  { icon: "◫", color: "blue", text: "What are the biggest gaps between recruiter and candidate perception?" },
  { icon: "◇", color: "pink", text: "Which benchmark findings should a Head of Talent act on first?" },
];

const FOLLOW_UPS = [
  "Where do candidates lose confidence most?",
  "How do leading TA teams reduce drop-off?",
  "Where are recruiter and candidate perceptions misaligned?",
];

root.innerHTML = `
  <div class="query-zone" id="query-zone">
    <form class="search-wrap" id="ask-form">
      <input
        id="question-input"
        class="search-input"
        type="text"
        placeholder="Ask a question about benchmark trends, gaps, or top performers..."
        autocomplete="off"
        required
      />
      <button class="send-btn" type="submit" aria-label="Ask question">➤</button>
    </form>
    <div class="helper-text">Powered by benchmark evidence from Starred's 2026 report.</div>
    <div id="result-container" class="chat-thread"></div>
  </div>
  <div id="loading-container"></div>
  <div class="try-asking" id="try-asking">Try asking:</div>
  <div class="questions" id="questions"></div>
`;

const form = document.getElementById("ask-form");
const input = document.getElementById("question-input");
const loadingContainer = document.getElementById("loading-container");
const resultContainer = document.getElementById("result-container");
const questions = document.getElementById("questions");
const tryAsking = document.getElementById("try-asking");
const queryZone = document.getElementById("query-zone");

if (!form || !input || !loadingContainer || !resultContainer || !questions || !tryAsking || !queryZone) {
  throw new Error("Missing benchmark UI elements");
}

promptCards.forEach((card) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card prompt-card";
  button.innerHTML = `<span class="icon ${card.color}">${card.icon}</span><p>${card.text}</p>`;
  button.addEventListener("click", () => {
    input.value = card.text;
    form.requestSubmit();
  });
  questions.appendChild(button);
});

function setBusy(isBusy) {
  const searchWrap = form;
  if (isBusy) {
    searchWrap.classList.add("is-active");
    queryZone.classList.add("results-mode");
    tryAsking.classList.add("dimmed");
    questions.classList.add("dimmed");
    loadingContainer.innerHTML = `
      <div class="loading-indicator" role="status" aria-live="polite">
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
      </div>
    `;
    } else {
    loadingContainer.innerHTML = "";
  }
}

function streamText(target, text, speed = 13) {
  return new Promise((resolve) => {
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      target.textContent = text.slice(0, index);
      if (index >= text.length) {
        window.clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function pickIntro(seedText) {
  const variants = [
    "Here's what stands out from the benchmark data:",
    "A few benchmark patterns consistently stand out here.",
    "Based on the 2026 benchmark patterns, several signals emerge.",
  ];
  let hash = 0;
  for (let i = 0; i < seedText.length; i += 1) hash += seedText.charCodeAt(i);
  return variants[hash % variants.length];
}

function toInsightHeadline(headline) {
  if (!headline) return "Communication consistency appears to be the strongest confidence driver.";
  const text = headline.toLowerCase();
  if (text.includes("confidence") || text.includes("drop")) {
    return "Candidate confidence appears to dip most during interview coordination.";
  }
  if (text.includes("communication")) {
    return "Communication consistency appears to be the strongest confidence driver.";
  }
  if (text.includes("top") || text.includes("perform")) {
    return "Top-performing TA teams tend to reduce uncertainty earlier in the journey.";
  }
  return "Top-performing TA teams tend to reduce uncertainty earlier in the journey.";
}

async function renderAnswer(payload, question) {
  const bullets = Array.isArray(payload.bullets) ? payload.bullets : [];
  const intro = pickIntro(question);
  const insightHeadline = toInsightHeadline(payload.headline);
  const insightBody = payload.bullets?.[0]
    ? payload.bullets[0]
    : "Public benchmark evidence suggests opportunities to tighten experience consistency across hiring stages.";
  const insight = `${insightHeadline} ${insightBody}`;
  const implication = payload.takeaway || "For TA leaders, the biggest leverage point is improving clarity and ownership between stages.";

  const responseEl = document.createElement("article");
  responseEl.className = "ai-response message-enter";
  responseEl.innerHTML = `
    <div class="ai-response-head">
      <div class="ai-identity">
        <span class="ai-avatar">✦</span>
        <p class="ai-label">Starred AI Co-Pilot</p>
      </div>
      <div class="ai-tags">
        <span class="ai-tag">Based on benchmark patterns across enterprise TA teams</span>
        <span class="ai-tag">Source: Starred 2026 Benchmark Report</span>
      </div>
    </div>
    <p class="ai-intro"></p>
    <p class="ai-insight"></p>
    <ul class="ai-bullets">
      ${bullets.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <p class="ai-implication"><strong>What this means for TA leaders:</strong> <span class="ai-implication-text"></span></p>
    <div class="ai-followups">
      <p>Suggested follow-ups</p>
      <div class="ai-followup-list">
        ${FOLLOW_UPS.map((item) => `<button type="button" class="ai-followup-btn">→ ${item}</button>`).join("")}
      </div>
    </div>
  `;
  resultContainer.appendChild(responseEl);

  const introNode = responseEl.querySelector(".ai-intro");
  const insightNode = responseEl.querySelector(".ai-insight");
  const implicationNode = responseEl.querySelector(".ai-implication-text");

  if (introNode && insightNode && implicationNode) {
    introNode.classList.add("typing-cursor");
    await streamText(introNode, intro, 10);
    introNode.classList.remove("typing-cursor");
    insightNode.classList.add("typing-cursor");
    await streamText(insightNode, insight, 8);
    insightNode.classList.remove("typing-cursor");
    implicationNode.classList.add("typing-cursor");
    await streamText(implicationNode, implication, 7);
    implicationNode.classList.remove("typing-cursor");
  }

  responseEl.querySelectorAll(".ai-followup-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const followUpText = (button.textContent ?? "").replace(/^→\s*/, "");
      input.value = followUpText;
      form.requestSubmit();
    });
  });

  responseEl.scrollIntoView({ behavior: "smooth", block: "end" });
}

function renderError(message) {
  const errorEl = document.createElement("article");
  errorEl.className = "answer-card message-enter";
  errorEl.innerHTML = `
    <p class="answer-label">Unable to answer right now</p>
    <h3 class="answer-headline">We hit a temporary issue</h3>
    <p class="answer-takeaway">${message}</p>
  `;
  resultContainer.appendChild(errorEl);
}

function appendUserMessage(question) {
  const userEl = document.createElement("article");
  userEl.className = "user-message message-enter";
  userEl.innerHTML = `<p>${question}</p>`;
  resultContainer.appendChild(userEl);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  appendUserMessage(question);
  setBusy(true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error ?? "Request failed");
    }

    await renderAnswer(payload, question);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Please try again in a moment.";
    renderError(message);
  } finally {
    setBusy(false);
  }
});

const initialQuestion = new URLSearchParams(window.location.search).get("q");
if (initialQuestion && initialQuestion.trim()) {
  input.value = initialQuestion.trim();
  form.requestSubmit();
}
