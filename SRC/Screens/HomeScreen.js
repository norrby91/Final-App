//PAGE NO LONGER IN USE 
//THIS WAS THE FIRST HOME PAGE CREATED FOR DEMO PURPOSES 

import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, StatusBar, Image, TouchableOpacity } from 'react-native';






class Home extends React.Component {
  constructor(props){
    super(props);
    state = {
    email: "",
    displayName: "",
  };

}
      render() {
        
        return(
          
            <View style= {styles.containner}>
              <StatusBar barStyle="light-content"></StatusBar>
            <Image style = {styles.logo} source = {require("../../Assets/uulogo.jpg")}  ></Image>
            <Text style = {styles.greeting}> View menus to order....</Text>
                 <TouchableOpacity style = {styles.button}  onPress = {() => this.props.navigation.navigate("Menus")}>
                  <Text style={styles.buttontxt}>Menus</Text>
                 </TouchableOpacity>
                <TouchableOpacity style = {styles.button} onPress = {() => this.props.navigation.navigate("Register")}>
                <Text style={styles.buttontxt}>Register</Text>
                </TouchableOpacity>
                 <TouchableOpacity style = {styles.button} onPress = {() => this.props.navigation.navigate("ViewDriver")}>
                <Text style={styles.buttontxt}>View Driver</Text>
                </TouchableOpacity> 
                <TouchableOpacity style = {styles.button} onPress = {() => this.props.navigation.navigate("Login")}>
                <Text style={styles.buttontxt}>Login</Text>
                </TouchableOpacity> 
                <TouchableOpacity style = {styles.button} onPress = {() => this.props.navigation.navigate("AddMenuItem")}>
                <Text style={styles.buttontxt}>Add Menu items</Text>
                </TouchableOpacity> 
            </View>
        )
      }
    }
  
      
      const styles = StyleSheet.create ({
        containner: {
          flex: 1,
          padding :20,
          alignItems: 'center',
          justifyContent: 'center',
        },
        greeting:{
          marginTop: 20,
              fontWeight: '800',
              fontSize: 20,
        },
          button: {
            marginHorizontal: 30,
            borderBottomColor: "#2db6e3",
            borderRadius: 4,
            height:52,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop:10,
            backgroundColor: "#2db6e3",
            padding: 10,
            width: '100%'
          },
          buttontxt: {
            fontWeight: '800',
            fontSize: 20,
            color: 'white'
          },
          logo: {
            marginTop: -64, 
            height: 200,
            width: '100%',
            alignContent: "center"
          },
      
      
        form : {
          flex: 1
        }
      })


  export default Home;