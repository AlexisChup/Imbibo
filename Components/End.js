import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, SafeAreaView, Dimensions, AsyncStorage, StatusBar } from 'react-native';
import EndTabNav from './EndTabNav';
import AlertRate from './AlertRate';
import * as stl from '../assets/styles/styles';
import * as text from '../assets/textInGame/listTextEnd';
import { green, blue, white } from '../assets/colors';
import AlertRecord from './AlertRecord';
import AnimatedEndGame from '../Animations/AnimatedEndGame';
import { connect } from 'react-redux';
const { width } = Dimensions.get('window');
class End extends Component {
	constructor(props) {
		super(props);
		this._goToHomeScreen = this._goToHomeScreen.bind(this);
		this._hideAlertPremium = this._hideAlertPremium.bind(this);
		this._showAlertFuncPremium = this._showAlertFuncPremium.bind(this);
		this._becomePremium = this._becomePremium.bind(this);
		this.state = {
			showAlert: false,
			showAlertPremium: false,
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
		const { showAlert, showAlertPremium } = this.state;
		let end, displayNameNaviga;
		if (language == 'FR') {
			end = text.endFR;
			displayNameNaviga = text.titleFR;
		} else if (language == 'EN') {
			end = text.endEN;
			displayNameNaviga = text.titleEN;
		}

		return (
			<SafeAreaView style={styles.container}>
				<StatusBar hidden={true} />

				{/* TOP BAR */}
				<View style={{ backgroundColor: green }}>
					<View style={stl.containerHeader}>
						<Text style={stl.headerTitle}> {displayNameNaviga} </Text>
					</View>
				</View>
				<View style={stl.containerView}>
					<View style={{ width: width, height: 1, backgroundColor: green }} />
					<View style={styles.containerTitle}>
						<Text style={styles.title}>{end}</Text>
					</View>
					<View style={styles.containerRest}>
						<AnimatedEndGame style={styles.containerLogo}>
							<Image style={styles.logo} source={require('../assets/logo-in-game.png')} />
						</AnimatedEndGame>
					</View>
				</View>
				<EndTabNav
					goToHomeScreen={this._goToHomeScreen}
					language={language}
					// premium={true}
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
		backgroundColor: blue,
		alignItems: 'center',
		justifyContent: 'center'
	},
	containerTitle: {
		borderBottomColor: white,
		borderBottomWidth: 5,
		borderBottomRightRadius: 70,
		borderBottomLeftRadius: 70,
		width: width - 100,
		alignSelf: 'center'
	},
	containerRest: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	containerLogo: {
		width: 0.7 * width,
		height: 0.4 * width,
		shadowColor: '#000',
		shadowOffset: {
			width: 6,
			height: 6
		},
		shadowOpacity: 0.8,
		shadowRadius: 6.0,

		elevation: 12
	},
	title: {
		fontSize: stl.fontSizeMenu,
		fontFamily: 'montserrat-bold',
		color: white,
		textAlign: 'center'
	},
	logo: {
		flex: 1,
		height: null,
		width: null,
		resizeMode: 'contain'
		// borderWidth: 5,
		// borderColor: red
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
