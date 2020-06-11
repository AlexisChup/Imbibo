import React, {Component} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  Animated,
  Switch,
  BackHandler,
  Platform,
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import * as stl from '../assets/styles/styles';
import HomeTabNaviga from './HomeTabNaviga';

// import * as Localization from 'expo-localization';
import AlertRecord from './AlertRecord';
import checkIfFirstLaunch from '../assets/checkIfFirstLaunch';
import RecordsAccueil from './RecordsAccueil';
import {connect} from 'react-redux';
import * as text from '../assets/textInGame/listTextHome';
import AppIntroSlider from 'react-native-app-intro-slider';
import SplashScreen from 'react-native-splash-screen';

const slidesEN = [
  {
    key: 'intro_1',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/EN/intro_1.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_2',
    title: 'Title 2',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/EN/intro_2.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_3',
    title: 'Title 3',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/EN/intro_3.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_4',
    title: 'Title 4',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/EN/intro_4.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_5',
    title: 'Title 5',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/EN/intro_5.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_6',
    title: 'Title 6',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/EN/intro_6.png'),
    backgroundColor: 'transparent',
  },
];
const slidesFR = [
  {
    key: 'intro_1',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/FR/intro_1.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_2',
    title: 'Title 2',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/FR/intro_2.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_3',
    title: 'Title 3',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/FR/intro_3.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_4',
    title: 'Title 4',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/FR/intro_4.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_5',
    title: 'Title 5',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/FR/intro_5.png'),
    backgroundColor: 'transparent',
  },
  {
    key: 'intro_6',
    title: 'Title 6',
    text: 'Description.\nSay something cool',
    image: require('../assets/introSliders/FR/intro_6.png'),
    backgroundColor: 'transparent',
  },
];

import {green, red, blue, white} from '../assets/colors';
const {height, width} = Dimensions.get('window');

class Home extends Component {
  constructor(props) {
    super(props);
    this._goToChoicescreen = this._goToChoicescreen.bind(this);
    this._addActions = this._addActions.bind(this);
    this._addPlayers = this._addPlayers.bind(this);
    this._triggerPopUp = this._triggerPopUp.bind(this);
    this.uriLogo = require('../assets/logo-in-game.png');
    this.rowRefs = [];
    this.state = {
      animationLogo: new Animated.Value(0.01),
      nbJoueurs: 0,
      nbActions: 0,
      premium: false,
      isFirstLaunch: false,
      hasCheckedAsyncStorage: false,
      showAlert: false,
      showAlertPremium: false,
      showAlertPremiumOrigin: undefined,
      showIntroSliders: false,
    };
    this.records = {};
    this.language = 'FR';
    this._triggerIntroSliders = this._triggerIntroSliders.bind(this);
    this.returnStateRecord = this.returnStateRecord.bind(this);
    this.disablePopUp = this.disablePopUp.bind(this);
    this.enablePopUp = this.enablePopUp.bind(this);
    this._hideAlert = this._hideAlert.bind(this);
    this._hideAlertPremium = this._hideAlertPremium.bind(this);
    this._showAlertFunc = this._showAlertFunc.bind(this);
    this._showAlertFuncPremium = this._showAlertFuncPremium.bind(this);
    this._becomePremium = this._becomePremium.bind(this);
    this.onBackButtonPressed = null;
  }

  async UNSAFE_componentWillMount() {
    const isFirstLaunch = await checkIfFirstLaunch();
    if (isFirstLaunch) {
      this._setLanguageFirstLaunch();
    }
    SplashScreen.hide();
    this.setState({
      isFirstLaunch,
      hasCheckedAsyncStorage: true,
      showIntroSliders: isFirstLaunch,
    });
  }

  //  Set the language when is it the first time
  _setLanguageFirstLaunch = () => {
    const countryCode = RNLocalize.getCountry();
    if (countryCode == 'EN') {
      this._setLanguage('SET_EN', 'EN');
    } else {
      this._setLanguage('SET_FR', 'FR');
    }
  };

  async componentDidMount() {
    // Disable back button
    this.onBackButtonPressed = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );

    // warning message
    this._showAlertFuncPremium('warningStart');

    if (Platform.OS === 'ios') {
      this._animateLogoiOS();
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onBackButtonPressed,
    );
  }

  _hideAlert() {
    this.setState({
      showAlert: false,
    });
  }

  _showAlertFunc() {
    this.setState({
      showAlert: true,
    });
  }
  _hideAlertPremium() {
    this.setState({
      showAlertPremium: false,
    });
  }

  // For Record permission or Purchase Premium error
  _showAlertFuncPremium(origin) {
    this.setState({
      showAlertPremium: true,
      showAlertPremiumOrigin: origin,
    });
  }
  //action for reducer setLanguage
  _setLanguage(type, value) {
    const action = {type: type, value: value};
    this.props.dispatch(action);
  }

  _setRingBell = (act) => {
    const action = {
      type: act,
    };
    this.props.dispatch(action);
  };

  _animateLogoiOS() {
    Animated.spring(this.state.animationLogo, {
      toValue: width / 1.7,
      friction: 4,
      tension: 18,
      useNativeDriver: false,
    }).start();
  }

  _animateLogoAndroid() {
    Animated.spring(this.state.animationLogo, {
      toValue: width / 1.7,
      friction: 4,
      tension: 18,
      useNativeDriver: false,
    }).start();
  }

  _goToChoicescreen(nb) {
    const {language} = this.props;
    const stateRecords = this.rowRefs[0]._returnState();
    if (stateRecords[0] || stateRecords[1]) {
      // let textAlert;
      // if (language == 'FR') {
      // 	textAlert = text.alertRecordFR;
      // } else if (language == 'EN') {
      // 	textAlert = text.alertRecordEN;
      // }
      this.setState({
        showAlert: true,
      });
    } else {
      this.records = this.rowRefs[0]._getDatasBeforeNavigate();

      const recordsNameNames = this.records.namesName;
      const iterator = recordsNameNames.values();
      let arrayName = [];
      for (const name of iterator) {
        arrayName.push({
          name: name,
          sipsDrank: 0,
          sipsGiven: 0,
        });
      }
      this.records.namesName = arrayName;
      this.props.navigation.navigate('ChoiceScreen', {
        nbJoueurs: nb,
        records: this.records,
      });
    }
  }

  _addPlayers(nb) {
    if (nb != -70) {
      this.setState({
        nbJoueurs: nb,
      });
    } else {
      //on delete un player
      this.setState({
        nbJoueurs: this.state.nbJoueurs - 1,
      });
    }
  }

  _addActions(nb) {
    if (nb != -70) {
      this.setState({
        nbActions: nb,
      });
    } else {
      //on delete une actions
      this.setState({
        nbActions: this.state.nbActions - 1,
      });
    }
  }

  //for premium enabling
  _toggleSwitch(val) {
    this.setState({
      premium: val,
    });

    //action for reducers
    const action = {type: 'TOGGLE_PREMIUM', value: val};
    this.props.dispatch(action);
  }

  // how introSlider's item are rendered
  _renderItem = ({item}) => {
    return (
      <View style={{flex: 1, backgroundColor: blue}}>
        <Image
          source={item.image}
          style={{resizeMode: 'contain', width: width, height: height}}
        />
      </View>
    );
  };

  //call at the end of the intro sliders
  _onDone = () => {
    this.setState({showIntroSliders: false, isFirstLaunch: false});
  };

  _triggerIntroSliders() {
    this.setState({showIntroSliders: true});
  }

  // for trigger popUp Premium when click on action and not premium
  _triggerPopUp() {
    this.rowRefs[1].triggerPopUp();
  }

  returnStateRecord() {
    const ret = this.rowRefs[0]._returnState();
    return ret;
  }

  //to disable popUp when recording
  disablePopUp() {
    this.rowRefs[1]._disablePopUp();
  }

  //to enable popUp when finish recording
  enablePopUp() {
    this.rowRefs[1]._enablePopUp();
  }

  // Dispatch actions to redux
  _becomePremium() {
    const action = {type: 'TOGGLE_PREMIUM', value: true};
    this.props.dispatch(action);

    // Show alert
    this._showAlertFuncPremium('premium');
  }

  // ASK PERMISSION FOR RECORD
  showPermissionAlert = () => {
    this.rowRefs[0]._askForPermissions();
  };

  render() {
    const animLogo = this.state.animationLogo;
    const {
      nbActions,
      nbJoueurs,
      hasCheckedAsyncStorage,
      isFirstLaunch,
      showIntroSliders,
    } = this.state;
    const {premium, language} = this.props;

    if (!hasCheckedAsyncStorage) {
      return <View style={{flex: 1, backgroundColor: green}} />;
    } else {
      if (showIntroSliders || isFirstLaunch) {
        let slides, skipLabel, doneLabel, nextLabel, prevLabel;
        if (language == 'FR') {
          slides = slidesFR;
          skipLabel = 'Quitter';
          doneLabel = 'Compris';
          nextLabel = 'Suivant';
          prevLabel = 'Retour';
        } else if (language == 'EN') {
          slides = slidesEN;
          skipLabel = 'Skip';
          doneLabel = 'Done';
          nextLabel = 'Next';
          prevLabel = 'Back';
        }
        return (
          <SafeAreaView style={styles.container}>
            <StatusBar hidden={true} />
            <AppIntroSlider
              renderItem={this._renderItem}
              slides={slides}
              onDone={this._onDone}
              showPrevButton
              showSkipButton
              skipLabel={skipLabel}
              doneLabel={doneLabel}
              nextLabel={nextLabel}
              prevLabel={prevLabel}
              paginationStyle={{}}
              activeDotStyle={{backgroundColor: red}}
              buttonStyle={{
                backgroundColor: green,
                borderWidth: 5,
                borderColor: red,
                borderRadius: 30,
              }}
              buttonTextStyle={{fontFamily: 'montserrat-bold', color: white}}
            />
          </SafeAreaView>
        );
      } else {
        let displayNameNaviga;
        if (language == 'FR') {
          displayNameNaviga = text.nameNavigaFR;
        } else if (language == 'EN') {
          displayNameNaviga = text.nameNavigaEN;
        }
        return (
          <SafeAreaView style={styles.container}>
            <StatusBar hidden={true} />

            {/* TOP BAR */}
            <View style={{backgroundColor: green}}>
              <View style={stl.containerHeader}>
                <Text style={stl.headerTitle}> {displayNameNaviga} </Text>
              </View>
            </View>

            <View style={stl.containerView}>
              <View style={styles.containerLogo}>
                <Animated.View
                  style={[
                    styles.containerLogo,
                    {height: animLogo, width: animLogo},
                  ]}>
                  <Image
                    style={[styles.logo]}
                    source={this.uriLogo}
                    onLoadEnd={() => this._animateLogoAndroid()}
                  />
                </Animated.View>
              </View>
              {/* <View style={{ alignSelf: 'center', marginVertical: 10 }}>
								<Switch value={this.props.premium} onValueChange={(val) => this._toggleSwitch(val)} />
							</View> */}

              <View style={styles.containerButtons}>
                <RecordsAccueil
                  ref={(ref) => (this.rowRefs[0] = ref)}
                  addPlayers={this._addPlayers}
                  addActions={this._addActions}
                  language={this.props.language}
                  premium={premium}
                  triggerPopUp={this._triggerPopUp}
                  disablePopUp={this.disablePopUp}
                  enablePopUp={this.enablePopUp}
                  showAlertFunc={this._showAlertFuncPremium}
                />
              </View>
            </View>
            <HomeTabNaviga
              ref={(ref) => (this.rowRefs[1] = ref)}
              goToChoiceScreen={this._goToChoicescreen}
              language={this.props.language}
              premium={premium}
              triggerIntroSliders={this._triggerIntroSliders}
              returnStateRecord={this.returnStateRecord}
              showAlertFunc={this._showAlertFunc}
              showAlertFuncPremium={this._showAlertFuncPremium}
              becomePremium={this._becomePremium}
              setRingBell={this._setRingBell}
              ringBell={this.props.ringBell}
            />
            <AlertRecord
              showAlert={this.state.showAlert}
              showAlertFunc={this._showAlertFunc}
              hideAlert={this._hideAlert}
              language={this.props.language}
              listText={true}
            />
            <AlertRecord
              showAlert={this.state.showAlertPremium}
              showAlertFunc={this._showAlertFuncPremium}
              showPermissionAlert={this.showPermissionAlert}
              hideAlert={this._hideAlertPremium}
              language={this.props.language}
              showAlertPremiumOrigin={this.state.showAlertPremiumOrigin}
              listText={false}
            />
          </SafeAreaView>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerView: {
    backgroundColor: green,
    flex: 1,
  },
  containerLogo: {
    flex: 2,
    alignSelf: 'center',
  },
  containerButtons: {
    flex: 5,
  },
  logo: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'contain',
  },
});

const mapStateToProps = (state) => {
  // get only what we need
  return {
    language: state.setLanguage.language,
    premium: state.togglePremium.premium,
    ringBell: state.ringBellReducer.ringBell,
  };
};

export default connect(mapStateToProps)(Home);
