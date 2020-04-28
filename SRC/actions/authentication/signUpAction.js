//sign up actions

import { SIGNUP_SERVICE_PENDING, SIGNUP_SERVICE_SUCCESS, SIGNUP_SERVICE_ERROR, } from './actionTypes';
import AsyncStorage from '@react-native-community/async-storage';
import { loaderStatus } from '../loaderAction';
import { emptyCart } from '../cartAction';
import { loginServiceSuccess } from './signInAction';
import * as firebase from 'firebase';
import * as firebaseSetting from '../../../Firebase';
require('firebase/auth');
require('firebase/firestore');


export const signUpServicePending = () => ({
    type: SIGNUP_SERVICE_PENDING,
})

export const signUpServiceSuccess = (data) => ({
    type: SIGNUP_SERVICE_SUCCESS,
    payload: data,
})

export const signUpServiceError = (error) => ({
    type: SIGNUP_SERVICE_ERROR,
    payload: error,
})

export const signUpSubmit = (data, navigation) => {
    console.log(data);
    return dispatch => {
        dispatch(emptyCart());
        dispatch(signUpServicePending());
        const { name, email, password } = data;
        dispatch(loaderStatus({ status: true, message: 'Signing Up...' }));
        if (name.trim() == "") {
            dispatch(signUpServiceError('Full Name is Required'));
            dispatch(loaderStatus({ status: false, message: '' }));
        }
        else if (email.trim() == "") {
            dispatch(signUpServiceError('Email is Required'));
            dispatch(loaderStatus({ status: false, message: '' }));
        }
        else if (password.trim() == "") {
            dispatch(signUpServiceError('Password is Required'));
            dispatch(loaderStatus({ status: false, message: '' }));
        }
        else {
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    console.log(res.user.uid);
                    const userData = {
                        name: name,
                        userid: res.user.uid,
                        cafeid: "",
                        driverid: "",
                        usertype: "public"
                    }
                    firebaseSetting.usersCollection.add(userData).then((docRef) => {
                        const now = new Date();
                        const localStorage = {
                            username: email,
                            password: password,
                            uid: res.user.uid,
                            usertype: userData.usertype,
                            cafeid: userData.cafeid,
                            driverid: userData.driverid,
                            time: now.getTime()
                        }

                        dispatch(loginServiceSuccess(localStorage));
                        AsyncStorage.setItem("loginDetail", JSON.stringify(localStorage));
                        navigation.navigate('Public');
                        dispatch(loaderStatus({ status: false, message: '' }));
                    })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                            dispatch(signUpServiceError(error.message));
                            dispatch(loaderStatus({ status: false, message: '' }));
                        });
                    // this.props.navigation.navigate('Home')
                }
                )
                .catch(error => {
                    console.log(error)
                    dispatch(signUpServiceError(error.message));
                    dispatch(loaderStatus({ status: false, message: '' }));
                })
        }

        return false
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {

                const query = firebase.firestore().collection('Users').where('userid', '==', res.user.uid).get();
                query.then((result) => {

                    if (!result.empty) {
                        const snapshot = result.docs[0];
                        const data = snapshot.data();
                        const now = new Date();
                        const localStorage = {
                            username: email,
                            password: password,
                            uid: res.user.uid,
                            usertype: data.usertype,
                            cafeid: data.cafeid,
                            driverid: data.driverid,
                            time: now.getTime()
                        }

                        dispatch(loginServiceSuccess(localStorage));

                        // ******** save login detail into local storage *********//
                        AsyncStorage.setItem("loginDetail", JSON.stringify(localStorage));
                        // this.props.navigation.navigate('Public')
                        if (localStorage.usertype == 'public') {
                            navigation.navigate('Public');
                        }
                        else if (localStorage.usertype == 'cafe') {
                            navigation.navigate('Cafe');
                        }
                        else if (localStorage.usertype == 'driver') {
                            navigation.navigate('Driver');
                        }
                        else {
                            navigation.navigate('Auth')
                        }
                        dispatch(loaderStatus({ status: false, message: '' }));
                    } else {
                        dispatch(loaderStatus({ status: false, message: '' }));
                    }
                })
            })
            .catch(error => {
                dispatch(loaderStatus({ status: false, message: '' }));
                // this.setState({ errormessage: error.message })
                dispatch(loginServiceError(error.message));
            })
    }
}


