import firebase from '../../_snowpack/pkg/firebase/app.js';
import '../../_snowpack/pkg/firebaseui/dist/firebaseui.css.proxy.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAFLQrOBJoAAzHJsv3AeCpET68IT8oU0cI",
    authDomain: "enlifted-39c67.firebaseapp.com",
    projectId: "enlifted-39c67",
    storageBucket: "enlifted-39c67.appspot.com",
    messagingSenderId: "382300458739",
    appId: "1:382300458739:web:7cd6a3d2bd5490b20f7186",
    measurementId: "G-2FBY8GGWP0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();