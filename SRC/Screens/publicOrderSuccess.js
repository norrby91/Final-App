//creates screen to show order ahs been successful

import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, Container, Content, Grid, Col, Footer, FooterTab } from 'native-base';
import {
  ImageBackground,
  Image,
  View,
  Text,
  PixelRatio,
  Alert,
  TouchableOpacity,
  StatusBar,
  BackHandler
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

export default class PublicOrderSuccess extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
  }

//navigate home 
  backToHome = () => {
    this.props.navigation.navigate('Home')
  }
//on screen load add listener 
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backToHome);
  }
//  when leavingscreen remove listener 
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backToHome);
  }
//render success object
  render() {

    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1, backgroundColor: '#39304A' }}>

          <StatusBar backgroundColor={"#39304A"} barStyle="light-content" translucent={false} />

          <Grid style={{ alignItems: 'center' }}>
            <Col>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="check-circle" color="#FFF" size={150} />
              </View>
              <Text style={{ fontSize: 24 / PixelRatio.getFontScale(), fontWeight: "bold", alignSelf: "center", color: '#fff', marginTop: 20, marginBottom: 30 }}>Order Confirmed!</Text>

              <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.3)', paddingHorizontal: 5, paddingVertical: 10, margin: 10, borderRadius: 10 }}>
                <Text style={{ fontSize: 12 / PixelRatio.getFontScale(), color: '#fff', marginHorizontal: 30, textAlign: 'center' }}>You may view your orders anytime by choosing My Orders from the menu</Text>
              </View>


            </Col>
          </Grid>
        </Content>
        <Footer>
          <FooterTab>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this.backToHome()}
                style={{ flex: 1, backgroundColor: '#7D7461', borderRadius: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#FFF', fontWeight: "bold", fontSize: 12 / PixelRatio.getFontScale() }}>BACK TO HOME</Text>
              </TouchableOpacity>
            </View>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
