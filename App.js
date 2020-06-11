// import React, { Component } from 'react';
// import { Text, View } from 'react-native';

// export default class App extends Component {
// 	render() {
// 		return (
// 			<View>
// 				<Text> APP works ! </Text>
// 			</View>
// 		);
// 	}
// }

// export default App;

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  YellowBox,
} from 'react-native';
import Navigation from './Navigation/Navigation';
import Store from './Store/configureStore';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/es/integration/react';
import {green} from './assets/colors';
import * as Font from 'expo-font';
import {Asset} from 'expo-asset';

import Purchases from 'react-native-purchases';

YellowBox.ignoreWarnings([
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount',
]);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
    };
  }

  async componentDidMount() {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup('ETWqFyEuzlspFWvxquyetnrCBcPBDcTU');
    await Font.loadAsync({
      'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf'),
      'montserrat-extra-bold': require('./assets/fonts/Montserrat-ExtraBold.ttf'),
      'montserrat-regular': require('./assets/fonts/Montserrat-Regular.ttf'),
      'cinzel-black': require('./assets/fonts/CinzelDecorative-Black.ttf'),
    }).then(() => {
      this.setState({
        fontLoaded: true,
      });
    });
  }

  render() {
    if (this.state.fontLoaded) {
      let persistor = persistStore(Store);
      return (
        <Provider store={Store}>
          <PersistGate persistor={persistor}>
            <Navigation />
          </PersistGate>
        </Provider>
      );
    } else {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: green,
    flex: 1,
  },
});

export default App;
