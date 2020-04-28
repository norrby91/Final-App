//sign out action 

import AsyncStorage from '@react-native-community/async-storage';
import { SHOW_SIGNOUT_DIALOG, HIDE_SIGNOUT_DIALOG } from './actionTypes';
import * as firebase from 'firebase';
require('firebase/auth');


export const showSignOutDialog = () => dispatch => {
  dispatch({ type: SHOW_SIGNOUT_DIALOG })
}
export const hideSignOutDialog = () => dispatch => {
  dispatch({ type: HIDE_SIGNOUT_DIALOG })
}
export const signOut = async (navigation) => {
  try {
    await firebase.auth().signOut().then(function () {
      // Sign-out successful.
      console.log("success");
      AsyncStorage.clear();
      navigation.navigate('Auth');
    }, function (error) {
      // An error happened.
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
}



