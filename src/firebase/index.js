import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB5awbd9FSZfBjORWgrw7-7FblrkBK39z0",
  authDomain: "contenttime-90543.firebaseapp.com",
  databaseURL: "https://contenttime-90543.firebaseio.com",
  projectId: "contenttime-90543",
  storageBucket: "contenttime-90543.appspot.com",
  messagingSenderId: "477680639521",
  appId: "1:477680639521:web:d3a40345602577b43e0d60",
  measurementId: "G-HZRSFV884F"
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

export { storage, firebase as default };