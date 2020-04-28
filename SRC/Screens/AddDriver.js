// add a new driver to the cafe 

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

import * as firebase from "../../Firebase";
import { decode, encode } from 'base-64'
import { Container, Header, Content, Footer, FooterTab, Button, Fab, Left, Text, Right, Body, Title, Card, CardItem, Input } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { loaderStatus } from '../actions/loaderAction';
import LoaderComponent from '../Components/common/loaderComponent'


if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }




class AddDriver extends Component {
  constructor() {
    super();
    //this.ref = firebase.firestore().collection('Driver');
    this.state = {
      driver: [],
      edit: false,
    };
  }

  componentDidMount() {
    this.driver = this.props.navigation.addListener('willFocus', () => {
      const driver = this.props.navigation.getParam('driver');
      const edit = this.props.navigation.getParam('edit');
      this.setState({ driver: driver, edit: edit });
      console.log(this.state);
    }
    );
  }

  componentWillUnmount = () => {
    this.driver.remove();
  }

  updateTextInput = (text, field) => {
    const driver = this.state.driver;
    driver[field] = text;
    this.setState({ driver: driver });
    console.log(this.state);
  }

  _DriverDelete = () => {
    const dockey = this.state.driver.key;
    this.props.loaderStatus({ status: true, message: 'Driver Deleting...' });
    firebase.driverCollection.doc(dockey).delete().then((docRef) => {
      this.setState({ driver: [] });
      this.props.navigation.navigate('Drivers');
      this.props.loaderStatus({ status: false, message: null });
      alert("Driver Deleted Successfully!");
    }).catch((error) => {
      console.error("Error adding document: ", error);
      alert(error.message);
      this.props.loaderStatus({ status: false, message: null });
    });
  }

  saveBoard() {
    const { cafeid } = this.props.logindetails;
    const { driver, edit } = this.state;
    if (driver.name == '' || driver.name == null) {
      alert('Driver name is Required');
    }
    else if (driver.email == '' || driver.email == null) {
      alert('Driver Email is Required');
    } else if (driver.phonenumber == '' || driver.phonenumber == null) {
      alert('Driver Contact No is Required');
    } else if (driver.driverNo == '' || driver.driverNo == null) {
      alert('Driver No. is Required');
    }
    else if (driver.address == '' || driver.address == null) {
      alert('Driver Address is Required');
    }
    else {
      const data = {
        name: driver.name,
        email: driver.email,
        phonenumber: driver.phonenumber,
        address: driver.address,
        driverNo: driver.driverNo,
        cafeid: cafeid
      }
      console.log("In data body");
      console.log(JSON.stringify(data));

      this.props.loaderStatus({ status: true, message: edit ? 'Updating Driver...' : 'Adding Driver' });

      if (this.state.edit) {
        const dockey = this.state.driver.key;
        firebase.driverCollection.doc(dockey).set(data).then((docRef) => {
          this.props.navigation.navigate('Drivers');
          alert("Driver Updated Successfully!");
          this.setState({ driver: [] })
          this.props.loaderStatus({ status: false, message: null });
        })
          .catch((error) => {
            console.error("Error adding document: ", error);
            alert(error.message);
            this.props.loaderStatus({ status: false, message: null });
          });
      } else {
        firebase.driverCollection.add(data).then((docRef) => {
          this.props.navigation.navigate('Drivers');
          alert("Driver Add Successfully!");
          this.setState({ driver: [] })
          this.props.loaderStatus({ status: false, message: null });
        })
          .catch((error) => {
            console.error("Error adding document: ", error);
            this.props.loaderStatus({ status: false, message: null });

          });
      }
    }
  }

  _deleteConfirmation = () => {
    Alert.alert(
      'Alert!',
      'Are you sure you want to delete this Driver?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this._DriverDelete() },
      ],
      { cancelable: false }
    )
  }


  render() {
    const { driver, edit } = this.state;
    return (
      <>
        <Header>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>{edit ? 'Edit' : 'Add'} Driver</Title>
          </Body>
          <Right></Right>
        </Header>

        <LoaderComponent />

        <ScrollView style={styles.container}>
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'Enter Name'}
              value={driver.name}
              style={{ height: 35, padding: 5, fontWeight: "bold" }}
              onChangeText={(text) => this.updateTextInput(text, 'name')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'Enter email'}
              value={driver.email}
              style={{ height: 35, padding: 5, fontWeight: "bold" }}

              onChangeText={(text) => this.updateTextInput(text, 'email')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'Enter phone no.'}
              value={driver.phonenumber}
              style={{ height: 35, padding: 5, fontWeight: "bold" }}

              onChangeText={(text) => this.updateTextInput(text, 'phonenumber')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              style={{ height: 35, padding: 5, fontWeight: "bold" }}

              placeholder={'Enter Driver Number'}
              value={driver.driverNo}
              onChangeText={(text) => this.updateTextInput(text, 'driverNo')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={{ height: 100, fontWeight: "bold", paddingLeft: 5, borderColor: "lightgrey", textAlignVertical: 'top', }}
              placeholder={'Enter Address'}
              value={driver.address}
              onChangeText={(text) => this.updateTextInput(text, 'address')}
            />
          </View>
        </ScrollView>
        <Footer>
          {
            this.state.edit ?
              <FooterTab>
                <Button
                  danger
                  onPress={() => this._deleteConfirmation()} >
                  <Text style={{ fontWeight: "bold", fontSize: 15, color: "#FFF" }}>{this.state.edit ? 'Delete' : 'Save'}</Text>
                </Button>
              </FooterTab> : null
          }
          <FooterTab>
            <Button
              onPress={() => this.saveBoard()} >
              <Text style={{ fontWeight: "bold", fontSize: 15, color: "#FFF" }}>{this.state.edit ? 'Update' : 'Save'}</Text>
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
export default connect(mapStateToProps, { loaderStatus })(AddDriver);