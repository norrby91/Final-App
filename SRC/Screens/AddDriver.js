// add a new driver to the cafe 

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';

import * as firebase from "../../Firebase";
import { decode, encode } from 'base-64'
import { Container, Header, Content, Footer, FooterTab, Button, Fab, Left, Text, Right, Body, Title, Card, CardItem, Input } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }




class AddDriver extends Component {
  constructor() {
    super();
    //this.ref = firebase.firestore().collection('Driver');
    this.state = {
      name: '',
      email: '',
      phonenumber: '',
      address: '',
      driverNo: '',
      isLoading: false,
    };
  }
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveBoard() {
    const { cafeid } = this.props.logindetails;
    console.log(this.props.logindetails);
    this.setState({
      isLoading: true,
    });
    firebase.driverCollection.add({
      name: this.state.name,
      email: this.state.email,
      phonenumber: this.state.phonenumber,
      address: this.state.address,
      driverNo: this.state.driverNo,
      cafeid: cafeid
    }).then((docRef) => {
      this.setState({
        name: '',
        email: '',
        phonenumber: '',
        address: '',
        driverNo: '',
        isLoading: false,
      });
    })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.setState({
          isLoading: false,
        });
      });

  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <>

        <Header style={{ backgroundColor: '#C1E319' }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Add Driver</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView style={styles.container}>
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'Enter Name'}
              value={this.state.name}
              style={{ height: 35, padding: 5, fontWeight: "bold" }}
              onChangeText={(text) => this.updateTextInput(text, 'name')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'Enter email'}
              value={this.state.email}
              style={{ height: 35, padding: 5, fontWeight: "bold" }}

              onChangeText={(text) => this.updateTextInput(text, 'email')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'Enter phone no.'}
              value={this.state.phonenumber}
              style={{ height: 35, padding: 5, fontWeight: "bold" }}

              onChangeText={(text) => this.updateTextInput(text, 'phonenumber')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              style={{ height: 35, padding: 5, fontWeight: "bold" }}

              placeholder={'Enter Driver Number'}
              value={this.state.driverNo}
              onChangeText={(text) => this.updateTextInput(text, 'driverNo')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={{ height: 100, fontWeight: "bold", paddingLeft: 5, borderColor: "lightgrey", textAlignVertical: 'top', }}
              placeholder={'Enter Address'}
              value={this.state.address}
              onChangeText={(text) => this.updateTextInput(text, 'address')}
            />
          </View>
        </ScrollView>
        <Footer>
          <FooterTab>
            <Button
              style={{ backgroundColor: '#C1E319' }}
              onPress={() => this.saveBoard()} >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>Save</Text>
            </Button>
          </FooterTab>
        </Footer>
      </>
    );
  }
};

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
  logindetails: state.SignInReducer.logindetails
});
export default connect(mapStateToProps)(AddDriver);
