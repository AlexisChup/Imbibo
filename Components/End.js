import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, SafeAreaView, Dimensions, Button, AsyncStorage } from 'react-native';
import EndTabNav from './EndTabNav';
import AlertRate from './AlertRate';
import Rate, { AndroidMarket } from 'react-native-rate';
import * as stl from '../assets/styles/styles';
import * as text from '../assets/textInGame/listTextEnd';
import { green, red, blue, white } from '../assets/colors';
import AlertRecord from './AlertRecord';
import { connect } from 'react-redux';
const { width, height } = Dimensions.get('window');
class End extends Component {
	constructor(props) {
		super(props);
		this._goToHomeScreen = this._goToHomeScreen.bind(this);
		this._hideAlertPremium = this._hideAlertPremium.bind(this);
		this._showAlertFuncPremium = this._showAlertFuncPremium.bind(this);
		this._becomePremium = this._becomePremium.bind(this);
		this.state = {
			showAlert: false,
			showAlertPremiumOrigin: undefined
		};
		this._hideAlert = this._hideAlert.bind(this);
	}

	async componentDidMount() {
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
			showAlert: true
		});
	}

	_showAlert = () => {
		this.setState({
			showAlert: true
		});
	};

	_hideAlert = () => {
		this.setState({
			showAlert: false
		});
	};

	_goToHomeScreen() {
		this.props.navigation.navigate('HomeScreen');
	}

	_hideAlertPremium() {
		this.setState({
			showAlertPremium: false
		});
	}

	_showAlertFuncPremium(origin) {
		this.setState({
			showAlertPremium: true,
			showAlertPremiumOrigin: origin
		});
	}

	// Dispatch actions to redux
	_becomePremium() {
		const action = { type: 'TOGGLE_PREMIUM', value: true };
		this.props.dispatch(action);

		// Show alert
		this._showAlertFuncPremium('premium');
	}

	render() {
		const { language, premium } = this.props;
		const { showAlert } = this.state;
		let end;
		if (language == 'FR') {
			end = text.endFR;
		} else if (language == 'EN') {
			end = text.endEN;
		}

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.containerView}>
					<View style={styles.containerTitle}>
						<Text style={styles.title}>{end}</Text>
					</View>
					<View style={styles.containerLogo}>
						<Image style={styles.logo} source={require('../assets/logo-in-game.png')} />
					</View>
				</View>
				<EndTabNav
					goToHomeScreen={this._goToHomeScreen}
					language={language}
					premium={premium}
					showAlertFuncPremium={this._showAlertFuncPremium}
					becomePremium={this._becomePremium}
				/>
				<AlertRate showAlert={showAlert} hideAlert={this._hideAlert} language={language} />
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
		backgroundColor: green,
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerView: stl.containerView,
	containerTitle: {
		borderBottomColor: white,
		borderBottomWidth: 5,
		borderBottomRightRadius: 70,
		borderBottomLeftRadius: 70,
		width: width - 100,
		marginTop: 10,
		alignSelf: 'center'
	},
	containerLogo: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		fontSize: stl.fontSizeMenu,
		fontFamily: 'montserrat-bold',
		color: white,
		textAlign: 'center'
	},
	logo: {
		width: width / 1.5,
		height: width / 1.5,
		resizeMode: 'contain'
	}
});

const mapStateToProps = (state) => {
	// get only what we need
	return {
		language: state.setLanguage.language,
		premium: state.togglePremium.premium
	};
};

export default connect(mapStateToProps)(End);
