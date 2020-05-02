import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import PremiumPopUp from './PremiumPopUp';
import * as text from '../assets/textInGame/listTextEnd';
import AnimatedOnPress from '../Animations/AnimatedOnPress';
import * as stl from '../assets/styles/styles';
import { green } from '../assets/colors';

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
				<View style={{}}>
					<PremiumPopUp
						isVisible={false}
						// isVisible={true}
						language={language}
						endTabNav={true}
						resetAnim={this.props.resetAnim}
						startAnim={this.props.startAnim}
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
					style={stl.buttonBottomTabBarImage}
					source={require('../assets/button-images/button-accueil-FR.png')}
				/>
			);
		} else if (language == 'EN') {
			return (
				<Image
					style={stl.buttonBottomTabBarImage}
					source={require('../assets/button-images/button-accueil-EN.png')}
				/>
			);
		}
	}

	render() {
		const { language, premium } = this.props;
		return (
			<View style={{ backgroundColor: green }}>
				<View style={stl.containerBottom}>
					<View style={{}}>
						<AnimatedOnPress toggleOnPress={this.props.goToHomeScreen}>
							{this._displayHome()}
						</AnimatedOnPress>
					</View>

					{this._displayPremiumIcon()}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({});
