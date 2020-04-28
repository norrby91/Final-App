//LOGIN SCREEN FOR USERS
//IMPORT PACKAGES
import React from 'react'
import {
  StyleSheet, Alert, Text, View, TextInput,
  TouchableOpacity, Image, StatusBar, LayoutAnimation
} from 'react-native';
import LoaderComponent from '../Components/common/loaderComponent';
import { loaderStatus } from '../actions/loaderAction';
import { connect } from 'react-redux';
import { callLoginService } from '../actions/authentication/signInAction';

class Login extends React.Component {
  state = {
    email: "",
    password: "",
  }


  getCollection = (querySnapshot) => {
    const userArr = [];
    querySnapshot.forEach((res) => {
      console.log("User fetch");
      console.log(res.data());
    });
  }


  handleLogin = async () => {
    const { email, password } = this.state;
    
    this.props.callLoginService({
      email: email,
      password: password
    }, this.props.navigation);
  }
  render() {

    LayoutAnimation.easeInEaseOut();

    return (

      <View style={styles.containner}>
        <StatusBar barStyle="light-content"></StatusBar>
        <Image style={styles.logo} source={require("../../Assets/small_logo3.png")}  ></Image>
        <Text style={styles.greeting}>Welcome To UU FAST ORDER</Text>
        <View style={styles.form}>
          <TextInput style={styles.inputStyle} underlineColorAndrorid='rgba(0,0,0,0) '
            placeholder='Email'
            placeholderTextColor="#000000"
            onChangeText={email => this.setState({ email: email.trim() })}
            value={this.state.email}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.form}>
          <TextInput style={styles.inputStyle} underlineColorAndrorid='rgba(0,0,0,0) '
            placeholder='Password'
            placeholderTextColor="#000000"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
        </View>
        {
          this.props.errormessage !== null ?
            <View style={styles.errormessage}>
              <Text style={{ fontWeight: "bold", fontStyle: "italic", color: "red", textAlign: "center" }}>
                {this.props.errormessage} </Text>
            </View> : null
        }

        <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
          <Text style={styles.button_txt}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }} onPress={() => this.props.navigation.navigate("Register")} >
          <Text>Do not have an account ? <Text style={styles.signinTxt}>Sign up here </Text>
          </Text>
        </TouchableOpacity>
        <LoaderComponent />
      </View >
    )
  }
}

const mapStateToProps = (state) => ({
  errormessage: state.SignInReducer.errormessage,
});

export default connect(mapStateToProps, { loaderStatus, callLoginService })(Login);

const styles = StyleSheet.create({
  containner: {
    flex: 1,
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 30,
  },
  errormessage: {
    justifyContent: "center",
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    marginVertical: 0,

  },
  inputStyle: {
    color: "#8A8F9E",
    fontSize: 10,

    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
  },
  logo: {
    height: 200,
    width: '100%',
    alignContent: "center"
  },
  button: {
    marginHorizontal: 26,
    borderBottomColor: "#2db6e3",
    borderRadius: 4,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginRight: 24,
    backgroundColor: '#C1E319',
    padding: 10,
    lineHeight: 23,
    fontWeight: 'bold',

  },
  button_txt: {
      fontSize: 18,
      fontWeight: 'bold'
  },
  signinTxt: {
    color: "#006032",
    fontWeight: 'bold'
  },
  greeting: {
    height: 72,
    textAlign: "center",
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: '600',
    textAlign: "center",
  }
})


