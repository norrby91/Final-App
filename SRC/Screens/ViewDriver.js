import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, ListView, Alert, TouchableOpacity } from 'react-native';

import * as firebase from 'firebase';
require('firebase/firestore');

import { decode, encode } from 'base-64'
import { FlatList } from 'react-native-gesture-handler';
import { Divider, ListItem } from 'react-native-elements';
import { Container, Header, Content, Footer, FooterTab, Button, Fab, Left, Text, Right, Body, Title, Card, CardItem, Input } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';


if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }


import { useNavigation } from '@react-navigation/native';
import { withNavigation } from 'react-navigation';



class ViewDriver extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      userArr: [],
      data: "",
    };
  }

  onPress(item, index) {
    if (item.userArr.length < item.limit) {
      this.props.navigation.navigate("DriverDetails", {
        userkey: item.key[index],
      })
    } else Alert.alert("No Driver Available")
  }

  GoToButton({ DriverDetails }) {
    const navigation = useNavigation();
  }

  componentDidMount() {
    const { cafeid } = this.props.logindetails;
    console.log(this.props.logindetails);
    this.firestoreRef = firebase.firestore().collection('Driver').where('cafeid', '==', cafeid);
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getCollection = (querySnapshot) => {
    const userArr = [];
    querySnapshot.forEach((res) => {
      const { name, email, phonenumber, driverNo, address } = res.data();
      userArr.push({
        key: res.id,
        res,
        name,
        email,
        phonenumber,
        driverNo,
        address
      });
    });
    this.setState({
      userArr,
      isLoading: false,
    });
  }

  render() {
    return (
      <>
        <Header style={{ backgroundColor: '#C1E319' }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Drivers</Title>
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
              <ScrollView style={styles.container}>
                {
                  this.state.userArr.map((item, i) => {
                    return (
                      <ListItem
                        key={i}
                        chevron
                        bottomDivider
                        title={item.name}
                        subtitle={<View>
                          <Text>Phone Number: {item.phonenumber}</Text>
                          <Text>Email: {item.email}</Text>
                          <Text>Driver no: {item.driverNo}</Text>
                          <Text>Address: {item.address}</Text>
                        </View>}
                        body={item.driverNo}
                        onPress={() => {
                          this.props.navigation.navigate('DriverDetails', {
                            userkey: item.key
                          });
                        }} />
                    );
                  })
                }
              </ScrollView>
              <Fab
                active={true}
                direction="up"
                containerStyle={{}}
                style={{ backgroundColor: '#4CAF50' }}
                position="bottomRight"
                onPress={() => this.props.navigation.navigate('DriverForm')}>

                <Ionicons name="md-add" color="#FFF" size={14} />
              </Fab>
            </>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 22
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = (state) => ({
  logindetails: state.SignInReducer.logindetails
});
export default connect(mapStateToProps, {})(ViewDriver);