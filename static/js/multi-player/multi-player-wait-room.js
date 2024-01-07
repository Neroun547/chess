const createGameBtn = document.getElementById("create-game-btn");
const connectToGameBtn = document.getElementById("connect-to-game-btn");
const wrapperButtons = document.querySelector(".wrapper__buttons");
const wrapperHash = document.querySelector(".wrapper__hash");
const body = document.getElementsByTagName("body")[0];

function createModal(success) {

    if(!success) {
        if(document.querySelector(".wrapper__modal-success")) {
            document.querySelector(".wrapper__modal-success").remove();
        }
        const wrapperModal = document.createElement("div");
        wrapperModal.classList.add("wrapper__modal-error");

        wrapperModal.innerText = "Такої гри не знайдено";

        body.appendChild(wrapperModal);
    } else {
        if(document.querySelector(".wrapper__modal-error")) {
            document.querySelector(".wrapper__modal-error").remove();
        }
        if(document.querySelector(".connect-to-game-form")) {
            document.querySelector(".connect-to-game-form").remove();
        }
        const wrapperModal = document.createElement("div");
        wrapperModal.classList.add("wrapper__modal-success");

        wrapperModal.innerText = "Успішно доєднано до гри. Чекаємо старту";

        body.appendChild(wrapperModal);
    }
}

createGameBtn.addEventListener("click", async function () {
    let startGame = false;

    const response = await fetch("/create-game", {
        method: "POST"
    })
    const data = await response.json();

    wrapperButtons.remove();

    const hashBlock = document.createElement("div");
    hashBlock.innerText = "Ідентифікатор вашої гри: " + data.hash;

    const copyBtn = document.createElement("button");
    copyBtn.innerText = "Скопіювати";
    copyBtn.style.cursor = "pointer";

    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(data.hash);
    });
    wrapperHash.style.display = "flex";

    wrapperHash.appendChild(hashBlock);
    wrapperHash.appendChild(copyBtn);

    const waitForPlayerLogo = document.createElement("h1");
    waitForPlayerLogo.innerText = "Очікування гравця ...";
    waitForPlayerLogo.style.textAlign = "center";

    body.appendChild(waitForPlayerLogo);

    const socket = io();

    socket.emit("create-room", data.hash);

    socket.on("player-connected", () => {
        waitForPlayerLogo.innerText = "Гравець підключився, можна починати";

        const startGameBtn = document.createElement("button");

        startGameBtn.setAttribute("id", "start-game-btn");
        startGameBtn.innerText = "Почати гру";
        startGameBtn.addEventListener("click", function () {
            startGame = true;
            localStorage.clear();

            socket.emit("start-game", data.hash);

            localStorage.setItem("game-hash", data.hash);

            window.location.href = "/multi-player/game";
        });
        startGameBtn.style.display = "block";
        startGameBtn.style.margin = "0 auto";
        startGameBtn.style.marginTop = "50px";

        body.appendChild(startGameBtn);
    });

    socket.on("player-leave", () => {
        if(!startGame) {
            alert("Гравець вийшов з зали очікування");

            waitForPlayerLogo.innerText = "Очікування гравця ...";

            const startGameBtn = document.getElementById("start-game-btn");

            if (startGameBtn) {
                startGameBtn.remove();
            }
        }
    });
});

connectToGameBtn.addEventListener("click", function () {
    wrapperButtons.remove();

    const form = document.createElement("form");

    form.classList.add("connect-to-game-form");

    const label = document.createElement("label");
    label.innerHTML = "Введіть ідентифікатор гри:";
    label.setAttribute("for", "game-hash-input");

    const input = document.createElement("input");
    input.setAttribute("id", "game-hash-input");
    input.setAttribute("placeholder", "Ідентифікатор гри:");

    const button = document.createElement("button");
    button.setAttribute("type", "submit");
    button.innerText = "Підключитися до гри";

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const socket = io();
        let startGame = false;

        socket.emit("join-to-room", e.target[0].value);

        socket.on("error-connect-to-room", () => {
            createModal(false);
        });
        socket.on("success-connect-to-room", () => {
            createModal(true);
        });
        socket.on("start-game", () => {
            startGame = true;
            localStorage.clear();
            localStorage.setItem("game-hash", e.target[0].value);

            window.location.href = "/multi-player/game";
        });
        socket.on("player-leave", () => {
            if(!startGame) {
                alert("Творець вийшов з конференції");
                window.location.reload();
            }
        });
    });

    body.appendChild(form);
});
