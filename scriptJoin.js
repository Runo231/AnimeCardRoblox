(function () {
    if (window.__rbxNextServerLoaded) return;
    window.__rbxNextServerLoaded = true;

    let currentIndex = -1;
    let loadingMore = false;
    let autoMode = false;
    let autoInterval = null;

    const getServers = () =>
        Array.from(document.querySelectorAll(
            "#rbx-public-game-server-item-container li.rbx-public-game-server-item"
        ));

    const clearHighlight = () => {
        getServers().forEach(li => {
            li.style.outline = "";
            li.style.outlineOffset = "";
            li.style.boxShadow = "";
        });
    };

    const highlightServer = (li) => {
        li.style.outline = "3px solid gold";
        li.style.outlineOffset = "-3px";
        li.style.boxShadow = "0 0 12px gold";
        li.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const clickLoadMore = async () => {
        if (loadingMore) return false;

        const btn = document.querySelector(
            ".rbx-public-running-games-footer .rbx-running-games-load-more"
        );

        if (!btn || btn.disabled) return false;

        loadingMore = true;
        const previousCount = getServers().length;

        btn.click();
        console.log("🔄 Cargando más servidores...");

        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 300));
            if (getServers().length > previousCount) {
                loadingMore = false;
                return true;
            }
        }

        loadingMore = false;
        return false;
    };

    const joinNextServer = async () => {
        let list = getServers();

        if (currentIndex + 1 >= list.length) {
            const loaded = await clickLoadMore();
            if (loaded) {
                list = getServers();
            } else {
                currentIndex = -1;
                list = getServers();
            }
        }

        clearHighlight();
        currentIndex++;

        if (currentIndex >= list.length) currentIndex = 0;

        const serverLi = list[currentIndex];
        highlightServer(serverLi);

        const joinButton = serverLi.querySelector(
            "button.rbx-public-game-server-join"
        );

        if (joinButton) {
            console.log(`▶ Uniéndose al servidor ${currentIndex + 1}/${list.length}`);
            joinButton.click();
        } else {
            console.warn("⚠ Botón 'Unirse' no encontrado");
        }
    };

    // ===== UI =====
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "8px";

    // Botón manual
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "▶ Siguiente servidor";
    nextBtn.style.padding = "12px 16px";
    nextBtn.style.background = "#ffd700";
    nextBtn.style.color = "#000";
    nextBtn.style.border = "none";
    nextBtn.style.borderRadius = "8px";
    nextBtn.style.fontWeight = "bold";
    nextBtn.style.cursor = "pointer";
    nextBtn.style.boxShadow = "0 0 12px rgba(255,215,0,0.8)";
    nextBtn.onclick = joinNextServer;

    // Botón automático
    const autoBtn = document.createElement("button");
    autoBtn.textContent = "⏸ Modo automático (OFF)";
    autoBtn.style.padding = "10px 16px";
    autoBtn.style.background = "#444";
    autoBtn.style.color = "#fff";
    autoBtn.style.border = "none";
    autoBtn.style.borderRadius = "8px";
    autoBtn.style.fontWeight = "bold";
    autoBtn.style.cursor = "pointer";

    const updateAutoUI = () => {
        if (autoMode) {
            autoBtn.textContent = "▶ Modo automático (ON)";
            autoBtn.style.background = "#2ecc71";
        } else {
            autoBtn.textContent = "⏸ Modo automático (OFF)";
            autoBtn.style.background = "#444";
        }
    };

    autoBtn.onclick = () => {
        autoMode = !autoMode;

        if (autoMode) {
            joinNextServer();
            autoInterval = setInterval(joinNextServer, 15000);
            console.log("🟢 Modo automático activado (cada 15s)");
        } else {
            clearInterval(autoInterval);
            autoInterval = null;
            console.log("🔴 Modo automático desactivado");
        }

        updateAutoUI();
    };

    updateAutoUI();

    container.appendChild(nextBtn);
    container.appendChild(autoBtn);
    document.body.appendChild(container);

    console.log("✔ Script completo cargado (manual + automático)");
})();
