const authLink = document.getElementById("auth-link");
const createAccountLink = document.getElementById("create-account-link");
const wrapperUserGameStatistic = document.querySelector(".wrapper__main-statistic");
const exitFromAccount = document.getElementById("exit-from-account");
const wrapperUserGameStatisticUserInfo = document.querySelector(".wrapper__main-statistic-user-info");
const wrapperUserGameStatisticStatistic = document.querySelector(".wrapper__main-statistic-statistic");

exitFromAccount.addEventListener("click", function () {
    fetch("http://localhost:8090/api/logout")
        .then(() => {
            localStorage.setItem("authToken", "");
            window.location.reload()
        });
});

fetch("http://localhost:8090/api/check-token/", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
})
    .then(res => {
        if(res.ok) {
            removeNotAuthUserElementsOnPage();
            displayAuthUserElementsOnPage();
            displayUserInfo();
            addUserStatisticToPage();
        }
    })

async function addUserStatisticToPage() {
    const api = await fetch("http://localhost:8090/api/game-statistic/", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }
    });

    if(api.ok) {
        const response = await api.json();

        const allGamesP = document.createElement("p");
        allGamesP.innerText = "Всього ігор зіграно: " + response.allGames;

        const winGamesP = document.createElement("p");
        winGamesP.innerText = "Ігор виграно: " + response.winGames;

        const loseGamesP = document.createElement("p");
        loseGamesP.innerText = "Ігор програно: " + response.loseGames;

        const drawGamesP = document.createElement("p");
        drawGamesP.innerText = "Ігор зіграних в нічію: " + response.drawGames;

        wrapperUserGameStatisticStatistic.appendChild(allGamesP);
        wrapperUserGameStatisticStatistic.appendChild(winGamesP);
        wrapperUserGameStatisticStatistic.appendChild(loseGamesP);
        wrapperUserGameStatisticStatistic.appendChild(drawGamesP);
    } else {
        const noDataLogo = document.createElement("h4")

        noDataLogo.innerText = "Немає данних";
        wrapperUserGameStatistic.appendChild(noDataLogo);
    }
}

function removeNotAuthUserElementsOnPage() {
    authLink.remove();
    createAccountLink.remove();
}

function displayAuthUserElementsOnPage() {
    wrapperUserGameStatistic.style.display = "block";
    exitFromAccount.style.display = "block";
}

async function displayUserInfo() {
    const api = await fetch("http://localhost:8090/api/user-info/", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }
    });

    if(api.ok) {
        const response = await api.json();

        const nameElement = document.createElement("p");
        nameElement.innerText = "Ім'я: " + response.name;

        wrapperUserGameStatisticUserInfo.appendChild(nameElement);

        const usernameElement = document.createElement("p");
        usernameElement.innerText = "Ім'я користувача: " + response.username;

        wrapperUserGameStatisticUserInfo.appendChild(usernameElement);

        const emailElement = document.createElement("p");
        emailElement.innerText = "Електронная пошта: " + response.email;

        wrapperUserGameStatisticUserInfo.appendChild(emailElement);
    }
}
