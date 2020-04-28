

import React from 'react'
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import * as firebase from 'firebase'


export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    })
  }

  
  
  render() {
    return(
      <View style= {styles.containner}>
      <ActivityIndicator size="large"></ActivityIndicator>
      </View>

    
    );
  }
}
  
  const styles = StyleSheet.create ({
    containner: {
      flex: 1,
      padding :20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
  
    },

  })