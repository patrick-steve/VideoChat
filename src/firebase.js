import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDq-oAMUsyquA3PC4gW76l8osrOeQxHkYc",
    authDomain: "videochat-62d9a.firebaseapp.com",
    projectId: "videochat-62d9a",
    storageBucket: "videochat-62d9a.appspot.com",
    messagingSenderId: "641858529403",
    appId: "1:641858529403:web:dbcd574ef51d98a23d1ade",
    measurementId: "G-31TCH6P3VD"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const firestore = firebase.firestore();
const app = initializeApp(firebaseConfig)
const fireDb = getFirestore(app)

export { firestore, fireDb }