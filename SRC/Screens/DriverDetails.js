import React, { Component } from 'react';
import { Alert, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
require('firebase/firestore');
import { decode, encode } from 'base-64'
if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }


import { useNavigation } from '@react-navigation/native';
import { withNavigation } from 'react-navigation';

import { Container, Header, Content, Footer, FooterTab, Button, Left, Text, Right, Body, Title, Card, CardItem, Input } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


class DriverDetails extends Component {

  constructor() {

    super();
    this.firestoreRef = firebase.firestore().collection('Driver');
    this.state = {
      name: '',
      email: '',
      phonenumber: '',
      address: '',
      driverNo: '',

      isLoading: true
    };
  }
  getNavigationParams() {
    return this.props.navigation.dangerouslyGetParent().getParam('params') || {}
  }
  componentDidMount() {
    // if(data) console.log(data.name); // => Job here
    console.log("NAV: ", this.props.navigation)
    const userkey = this.props.navigation.getParam('userkey');
    console.group(userkey);
    const dbRef = firebase.firestore().collection('Driver').doc(userkey)
    dbRef.get().then((res) => {
      if (res.exists) {
        const Driver = res.data();
        this.setState({
          key: res.id,
          name: Driver.name,
          email: Driver.email,
          phonenumber: Driver.phonenumber,
          driverNo: Driver.driverNo,
          address: Driver.address,
          isLoading: false
        });
      } else {
        console.log("Document does not exist!");
      }
    });
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  updateUser() {
    const { cafeid } = this.props.logindetails;
    console.log(this.props.logindetails);
    this.setState({
      isLoading: true,
    });
    const updateDBRef = firebase.firestore().collection('Driver').doc(this.state.key);
    const data = {
      
      name: this.state.name,
      email: this.state.email,
      phonenumber: this.state.phonenumber,
      address: this.state.address,
      driverNo: this.state.driverNo,
      cafeid: cafeid
    }
    updateDBRef.set(data).then((docRef) => {
      this.setState({
        key: res.id,
        name: '',
        email: '',
        phonenumber: '',
        address: '',
        driverNo: '',
        cafeid: cafeid,
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
      this.props.navigation.navigate('Drivers');
    })
      .catch((error) => {
        console.error("Error: ", error);
        this.setState({
          isLoading: false,
        });
      });
  }

  deleteUser() {
    console.log(this.state.key);
    const dbRef = firebase.firestore().collection('Driver').doc(this.state.key)
    dbRef.delete().then((res) => {
      console.log('Item removed from database')
      Alert.alert(
        'Delete User',
        'User Deleted Successfuly ',
        [
          { text: 'Ok', onPress: () => console.log('No item was removed'), style: 'cancel' },
        ],
        {
          cancelable: true
        }
      );
      this.props.navigation.navigate('Drivers');
    })
  }

  openTwoButtonAlert = () => {
    Alert.alert(
      'Delete User',
      'Are you sure?',
      [
        { text: 'Yes', onPress: () => this.deleteUser() },
        { text: 'No', onPress: () => console.log(' item wasnt removed'), style: 'cancel' },
      ],
      {
        cancelable: true
      }
    );
  }

  render() {
    return (
      <>
        <Header style={{ backgroundColor: '#C1E319' }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Edit Driver</Title>
          </Body>
          <Right></Right>
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
              <ScrollView style={{ padding: 15 }}>
                <View style={styles.subContainer}>
                  <TextInput
                    placeholder={'Name'}
                    value={this.state.name}
                    style={{ height: 35, padding: 5, fontWeight: "bold" }}
                    onChangeText={(val) => this.inputValueUpdate(val, 'name')}
                  />
                </View>
                <View style={styles.subContainer}>
                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    placeholder={'Email'}
                    value={this.state.email}
                    style={{ height: 35, padding: 5, fontWeight: "bold" }}
                    onChangeText={(val) => this.inputValueUpdate(val, 'email')}
                  />
                </View>
                <View style={styles.subContainer}>
                  <TextInput
                    placeholder={'Mobile'}
                    value={this.state.phonenumber}
                    style={{ height: 35, padding: 5, fontWeight: "bold" }}
                    onChangeText={(val) => this.inputValueUpdate(val, 'phonenumber')}
                  />
                </View>
                <View style={styles.subContainer}>
                  <TextInput
                    placeholder={'Address'}
                    value={this.state.address}
                    style={{ height: 35, padding: 5, fontWeight: "bold" }}
                    onChangeText={(val) => this.inputValueUpdate(val, 'address')}
                  />
                </View>
                <View style={styles.subContainer}>
                  <TextInput
                    placeholder={'DriverNo'}
                    value={this.state.driverNo}
                    style={{ height: 35, padding: 5, fontWeight: "bold" }}
                    onChangeText={(val) => this.inputValueUpdate(val, 'DriverNo')}
                  />
                </View>
            

              </ScrollView>

              <Footer>

                <FooterTab>
                  <Button
                    danger
                    onPress={this.openTwoButtonAlert}
                  ><Text style={{ fontSize: 15, fontWeight: "bold", color: "#fff" }} >Delete</Text></Button>
                </FooterTab>
                <FooterTab>
                  <Button
                    onPress={() => this.updateUser()}
                  ><Text style={{ fontSize: 15, fontWeight: "bold", color: "#fff" }} >Update</Text></Button>
                </FooterTab>
              </Footer>
            </>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginBottom: 7,
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
})

export default withNavigation(DriverDetails);