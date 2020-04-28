import React, { Component } from 'react';
import {
	Text,
	StyleSheet,
	View,
	SafeAreaView,
	Dimensions,
	StatusBar,
	ScrollView,
	YellowBox,
	Image
} from 'react-native';
import { Audio } from 'expo-av';
import { green, red, blue, white } from '../assets/colors';
import ChoiceTabNav from './ChoiceTabNav';
import CustomSlider from './CustomSlider';
import * as stl from '../assets/styles/styles';
//import ItemChoice from './ItemChoice'

//differents ItemMods
import ItemModNormal from './ItemModNormal';
import ItemModShots from './ItemModShots';
import ItemModDistribution from './ItemModDistribution';
import ItemModHardcore from './ItemModHardcore';
import AlertRecord from './AlertRecord';
import { connect } from 'react-redux';
import * as text from '../assets/textInGame/listTextChoice';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
const { height, width } = Dimensions.get('window');

YellowBox.ignoreWarnings([ 'Warning: componentWillReceiveProps', 'Warning: componentWillMount' ]);

const defaultValuesSlider = [ 90, 180 ];

var audioObject = new Audio.Sound();
class Choice extends Component {
	constructor(props) {
		super(props);
		this.valuesSlider = [];
		this.mod = 0;
		this._goToHomeScreen = this._goToHomeScreen.bind(this);
		this._goToGameScreen = this._goToGameScreen.bind(this);
		this._toggleSliderValues = this._toggleSliderValues.bind(this);
		this._toggleItemMod = this._toggleItemMod.bind(this);
		this._returnMod = this._returnMod.bind(this);
		this._triggerPopUp = this._triggerPopUp.bind(this);
		this._hideAlertPremium = this._hideAlertPremium.bind(this);
		this._showAlertFuncPremium = this._showAlertFuncPremium.bind(this);
		this._becomePremium = this._becomePremium.bind(this);
		this.modRef = [];
		this.rowRefs = [];
		this.state = { showAlertPremiumOrigin: undefined };
	}

	componentDidMount() {
		//init default value for slider
		this.valuesSlider = defaultValuesSlider;
		this.modRef[this.mod]._reverseColor();
	}

	_goToHomeScreen() {
		this.props.navigation.navigate('HomeScreen');
	}

	_goToGameScreen() {
		const records = this.props.navigation.getParam('records');
		const valuesSlider = this.valuesSlider;
		//mode de jeu
		const mod = this.mod;

		this.props.navigation.navigate('GameScreen', {
			records: records,
			valuesSlider: valuesSlider,
			mod: mod
		});
	}

	_toggleSliderValues(values) {
		const { premium } = this.props;
		if (premium) {
			this.valuesSlider = values;
		} else {
		}
	}

	_returnMod() {
		return this.mod;
	}

	_toggleItemMod(mod) {
		//reset color of old item if it's not the same
		this.modRef[this.mod]._reverseColor();

		this.mod = mod;
	}

	// for trigger popUp Premium when click on action and not premium
	_triggerPopUp() {
		this.rowRefs[0].triggerPopUp();
	}

	//display or not the real Sliders
	_displaySliders() {
		const { premium } = this.props;
		if (premium) {
			return (
				<CustomSlider
					toggleSliderValues={this._toggleSliderValues}
					defaultValuesSlider={defaultValuesSlider}
					premium={premium}
				/>
			);
		} else {
			return (
				<TouchableWithoutFeedback
					onPress={() => this._triggerPopUp()}
					style={{ height: 140, width: width - 80 }}
				>
					<Image
						source={require('../assets/slider/slidersLocked.png')}
						style={[
							{
								flex: 1,
								height: null,
								width: null,
								resizeMode: 'contain'
							}
						]}
					/>
				</TouchableWithoutFeedback>
			);
		}
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
		const { navigation, language, premium } = this.props;
		const records = this.props.navigation.getParam('records');
		const nbJoueurs = records.names.length;
		let textMods, textIntervals, displayNameNaviga;
		if (language == 'FR') {
			textMods = text.titleModsFR;
			displayNameNaviga = text.titleScreenFR;
			textIntervals = text.titleIntervalsFR;
		} else if (language == 'EN') {
			textMods = text.titleModsEN;
			textIntervals = text.titleIntervalsEN;
			displayNameNaviga = text.titleScreenEN;
		}

		//remove the 's' if there is less than 2 players
		if (nbJoueurs <= 1) {
			displayNameNaviga = displayNameNaviga.slice(0, -1);
		}

		return (
			<SafeAreaView style={styles.container}>
				<StatusBar hidden={true} />

				{/* TOP BAR */}
				<View style={{ backgroundColor: green }}>
					<View style={stl.containerHeader}>
						<Text style={stl.headerTitle}>
							{' '}
							{nbJoueurs} {displayNameNaviga}{' '}
						</Text>
					</View>
				</View>

				<View style={stl.containerView}>
					<View style={styles.containerGame}>
						<View style={styles.containerGameTitle}>
							<Text style={styles.titleMenu}>{textMods}</Text>
						</View>
						<View style={styles.containerGameMenu}>
							<ScrollView>
								<ItemModNormal
									premium={premium}
									language={language}
									toggleItemMod={this._toggleItemMod}
									ref={(ref) => {
										this.modRef[0] = ref;
									}}
									returnMod={this._returnMod}
									triggerPopUp={this._triggerPopUp}
								/>
								<ItemModShots
									premium={premium}
									language={language}
									toggleItemMod={this._toggleItemMod}
									ref={(ref) => {
										this.modRef[1] = ref;
									}}
									returnMod={this._returnMod}
									triggerPopUp={this._triggerPopUp}
								/>
								<ItemModDistribution
									premium={premium}
									language={language}
									toggleItemMod={this._toggleItemMod}
									ref={(ref) => {
										this.modRef[2] = ref;
									}}
									returnMod={this._returnMod}
									triggerPopUp={this._triggerPopUp}
								/>
								<ItemModHardcore
									premium={premium}
									language={language}
									toggleItemMod={this._toggleItemMod}
									ref={(ref) => {
										this.modRef[3] = ref;
									}}
									returnMod={this._returnMod}
									triggerPopUp={this._triggerPopUp}
								/>
							</ScrollView>
						</View>
					</View>
					<View style={styles.containerInterval}>
						<View style={styles.containerGameTitle}>
							<Text style={styles.titleMenu}>{textIntervals}</Text>
						</View>
						<View style={[ styles.containerGameCard, {} ]}>{this._displaySliders()}</View>
					</View>
				</View>
				<ChoiceTabNav
					nbJoueurs={records.namesName.length}
					goToHomeScreen={this._goToHomeScreen}
					goToGameScreen={this._goToGameScreen}
					language={language}
					premium={premium}
					ref={(ref) => (this.rowRefs[0] = ref)}
					showAlertFuncPremium={this._showAlertFuncPremium}
					becomePremium={this._becomePremium}
				/>
				<AlertRecord
					showAlert={this.state.showAlertPremium}
					showAlertFunc={this._showAlertFuncPremium}
					showAlertPremiumOrigin={this.state.showAlertPremiumOrigin}
					hideAlert={this._hideAlertPremium}
					language={language}
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
	containerGame: {
		flex: 1,
		marginBottom: 5
	},
	containerGameTitle: {
		borderBottomColor: white,
		borderBottomWidth: 5,
		borderBottomRightRadius: 70,
		borderBottomLeftRadius: 70,
		width: width - 100,
		alignSelf: 'center'
	},
	containerGameMenu: {
		width: width,
		marginBottom: 30
	},
	containerGameCard: {
		flex: 1,
		// height: height / 6,
		marginVertical: 5,
		borderRadius: 15,
		width: width - 30,
		borderWidth: 3,
		borderColor: red,
		backgroundColor: blue,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center'
	},
	containerInterval: {
		height: 160,
		backgroundColor: green
	},
	titleMenu: {
		fontSize: stl.fontSizeMenu,
		fontFamily: 'montserrat-bold',
		color: white,
		textAlign: 'center'
	}
});

const mapStateToProps = (state) => {
	// get only what we need
	return {
		language: state.setLanguage.language,
		premium: state.togglePremium.premium
	};
};

export default connect(mapStateToProps)(Choice);
