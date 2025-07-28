const wrapperForm = document.querySelector(".wrapper__form");

wrapperForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = e.target["username"].value;
    const password = e.target["password"].value;

    const api = await fetch("http://localhost:8090/api/auth/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
    const response = await api.json();

    if(api.ok) {
        localStorage.setItem("authToken", response.token);

        window.location.href = "/";
    } else {

    }
});


