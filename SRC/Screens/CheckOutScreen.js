//CREATE CHECK OUT SCREEN
//CUSTOMER WILL BE ABLE TO ENTER DETAILS TO CONFIRM ORDER
//IMPORT PACKAGES

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, ListView, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { decode, encode } from 'base-64'
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { loaderStatus } from '../actions/loaderAction';

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }



import { withNavigation } from 'react-navigation'
import { Container, Header, Content, Footer, FooterTab, Button, ListItem, Left, Right, Body, Title, Radio, Input, DatePicker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { changeProductQuantity, emptyCart } from '../actions/cartAction';
import * as firebase from "../../Firebase";
import LoadingComponent from '../Components/common/loaderComponent';

class CheckOut extends Component {

  constructor() {
    super();
    //SET STATE FOR ORDER DETAILS
    this.state = {
      paymenttype: "cash",
      ordertype: "collection",
      address: "",
      postalcode: "",
      message: "",
      date: new Date(),
      mode: 'time',
      showdatepicker: false,
      showtimepicker: false,
      deliverydate: new Date(),
      deliverytime: new Date()
    };
  }
//PUSH ORDER TO FIREBASE
  saveBoard() {
    let orderitems = [];
    const cafeid = this.props.navigation.getParam('cafeid');
    this.props.cart.forEach((item) => {
      orderitems.push({
        menuid: item.key,
        menuname: item.name,
        quantity: item.qty,
        price: item.price
      });
    });
//CREATE USER INFO ARRAY
    let userinfo = [];
    //VALIDATION FOR REQUIRED FIELDS
    if (this.state.ordertype == 'delivery') {
      if (this.state.address.trim() == "") {
        alert("Address is required for delivery");
        return false;
      }
      else if (this.state.postalcode == "") {
        alert("Postal Code is required for delivery");
        return false;
      }
      //APPLY STATE TO USER INFO
      userinfo = {
        address: this.state.address,
        postalcode: this.state.postalcode,
        message: this.state.message
      }
    }
    //CREATE ANOTHER  VARIABLE TO HOLD ON INFORMATION ON 
    const a = {
      userid: this.props.userid,
      cafeid: cafeid,
      paymenttype: this.state.paymenttype,
      collection: this.state.ordertype == 'collection' ? 'yes' : 'no',
      userinfo: userinfo,
      orderitems: orderitems,
      orderdate: new Date(),
      deliverydatetime: this.state.deliverytime
    }

    //SET LOADER STATUS 
    //ADD COLLECTION TO FIREBASE
    //NAVIGATE TO ORDER SUCCESS SCREEN 
    //IF UNSUCCESSFULL FLAG ERROR 
    this.props.loaderStatus({ status: true, message: 'Order sending...' });
    firebase.orderCollection.add(a).then((docRef) => {
      this.props.emptyCart();
      this.props.navigation.navigate('OrderSuccess');
      this.props.loaderStatus({ status: false, message: '' });

    })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.props.loaderStatus({ status: false, message: '' });


      });

  }
  //FUNCTION TO APPLY TIME TO ORDER
  //APPLY SECTED DATE/TIME TO DATE CONST
  //CHECK IF DATE IS CORRECT
  //CONSOLE LOG TIME 
  onTimeChange = (event, selectedDate) => {
    console.log(event);
    const date = selectedDate || new Date();
    console.log(selectedDate);
    this.setState({ deliverytime: date, showtimepicker: false })
    console.log("TIME");
    console.log(this.state.deliverytime);
  };
   //FUNCTION TO APPLY DATE TO ORDER
  //APPLY SECTED DATE/TIME TO DATE CONST
  //CHECK IF DATE IS CORRECT
  //CONSOLE LOG DATE
  onDateChange = (event, selectedDate) => {
    console.log(event);
    const date = selectedDate || new Date();
    console.log(selectedDate);
    this.setState({ deliverydate: date, showdatepicker: false })
    console.log(this.state);
  };

  showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };
//ENABLE DATE PICKER
  showDatepicker = () => {
    this.setState({ showdatepicker: true, mode: 'date' })
  };
  //ENABLE TIME PICKER
  showTimepicker = () => {
    this.setState({ showtimepicker: true, mode: 'time' })
  };

  //RENDER CHANGE QUANTITY OBJECTS
  renderItem = data =>
    <ListItem
    >
      <Left>
        <View style={{ flexDirection: "column" }}>
          <View>
            <Text style={styles.title}>{data.item.name}</Text>
          </View>
          <View>
            <Text style={styles.lightText} >{data.item.price}</Text>
          </View>
        </View>
      </Left>
      <Right>
        <View style={{ flexDirection: "row" }}>
          <View style={{ justifyContent: 'center' }}>

            <TouchableOpacity disabled={data.item.qty === 1}
              onPress={() => this.props.changeProductQuantity(data.item.key, data.item.qty - 1, 20)}
              style={{ paddingHorizontal: 15 }}>
              <Icon name='minus' size={13} color="red" />
            </TouchableOpacity>
          </View>

          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>{data.item.qty}</Text>
          </View>

          <View style={{ justifyContent: 'center', paddingHorizontal: 15 }}>
            <TouchableOpacity
              onPress={() => this.props.changeProductQuantity(data.item.key, data.item.qty + 1, 20)}
              style={{ padding: 3 }}>
              <Icon name='plus' size={13} color="green" />
            </TouchableOpacity>
          </View>
        </View>

      </Right>
    </ListItem>
  //RENDER OBJECTS ON SCREEN 
  render() {
    // const cartitems = this.props.navigation.getParam('cartitems');
    const { cart, cartTotal } = this.props;
    console.log(this.props);
    return (
      <>
        <Header style={{ backgroundColor: '#C1E319' }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Check Out</Title>
          </Body>
          <Right></Right>
        </Header>

        <Content style={{ backgroundColor: "#fff" }}>
          <LoadingComponent />
          <View style={{ margin: 15 }}>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>Select a payment method</Text>
          </View>
          <View style={{ marginHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: "#e7e7e7" }}>
            <TouchableOpacity onPress={() => this.setState({ paymenttype: "cash" })} style={{ flexDirection: "row", padding: 13, borderBottomWidth: 1, borderColor: "#e7e7e7" }}> 
              <Radio onPress={() => this.setState({ paymenttype: "cash" })} selected={this.state.paymenttype == 'cash' ? true : false} />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}> Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ paymenttype: "paypal" })} style={{ flexDirection: "row", padding: 13 }}>
              <Radio onPress={() => this.setState({ paymenttype: "paypal" })} selected={this.state.paymenttype == 'paypal' ? true : false} />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}> Paypal</Text>
            </TouchableOpacity>
          </View>

          <View style={{ margin: 15 }}>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>Select Order Type</Text>
          </View>
          <View style={{ marginHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: "#e7e7e7" }}>
            <TouchableOpacity onPress={() => this.setState({ ordertype: "collection" })} style={{ flexDirection: "row", padding: 13, borderBottomWidth: 1, borderColor: "#e7e7e7" }}>
              <Radio onPress={() => this.setState({ ordertype: "collection" })} selected={this.state.ordertype == 'collection' ? true : false} />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}> Collection</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ ordertype: "delivery" })} style={{ flexDirection: "row", padding: 13 }}>
              <Radio onPress={() => this.setState({ ordertype: "delivery" })} selected={this.state.ordertype == 'delivery' ? true : false} />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}> Delivery</Text>
            </TouchableOpacity>
          </View>
          {
            this.state.ordertype == 'delivery' ?
              <>
                <View style={{ margin: 15 }}>
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>Delivery Information</Text>
                </View>
                <View style={{ marginHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: "#e7e7e7" }}>
                  <View style={{ padding: 13, }}>

                    <Input
                      value={this.state.address}
                      onChangeText={(value) => this.setState({ address: value })}
                      placeholder={'Address'}
                      style={{ borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, fontSize: 13, height: 35, fontWeight: "bold", paddingLeft: 5, borderColor: "lightgrey" }} />


                    <Input
                      value={this.state.postalcode}
                      onChangeText={(value) => this.setState({ postalcode: value })}
                      placeholder={'Postal Code'}
                      style={{ marginTop: 15, borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, fontSize: 13, height: 35, fontWeight: "bold", paddingLeft: 5, borderColor: "lightgrey" }} />

                    <Input
                      value={this.state.message}
                      onChangeText={(value) => this.setState({ message: value })}
                      multiline={true}
                      numberOfLines={4}
                      placeholder={'Special Message'}
                      underlineColorAndroid="transparent"
                      style={{ marginTop: 15, borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, fontSize: 13, height: 100, fontWeight: "bold", paddingLeft: 5, borderColor: "lightgrey", textAlignVertical: 'top', }} />
                  </View>
                </View>
              </>
              : null

          }

          <>
            <View style={{ margin: 15 }}>
              <Text style={{ fontSize: 25, fontWeight: "bold" }}>Delivery Date &amp; Time</Text>
            </View>
            <View style={{ marginHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: "#e7e7e7" }}>
              <View style={{ padding: 13, }}>
                {
                  this.state.showtimepicker ?
                    <DateTimePicker
                      timeZoneOffsetInMinutes={0}
                      value={
                        this.state.deliverydate.getDate() !== this.state.deliverytime.getDate() ? this.state.deliverydate : this.state.deliverytime
                      }
                      mode={'time'}
                      is24Hour={false}
                      display="default"
                      onChange={this.onTimeChange}
                    /> : null
                }

                {
                  this.state.showdatepicker ?
                    <DateTimePicker
                      minimumDate={new Date()}
                      locale={"en"}
                      animationType={"fade"}
                      value={this.state.deliverydate}
                      mode={'date'}
                      display="default"
                      onChange={this.onDateChange}
                    /> : null
                }
                <TouchableOpacity onPress={() => this.showDatepicker()}>
                  <Input
                    disabled
                    value={this.state.deliverydate.toString().substring(4, 15)}
                    placeholder={'Delivery Date'}
                    style={{ marginTop: 15, borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, fontSize: 13, height: 35, fontWeight: "bold", paddingLeft: 5, borderColor: "lightgrey" }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.showTimepicker()}>
                  <Input
                    disabled
                    value={this.state.deliverytime.toString().substring(15, 21)}
                    placeholder={'Delivery Time'}
                    style={{ marginTop: 15, borderWidth: 1, paddingHorizontal: 5, borderRadius: 5, fontSize: 13, height: 35, fontWeight: "bold", paddingLeft: 5, borderColor: "lightgrey" }} />
                </TouchableOpacity>

              </View>
            </View>
          </>
      
        </Content>
        <Footer style={{ height: 100 }}>
          <FooterTab style={{ borderRadius: 0 }}>

            <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#DDD', flex: 1, padding: 10, backgroundColor: '#FFF' }}>
              <View style={{ flex: 1, flexDirection: "column", paddingTop: 0, paddingBottom: 0 }}>

                <View style={{ paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.totalCaptionTextStyle}>Sub Total</Text>
                  </View>
                  <View>
                    <Text style={styles.totalTextStyle}>£{cartTotal.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={{ paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.totalCaptionTextStyle}>Tax</Text>
                  </View>
                  <View>
                    <Text style={styles.totalTextStyle}>£ 0.00</Text>
                  </View>
                </View>
                <View style={{ paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.totalCaptionTextStyle}>Grand Total</Text>
                  </View>
                  <View>
                    <Text style={styles.totalTextStyle}>£ {cartTotal.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>

          </FooterTab>
        </Footer>

        <Footer >
          <FooterTab>
            <Button style={{ backgroundColor: '#C1E319' }} onPress={() => this.saveBoard()}><Text style={{ fontWeight: "bold", color: "#fff" }}>Complete Order</Text></Button>
          </FooterTab>
        </Footer>
      </>
    )
  }
}
//APPLY CSS TO SCREEN
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
    backgroundColor: "#192338",
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
  selected: {},
  totalCaptionTextStyle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#39304A'
  },

  totalTextStyle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#7D7461'
  },
});

// export default withNavigation(OrderDetails);
const mapStateToProps = (state) => ({
  cart: state.CartReducer.cart,
  cartTotal: state.CartReducer.cartTotal,
  userid: state.SignInReducer.logindetails.uid
});
export default connect(mapStateToProps, { changeProductQuantity, emptyCart, loaderStatus })(CheckOut);