
export async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("psw").value;

  try {
    const res = await fetch("https://anastasiiabryiovska-github-io.onrender.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    alert("User created: " + data.email);

  } catch (error) {
    alert(error.message);
  }
}

export async function login() {
  const email = document.getElementById("Lemail").value;
  const password = document.getElementById("Lpsw").value;

  try {
    const res = await fetch("https://anastasiiabryiovska-github-io.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    localStorage.setItem("token", data.token);

    window.location.reload();

    window.location.href = "/";

    alert("Logged in: " + data.email);


    console.log("LOGIN RESPONSE:", data);

  } catch (error) {
    alert(error.message);
  }
}

export async function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}