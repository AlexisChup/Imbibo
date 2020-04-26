import React, { Component } from 'react';
import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import PremiumPopUp from './PremiumPopUp';
const { height, width } = Dimensions.get('window');
import * as stl from '../assets/styles/styles';
import AnimatedOnPress from '../Animations/AnimatedOnPress';
import * as text from '../assets/textInGame/listTextChoice';
export default class ChoiceTabNav extends Component {
	constructor(props) {
		super(props);
		this.rowRefs = [];
		this.state = {};
		this._permitPopUp = this._permitPopUp.bind(this);
	}

	triggerPopUp() {
		this.rowRefs[0]._triggerPopUp();
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
				<PremiumPopUp
					ref={(ref) => (this.rowRefs[0] = ref)}
					isVisible={false}
					language={language}
					permitPopUp={this._permitPopUp}
					showAlertFuncPremium={this.props.showAlertFuncPremium}
					becomePremium={this.props.becomePremium}
				/>
			);
		}
	}

	render() {
		const { language, premium, nbJoueurs } = this.props;

		let playersName, displayedNBJ;
		if (language == 'FR') {
			playersName = text.titleScreenFR;
		} else if (language == 'EN') {
			playersName = text.titleScreenEN;
		}

		//remove the 's' if there is less than 2 players
		if (nbJoueurs <= 1) {
			playersName = playersName.slice(0, -1);
		}

		const flexPopUp = premium ? null : 1;

		return (
			<View style={{ flex: 1 }}>
				<View style={styles.bottomTabBar}>
					<View style={styles.buttonsContainer}>
						<View style={styles.containerButton}>
							<AnimatedOnPress toggleOnPress={this.props.goToHomeScreen}>
								<Image
									style={styles.buttonBottomTabBar}
									source={require('../assets/button-images/button-left.png')}
								/>
							</AnimatedOnPress>
						</View>
						<View style={[ styles.containerButton, { marginTop: 10, flex: flexPopUp } ]}>
							{this._displayPremiumIcon()}
						</View>
						<View style={styles.containerButton}>
							<AnimatedOnPress toggleOnPress={this.props.goToGameScreen}>
								<Image
									style={[ styles.buttonGo ]}
									source={require('../assets/button-images/button-go.png')}
								/>
							</AnimatedOnPress>
						</View>
					</View>
				</View>
				<View style={styles.topTabBar}>
					<View style={styles.headerContainer}>
						<Text style={styles.headerTitle}>
							{nbJoueurs} {playersName}
						</Text>
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
	containerButton: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonsContainer: {
		marginBottom: 60,
		flexDirection: 'row'
		//justifyContent: 'space-around'
	},
	buttonBottomTabBar: {
		height: 40,
		width: 40,
		resizeMode: 'contain'
	},
	buttonGo: {
		height: 65,
		width: 65,
		resizeMode: 'contain'
	}
});
