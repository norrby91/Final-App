//LOADING SCREEN
//IMPORT PACKAGES
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    StatusBar,
    PixelRatio,

} from 'react-native';
import { Spinner } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { callLoginService } from '../actions/authentication/signInAction';


import * as firebase from 'firebase';
require('firebase/auth');
require('firebase/firestore');
import { loginServiceSuccess } from '../actions/authentication/signInAction';

class AuthLoadingScreen extends Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }
    //ON LOAD FIND OUT LOGIN DETAILS AND CHECK LEVEL OF USER AUTH AND MOVE TO CORRECT SCREEN
    _bootstrapAsync = async () => {
        let loginDetail = JSON.parse(await AsyncStorage.getItem("loginDetail"));
        console.log(loginDetail);
        if (loginDetail !== null === true) {
            console.log(loginDetail.uid);
            const now = new Date();
            const localStorage = loginDetail
            console.log(loginDetail);
            this.props.loginServiceSuccess(localStorage);
            if (loginDetail.usertype == 'public') {
                this.props.navigation.navigate('Public');
            }
            else if (loginDetail.usertype == 'cafe') {
                this.props.navigation.navigate('Cafe');
            }
            else if (loginDetail.usertype == 'driver') {
                this.props.navigation.navigate('Driver');
            }
            else {
                this.props.navigation.navigate('Auth')
            }
        }
        else {
            this.props.navigation.navigate('Auth');
        }

    }
    componentDidMount() {
    }
    //RENDER OBJECTS ON SCREEN
    render() {
        return (
            <>
                <StatusBar backgroundColor={"#C1E319"} barStyle="light-content" />
                <View style={{ backgroundColor: "#C1E319", flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Spinner color="#fff" />
                        <Text style={{ color: "#FFF", fontSize: 14 / PixelRatio.getFontScale() }}>
                            Signing In
                    </Text>
                    </View>
                </View>
            </>
        );
    }
}

//EXPORT CLASSS AND CONNECT TO REDUX STORE
export default connect(null, { callLoginService, loginServiceSuccess })(AuthLoadingScreen);