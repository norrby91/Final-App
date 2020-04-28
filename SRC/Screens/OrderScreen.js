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
            orders: []
            // cafeid: this.props.navigation.getParam('cafeid')
        };
    }

    onPress(item, index) {
        if (item.userArr.length < item.limit) {
            this.props.navigation.navigate("OrderDetails", {
                ConfirmOrder: item.key[index],
            })
        } else Alert.alert("There is an error with your Order")
    }

    //grab collection
    componentDidMount() {
        const userid = this.props.userid;
        this.firestoreRef = firebase.firestore().collection('Orders').where('userid', '==', userid);
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
        const orders = [];
        querySnapshot.forEach((res) => {
            console.log("Orders");
            console.log(res.data());
            //   const { cafe } = res.data();
            orders.push({
                key: res.id,
                ...res.data()
            });
        });
        this.setState({
            orders,
            isLoading: false,
        });
        console.log(this.state.orders);
    }

    FlatListItemSeparator = () => <View style={styles.line} />;

    renderOrderItme = (data) => {

    }

    _renderOrderItems = ({ item }) => {
        return (
            <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 0.6 }}>
                    <Text style={{}}>{item.menuname}</Text>
                </View>
                <View style={{ flex: 0.2 }}>
                    <Text style={{ textAlign: "center" }}>{item.quantity}</Text>
                </View>
                <View style={{ flex: 0.2 }}>
                    <Text style={{ textAlign: "right" }}>£{parseFloat(item.price).toFixed(2)}</Text>
                </View>
            </View>
        )
    }

    _calculateTotal = (orderitems) => {
        let total = 0;
        // console.log("hello");
        // console.log(JSON.stringify(orderitems[0]));

        orderitems.forEach(item => {
            // console.log("hhh");
            // console.log(item);
            // total += item.orderedamount * item.unitcost;
        });
        return total;
        return total;
    }
    renderOrders = ({ item }) => {
        console.log('render item');
        console.log(item);
        return (
            <Card style={{ borderRadius: 5 }}>
                <CardItem style={{ borderBottomWidth: 1, borderTopRightRadius: 5, borderTopLeftRadius: 5, borderColor: "#efefef" }}>
                    <Left>
                        <Text>Order Id: <Text style={{ fontWeight: "bold" }}>{item.key}</Text></Text>
                    </Left>
                </CardItem>
                <CardItem cardBody>
                    <View style={{ flexDirection: "column", flex: 1, paddingHorizontal: 15 }}>
                        <View style={{ flexDirection: "row", flex: 1, borderColor: "#efefef", borderBottomWidth: 1 }}>
                            <View style={{ flex: 0.6 }}>
                                <Text style={{ fontWeight: "bold" }}>Product</Text>
                            </View>
                            <View style={{ flex: 0.2 }}>
                                <Text style={{ fontWeight: "bold", textAlign: "center" }}>Qty</Text>
                            </View>
                            <View style={{ flex: 0.2 }}>
                                <Text style={{ fontWeight: "bold", textAlign: "right" }}>Price</Text>
                            </View>
                        </View>


                        <FlatList
                            data={item.orderitems}
                            renderItem={this._renderOrderItems}
                            keyExtractor={(item, index) => index.toString()} />
                    </View>
                </CardItem>
                <CardItem style={{ borderTopWidth: 1, borderBottomRightRadius: 5, borderBottomLeftRadius: 5, borderColor: "#efefef" }}>
                    <Left>

                    </Left>
                    <Body>

                    </Body>
                </CardItem>
            </Card>
        )
    }

    render() {
        console.log(this.state.cafeid);
        const { params } = this.props.navigation.state;
        const { navigate, cart } = this.props.navigation;
        const { orders } = this.state;
        //const key = this.state.dataSource.filter(item => item.isSelect).length;

        return (

            <>
                <Header style={{ backgroundColor: '#C1E319' }}>
                    <Left>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Menus')}>
                            <MaterialIcons name="arrow-back" size={25} color="#fff" />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Title>Orders</Title>
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
                            <Text style={{fontWeight:"bold"}}>
                                Loading..
                            </Text>
                        </View> :

                        orders.length > 0 ?
                            <Content>
                                {/* <FlatList
                                    data={orders}
                                    renderItem={this.renderOrders}
                                    contentContainerStyle={{ paddingBottom: 120 }}
                                    keyExtractor={(item, index) => index.toString()} /> */}
                                    <OrderListComponent navigation={this.props.navigation} orders={orders}/>
                            </Content>
                            :
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1
                            }}>
                                <Text style={{ fontWeight: "bold", fontSize: 15 }}>No Orders Found</Text>
                            </View>
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
    userid: state.SignInReducer.logindetails.uid
});
export default connect(mapStateToProps, { addToCart, removeItem })(OrderMenu);
