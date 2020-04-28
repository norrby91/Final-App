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
    _bootstrapAsync = async () => {
        let loginDetail = JSON.parse(await AsyncStorage.getItem("loginDetail"));
        console.log(loginDetail);
        if (loginDetail !== null === true) {
            console.log(loginDetail.uid);
            // const query = firebase.firestore().collection('Users').where('userid', '==', loginDetail.uid).get();
            // query.then((result) => {


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
            // ******** save login detail into local storage *********//
            // AsyncStorage.setItem("loginDetail", JSON.stringify(localStorage));
        }
        else {
            this.props.navigation.navigate('Auth');
        }

    }
    componentDidMount() {
    }
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

// const mapStateToProps = (state) => ({
//     errorSimulate: state.ErrorSimulateReducer.detail,
// });
export default connect(null, { callLoginService, loginServiceSuccess })(AuthLoadingScreen);