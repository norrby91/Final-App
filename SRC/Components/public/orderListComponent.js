import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    FlatList,
    Fab,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    View,
    Text,
    StatusBar,
    StyleSheet,
    ScrollView,
    PixelRatio
}
    from 'react-native';
import { Card, CardItem, Body, Icon, Right, Left, ListItem, Button } from "native-base";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class OrderList extends Component {
    constructor(props) {
        super(props);
    }


    calcTotal = (orderItems) => {
        let total = 0;
        orderItems.forEach(item => {
            total += parseFloat(item.quantity) * parseFloat(item.price);
        })
        return total.toFixed(2);
    }

    calcItem = (orderItems) => {
        let items = 0;
        orderItems.forEach(item => {
            items += (item.orderedamount);
        })
        return items;
    }
    filterOrder = (ordersList) => {
        console.log(ordersList);
        let filteredOrder = [];
        ordersList.forEach(order => {
            console.log("hhh");
            console.log(order.orderdate.toDate());
            const orderTimestamp = order.orderdate.toDate();
            const todayTimestanp = new Date();

            console.log(orderTimestamp);
            const orderdate = orderTimestamp.toString().substr(3, 12);
            const todaydate = todayTimestanp.toString().substr(3, 12);

            let ordreIndex = filteredOrder.findIndex(element => element.orderdate === orderdate);
            if (ordreIndex !== -1) {
                const temOrderItem = {
                    ...order
                }
                filteredOrder[ordreIndex].orders = [...filteredOrder[ordreIndex].orders, temOrderItem];
            } else {
                const temOrder = {
                    orderdate: orderdate,
                    orders: [
                        {
                            ...order
                        }
                    ]
                }
                if (this.props.latest) {
                    console.log("In");
                    // alert("hello");
                    console.log(orderdate + " " + todaydate);
                    if (orderdate == todaydate && order.status != 'completed') {
                        console.log("Valid")
                        filteredOrder = [...filteredOrder, temOrder];
                    }
                    else {
                        console.log("NOt Valid")

                    }
                }
                else {
                    filteredOrder = [...filteredOrder, temOrder];
                }
            }
        });
        console.log("Filter Order");
        console.log(filteredOrder);
        return filteredOrder;
    }
    renderOrderItem = ({ item }) => {
        return (
            <ListItem button>

                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View>
                        <Text style={{ fontSize: 12 / PixelRatio.getFontScale(), color: "#7357BB" }}>{item.productname}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 12 / PixelRatio.getFontScale(), fontWeight: "bold" }}>Items:</Text><Text>{item.orderedamount}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 12 / PixelRatio.getFontScale() }}>£{(item.unitcost * item.orderedamount).toFixed(2)}</Text>
                    </View>
                </View>

            </ListItem>
        )
    }
    formateOrderDate = (orderdate) => {
        console.log("h");
        console.log(orderdate);
        return `${orderdate.substr(1, 6)}, ${orderdate.substr(7, 6)}`;
    }
    renderOrders = ({ item }) => {
        return (
            <View style={{ padding: 10, margin: 10 }}>
                <Text style={{ color: '#39304A', padding: 10, fontWeight: 'bold', fontSize: 15 / PixelRatio.getFontScale() }}>{this.formateOrderDate(item.orderdate)}</Text>
                <FlatList
                    data={item.orders}
                    renderItem={this._renderOrderItems}
                    keyExtractor={(item, index) => index.toString()} />
            </View>
        )
    }

    _renderOrderItems = ({ item }) => {
        return (
            <Card transparent style={styles.orderItemCard}>
                <CardItem button
                    style={{ backgroundColor: '#FFF', padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#B0A990' }}
                    onPress={() => console.log("hello")}>
                    <Left>
                        <Text numberOfLines={1} style={{ fontSize: 13 / PixelRatio.getFontScale(), fontWeight: 'bold' }}>Order # : <Text style={{ color: '#7D7461' }}>{item.key}</Text></Text>
                    </Left>
                    {/* <Body/> */}
                    <Right>
                        <View style={{ backgroundColor: "green", borderRadius: 2, paddingHorizontal: 5 }}>
                            <Text style={{ fontWeight: "bold", color: '#FFF', fontSize: 14 / PixelRatio.getFontScale(), textAlign: 'right', alignSelf: 'stretch' }}>Open</Text>
                        </View>
                    </Right>
                </CardItem>
                <CardItem button
                    style={{ backgroundColor: '#FFF', flexDirection: 'row' }}
                    onPress={() => this.props.navigation.navigate('OrderDetail', { orderkey: item.key })}>
                    <View style={{ flex: 0.9 }}>

                        <Text style={{ fontSize: 11 / PixelRatio.getFontScale() }}>Items : {item.orderitems.length}</Text>
                        <Text style={{ color: '#7D7461', fontWeight: 'bold', fontSize: 11 / PixelRatio.getFontScale() }}>Total: £{this.calcTotal(item.orderitems)}</Text>

                        <View style={{ paddingBottom: 10 }}>
                            <Text style={{ fontSize: 12 / PixelRatio.getFontScale() }}><Text style={{ fontWeight: 'bold' }}>Order Type: </Text>{item.collection == 'no' ?
                                'Delivery' : 'Collection'}</Text>

                            {
                                item.collection == 'no' ?
                                    <Text style={{ fontSize: 12 / PixelRatio.getFontScale() }}><Text style={{ fontWeight: 'bold' }}>Delivery Time:
                                </Text>{
                                            item.deliverydatetime.toDate().toString().substr(15, 10)}
                                    </Text>

                                    : null}

                        </View>
                    </View>
                    <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
                        <FontAwesome5 name="chevron-right" size={12} color="#39304A" />
                    </View>
                </CardItem>
            </Card >
        )
    }

    render() {
        const { orders, error } = this.props;
        console.log("Order List Component");
        console.log(this.props.orders);
        return (
            <View style={{ flex: 1, backgroundColor: '#F1F1F1' }}>
                {
                    orders.length > 0 ?
                        <FlatList
                            data={this.filterOrder(orders)}
                            renderItem={this.renderOrders}
                            contentContainerStyle={{ paddingBottom: 120 }}
                            keyExtractor={(item, index) => index.toString()} />
                        :
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: "center" }}>

                            <View style={{ marginTop: 30 }}>
                                <Ionicons name="ios-document" size={150} color="#999" />
                            </View>

                            <View>
                                <Text style={{ textAlign: 'center', fontSize: 25 / PixelRatio.getFontScale(), fontWeight: "bold", color: '#ccc', marginTop: 20, padding: 20 }}>No Orders Currently Available</Text>
                            </View>

                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({

    orderItemCard: {
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#DDD',
        borderRadius: 8,
        backgroundColor: "#FFF",
        shadowColor: "#CCC",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 1

    }

})