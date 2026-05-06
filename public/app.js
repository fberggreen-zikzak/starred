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
    <div id="result-container"></div>
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

function renderAnswer(payload) {
  const bullets = Array.isArray(payload.bullets) ? payload.bullets : [];
  resultContainer.innerHTML = `
    <article class="answer-card">
      <p class="answer-label">Benchmark answer</p>
      <h3 class="answer-headline">${payload.headline ?? "Benchmark insight"}</h3>
      <ul class="answer-list">
        ${bullets.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <p class="answer-takeaway">${payload.takeaway ?? ""}</p>
      <a class="answer-cta answer-cta--benchmark" href="#">Explore benchmark methodology →</a>
    </article>
  `;
}

function renderError(message) {
  resultContainer.innerHTML = `
    <article class="answer-card">
      <p class="answer-label">Unable to answer right now</p>
      <h3 class="answer-headline">We hit a temporary issue</h3>
      <p class="answer-takeaway">${message}</p>
    </article>
  `;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  resultContainer.innerHTML = "";
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

    renderAnswer(payload);
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
