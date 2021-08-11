import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/app";
import "firebase/auth";

const auth = firebase.initializeApp(firebaseConfig).auth();
export default auth;
