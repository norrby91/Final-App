//screen to create an order

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, ListView, Text, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
require('firebase/firestore');


import { decode, encode } from 'base-64'
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }

import { connect } from 'react-redux';

import { withNavigation } from 'react-navigation'
import { Container, Header, Content, Footer, FooterTab, Button, Left, Right, ListItem, Body, Title } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { addToCart, removeItem } from '../actions/cartAction.js';
import AsyncImage from '../Components/public/AsyncImageComponent';




class OrderMenu extends Component {

  constructor() {
    super();


    this.state = {
      isLoading: true,
      userArr: [],
      dataSource: [],
      cartitems: [],
      // cafeid: this.props.navigation.getParam('cafeid')
    };
  }
// on press function to navigate to order details
  onPress(item, index) {
    if (item.userArr.length < item.limit) {
      this.props.navigation.navigate("OrderDetails", {
        ConfirmOrder: item.key[index],
      })
    } else Alert.alert("There is an error with your Order")
  }




  //grab collection
  componentDidMount() {
    const cafeid = this.props.navigation.getParam('cafeid');
    this.firestoreRef = firebase.firestore().collection('Menus').where('cafeid', '==', cafeid);
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    // this.check()

  }

  onSelectionsChange = () => {

    this.setState({ selectedItems })
  }


  componentWillUnmount() {
    this.unsubscribe();
  }

  renderSeparator = () => <View style={styles.line}>
  </View>


  getCollection = (querySnapshot) => {
    const userArr = [];
    querySnapshot.forEach((res) => {
      console.log("Menusss");
      console.log(res);
      const { name, description, foodtype, price } = res.data();
      userArr.push({
        key: res.id,
        name,
        description,
        foodtype,
        price,
        qty: 1
      });
    });
    this.setState({
      userArr,
      isLoading: false,
    });
  }

  FlatListItemSeparator = () => <View style={styles.line} />;

  selectItem = (data) => {
    data.isSelect = !data.isSelect;
    data.selectedClass = data.isSelect ? styles.selected : styles.list;
    if (data.isSelect) {
      this.props.addToCart(data);
    }
    else {
      this.props.removeItem(data);
    }
    const index = this.state.dataSource.findIndex(
      item => data.id === item.id
    );
    this.state.dataSource[index] = data;

    this.setState({
      dataSource: this.state.dataSource,
    });
  };

  goToStore = () => this.props.navigation.navigate("Expenses", { selected: this.state.selected, });

  renderItem = ({ item }) => {
    return (
      <ListItem
        onPress={() => this.selectItem(item)}
        style={[styles.list, item.selectedClass, { marginLeft: 0, paddingLeft: 15 }]}
      >
        <Left style={{ flex: 0.25 }}>
          <AsyncImage image={'menus/' + item.key + ".jpg"}
            style={{
              backgroundColor: "grey",
              justifyContent: "center",
              resizeMode: "stretch",
              height: 75,
              // width: 75,
              flex: 1,
              borderRadius: 5,
            }}
            refresh={this.state.refresh}></AsyncImage>
        </Left>
        <Body style={{ flex: 0.6, paddingLeft: 10, }}>
          <View style={{ flexDirection: "column" }}>
            <View>
              <Text style={styles.title}>{item.name}</Text>
            </View>
            <View>
              <Text style={styles.lightText} >{item.description}</Text>
            </View>
          </View>

        </Body>
        <Right>
          <Text style={{ textAlign: "right", fontWeight: "bold" }} >£ {item.price}</Text>
        </Right>
      </ListItem>
    )
  }


  _addToCart = () => {
    const cartitems = [];
    this.state.userArr.forEach((item) => {
      console.log(JSON.stringify(item));
      if (item.isSelect === true) {
        cartitems.push(item);
      }
    });
    // if (cartitems.length == 0) {
    //   alert("Please Select Atleast One Item!");
    //   return false
    // }
    // else {
    const cafeid = this.props.navigation.getParam('cafeid');
    this.props.navigation.navigate("OrderDetails", { cartitems: cartitems, cafeid: cafeid });
    // }

  }
  render() {
    console.log(this.state.cafeid);
    const { params } = this.props.navigation.state;
    const { navigate, cart } = this.props.navigation;

    console.log(this.state);
    //const key = this.state.dataSource.filter(item => item.isSelect).length;

    return (

      <>
        <Header style={{ backgroundColor: '#C1E319' }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Menus</Title>
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
              <Content>
                <FlatList
                  data={this.state.userArr}
                  // ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={item => this.renderItem(item)}
                  keyExtractor={item => item.key}
                  extraData={this.state}
                />
              </Content>
              {
                this.props.cart.length > 0 ?
                  <Footer>
                    <FooterTab>
                      <Button  style={{  backgroundColor: "#C1E319" }} onPress={() => this._addToCart()}>
                        <Text style={{ fontWeight: "bold", color: "#fff" }}>Add To Order</Text>
                      </Button>
                    </FooterTab>
                  </Footer>
                  : null
              }
            </>
        }




      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#192338",
    paddingVertical: 50,
    position: "relative"
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  },
  list: {
    paddingVertical: 5,
    margin: 3,
    flexDirection: "row",
    backgroundColor: "#efefef",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: -1
  },
  lightText: {
    color: "#000",
    width: 200,
    fontWeight: "bold",
    paddingLeft: 0,
    fontSize: 12
  },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  icon: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    left: 290,
    zIndex: 1
  },
  numberBox: {
    position: "absolute",
    bottom: 75,
    width: 30,
    height: 30,
    borderRadius: 15,
    left: 330,
    zIndex: 3,
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center"
  },
  number: { fontSize: 14, color: "#000" },
  selected: { backgroundColor: "forestgreen" },
});

// export default withNavigation(OrderMenu);
const mapStateToProps = (state) => ({
  cart: state.CartReducer.cart,
  cartTotal: state.CartReducer.cartTotal,
});
export default connect(mapStateToProps, { addToCart, removeItem })(OrderMenu);
