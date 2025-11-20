document.addEventListener("DOMContentLoaded", function () {
    const homePage    = document.getElementById("homePage");
    const readyPage   = document.getElementById("readyPage");
    const scorePage   = document.getElementById("scorePage");
    const statsPage   = document.getElementById("statsPage");
    const historyPage = document.getElementById("historyPage");
    const earnPage    = document.getElementById("earnPage");
    const rewardPage  = document.getElementById("rewardPage");

    const resHome   = document.getElementById("response");
    const resReady  = document.getElementById("readyResponse");
    const scoreEl   = document.getElementById("scoreValue");
    const statsScoreEl = document.getElementById("statsScore");
    const statsMsgEl   = document.getElementById("statsMessage");
    const historyList  = document.getElementById("historyList");
    const rewardScoreEl = document.getElementById("rewardScore");
    const rewardMsgEl   = document.getElementById("rewardMessage");

    // Tích điểm bằng mã
    const codeInput     = document.getElementById("codeInput");
    const btnSubmitCode = document.getElementById("btnSubmitCode");
    const earnMessage   = document.getElementById("earnMessage");

    // ===== BIẾN TOÀN CỤC =====
    let score = 0;                     // điểm hiện tại
    const HISTORY_KEY = "greenPointHistory";
    const SCORE_KEY   = "greenPointScore";
    let history = [];                  // lưu lịch sử các lần cộng/trừ điểm

    // Bảng mã điểm
    const CODE_TABLE = {
        "GP1": 1,
        "GP2": 2,
        "GP5": 5,
        "GP10": 10,
        "GP20": 20,
        "GP50": 50,
    };

    // ===== LOCALSTORAGE: load & save =====
    function loadHistory() {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (!raw) {
            history = [];
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            history = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            history = [];
        }
    }

    function saveHistory() {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function loadScore() {
        const raw = localStorage.getItem(SCORE_KEY);
        const val = parseInt(raw, 10);
        if (!isNaN(val)) {
            score = val;
        } else {
            score = 0;
        }
    }

    function saveScore() {
        localStorage.setItem(SCORE_KEY, String(score));
    }

    // Gọi khi mở trang
    loadHistory();
    loadScore();

    // ===== HÀM HỖ TRỢ =====
    function updateScoreDisplay() {
        if (scoreEl) scoreEl.textContent = score;
        if (statsScoreEl) statsScoreEl.textContent = score;
        if (rewardScoreEl) rewardScoreEl.textContent = score;
    }

    function renderHistory() {
        historyList.innerHTML = "";
        if (history.length === 0) {
            const li = document.createElement("li");
            li.textContent = "Chưa có lần tích điểm nào.";
            historyList.appendChild(li);
            return;
        }
        history.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            historyList.appendChild(li);
        });
    }

    // ===== ĐỔI MÀN HÌNH =====
    function hideAll() {
        homePage.classList.add("hidden");
        readyPage.classList.add("hidden");
        scorePage.classList.add("hidden");
        statsPage.classList.add("hidden");
        historyPage.classList.add("hidden");
        earnPage.classList.add("hidden");
        rewardPage.classList.add("hidden");
    }

    function showHome() {
        hideAll();
        homePage.classList.remove("hidden");
        resHome.textContent = "";
    }

    function showReady() {
        hideAll();
        readyPage.classList.remove("hidden");
        resReady.textContent = "";
    }

    function showScore() {
        hideAll();
        scorePage.classList.remove("hidden");
        updateScoreDisplay();
    }

    function showStats() {
        hideAll();
        statsPage.classList.remove("hidden");
        updateScoreDisplay();
        statsMsgEl.textContent = "";
    }

    function showHistory() {
        hideAll();
        historyPage.classList.remove("hidden");
        renderHistory();
    }

    function showEarn() {
        hideAll();
        earnPage.classList.remove("hidden");
        earnMessage.textContent = "";
        if (codeInput) codeInput.value = "";
    }

    function showReward() {
        hideAll();
        rewardPage.classList.remove("hidden");
        updateScoreDisplay();
        rewardMsgEl.textContent = "";
    }

    // ===== MÀN 1: TRANG CHÍNH =====
    document.getElementById("btnStart").addEventListener("click", function () {
        // Bắt đầu lượt mới → reset điểm về 0 và lưu lại
        score = 0;
        saveScore();
        showReady();
    });

    document.getElementById("btnScore").addEventListener("click", showEarn);

    document.getElementById("btnStat").addEventListener("click", showStats);

    // ===== MÀN 2: SẴN SÀNG CHƯA =====
    document.getElementById("backFromReady").addEventListener("click", showHome);

    document.getElementById("btnReady").addEventListener("click", function () {
        const delta = 1;
        score += delta;
        saveScore();
        history.push(`Bạn có thêm ${delta} điểm.`);
        saveHistory();
        showScore();
    });

    document.getElementById("btnExcited").addEventListener("click", function () {
        const delta = 2;
        score += delta;
        saveScore();
        history.push(`Bạn có thêm ${delta} điểm.`);
        saveHistory();
        showScore();
    });

    // ===== MÀN 3: ĐIỂM HIỆN TẠI =====
    document.getElementById("closeScore").addEventListener("click", showHome);

    // ===== MÀN 4: THỐNG KÊ =====
    document.getElementById("closeStats").addEventListener("click", showHome);
    document.getElementById("btnHistory").addEventListener("click", showHistory);
    document.getElementById("btnRedeem").addEventListener("click", showReward);

    // ===== MÀN 5: LỊCH SỬ =====
    document.getElementById("closeHistory").addEventListener("click", showStats);
    document.getElementById("clearHistoryBtn").addEventListener("click", function () {
        history = [];
        saveHistory();
        renderHistory();
    });

    // ===== MÀN 6: TÍCH ĐIỂM (NHẬP MÃ) =====
    document.getElementById("closeEarn").addEventListener("click", showHome);

    if (btnSubmitCode && codeInput && earnMessage) {
        btnSubmitCode.addEventListener("click", function () {
            const raw = codeInput.value.trim().toUpperCase();
            if (!raw) {
                earnMessage.textContent = "Vui lòng nhập mã.";
                return;
            }

            const delta = CODE_TABLE[raw];
            if (delta === undefined) {
                earnMessage.textContent = "Mã không hợp lệ. Hãy kiểm tra lại.";
                return;
            }

            score += delta;
            saveScore();
            updateScoreDisplay();

            const msg = `Bạn nhập mã ${raw}, được cộng ${delta} điểm.`;
            earnMessage.textContent = msg;

            history.push(msg);
            saveHistory();
            codeInput.value = "";
        });

        // Enter để gửi
        codeInput.addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
                btnSubmitCode.click();
            }
        });
    }

    // ===== MÀN 9: ĐỔI THƯỞNG =====
    document.getElementById("closeReward").addEventListener("click", showStats);

    document.querySelectorAll(".reward-item").forEach(btn => {
        btn.addEventListener("click", function () {
            const cost = parseInt(this.dataset.cost, 10);
            const name = this.dataset.name;
            if (score >= cost) {
                score -= cost;               // trừ điểm
                saveScore();
                updateScoreDisplay();

                const msg = `Bạn đã đổi "${name}" (-${cost} điểm).`;
                history.push(msg);
                saveHistory();
                rewardMsgEl.textContent = `Bạn đã đổi "${name}". Điểm còn lại: ${score}.`;
            } else {
                rewardMsgEl.textContent = "Bạn chưa đủ điểm để đổi phần thưởng này.";
            }
        });
    });

    // khi load xong, nếu bạn mở thẳng sang thống kê / đổi thưởng
    // thì updateScoreDisplay sẽ dùng score lấy từ localStorage
    updateScoreDisplay();
});
