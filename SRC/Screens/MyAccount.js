//USER DETAILS PAGE ON ACCOUNT
//IMPORT PACKAGES
import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Left, Right, ListItem, Body, Title, Card, CardItem, Thumbnail, Button } from 'native-base';
import { View, StyleSheet, Text, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { signOut } from '../actions/authentication/signOutAction';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { loaderStatus } from '../actions/loaderAction';


import * as firebase from 'firebase';
require('firebase/firestore');

import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }

class MyAccount extends React.Component {

  constructor() {
    super();
    //SET STATE
    this.state = {
      name: null,
      email: null,
      contactno: null,
      isLoading: true
    };
  }
//ON SCREEN LOAD GET COLLECTION BY FINDING USERS UID ON FIRESTORE
//SET THIS DATA TO STATE
  componentDidMount() {
    console.log("Component Mount");
    const { uid } = this.props.logindetails;
    console.log("UID:" + uid);
    const query = firebase.firestore().collection('Users').where('userid', '==', uid).get();
    query.then((res) => {
      console.log(res);
      const snapshot = res.docs[0];
      const data = snapshot.data();
      console.log("snapshot");
      console.log(snapshot.id);
      this.setState({
        key: snapshot.id,
        name: data.name,
        email: this.props.logindetails.username,
        contactno: data.contactno,
        isLoading: false
      })
      console.log(data);
      console.log(this.state);
    });
  }
//CREATE FUNCTION TO UPDATE DATA OF USER DETAILS
// ALERT USER IT WORKED OK 
  updateUser() {
    this.setState({
      isLoading: true,
    });
    const { logindetails } = this.props;
    const updateDBRef = firebase.firestore().collection('Users').doc(this.state.key);
    const data = {
      name: this.state.name,
      contactno: this.state.contactno,
      cafeid: logindetails.cafeid,
      driverid: logindetails.driverid,
      userid: logindetails.uid,
      usertpe: logindetails.usertype
    }
    updateDBRef.set(data).then((docRef) => {
      this.setState({
        name: this.state.name,
        email: logindetails.username,
        contactno: this.state.contactno,
        isLoading: false,
      });
      Alert.alert(
        'Update User',
        'User Updated Successfuly ',
        [
          { text: 'Ok', onPress: () => console.log('No item was removed'), style: 'cancel' },
        ],
        {
          cancelable: true
        }
      );
    })
      .catch((error) => {
        console.error("Error: ", error);
        this.setState({
          isLoading: false,
        });
      });
  }



//RENDER OBJECTS ON SCREEN
  render() {
    const { navigate } = this.props.navigation;
    console.log("Props:");
    console.log(this.props);
    return (
      <>
        <Header style={{ backgroundColor: '#C1E319' }}>
          <Left> 
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>My Account</Title>
          </Body>
          <Right />
        </Header>
        {
          this.state.isLoading ?
            < View style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            }}>
              <ActivityIndicator size="large" color="#9E9E9E" />
              <Text style={{ fontWeight: "bold" }}>
                Loading..
                    </Text>
            </View> :
            <>
              <Content padder>
                <View style={styles.subContainer}>
                  <TextInput
                    value={this.state.name}
                    style={{ height: 35, padding: 5, fontWeight: "bold" }}
                    placeholder={'Enter Name'}
                    onChangeText={(text) => this.setState({ name: text })}
                  />
                </View>
                <View style={styles.subContainer}>
                  <TextInput
                    editable={false}
                    value={this.state.email}
                    style={{ height: 35, padding: 5, fontWeight: "bold" }}
                    placeholder={'Enter Email Address'}
                  />
                </View>
                <View style={styles.subContainer}>
                  <TextInput
                    value={this.state.contactno}
                    style={{ height: 35, padding: 5, fontWeight: "bold" }}
                    placeholder={'Contact No'}
                    onChangeText={(text) => this.setState({ contactno: text })}
                  />
                </View>
              </Content>
              <Footer>
                <FooterTab>
                  <Button 
                  style={{ backgroundColor: '#C1E319' }}
                  onPress={() => this.updateUser()}>
                    <Text style={{ fontWeight: "bold", color: "#FFF" }}>Update Details</Text>
                  </Button>
                </FooterTab>
              </Footer>
            </>

        }

      </>
    );
  }
}
//APPLY STYLE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    // borderBottomWidth: 1,
    borderColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = (state) => ({
  logindetails: state.SignInReducer.logindetails,
});

export default connect(mapStateToProps)(MyAccount);