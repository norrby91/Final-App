import React from 'react';
import { View, ActivityIndicator, Image, } from 'react-native';

import * as firebase from 'firebase';
require('firebase/firestore');
require('firebase/storage');

export default class AsyncImage extends React.Component {

    constructor(props) {
        super(props);
        this.state =
        {
            loading: true,
            mounted: true,
            image: "/images/logoblue.jpg",
            url: "",

        }
    }

    componentDidMount() {
        this.setState({ isMounted: true })
        this.getAndLoadHttpUrl()

    }

    async getAndLoadHttpUrl() {
        if (this.state.mounted == true) {
            const ref = firebase.storage().ref(this.props.image);
            ref.getDownloadURL().then(data => {
                this.setState({ url: data })
                this.setState({ loading: false })
            }).catch(error => {
                this.setState({ url: "Cafes/jitters.jpg" })
                this.setState({ loading: false })
            })
        }
    }

    componentWillUnmount() {
        this.setState({ isMounted: false })
    }


    componentWillReceiveProps(props) {
        this.props = props
        if (this.props.refresh == true) {

        }
    }


    render() {
        if (this.state.mounted == true) {
            if (this.state.loading == true) {
                return (
                    <View key={this.props.image} style={[this.props.style,{justifyContent:"center"}]} >
                        <ActivityIndicator />
                    </View>
                )
            }
            else {
                return (
                    <Image style={this.props.style} source={{ uri: this.state.url }} />
                )
            }
        }
        else {
            return null
        }
    }

}