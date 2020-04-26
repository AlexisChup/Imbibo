import React, { Component } from 'react';
import {
	Text,
	StyleSheet,
	View,
	SafeAreaView,
	Dimensions,
	Button,
	TouchableWithoutFeedback,
	Image
} from 'react-native';
import PremiumPopUp from './PremiumPopUp';
import * as text from '../assets/textInGame/listTextEnd';
import AnimatedOnPress from '../Animations/AnimatedOnPress';
import * as stl from '../assets/styles/styles';
const { width, height } = Dimensions.get('window');

export default class EndTabNav extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this._permitPopUp = this._permitPopUp.bind(this);
	}

	//to know if we can launch popUp
	_permitPopUp() {
		return true;
	}

	_displayPremiumIcon() {
		const { premium, language } = this.props;
		if (premium) {
			return null;
		} else {
			return (
				<View style={{ marginTop: 12 }}>
					<PremiumPopUp
						isVisible={true}
						language={language}
						permitPopUp={this._permitPopUp}
						showAlertFuncPremium={this.props.showAlertFuncPremium}
						becomePremium={this.props.becomePremium}
					/>
				</View>
			);
		}
	}

	// Choose the write 'Accueil' button
	_displayHome() {
		const { language } = this.props;
		if (language == 'FR') {
			return (
				<Image
					style={styles.buttonBottomTabBar}
					source={require('../assets/button-images/button-accueil-FR.png')}
				/>
			);
		} else if (language == 'EN') {
			return (
				<Image
					style={styles.buttonBottomTabBar}
					source={require('../assets/button-images/button-accueil-EN.png')}
				/>
			);
		}
	}

	render() {
		const { language, premium } = this.props;
		let title;
		// let sourceButtonHome;
		if (language == 'FR') {
			title = text.titleFR;
			// sourceButtonHome = require('../assets/button-images/button-accueil-FR.png');
		} else if (language == 'EN') {
			title = text.titleEN;
			// sourceButtonHome = require('../assets/button-images/button-accueil-EN.png');
		}

		const flexPopUp = premium ? null : 1;
		return (
			<View style={{ flex: 1, alignSelf: 'center' }}>
				<View style={styles.bottomTabBar}>
					<View style={styles.buttonsContainer}>
						<View style={{}}>
							<AnimatedOnPress toggleOnPress={this.props.goToHomeScreen}>
								{this._displayHome()}
							</AnimatedOnPress>
						</View>

						{this._displayPremiumIcon()}
					</View>
				</View>
				<View style={styles.topTabBar}>
					<View style={styles.headerContainer}>
						<Text style={styles.headerTitle}>{title}</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	topTabBar: stl.topTabBar,
	headerContainer: stl.headerContainer,
	headerTitle: stl.headerTitle,
	bottomTabBar: stl.bottomTabBar,
	buttonsContainer: {
		marginBottom: 60,
		flexDirection: 'row',
		//alignItems: "center",
		justifyContent: 'center',
		justifyContent: 'space-around'
	},
	buttonBottomTabBar: {
		height: 65,
		width: 65,
		resizeMode: 'contain'
	}
});
