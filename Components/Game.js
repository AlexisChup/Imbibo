import React, { Component } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Dimensions, StatusBar, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Chronometer from './Chronometer';
import GameTabNav from './GameTabNav';
import * as stl from '../assets/styles/styles';
import Historique from './Historique';
import * as text from '../assets/textInGame/listTextGame';

import { green, red, blue, white } from '../assets/colors';

const { height, width } = Dimensions.get('window');
let flexContainerChrono;
if (height < 800) {
	flexContainerChrono = 6;
} else {
	flexContainerChrono = 5.5;
}

class Game extends Component {
	constructor(props) {
		super(props);
		this._goToHomeScreen = this._goToHomeScreen.bind(this);
		this._goToChoiceScreen = this._goToChoiceScreen.bind(this);
		this._goToEndScreen = this._goToEndScreen.bind(this);
		this._onPlayPausePressedTabNav = this._onPlayPausePressedTabNav.bind(this);
		this._onStopPressedTabNav = this._onStopPressedTabNav.bind(this);
		this._addHistorique = this._addHistorique.bind(this);

		this.records = this.props.navigation.getParam('records');
		this.valuesSlider = this.props.navigation.getParam('valuesSlider');
		this.mod = this.props.navigation.getParam('mod');
		this.indexHistory;
		this.rowRefs = [];
		this.historique = [];
		this.state = {
			hist: null
		};
	}

	_goToHomeScreen() {
		this.props.navigation.navigate('HomeScreen');
	}

	_goToChoiceScreen() {
		this.refs.chrono._stopChrono();
		this.props.navigation.navigate('ChoiceScreen');
	}

	_goToEndScreen() {
		this.refs.chrono._stopChrono();
		this.props.navigation.navigate('EndScreen');
	}

	// Pres on Play/Pause
	_onPlayPausePressedTabNav() {
		//Acces to the PLAY/PAUSE du chrono
		this.refs.chrono._onPlayPausePressed();
	}

	// Pres on Stop
	_onStopPressedTabNav() {
		//Acces to the PLAY/PAUSE du chrono
		this.refs.chrono._onStopPressed();
		this._goToEndScreen();
	}

	// add item for FlatList
	_addHistorique(name, action) {
		const index = this.historique.length;
		var hours = new Date().getHours(); //Current Hours
		var minutes = new Date().getMinutes(); //Current Hours
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		const newItem = {
			name: name,
			hours: hours,
			minutes: minutes,
			action: action
		};

		this.historique.unshift(newItem);
		this.setState(
			{
				hist: name
			},
			() => this.rowRefs[0]._animateItem()
		);
	}

	_renderFooter() {
		return <View style={{ marginBottom: 20 }} />;
	}

	render() {
		const language = this.props.language;
		let time;
		let history;
		if (language == 'FR') {
			time = text.timeFR;
			history = text.historyFR;
		} else if (language == 'EN') {
			time = text.timeEN;
			history = text.historyEN;
		}
		//console.log("GAME LANGUAGE " +language+ " GAME MOD : " + this.mod)
		//console.log(" nb Actions :" + this.records.actions.length)
		return (
			<SafeAreaView style={styles.container}>
				<StatusBar hidden={true} />
				<View style={styles.containerView}>
					<View style={styles.containerTitle}>
						<Text style={styles.title}>{time}</Text>
					</View>
					<View style={styles.containerChrono}>
						<Chronometer
							ref="chrono"
							records={this.records}
							addHistorique={this._addHistorique}
							valuesSlider={this.valuesSlider}
							language={language}
							mod={this.mod}
						/>
					</View>
					<View style={styles.containerHistorique}>
						<View style={styles.containerTitle}>
							<Text style={styles.title}>{history}</Text>
						</View>

						<View style={styles.containerFlat}>
							<View style={{ marginTop: 10 }}>
								<FlatList
									data={this.historique}
									extraData={this.state.hist}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<Historique
											name={this.historique[index].name}
											action={this.historique[index].action}
											hours={this.historique[index].hours}
											minutes={this.historique[index].minutes}
											index={index}
											ref={(Historique) => {
												this.rowRefs[index] = Historique;
											}}
										/>
									)}
									ListFooterComponent={this._renderFooter()}
								/>
							</View>
						</View>
					</View>
				</View>

				<GameTabNav
					goToChoiceScreen={this._goToChoiceScreen}
					onPlayPausePressedTabNav={this._onPlayPausePressedTabNav}
					onStopPressedTabNav={this._onStopPressedTabNav}
					language={language}
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
		alignSelf: 'center',
		marginTop: 10
	},
	containerChrono: {
		flex: flexContainerChrono,
		width: width - 30,
		justifyContent: 'center',
		alignSelf: 'center',
		// marginTop: 40,
		marginBottom: -10
	},
	containerHistorique: {
		flex: 3,
		width: width - 30
	},
	containerFlat: {
		// backgroundColor: red,
		// borderColor: green,
		// borderWidth: 2,

		flex: 1,
		borderRadius: 15,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 6,
			height: 6
		},
		shadowOpacity: 0.8,
		shadowRadius: 6.0
	},
	title: {
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

export default connect(mapStateToProps)(Game);