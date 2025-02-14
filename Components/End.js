import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  AsyncStorage,
  StatusBar,
  ScrollView,
  FlatList,
  Dimensions,
  Button,
} from 'react-native';
import EndTabNav from './EndTabNav';
import AlertRate from './AlertRate';
import * as stl from '../assets/styles/styles';
import * as text from '../assets/textInGame/listTextEnd';
import {green, blue, white, red} from '../assets/colors';
import AlertRecord from './AlertRecord';
import AnimatedEndGame from '../Animations/AnimatedEndGame';
import {connect} from 'react-redux';
const {width, height} = Dimensions.get('window');
class End extends Component {
  constructor(props) {
    super(props);
    this._goToHomeScreen = this._goToHomeScreen.bind(this);
    this._hideAlertPremium = this._hideAlertPremium.bind(this);
    this._showAlertFuncPremium = this._showAlertFuncPremium.bind(this);
    this._becomePremium = this._becomePremium.bind(this);
    this.resetAnim = this.resetAnim.bind(this);
    this.startAnim = this.startAnim.bind(this);
    this.names = this.props.navigation.getParam('names');
    this.state = {
      showAlert: false,
      showAlertPremium: false,
      showAlertPremiumOrigin: undefined,
      totalSipsDrank: 0,
      totalSipsGiven: 0,
    };
    this._hideAlert = this._hideAlert.bind(this);
    this._animatedEndGame = undefined;
  }

  async componentDidMount() {
    let totalSipsDrank = 0;
    let totalSipsGiven = 0;
    this.names.forEach((item) => {
      totalSipsDrank = totalSipsDrank + item.sipsDrank;
      totalSipsGiven = totalSipsGiven + item.sipsGiven;
    });
    this.setState({
      totalSipsDrank,
      totalSipsGiven,
    });
    // Launch AlerRate every 3 times
    const isAlreadyRate = await AsyncStorage.getItem('isAlreadyRate');
    const countStartApp = await AsyncStorage.getItem('countStartApp');
    const count = countStartApp ? parseInt(countStartApp) : 1;
    if (!isAlreadyRate && count % 3 === 0) {
      this._showAlert();
    }
    await AsyncStorage.setItem('countStartApp', `${count + 1}`);
  }

  // 1 time / 3 we put the AlertRate
  _toggleAlertRate() {
    this.setState({
      showAlert: true,
    });
  }

  // Reset / Start Anim when trigger popup premium
  resetAnim() {
    if (this.names.length <= 0) {
      this.refs.animationEnd._resetAnimation();
    }
  }
  startAnim() {
    if (this.names.length <= 0) {
      this.refs.animationEnd._startAnimation();
    }
  }

  _showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  _hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  _goToHomeScreen() {
    this.props.navigation.navigate('HomeScreen');
  }

  _hideAlertPremium() {
    this.setState({
      showAlertPremium: false,
    });
  }

  _showAlertFuncPremium(origin) {
    this.setState({
      showAlertPremium: true,
      showAlertPremiumOrigin: origin,
    });
  }

  // Dispatch actions to redux
  _becomePremium() {
    const action = {type: 'TOGGLE_PREMIUM', value: true};
    this.props.dispatch(action);

    // Show alert
    this._showAlertFuncPremium('premium');
  }

  // Display scoreBorard or Animations
  _displayScoreBoard = () => {
    const names = this.names;
    const {language} = this.props;
    if (names.length > 0) {
      let players, drank, given;
      if (language == 'FR') {
        players = 'Joueurs';
        drank = 'Prises';
        given = 'Données';
      } else if (language == 'EN') {
        players = 'Players';
        drank = 'Drank';
        given = 'Given';
      }

      return (
        <View style={styles.scoreBoard}>
          <View style={styles.scoreBoardHeader}>
            <Text
              style={[styles.scoreBoardTitle, {flex: 2, textAlign: 'left'}]}>
              {players}
            </Text>
            <Text style={[styles.scoreBoardTitle]}>{drank}</Text>
            <Text style={[styles.scoreBoardTitle]}>{given}</Text>
          </View>
          <FlatList
            data={names}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) =>
              this._displayScoreBoardItem(item, index)
            }
            ListFooterComponent={() => (
              <View style={styles.scoreBoardHeader}>
                <Text
                  style={[
                    styles.scoreBoardTitle,
                    {flex: 2, textAlign: 'left'},
                  ]}>
                  {' '}
                  Total
                </Text>
                <Text style={[styles.scoreBoardTitle]}>
                  {this.state.totalSipsDrank}
                </Text>
                <Text style={[styles.scoreBoardTitle]}>
                  {this.state.totalSipsGiven}
                </Text>
              </View>
            )}
          />
        </View>
      );
    }
  };

  _displayScoreBoardItem(item, index) {
    return (
      <View style={[styles.scoreBoardItem]}>
        <Text style={[styles.scoreBoardItemText, {flex: 2, textAlign: 'left'}]}>
          {item.name}
        </Text>
        <Text style={styles.scoreBoardItemText}>{item.sipsDrank}</Text>
        <Text style={styles.scoreBoardItemText}>{item.sipsGiven}</Text>
      </View>
    );
  }

  _displayAnimationLogo = () => {
    if (this.names.length <= 0) {
      return (
        <View style={styles.containerRest}>
          <AnimatedEndGame ref="animationEnd" style={styles.containerLogo}>
            <Image
              style={styles.logo}
              source={require('../assets/logo-in-game.png')}
            />
          </AnimatedEndGame>
        </View>
      );
    }
  };

  render() {
    const {language, premium} = this.props;
    const {showAlert, showAlertPremium} = this.state;
    let end, displayNameNaviga;
    // if (true) {
    if (this.names.length <= 0) {
      if (language == 'FR') {
        end = text.endFR;
        displayNameNaviga = text.titleFR;
      } else if (language == 'EN') {
        end = text.endEN;
        displayNameNaviga = text.titleEN;
      }
    } else {
      if (language == 'FR') {
        end = text.endWithPlayerFR;
        displayNameNaviga = text.titleFR;
      } else if (language == 'EN') {
        end = text.endWithPlayerEN;
        displayNameNaviga = text.titleEN;
      }
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
        <View style={[stl.containerView, {justifyContent: 'center'}]}>
          <View style={{width: width, height: 1, backgroundColor: green}} />
          <View style={styles.containerTitle}>
            <Text style={styles.title}>{end}</Text>
            {/* <Text style={styles.title}>{end}</Text> */}
          </View>

          {this._displayScoreBoard()}
          {this._displayAnimationLogo()}
        </View>
        <EndTabNav
          goToHomeScreen={this._goToHomeScreen}
          language={language}
          // premium={true}
          premium={premium}
          showAlertFuncPremium={this._showAlertFuncPremium}
          resetAnim={this.resetAnim}
          startAnim={this.startAnim}
          becomePremium={this._becomePremium}
        />
        <AlertRate
          showAlert={showAlert}
          hideAlert={this._hideAlert}
          language={language}
        />
        <AlertRecord
          showAlert={this.state.showAlertPremium}
          showAlertFunc={this._showAlertFuncPremium}
          hideAlert={this._hideAlertPremium}
          language={language}
          showAlertPremiumOrigin={this.state.showAlertPremiumOrigin}
          listText={false}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerTitle: {
    borderBottomColor: white,
    borderBottomWidth: 5,
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 70,
    width: width - 100,
    alignSelf: 'center',
  },
  scoreBoard: {
    marginTop: 10,
    backgroundColor: blue,
    flexDirection: 'column',
    borderColor: blue,
    borderWidth: 10,
    width: width - 50,
    maxHeight: height / 2,
    borderRadius: 20,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // paddingVertical: 10
  },
  scoreBoardHeader: {
    flexDirection: 'row',
    backgroundColor: blue,
    // borderTopLeftRadius: 24,
    // borderTopRightRadius: 24,
    paddingVertical: 15,
  },
  scoreBoardItem: {
    flexDirection: 'row',
    backgroundColor: red,
    paddingVertical: 15,
    borderWidth: 3,
    borderColor: blue,
    // borderBottomColor: white
  },
  scoreBoardTitle: {
    fontFamily: 'montserrat-extra-bold',
    fontSize: stl.titleItem - 5,
    color: white,
    textAlign: 'center',
    marginHorizontal: 10,
    flex: 1,
  },
  scoreBoardItemText: {
    fontFamily: 'montserrat-bold',
    textAlign: 'center',
    color: white,
    fontSize: stl.descItem + 2,
    marginHorizontal: 10,
    flex: 1,
  },
  containerRest: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLogo: {
    width: 0.7 * width,
    height: 0.4 * width,
    shadowColor: '#000',
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.0,

    elevation: 12,
  },
  title: {
    fontSize: stl.fontSizeMenu,
    fontFamily: 'montserrat-bold',
    color: white,
    textAlign: 'center',
  },
  logo: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'contain',
    // borderWidth: 5,
    // borderColor: red
  },
});

const mapStateToProps = (state) => {
  // get only what we need
  return {
    language: state.setLanguage.language,
    premium: state.togglePremium.premium,
  };
};

export default connect(mapStateToProps)(End);
