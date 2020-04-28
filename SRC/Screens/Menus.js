import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation'

import * as firebase from 'firebase';
require('firebase/firestore');
require('firebase/storage');

import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { Container, Header, Content, Footer, FooterTab, Button, Left, Right, ListItem, Body, Title, Card, CardItem, Thumbnail } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux';
import { emptyCart } from '../actions/cartAction';


import AsyncImage from '../Components/public/AsyncImageComponent';





class Menus extends Component {
  constructor(props) {
    super(props);
    this.firestoreRef = firebase.firestore().collection('Cafes')
    this.state = {
      isLoading: true,
      cafes: [],
      menuimage: null
    };
  }


  componentDidMount() {
    this.cafes = this.firestoreRef.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.cafes();
  }

  getCollection = (querySnapshot) => {
    const cafes = [];
    querySnapshot.forEach((res) => {
      const { CafeName } = res.data();
      console.log("Menusss");

      console.log(res.data());

      cafes.push({
        key: res.id,
        res,
        CafeName
      });
    });
    this.setState({
      cafes,
      isLoading: false,
    });
  }

  navigateToMenu = (item) => {
    this.props.navigation.navigate("OrderMenu", { cafeid: item.key, cafename: item.CafeName })
  }


  _getImages = async () => {

    const ref = firebase.storage().ref('Cafes/jitters.jpg');
    const url = await ref.getDownloadURL()

    return this.setState({ menuimage: url })


  }
  _renderItem = ({ item }) => {
    // this._getImages();
    const imagename = item.CafeName.replace(' ', '').toLowerCase();
    console.log(imagename);
    return (
      <Card style={{ borderRadius: 5 }}>

        <CardItem cardBody style={{ borderRadius: 5 }}>
         
          <AsyncImage image={'Cafes/' + imagename + ".jpg"} style={{ height: 180, width: null, flex: 1, borderRadius: 5 }} refresh={this.state.refresh}></AsyncImage>
         
          <View style={{ position: "absolute", top: 10, left: 10, padding: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 24, color: "#fff" }}>{item.CafeName}</Text>
          </View>

          <Button onPress={() => this.navigateToMenu(item)} block bordered style={{ position: "absolute", right: 0, bottom: 0, margin: 10, padding: 20, borderColor: "#efefef", borderRadius: 5, paddingVertical: 150 }}>
            <Text style={{ fontWeight: "bold", fontSize: 15, color: "#fff" }}>View Menu</Text>
          </Button>
        </CardItem>
      </Card>

    )
  }



  render() {
    return (
      <>
        <Header style={{ backgroundColor: '#C1E319' }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
              <MaterialIcons name="menu" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>UU FAST ORDER</Title>
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
            </View> : <Content padder>
              {/* <Image style={styles.logo} source={require("../../Assets/menupic.jpg")}  ></Image> */}
              <FlatList
                data={this.state.cafes}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </Content>
        }


      </>
    );
  }
}

const styles = StyleSheet.create({
  containner: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    marginTop: 20,
    fontWeight: '800',
    fontSize: 20,
  },
  button: {
    marginHorizontal: 30,
    borderBottomColor: "#2db6e3",
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
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


  form: {
    flex: 1
  }
})

// export default withNavigation(Menus)
const mapStateToProps = (state) => ({
  cart: state.CartReducer.cart,
  cartTotal: state.CartReducer.cartTotal,
});
export default connect(mapStateToProps, { emptyCart })(Menus);