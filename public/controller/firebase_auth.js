import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
import { app } from "./firebase_core.js"
import { DEV } from "../model/constants.js"

const auth = getAuth(app);

export async function signinFirebase(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth,email,password);
        const user = userCredential.user;
    } catch (error){
        if (DEV) console.log('signin error: ', error);
        const errorCode = error.code;
        const errorMessage = error.errorMessage
        alert('Signing Error: ' + errorCode + ' ' + errorMessage)
    }
}