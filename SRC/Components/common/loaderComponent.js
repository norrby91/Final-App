//Loading component screen

import React, { Component } from 'react';
import { Modal, Text, View, PixelRatio } from 'react-native';
import { Spinner } from 'native-base';
import { connect } from 'react-redux';
import { loaderStatus } from '../../actions/loaderAction';


class LoaderComponent extends Component {
  render() {
    const { loading, message } = this.props;
    return (
      <View >
        <Modal
          animationType="fade"
          presentationStyle="fullScreen"
          transparent={false}
          visible={loading === true ? true : false}
          onRequestClose={() => {
            this.props.loaderStatus({
              status: false,
              message: ''
            })
          }}
        >
          <View style={{ backgroundColor: "#C1E319", flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
              <Spinner color="#fff" />
              <Text style={{ color: "#FFF", fontSize: 14 / PixelRatio.getFontScale() }}>
                {message}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.LoaderReducer.loading,
  message: state.LoaderReducer.message,
})
export default connect(mapStateToProps, { loaderStatus })(LoaderComponent);