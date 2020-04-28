import React, { Component } from 'react';
import {
    Image,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Alert
} from 'react-native';
import { Button, Container, Content, List, ListItem, Icon, Footer, FooterTab, Left, Right } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions } from 'react-navigation';

import { signOut } from '../../actions/authentication/signOutAction';

export default class DrawerContent extends Component {

    navigateToScreen = (route) => () => {
        this.props.navigation.closeDrawer();
        const navigateAction = NavigationActions.navigate({ routeName: route, });
        this.props.navigation.dispatch(navigateAction);
    };

    signOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => signOut(this.props.navigation) },
            ],
            { cancelable: false }
        )
    }

    render() {
        return (
            <Container>
                <Content >
                    <List>
                        <ListItem style={{ flexDirection: "column", marginLeft: 0, backgroundColor: '#F1F1F1', borderColor: '#F1F1F1' }}>
                            <TouchableOpacity
                                style={{ position: "absolute", right: 0, padding: 15 }}
                                onPress={() => this.props.navigation.closeDrawer()}>
                                <Icon name="close" />
                            </TouchableOpacity>
                            <Image source={require('../../../Assets/small_logo.png')}
                                style={{ width: 200, height: 160,  borderColor: '#EEE', borderWidth: 4 }}  />

                            <Text style={{ fontSize: 18 / PixelRatio.getFontScale(), fontWeight: "bold" }}>Welcome to</Text>
                            <Text style={{ fontSize: 12 / PixelRatio.getFontScale() }}>UU Quick Order</Text>
                        </ListItem>

                        <ListItem style={styles.listItemStyle} onPress={this.navigateToScreen('Home')}>
                            <Left>
                                <View style={styles.listItemWrapperStyle}>
                                    <View style={{ flex: 0.2 }}>
                                        <FontAwesome5 name="home" size={20} color="#888" />
                                    </View>
                                    <View style={{ flex: 1, paddingLeft: 20, justifyContent: 'center' }}>
                                        <Text style={styles.listItemTextStyle}>Home</Text>
                                    </View>
                                </View>
                            </Left>
                            <Right>
                                <FontAwesome5 name="chevron-right" size={12} color="#999" />
                            </Right>
                        </ListItem>

                        <ListItem onPress={this.navigateToScreen('Orders')} style={styles.listItemStyle}>
                            <Left>
                                <View style={styles.listItemWrapperStyle}>
                                    <View style={{ flex: 0.2 }}>
                                        <FontAwesome5 name="shopping-bag" size={20} color="#888" />
                                    </View>
                                    <View style={{ flex: 1, paddingLeft: 20, justifyContent: 'center' }}>
                                        <Text style={styles.listItemTextStyle}>My Orders</Text>
                                    </View>
                                </View>
                            </Left>
                            <Right>
                                <FontAwesome5 name="chevron-right" size={12} color="#999" />
                            </Right>
                        </ListItem>
                        <ListItem onPress={this.navigateToScreen('MyAccount')} style={styles.listItemStyle}>
                            <Left>
                                <View style={styles.listItemWrapperStyle}>
                                    <View style={{ flex: 0.2 }}>
                                        <FontAwesome5 name="user" size={20} color="#888" />
                                    </View>
                                    <View style={{ flex: 1, paddingLeft: 20, justifyContent: 'center' }}>
                                        <Text style={styles.listItemTextStyle}>My Account</Text>
                                    </View>
                                </View>
                            </Left>
                            <Right>
                                <FontAwesome5 name="chevron-right" size={12} color="#999" />
                            </Right>
                        </ListItem>
                        {/* <ListItem onPress={this.navigateToScreen('MyAccount')} style={styles.listItemStyle}>
                            <Left>
                                <View style={styles.listItemWrapperStyle}>
                                    <View style={{ flex: 0.2 }}>
                                        <FontAwesome5 name="user" size={20} color="#888" />
                                    </View>
                                    <View style={{ flex: 1, paddingLeft: 20, justifyContent: 'center' }}>
                                        <Text style={styles.listItemTextStyle}>My Account</Text>
                                    </View>
                                </View>
                            </Left>
                            <Right>
                                <FontAwesome5 name="chevron-right" size={12} color="#999" />
                            </Right>
                        </ListItem> */}
                    </List>


                </Content>
                <Footer style={{ backgroundColor: '#C1E319' }}>
                    <TouchableOpacity
                        style={{ margin: 10, flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6, backgroundColor: '#C1E319', paddingVertical: 20 }}
                        onPress={() => {
                            this.props.navigation.closeDrawer();
                            this.signOut();
                        }}>
                        <Text style={{ fontWeight: 'bold', color: '#FFF', fontSize: 18 / PixelRatio.getFontScale() }}>Sign Out</Text>
                    </TouchableOpacity>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    iconsidebar: {
        width: 25,
        height: 25,
    },

    listItemStyle: {
        backgroundColor: '#F9F9F9',
        paddingLeft: 18,
        marginLeft: 0,
        borderColor: '#FFFFFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE'
    },

    listItemTextStyle: {
        fontSize: 12 / PixelRatio.getFontScale()
    },

    listItemWrapperStyle: {
        flexDirection: 'row'
    }
})