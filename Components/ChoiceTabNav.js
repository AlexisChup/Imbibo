import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import PremiumPopUp from './PremiumPopUp';
import * as stl from '../assets/styles/styles';
import AnimatedOnPress from '../Animations/AnimatedOnPress';
import * as text from '../assets/textInGame/listTextChoice';
import { green } from '../assets/colors';
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
			<View style={{ backgroundColor: green }}>
				<View style={stl.containerBottom}>
					<View style={[ styles.containerButton, { flex: 1 } ]}>
						<AnimatedOnPress toggleOnPress={this.props.goToHomeScreen}>
							<Image
								style={stl.buttonBottomTabBar}
								source={require('../assets/button-images/button-left.png')}
							/>
						</AnimatedOnPress>
					</View>
					<View style={[ { flex: flexPopUp } ]}>{this._displayPremiumIcon()}</View>
					<View style={[ styles.containerButton, { flex: 1 } ]}>
						<AnimatedOnPress toggleOnPress={this.props.goToGameScreen}>
							<Image
								style={[ stl.buttonBottomTabBarImage ]}
								source={require('../assets/button-images/button-go.png')}
							/>
						</AnimatedOnPress>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	containerButton: {
		alignItems: 'center',
		justifyContent: 'center'
	}
});
