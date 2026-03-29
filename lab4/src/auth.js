
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "./firebase";
// import React, { useState, useEffect } from 'react';


const auth = getAuth(app);

export async function signUp() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("psw");

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email) {
        alert("Введіть, будь ласка, email");
        return;
    } else if(!password) {
        alert("Введіть, будь ласка, пароль");
        return;
    } else if (password.length < 6) {
        alert("Пароль повинен містити не менше 6 символів");
        return;
    }

    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("User created: " + userCredential.user.email);
    } catch (error) {
        alert("Таке ім'я користувача вже існує або пароль занадто короткий. Спробуйте інший email або пароль довжиною не менше 6 символів.");
    }
}

export async function login() {
    const emailInput = document.getElementById("Lemail");
    const passwordInput = document.getElementById("Lpsw");


    const email = emailInput.value;
    const password = passwordInput.value;

        if (!email) {
        alert("Введіть, будь ласка, email");
        return;
    } else if(!password) {
        alert("Введіть, будь ласка, пароль");
        return;
    } else if (password.length < 6) {
        alert("Пароль повинен містити не менше 6 символів");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in: " + userCredential.user.email);
    } catch (error) {
        alert("Error logging in. Перевірте правильність введених даних або зареєструйтеся, якщо у вас ще немає облікового запису.");
  }
}

export async function logout() {
  try {
    await signOut(auth);
    alert("Вихід виконано успішно");
  } catch (error) {
    alert("Помилка виходу");
  }
}
