//add new items to menus 

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';

import * as firebase from 'firebase';

import * as firebaseApp from "../../Firebase";
import { Container, Header, Content, Footer, FooterTab, Button, Left, Text, Right, ListItem, Body, Title, Card, CardItem, Input } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { loaderStatus } from '../actions/loaderAction';
import LoaderComponent from '../Components/common/loaderComponent'
import Icon from 'react-native-vector-icons/MaterialIcons';
require('firebase/firestore');
require('firebase/storage');
import AsyncImage from '../Components/public/AsyncImageComponent';


import ImagePicker from 'react-native-image-picker';

// if (!global.btoa) { global.btoa = encode }

// if (!global.atob) { global.atob = decode }

const screenWidth = Math.round(Dimensions.get('window').width);

const options = {
  title: 'Select Menu Image',
  // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class AddMenuItem extends Component {
  constructor() {
    super();

    this.state = {
      menuitem: [],
      edit: false,
      menuimage: null,
      avatarSource: null
    };
  }

  componentDidMount = () => {
    this.menu = this.props.navigation.addListener('willFocus', () => {
      const menu = this.props.navigation.getParam('menu');
      const edit = this.props.navigation.getParam('edit');
      console.log("Get Param");
      console.log(menu);
      this.setState({ menuitem: menu, edit: edit });
      console.log(this.state);
    }
    );
  }

  componentWillUnmount = () => {
    this.menu.remove();
  }

  _deleteConfirmation = () => {
    Alert.alert(
      'Alert!',
      'Are you sure you want to delete this Item?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this._MenuDelete() },
      ],
      { cancelable: false }
    )
  }

  _MenuDelete = () => {
    const menuid = this.state.menuitem.key;
    this.props.loaderStatus({ status: true, message: 'Item Deleting...' });
    firebaseApp.menusCollection.doc(menuid).delete().then((docRef) => {
      alert("Menu Deleted Successfully!");
      this.props.navigation.navigate('Menus');
      this.props.loaderStatus({ status: false, message: null });
    }).catch((error) => {
      console.error("Error adding document: ", error);
      alert(error.message);
      this.props.loaderStatus({ status: false, message: null });
    });
  }

  updateTextInput = (text, field) => {
    const menuitem = this.state.menuitem;
    menuitem[field] = text;
    this.setState({ menuitem: menuitem });
    console.log("State change");
    console.log(this.state);
  }

  saveBoard() {
    const edit = this.state.edit;
    if (this.state.menuitem.name == '' || this.state.menuitem.name == null) {
      alert('Menu name is Required');
    }
    else if (this.state.menuitem.foodtypeNo == '' || this.state.menuitem.foodtypeNo == null) {
      alert('Menu Food Type No. is Required');
    } else if (this.state.menuitem.foodtype == '' || this.state.menuitem.foodtype == null) {
      alert('Menu Food Type is Required');
    } else if (this.state.menuitem.price == '' || this.state.menuitem.price == null) {
      alert('Menu Price is Required');
    }
    else if (this.state.menuitem.description == '' || this.state.menuitem.description == null) {
      alert('Menu Description is Required');
    }
    else {
      this.props.loaderStatus({ status: true, message: edit ? 'Updating Menu...' : 'Adding Menu' });
      const { logindetails } = this.props;

      if (this.state.edit) {
        const menuid = this.state.menuitem.key;
        firebaseApp.menusCollection.doc(menuid).set({
          name: this.state.menuitem.name,
          price: this.state.menuitem.price,
          description: this.state.menuitem.description,
          foodtype: this.state.menuitem.foodtype,
          foodtypeNo: this.state.menuitem.foodtypeNo,
          cafeid: logindetails.cafeid
        }).then((docRef) => {
          console.log("DocumentID");
          console.log(docRef);
          const uri = this.state.avatarSource;
          if (uri !== null) {
            this.uriToBlob(uri).then(blob => {
              this.uploadToFirebase(blob, menuid);
            }).then(result => {
              this.props.navigation.navigate('Menus');
              alert("Menu Updated Successfully!");
              this.props.loaderStatus({ status: false, message: null });
            })
          }
          else {
            this.props.navigation.navigate('Menus');
            alert("Menu Updated Successfully!");
            this.props.loaderStatus({ status: false, message: null });
          }



        })
          .catch((error) => {
            console.error("Error adding document: ", error);
            alert(error.message);
            this.props.loaderStatus({ status: false, message: null });

          });
      }
      else {
        firebaseApp.menusCollection.add({
          name: this.state.menuitem.name,
          price: this.state.menuitem.price,
          description: this.state.menuitem.description,
          foodtype: this.state.menuitem.foodtype,
          foodtypeNo: this.state.menuitem.foodtypeNo,
          cafeid: logindetails.cafeid
        }).then((docRef) => {
          console.log("DocumentID");
          console.log(docRef.id);
          const menuid = docRef.id;
          const uri = this.state.avatarSource;
          if (uri !== null) {
            this.uriToBlob(uri).then(blob => {
              this.uploadToFirebase(blob, menuid);
            }).then(result => {
              this.props.navigation.navigate('Menus');
              alert("Menu Added Successfully!");
              this.props.loaderStatus({ status: false, message: null });
            }).catch(error => {
              this.props.navigation.navigate('Menus');
              alert("Menu Added Successfully!");
              this.props.loaderStatus({ status: false, message: null });
            })
          }
          else {
            this.props.navigation.navigate('Menus');
            alert("Menu Added Successfully!");
            this.props.loaderStatus({ status: false, message: null });
          }

        })
          .catch((error) => {
            console.error("Error adding document: ", error);
            alert(error.message);
            this.props.loaderStatus({ status: false, message: null });
          });
      }
    }
  }

  uriToBlob = (uri) => {
    console.log("Call uriToBlob Method");
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
        console.log(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };

      // this helps us get a blob
      xhr.responseType = 'blob';

      xhr.open('GET', uri, true);
      xhr.send(null);

    });

  }

  uploadToFirebase = (blob, path) => {
    console.log("uploadToFirebase");
    console.log(blob);
    return new Promise((resolve, reject) => {

      var storageRef = firebase.storage().ref();

      storageRef.child('menus/' + path + '.jpg').put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot) => {

        blob.close();

        resolve(snapshot);

      }).catch((error) => {

        reject(error);

      });

    });
  }


  _selectImage = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const { height, width, type, uri } = response;
        const source = response.uri;
        console.log(source);
        // this.uriToBlob(uri).then(blob => {
        //   this.uploadToFirebase(blob);
        // })
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  render() {
    console.log(this.state);
    const menuimage = this.state.menuimage;
    const avatarSource = this.state.avatarSource;
    console.log(avatarSource);
    return (
      <>
        <Header style={{ backgroundColor: '#C1E319' }}>
          <Left>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>{this.state.edit ? 'Edit' : 'Add'} Menu</Title>
          </Body>
          <Right></Right>
        </Header>
        <LoaderComponent />
        <ScrollView style={styles.container}>
          <View>
            {
              this.state.edit && this.state.avatarSource === null ?
                <AsyncImage image={'menus/' + this.state.menuitem.key + ".jpg"}
                  style={{
                    backgroundColor: "grey",
                    justifyContent: "center",
                    resizeMode: "contain",
                    height: 200,
                    width: screenWidth - 40,
                    borderRadius: 5,
                    marginBottom: 15,
                  }}
                  refresh={this.state.refresh}></AsyncImage> :
                <Image
                  style={{
                    backgroundColor: "grey",
                    justifyContent: "center",
                    resizeMode: "contain",
                    height: 200,
                    width: screenWidth - 40,
                    borderRadius: 5,
                    marginBottom: 15,
                  }}

                  source={{ uri: avatarSource }}

                />
            }


            <TouchableOpacity
              onPress={() => this._selectImage()}
              style={{
                borderRadius: 15,
                borderWidth: 1,
                width: 90,
                borderColor: "#efefef",
                justifyContent: "center",
                position: "absolute",
                bottom: 25,
                right: 10,
              }}><Text style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 13,
                color: "#efefef"
              }}><Icon name="edit" color={'#efefef'} size={13} />Select</Text></TouchableOpacity>
          </View>
          <View style={styles.subContainer}>
            <TextInput
              placeholder={'Enter Food Name'}
              value={this.state.menuitem.name}
              style={{ height: 35, padding: 5, fontWeight: "bold" }}
              onChangeText={(text) => this.updateTextInput(text, 'name')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              style={{ height: 35, padding: 5, fontWeight: "bold" }}
              placeholder={'Enter Food Group Number This Sets Menu Order'}
              value={this.state.menuitem.foodtypeNo}
              onChangeText={(text) => this.updateTextInput(text, 'foodtypeNo')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              style={{ height: 35, padding: 5, fontWeight: "bold" }}
              placeholder={'Enter Food Group'}
              value={this.state.menuitem.foodtype}
              onChangeText={(text) => this.updateTextInput(text, 'foodtype')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              style={{ height: 35, padding: 5, fontWeight: "bold" }}
              placeholder={'Enter Price >>> 0.00'}
              value={this.state.menuitem.price}
              onChangeText={(text) => this.updateTextInput(text, 'price')}
            />
          </View>
          <View style={styles.subContainer}>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={{ height: 100, fontWeight: "bold", paddingLeft: 5, borderColor: "lightgrey", textAlignVertical: 'top', }}
              placeholder={'Enter Description'}
              value={this.state.menuitem.description}
              onChangeText={(text) => this.updateTextInput(text, 'description')}
            />
          </View>
        </ScrollView>
        <Footer>
          {
            this.state.edit ?
              <FooterTab>
                <Button
                style={{ backgroundColor: '#C1E319' }}
                  danger
                  onPress={() => this._deleteConfirmation()} >
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>{this.state.edit ? 'Delete' : 'Save'}</Text>
                  <Text style={{ fontWeight: "bold", fontSize: 15, color: "#FFF" }}>Delete</Text>
                </Button>
              </FooterTab> : null
          }
          <FooterTab>
            <Button
              style={{ backgroundColor: '#C1E319' }}
              onPress={() => this.saveBoard()} >
              <Text style={{ fontWeight: "bold", fontSize: 15, color: "#FFF" }}>{this.state.edit ? 'Update' : 'Save'}</Text>
            </Button>
          </FooterTab>
        </Footer>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    // borderBottomWidth: 1,
    borderColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
const mapStateToProps = (state) => ({
  logindetails: state.SignInReducer.logindetails,
});
export default connect(mapStateToProps, { loaderStatus })(AddMenuItem);