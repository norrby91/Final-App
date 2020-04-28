//sign in action

import { LOGIN_FORM_DATA, LOGIN_SERVICE_ERROR, LOGIN_SERVICE_SUCCESS, LOGIN_SERVICE_PENDING, FORCE_RESET_PASSWORD } from './actionTypes';
import AsyncStorage from '@react-native-community/async-storage';
import { loaderStatus } from '../loaderAction';
import { emptyCart } from '../cartAction';

import * as firebase from 'firebase';
require('firebase/auth');
require('firebase/firestore');

export const loginServicePending = () => ({
  type: LOGIN_SERVICE_PENDING,
})


export const loginServiceSuccess = (data) => ({
  type: LOGIN_SERVICE_SUCCESS,
  payload: data
})

export const loginServiceError = (error) => ({
  type: LOGIN_SERVICE_ERROR,
  payload: error,
})



export const callLoginService = (body, navigation) => {
  return dispatch => {
    dispatch(emptyCart());
    dispatch(loginServicePending());
    const { email, password } = body;
    dispatch(loaderStatus({ status: true, message: 'Signing In...' }));

    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log("Auth Result");
        console.log(res);
        const query = firebase.firestore().collection('Users').where('userid', '==', res.user.uid).get();
        console.log(res.user.uid);
        query.then((result) => {
          if (!result.empty) {
            const snapshot = result.docs[0];
            const data = snapshot.data();
            console.log(data);
            const now = new Date();
            const localStorage = {
              key: snapshot.id,
              username: email,
              password: password,
              uid: res.user.uid,
              usertype: data.usertype,
              cafeid: data.cafeid,
              driverid: data.driverid,
              time: now.getTime()
            }
            console.log(data);
            console.log(localStorage.usertype);
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
