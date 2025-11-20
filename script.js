document.addEventListener("DOMContentLoaded", function () {
    const homePage    = document.getElementById("homePage");
    const readyPage   = document.getElementById("readyPage");
    const scorePage   = document.getElementById("scorePage");
    const statsPage   = document.getElementById("statsPage");
    const historyPage = document.getElementById("historyPage");
    const earnPage    = document.getElementById("earnPage");
    const qrPage      = document.getElementById("qrPage");
    const uploadPage  = document.getElementById("uploadPage");
    const rewardPage  = document.getElementById("rewardPage");

    const resHome   = document.getElementById("response");
    const resReady  = document.getElementById("readyResponse");
    const scoreEl   = document.getElementById("scoreValue");
    const statsScoreEl = document.getElementById("statsScore");
    const statsMsgEl   = document.getElementById("statsMessage");
    const historyList  = document.getElementById("historyList");
    const rewardScoreEl = document.getElementById("rewardScore");
    const rewardMsgEl   = document.getElementById("rewardMessage");

    const imageInput   = document.getElementById("imageInput");
    const imagePreview = document.getElementById("imagePreview");

    let score = 0;                     // điểm hiện tại
    const HISTORY_KEY = "greenPointHistory";
    let history = [];                  // lưu lịch sử các lần cộng/trừ điểm

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

    loadHistory();

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
        qrPage.classList.add("hidden");
        uploadPage.classList.add("hidden");
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
    }

    function showQR() {
        hideAll();
        qrPage.classList.remove("hidden");
    }

    function showUpload() {
        hideAll();
        uploadPage.classList.remove("hidden");
    }

    function showReward() {
        hideAll();
        rewardPage.classList.remove("hidden");
        updateScoreDisplay();
        rewardMsgEl.textContent = "";
    }

    // ===== MÀN 1: TRANG CHÍNH =====
    document.getElementById("btnStart").addEventListener("click", function () {
        score = 0;  // lượt mới → reset điểm, không xóa lịch sử
        showReady();
    });

    document.getElementById("btnScore").addEventListener("click", showEarn);

    document.getElementById("btnStat").addEventListener("click", showStats);

    // ===== MÀN 2: SẴN SÀNG CHƯA =====
    document.getElementById("backFromReady").addEventListener("click", showHome);

    document.getElementById("btnReady").addEventListener("click", function () {
        const delta = 1;
        score += delta;
        history.push(`Bạn có thêm ${delta} điểm.`);
        saveHistory();
        showScore();
    });

    document.getElementById("btnExcited").addEventListener("click", function () {
        const delta = 2;
        score += delta;
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

    // ===== MÀN 6: TÍCH ĐIỂM =====
    document.getElementById("closeEarn").addEventListener("click", showHome);
    document.getElementById("btnScanQR").addEventListener("click", showQR);
    document.getElementById("btnSendImage").addEventListener("click", showUpload);

    // ===== MÀN 7: QUÉT QR =====
    document.getElementById("closeQR").addEventListener("click", showEarn);

    // ===== MÀN 8: GỬI HÌNH ẢNH =====
    document.getElementById("closeUpload").addEventListener("click", showEarn);

    if (imageInput && imagePreview) {
        imageInput.addEventListener("change", function () {
            imagePreview.innerHTML = "";
            const files = Array.from(this.files || []);
            files.forEach(file => {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                imagePreview.appendChild(img);
            });
        });
    }

    // ===== MÀN 9: ĐỔI THƯỞNG =====
    document.getElementById("closeReward").addEventListener("click", showStats);

    document.querySelectorAll(".reward-item").forEach(btn => {
        btn.addEventListener("click", function () {
            const cost = parseInt(this.dataset.cost, 10);
            const name = this.dataset.name;
            if (score >= cost) {
                score -= cost;               // ✅ trừ điểm
                updateScoreDisplay();
                history.push(`Bạn đã đổi "${name}" (-${cost} điểm).`);
                saveHistory();
                rewardMsgEl.textContent = `Bạn đã đổi "${name}". Điểm còn lại: ${score}.`;
            } else {
                rewardMsgEl.textContent = "Bạn chưa đủ điểm để đổi phần thưởng này.";
            }
        });
    });
});
