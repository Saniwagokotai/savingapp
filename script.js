// ===== HTMLの要素を取得 =====

const goalDisplay = document.getElementById("goalDisplay");

const totalAmount = document.getElementById("totalAmount");
const remainingAmount = document.getElementById("remainingAmount");

const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const goalAmountInput = document.getElementById("goalAmount");
const todayAmountInput = document.getElementById("todayAmount");

const setGoalButton = document.getElementById("setGoalButton");
const saveButton = document.getElementById("saveButton");

const editGoalButton = document.getElementById("editGoalButton");
const goalEditArea = document.getElementById("goalEditArea");


// ===== データ =====

let goal = 0;
let total = 0;
let history = [];

// ===== 目標編集を開く =====

editGoalButton.addEventListener("click", () => {

  goalEditArea.classList.toggle("hidden");

});


// ===== 目標金額を設定 =====

setGoalButton.addEventListener("click", () => {

  goal = Number(goalAmountInput.value);

  localStorage.setItem("goal", goal);

  goalDisplay.textContent = `${goal} 円`;

  updateUI();

});


// ===== 今日の貯金を追加 =====

saveButton.addEventListener("click", () => {
  const todaySaving = Number(todayAmountInput.value);

  total += todaySaving;

  const now = new Date();

  const record = {
    amount: todaySaving,
    date: now.toLocaleDateString("ja-JP"),
    time: now.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  history.unshift(record);

  localStorage.setItem("total", total);
  localStorage.setItem("history", JSON.stringify(history));

  todayAmountInput.value = "";

  updateUI();
  updateHistory();
});

function updateHistory() {
  const historyList = document.getElementById("historyList");

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `
      <p class="empty-message">
        まだ記録がありません
      </p>
    `;
    return;
  }

  history.forEach((record) => {

  const item = document.createElement("div");
  item.classList.add("history-item");

  const valueClass =
    record.amount >= 0
      ? "plus-value"
      : "minus-value";

  const sign =
    record.amount >= 0
      ? "+"
      : "";

  item.innerHTML = `
    <div>
      <p class="history-date">
        ${record.date} ${record.time}
      </p>
    </div>

    <strong class="${valueClass}">
      ${sign}${record.amount} 円
    </strong>
    `;

    historyList.appendChild(item);

  });
}

const savedHistory = localStorage.getItem("history");

if (savedHistory) {
  history = JSON.parse(savedHistory);
}


// ===== 表示更新 =====

function updateUI() {

  totalAmount.textContent = `${total} 円`;

  const remaining = goal - total;

  remainingAmount.textContent = `${remaining} 円`;

  // 達成率

  let percent = 0;

  if (goal > 0) {
    percent = Math.floor((total / goal) * 100);
  }

  progressPercent.textContent = `${percent}%`;

  progressFill.style.width = `${percent}%`;

}

// ===== 保存データを読み込む =====

const savedGoal = localStorage.getItem("goal");
const savedTotal = localStorage.getItem("total");

if (savedGoal) {
  goal = Number(savedGoal);
}

if (savedTotal) {
  total = Number(savedTotal);
}

goalDisplay.textContent = `${goal} 円`;

updateUI();

updateHistory();