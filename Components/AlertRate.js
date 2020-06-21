import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { red, blue, green, white } from '../assets/colors';
import * as text from '../assets/textInGame/listTextRate';
import Rate, { AndroidMarket } from 'react-native-rate';
import AwesomeAlert from 'react-native-awesome-alerts';

const { height, width } = Dimensions.get('window');

export default class AlertRate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: this.props.showAlert,
    };
  }

  async componentDidMount() { }

  async _toggleOnConfirmPressed() {
    // Rate the app !
    setTimeout(() => {
      let options = {
        AppleAppID: '1505766839',
        GooglePackageName: 'com.imbibo',
        preferInApp: true,
        openAppStoreIfInAppFails: true,
      };
      Rate.rate(options, async (success) => {
        if (success) {
          await AsyncStorage.setItem('isAlreadyRate', 'true').then(() =>
            this.hideAlert(),
          );
        }
      });
    }, 500);
  }

  hideAlert = () => {
    this.props.hideAlert();
  };

  render() {
    const { showAlert, language } = this.props;
    let textAlert;
    let textAlertTitle;
    let textConfirm;
    let textCancel;
    if (language == 'FR') {
      textAlertTitle = text.alertTitleFR;
      textAlert = text.alertRecordFR;
      textConfirm = text.alertConfirmFR;
      textCancel = text.alertCancelFR;
    } else if (language == 'EN') {
      textAlert = text.alertRecordEN;
      textAlertTitle = text.alertTitleEN;
      textConfirm = text.alertConfirmEN;
      textCancel = text.alertCancelEN;
    }
    return (
      <View style={styles.container}>
        <AwesomeAlert
          alertContainerStyle={{
            width: width,
            heihgt: height,
            top: 0,
            right: -width / 2,
          }}
          show={showAlert}
          // show={showAlert}
          showProgress={false}
          title={textAlertTitle}
          titleStyle={{
            color: white,
            fontFamily: 'montserrat-extra-bold',
            fontSize: height / 35,
          }}
          message={textAlert}
          messageStyle={{
            color: white,
            fontFamily: 'montserrat-bold',
            fontSize: height / 50,
            textAlign: 'center',
          }}
          contentContainerStyle={{
            backgroundColor: blue,
            borderRadius: 30,
            height: height / 3,
            width: width - 30,
            justifyContent: 'center',
            borderWidth: 5,
            borderColor: white,
          }}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showConfirmButton={true}
          showCancelButton={true}
          confirmButtonColor={green}
          confirmText={textConfirm}
          confirmButtonTextStyle={{ fontFamily: 'montserrat-extra-bold' }}
          cancelButtonColor={red}
          cancelText={textCancel}
          cancelButtonTextStyle={{ fontFamily: 'montserrat-extra-bold' }}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={async () => {
            this._toggleOnConfirmPressed();
          }}
          onDismiss={() => {
            this.hideAlert();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});
