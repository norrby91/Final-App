import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const settings = {};

const config = {
    apiKey: "AIzaSyDvPEeykZXRbJAcdK9WNiGVqcvK9QfVjTE",
    authDomain: "fir-setup-d5cc7.firebaseapp.com",
    databaseURL: "https://fir-setup-d5cc7.firebaseio.com",
    projectId: "fir-setup-d5cc7",
    storageBucket: "fir-setup-d5cc7.appspot.com",
    messagingSenderId: "840471680360",
    appId: "1:840471680360:web:7f3f6df8b7bdc8a56872dd",
    measurementId: "G-7FDGR463HN"
};
firebase.initializeApp(config);

const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

db.settings({});

// firebase collections
const analyticsCollection = db.collection('analytics');
const menusCollection = db.collection('Menus');
const orderCollection = db.collection('Orders');
const driverCollection = db.collection('Driver')
const usersCollection = db.collection('Users')


export {
    db,
    auth,
    currentUser,
    analyticsCollection,
    orderCollection, 
    driverCollection,
    usersCollection,
    menusCollection
}