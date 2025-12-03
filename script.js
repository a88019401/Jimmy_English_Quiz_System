const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  //difficulty = document.querySelector("#difficulty"),
  //timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

let time = 30,
  timer;
let questions = [];
let currentQuestion = 1;
let score = 0;
let selectedCategory = "";
let userName = ""; // 使用者名字
let userAnswers = [];
function loadingAnimation() {
  if (!startBtn) return;
  startBtn.disabled = true;
  startBtn.textContent = "準備題目中…";

  let dotCount = 0;
  const maxDots = 3;

  const intervalId = setInterval(() => {
    if (!startBtn) {
      clearInterval(intervalId);
      return;
    }
    dotCount = (dotCount + 1) % (maxDots + 1);
    const dots = "．".repeat(dotCount);
    startBtn.textContent = "準備題目中" + dots;
  }, 400);

  // 約 1.5 秒後停止動畫（真正開始顯示題目）
  setTimeout(() => {
    clearInterval(intervalId);
  }, 1500);
}
// === 開始測驗 ===
const startQuiz = () => {
  const nameInput = document.querySelector("#user-name");
  if (!nameInput || nameInput.value.trim() === "") {
    alert("請輸入你的名字再開始測驗！");
    return;
  }

  // 記錄開始時間與顯示用類別文字
  window.__quizStartedAt = Date.now();
  selectedCategory =
    category.options[category.selectedIndex]?.textContent || category.value;

  userName = nameInput.value.trim();
  console.log("userName:", userName, "selectedCategory:", selectedCategory);

  loadingAnimation();


  // 使用自訂題庫
  const cat = category.value;
  if (cat === "HanLinB1L3L4test") {
    questions = B1L3L4_hinLin;
  } else if (cat === "HanLinB3L3L4test") {
    questions = B3L3L4_hinLin;
  } else if (cat === "B5L3L4test") {
    questions = B5L3L4_all;
  } else if (cat === "timeDay") {
    questions = timeAndDayGrammarQuestions;
  } else {
    questions = [
      ...HanLinB2L3L4,
      ...HanLinB4L3L4,
    ];
  }
  console.log("category value:", cat);

  // 取選擇的題數
  const num = parseInt(numQuestions.value, 10);
  // 隨機抽題
  questions = questions.sort(() => Math.random() - 0.5).slice(0, num);
  console.log("picked questions:", questions);

  setTimeout(() => {
    startScreen.classList.add("hide");
    quiz.classList.remove("hide");
    currentQuestion = 1;
    showQuestion(questions[0]);
  }, 1000);
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");
  const questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [...question.incorrect_answers, question.correct_answer];
  answersWrapper.innerHTML = "";
  const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
  shuffledAnswers.forEach((answer, index) => {
    const div = document.createElement("div");
    div.classList.add("answer");
    div.innerHTML = `
      <span class="text">(${String.fromCharCode(65 + index)}) ${answer}</span>
      <span class="checkbox">
        <i class="fas fa-check"></i>
      </span>
    `;
    answersWrapper.appendChild(div);
  });

  questionNumber.innerHTML = `
    Question <span class="current">${currentQuestion}</span>
    <span class="total">/${questions.length}</span>
  `;

  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("selected")) {
        answersDiv.forEach((answer) =>
          answer.classList.remove("selected")
        );
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
  submitBtn.disabled = true;
};

const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  const currentQuestionData = questions[currentQuestion - 1];

  let userAnswer = "No Answer";
  if (selectedAnswer) {
    userAnswer = selectedAnswer.querySelector(".text").innerHTML.trim();
    userAnswer = userAnswer.replace(/^\([A-D]\)\s/, ""); // 去掉 (A) 前綴
  }

  // 紀錄作答
  userAnswers.push({
    question: currentQuestionData.question,
    correctAnswer: currentQuestionData.correct_answer,
    userAnswer: userAnswer,
    isCorrect: userAnswer === currentQuestionData.correct_answer,
  });

  if (userAnswer === currentQuestionData.correct_answer) {
    score++;
  }

  showCorrectAnswer(currentQuestionData.correct_answer);
};

const showCorrectAnswer = (correctAnswer) => {
  const answersDiv = document.querySelectorAll(".answer");

  answersDiv.forEach((answer) => {
    const text = answer.querySelector(".text").innerHTML.trim();
    const pureText = text.replace(/^\([A-D]\)\s/, "");
    if (pureText === correctAnswer) {
      answer.classList.add("correct");
    } else if (answer.classList.contains("selected")) {
      answer.classList.add("wrong");
    }
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/ ${questions.length}`;
    // 剛進結算畫面時：先把「重新測驗」鎖起來，避免學生狂按
  setRestartButtonState(false, "成績同步中…");

  // 顯示名字
  const userNameDisplay = document.querySelector(".user-name-display");
  userNameDisplay.innerHTML = `你好, ${userName}！`;
  console.log("userName:", userName);

  // 類別顯示
  const categoryDisplay = document.querySelector(".category-display");
  categoryDisplay.innerHTML = `來回顧一下吧～ ${selectedCategory}`;
  console.log("selectedCategory:", selectedCategory);

  // 顯示作答詳情
  const answerDetails = document.querySelector(".answer-details");
  answerDetails.innerHTML = "";
  userAnswers.forEach((answer, index) => {
    const isCorrectClass = answer.isCorrect ? "correct-answer" : "wrong-answer";
    answerDetails.innerHTML += `
      <div class="answer-detail ${isCorrectClass}">
        <p><strong>第 ${index + 1} 題</strong></p>
        <p>${answer.question}</p>
        <p>你的答案: ${answer.userAnswer}</p>
        <p><strong>正確答案:</strong> ${answer.correctAnswer}</p>
      </div>
      <hr>
    `;
  });

  // === 組成要上傳後端的 payload ===
  const payload = {
    userName,
    category: document.querySelector("#category")?.value || "",
    total: questions.length,
    score,
    answers: userAnswers,
    startedAt: window.__quizStartedAt || null,
    endedAt: Date.now(),
    durationSec: window.__quizStartedAt
      ? Math.round((Date.now() - window.__quizStartedAt) / 1000)
      : null,
  };

  // 呼叫後端（此函式會在下面被我們實作，改成 Google Sheet）
  if (window.saveAttemptToFirestore) {
    window.saveAttemptToFirestore(payload);
  } else {
    console.warn("saveAttemptToFirestore 未載入，先略過上傳");
  }
};

const restartBtn = document.querySelector(".restart");

// 統一控制「重新測驗」按鈕狀態的小工具
function setRestartButtonState(enabled, label) {
  if (!restartBtn) return;
  restartBtn.disabled = !enabled;
  if (label) restartBtn.textContent = label;
}

// 點擊重新測驗：重新整理頁面
restartBtn.addEventListener("click", () => {
  if (restartBtn.disabled) return; // 保險：真的 disabled 就不要動作
  window.location.reload();
});


// === Google Sheets 版成績上傳與排行榜 ===
// 請將下面這個網址換成你自己的 Apps Script Web App URL
// 例如：https://script.google.com/macros/s/XXXXXXXXXXXX/exec
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbx0QJRi1Kt0dNJAsHskq_toDOKy6oYlCuvyeUsq_gl5pEu69ovRuWdvkPExw8Sh-1xTwg/exec";
// 將成績寫入 Google 試算表
async function saveScoreToSheet(payload) {
  // 從頁面上讀取學生基本資料
  const nameInput = document.getElementById("user-name");
  const schoolInput = document.getElementById("user-school");
  const gradeInput = document.getElementById("user-grade");

  const name = nameInput ? nameInput.value.trim() : "";
  const school = schoolInput ? schoolInput.value.trim() : "";
  const grade = gradeInput ? gradeInput.value.trim() : "";

  if (!name) {
    // 理論上在 startQuiz 已經檢查過一次
    alert("請先輸入名字再開始測驗喔！");
    throw new Error("缺少姓名");
  }

  const body = {
    name,
    school,
    grade,
    score: payload.score,
    total: payload.total,
    category: payload.category,
    answers: payload.answers,
  };

  const res = await fetch(SHEET_API_URL, {
    method: "POST",
    // 使用 text/plain 以避免 CORS preflight
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // 如果不是 JSON，就忽略 parsing 錯誤
  }

  if (!res.ok || (data && data.error)) {
    throw new Error((data && data.error) || "儲存成績失敗");
  }
}

// 從 Google 試算表讀取排行榜
async function loadLeaderboardFromSheet() {
  const res = await fetch(SHEET_API_URL, { method: "GET" });
  if (!res.ok) {
    throw new Error("讀取排行榜失敗");
  }
  const rows = await res.json();
  renderLeaderboard(rows);
}

// 將排行榜資料渲染到畫面
function renderLeaderboard(rows) {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="5">目前還沒有任何成績，快來成為第一個上榜的人吧！</td>';
    tbody.appendChild(tr);
    return;
  }

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    const scoreText =
      row.score != null && row.total != null
        ? `${row.score} / ${row.total}`
        : row.score != null
        ? String(row.score)
        : "";
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.name || ""}</td>
      <td>${row.school || ""}</td>
      <td>${row.grade || ""}</td>
      <td>${scoreText}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 取代原本的 Firestore 上傳函式，沿用同一個 hook 名稱
// 取代原本的 saveAttemptToFirestore 寫法
window.saveAttemptToFirestore = async function (payload) {
  // 先專心處理「寫入成績」
  try {
    await saveScoreToSheet(payload);
    console.log("成績已成功寫入 Google 試算表");
  } catch (err) {
    console.error("寫入 Google 試算表失敗：", err);
    alert("成績已計算，但寫入 Google 試算表失敗：" + err.message);
        // 就算寫入失敗，也不要把學生困在這頁，放他回去重測

    setRestartButtonState(true, "重新測驗");

    return; // 寫入都失敗了，就不需要再更新排行榜
  }

  // 再來試著更新排行榜；就算這裡失敗，也不要說「上傳失敗」
  try {
    await loadLeaderboardFromSheet();
    console.log("排行榜已更新");
  } catch (err) {
    console.warn("排行榜更新失敗（但成績已經寫進試算表）：", err);
    // 視情況決定要不要提醒學生
    // alert("成績已儲存，但排行榜暫時無法更新：" + err.message);
  }finally {
    // 無論成功或失敗，最後一定解鎖「重新測驗」按鈕
    setRestartButtonState(true, "重新測驗");
  }
};

// 一進頁面就先載入排行榜
document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboardFromSheet().catch((err) => {
    console.warn("載入排行榜失敗：", err);
  });
});
