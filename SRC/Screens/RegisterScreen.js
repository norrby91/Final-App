//register user screen
import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Image, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';

import { signUpSubmit } from '../actions/authentication/signUpAction';

class RegisterScreen extends React.Component {
  //set state
  state = {
    name: "",
    email: "",
    password: "",
    errormessage: null,
  }
  // handle sign up function
  handleSignUp = () => {
    const { name, email, password } = this.state
    const data = {
      name,
      email,
      password
    }
    this.props.signUpSubmit(data, this.props.navigation);
  }

//render on screen objects
  render() {

    LayoutAnimation.easeInEaseOut();

    return (
      <View style={styles.containner}>
        <StatusBar barStyle="light-content"></StatusBar>
        <Text style={styles.greeting}>Please enter your details to register..</Text>
        <View style={styles.form}>
          <TextInput style={styles.inputStyle} underlineColorAndrorid='rgba(0,0,0,0) '
            placeholder='Full Name'
            placeholderTextColor="#000000"
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
            autoCapitalize
          />
        </View>

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
            secureTextEntry={true}
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
        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style= {styles.button_txt}>Complete Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: "center", marginTop: 8 }} onPress={() => this.props.navigation.navigate("Login")}>
          <Text>Already have an account ? <Text style={styles.signinTxt}>Sign in </Text>
          </Text>
        </TouchableOpacity>

      </View>


    )
  }
}

//connect to redux 
const mapStateToProps = (state) => ({
  errormessage: state.SignUpReducer.errormessage,
});
//export class 
export default connect(mapStateToProps, { signUpSubmit })(RegisterScreen);

//apply styles
const styles = StyleSheet.create({
  containner: {
    flex: 1,
  },
  form: {
    marginTop: -32,
    marginBottom: 48,
    marginHorizontal: 30,
  },
  errormessage: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3

  },
  inputStyle: {
    marginTop: 20,
    color: "#8A8F9E",
    fontSize: 10,
    borderBottomColor: "#8A8F9E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
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
    fontSize: 16,
    fontWeight: 'bold'
},
  signinTxt: {
    color: "#006032",
    fontWeight: 'bold'
  },
  greeting: {
    marginTop: 20,
    height: 72,
    textAlign: "center",
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3
  },
  error: {
    color: "#E9446A",
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: "center",
  }

})





