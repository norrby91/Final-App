import React, { Component } from 'react';
import { View, StyleSheet, Button, ScrollView, TextInput, ActivityIndicator, ListView, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';
import * as firebaseCollection from "../../Firebase";


import { decode, encode } from 'base-64'
import { FlatList } from 'react-native-gesture-handler';
import { Divider, ListItem } from 'react-native-elements';

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }


import { useNavigation } from '@react-navigation/native';

import { Container, Header, Content, Footer, FooterTab, Left, Right, Body, Title, Fab } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { loaderStatus } from '../actions/loaderAction';
import LoaderComponent from '../Components/common/loaderComponent'

const dummyMenu = {
  name: null,
  price: null,
  description: null,
  foodtype: null,
  foodtypeNo: null,
}
class ViewMenuItems extends Component {

  constructor() {
    super();

    this.state = {
      isLoading: true,
      userArr: []
    };
  }
  GoToButton({ HomeScreen }) {
    const navigation = useNavigation();
  }

  componentDidMount() {
    const { cafeid } = this.props.logindetails;
    console.log(this.props.logindetails);
    console.log(cafeid);
    this.firestoreRef = firebase.firestore().collection('Menus').where('cafeid', '==', cafeid);
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getCollection = (querySnapshot) => {
    const userArr = [];
    querySnapshot.forEach((res) => {
      const { name, description, foodtype, price, foodtypeNo } = res.data();
      userArr.push({
        key: res.id,
        res,
        name,
        description,
        foodtypeNo,
        foodtype,
        price
      });
    });
    this.setState({
      userArr,
      isLoading: false,
    });
  }

 

  
  render() {
    console.log(dummyMenu);
    return (
      <>
        <Header  style={{ backgroundColor: '#C1E319' }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Menus</Title>
          </Body>
          <Right></Right>
        </Header>
        <LoaderComponent />
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
            <ScrollView style={styles.container}>
              {
                this.state.userArr.map((item, i) => {
                  return (
                    <ListItem
                      // onPress={() => this.props.navigation.navigate('MenuForm')}
                      key={i}
                      chevron
                      bottomDivider
                      title={<Text>{item.name} {item.price}</Text>}
                      subtitle={<View>
                        <Text>Description: {item.description}</Text>
                        <Text>FoodType: id:{item.foodtypeNo}{item.foodtype}</Text>
                      </View>}
                    
                      onPress={() => {
                        this.props.navigation.navigate('MenuForm', {
                          menu: item,
                          edit: true
                        });
                      }} />
                  );
                })
              }
            </ScrollView>

        }
        <Fab
          active={true}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#4CAF50' }}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('MenuForm', {
            menu: {
              name: null,
              price: null,
              description: null,
              foodtype: null,
              foodtypeNo: null,
            },
            edit: false
          })}>

          <Ionicons name="md-add" color="#FFF" size={14} />
        </Fab>
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
export default connect(mapStateToProps, { loaderStatus })(ViewMenuItems);