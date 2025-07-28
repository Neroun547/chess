const wrapperForm = document.querySelector(".wrapper__form");

wrapperForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = e.target["name"].value;
    const username = e.target["username"].value;
    const email = e.target["email"].value;
    const password = e.target["password"].value;

    const api = await fetch("http://localhost:8090/api/signup/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            username: username,
            email: email,
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
