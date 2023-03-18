import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "***",
    authDomain: "***",
    projectId: "***",
    storageBucket: "***",
    messagingSenderId: "***",
    appId: "***",
    measurementId: "***"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const firestore = firebase.firestore();
const app = initializeApp(firebaseConfig)
const fireDb = getFirestore(app)

export { firestore, fireDb }
