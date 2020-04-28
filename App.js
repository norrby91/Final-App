import React, { Component } from 'react';
import { Button, View } from 'react-native'
import Icon from 'react-native-elements';

import store from './SRC/store';
import { Provider } from 'react-redux';
import { StyleProvider, Root } from 'native-base';
import AppContainer from './SRC/routes';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>     
              <Root>
                <AppContainer />
              </Root>
       </Provider>
    );
  }
}