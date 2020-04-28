//GENERATE ORDER DETAILS

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, ListView, Text, TouchableOpacity, PixelRatio,Alert } from 'react-native';
import * as firebase from 'firebase';
require('firebase/firestore');


import { decode, encode } from 'base-64'
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }

import { connect } from 'react-redux';

import { withNavigation } from 'react-navigation'
import { Container, Header, Content, Footer, FooterTab, Button, Left, Right, ListItem, Body, Title, Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { addToCart, removeItem } from '../actions/cartAction.js';
import OrderListComponent from '../Components/public/orderListComponent';


class OrderMenu extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true,
            order: {}
        };
    }

//GET ORDER KEY PARAM FROM PREVIOUS SCREEN
// SET FIREBASE REF
//PUSH ORDER TO STATE TO DISPLAY ITEMS 
//IF STATEMENT IF NOT DOC FOUND
//SET LOAD TO FALSE IF WORKED
    componentDidMount() {
        // if(data) console.log(data.name); // => Job here
        console.log("NAV: ", this.props.navigation)
        const orderkey = this.props.navigation.getParam('orderkey');
        console.group(orderkey);
        const dbRef = firebase.firestore().collection('Orders').doc(orderkey)
        dbRef.get().then((res) => {
            if (res.exists) {
                const Order = res.data();
                console.log(Order);
                this.setState({
                    order: {
                        key: res.id,
                        collection: Order.collection,
                        orderdate: Order.orderdate,
                        deliverydatetime: Order.deliverydatetime,
                        orderitems: Order.orderitems,
                        paymenttype: Order.paymenttype,
                        userid: Order.userid,
                        userinfo: Order.userinfo
                    },
                    isLoading: false,
                });
                console.log(this.state);
            } else {
                console.log("Document does not exist!");
            }
        });
    }
//complete order function for cafes and drivers
    updateOrder() {
        this.setState({
            isLoading: true,
        });
        const { logindetails } = this.props;
        const orderkey = this.props.navigation.getParam('orderkey');
        console.group(orderkey);
        const updateDBRef = firebase.firestore().collection('Orders').doc(orderkey);
        //UPDATE DATABASE REFERENCE TO COMPLETE ORDERS 
        updateDBRef.update({ status: 'completed' }).then((docRef) => {
            this.props.navigation.navigate('Orders');
            Alert.alert(
                'Update Order',
                'Order Updated Successfuly ',
                [
                    { text: 'Ok', onPress: () => console.log('COMPLETED'), style: 'cancel' },
                ],
                {
                    cancelable: true
                }
            );
        })
            .catch((error) => {
                console.error("Error: ", error);
                this.setState({
                    isLoading: false,
                });
            });
    }

    //CALCULATE TOTAL 
    calcTotal = (orderItems) => {
        let total = 0;
        orderItems.forEach(item => {
            total += parseFloat(item.quantity) * parseFloat(item.price);
        })
        return total.toFixed(2);
    }

    //RENDER MIDDLE TABLE WITH ITEMS AND QUNTITY 
    _renderOrderItems = ({ item }) => {

        return (
            <ListItem >
                <View style={{ flex: 1, flexDirection: "row", paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
                    <Text style={{ flex: 0.4, fontSize: 11 / PixelRatio.getFontScale() }}>{item.menuname}</Text>

                    <Text style={{ flex: 0.3, fontSize: 11 / PixelRatio.getFontScale(), textAlign: "center" }}>{item.quantity}</Text>
                    <Text style={{ flex: 0.3, textAlign: "right", fontSize: 11 / PixelRatio.getFontScale() }}>£{parseFloat(item.price).toFixed(2)}</Text>
                </View>
            </ListItem>
        )
    }


    render() {
        console.log(this.state);
        const { params } = this.props.navigation.state;
        const { navigate, cart } = this.props.navigation;
        const orderDetail = this.state.order;
        const { logindetails } = this.props;
        //const key = this.state.dataSource.filter(item => item.isSelect).length;
        console.log(orderDetail.deliverydatetime);
        return (

            <>
                <Header style={{ backgroundColor: '#C1E319' }} >
                
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
                                <View style={{ padding: 10, backgroundColor: "#ccc", }}>
                                    <Text style={{ paddingVertical: 2.5, paddingHorizontal: 5, fontSize: 14 / PixelRatio.getFontScale(), fontWeight: "bold", color: "#7D7461" }}>Order #: <Text style={{ color: "#000" }}>{orderDetail.key}</Text></Text>
                                    <Text style={{ paddingVertical: 2.5, paddingHorizontal: 5, fontSize: 14 / PixelRatio.getFontScale(), fontWeight: "bold", color: "#7D7461" }}>Order Type: <Text style={{ color: "#000" }}>{orderDetail.collection === 'yes' ? 'Collection' : 'Delivery'}</Text></Text>
                                    <Text style={{ paddingVertical: 2.5, paddingHorizontal: 5, fontSize: 14 / PixelRatio.getFontScale(), fontWeight: "bold", color: "#7D7461" }}>Order Time: <Text style={{ color: "#000" }}></Text>{orderDetail.deliverydatetime.toDate().toString().substr(3, 21)}</Text>
                                </View>
                                <View style={{ padding: 15, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flex: 0.8 }}>
                                        <Text style={{ fontSize: 14 / PixelRatio.getFontScale(), fontWeight: "bold", color: "#7D7461" }}>Ordered Items</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#DDD', height: 1, marginLeft: 10, flex: 1 }} />
                                </View>
                                <ListItem style={[styles.list_item, { borderBottomWidth: 1, marginLeft: 0, paddingLeft: 18, backgroundColor: "#f1f1f1", marginTop: 10 }]}>
                                    <View style={{ flex: 1, flexDirection: "row", paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
                                        <Text style={{ fontSize: 11 / PixelRatio.getFontScale(), flex: 0.4, fontWeight: "bold" }}>Products</Text>
                                        <Text style={{ fontSize: 11 / PixelRatio.getFontScale(), flex: 0.3, fontWeight: "bold", textAlign: "center" }}>Quantity</Text>
                                        <Text style={{ fontSize: 11 / PixelRatio.getFontScale(), flex: 0.3, textAlign: "right", fontWeight: "bold" }}>Price</Text>
                                    </View>
                                </ListItem>
                                <FlatList
                                    data={orderDetail.orderitems}
                                    renderItem={this._renderOrderItems}
                                    keyExtractor={this._keyExtractor} />

                                <ListItem style={[styles.list_item, { borderBottomWidth: 1, marginLeft: 0, paddingLeft: 18, backgroundColor: "#f1f1f1", marginTop: 10 }]}>
                                    <View style={{ flex: 1, flexDirection: "row", paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
                                        <Text style={{ fontSize: 11 / PixelRatio.getFontScale(), flex: 0.4, fontWeight: "bold" }}></Text>
                                        <Text style={{ fontSize: 11 / PixelRatio.getFontScale(), flex: 0.3, fontWeight: "bold", textAlign: "center" }}></Text>
                                        <Text style={{ fontSize: 11 / PixelRatio.getFontScale(), flex: 0.3, textAlign: "right", fontWeight: "bold" }}>Total: {this.calcTotal(orderDetail.orderitems)}</Text>
                                    </View>
                                </ListItem>


                            </Content>
                            {
                                logindetails.usertype !== 'public' ?
                                    <Footer style={{ backgroundColor: '#C1E319' }}>
                                        <FooterTab>
                                            <Button
                                            style={{ backgroundColor: '#C1E319' }}
                                                onPress={() => this.updateOrder()}
                                            >
                                                <Text style={{ fontWeight: "bold", color: "#fff" }}>Complete Order</Text>
                                            </Button>
                                        </FooterTab>
                                    </Footer> : null
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
    logindetails: state.SignInReducer.logindetails
});
export default connect(mapStateToProps, { addToCart, removeItem })(OrderMenu);
