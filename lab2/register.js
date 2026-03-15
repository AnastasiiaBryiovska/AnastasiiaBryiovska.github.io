const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('psw');
const registerButton = document.getElementById('registerButton');
const message = document.getElementById('message');

let currentUser = null;

if(registerButton){
registerButton.addEventListener('click', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if(name === '' || email === '' || password === '' || !email.includes('@') || password.length < 6){
        message.textContent = "Помилка: будь ласка, заповніть поля";
        message.style.color = "red";
    } else {
        currentUser = { name, email, password };
        sessionStorage.setItem('currentUser', name);
        message.textContent = `Вітаємо, ${currentUser.name}! Ви зареєстровані.`;
        message.style.color = "green";

        console.log(nameInput, emailInput, passwordInput, registerButton, message);

        window.location.href = "index.html";

    }
});
}
