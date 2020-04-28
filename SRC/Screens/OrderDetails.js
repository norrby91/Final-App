
//PUBLIC ORDER DETAILS SCREEN TO CHECKOUT FUNCTION
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, ListView, Text, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
require('firebase/firestore');


import { decode, encode } from 'base-64'
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }



import { withNavigation } from 'react-navigation'
import { Container, Header, Content, Footer, FooterTab, Button, ListItem, Left, Right, Body, Title, Radio } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { changeProductQuantity } from '../actions/cartAction';
import AsyncImage from '../Components/public/AsyncImageComponent';


class OrderDetails extends Component {

  constructor() {
    super();
    this.state = {

    };
  }
//RENDER ORDER FROM PREVIOUS SCREEN AND ADD QUANTITY OR SUBTRACT
  renderItem = data =>
    <ListItem
    >
      <Left>
        <AsyncImage image={'menus/' + data.item.key + ".jpg"}
          style={{
            backgroundColor: "grey",
            justifyContent: "center",
            resizeMode: "stretch",
            height: 75,
            flex: 1,
            borderRadius: 5,
          }}
          refresh={this.state.refresh}></AsyncImage>
        <View style={{ flexDirection: "column",paddingLeft:10 }}>
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
  // RENDER ON SCREEN OBJECTS
  render() {
    
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
            <Title>Order Details</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content style={{ backgroundColor: "#fff" }}>
          <FlatList
            data={cart}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={item => this.renderItem(item)}
            keyExtractor={item => item.key}
            extraData={this.state}
          />
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

        <Footer style={{ backgroundColor: '#C1E319' }}>
          <FooterTab>
            <Button style={{ backgroundColor: '#C1E319' }} onPress={() => this.props.navigation.navigate('CheckOut', { cafeid: this.props.navigation.getParam('cafeid') })}><Text style={{ fontWeight: "bold", color: "#fff" }}>Process To Check Out</Text></Button>
          </FooterTab>
        </Footer>
      </>
    )
  }
}
//apply css to screen
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
});
export default connect(mapStateToProps, { changeProductQuantity })(OrderDetails);