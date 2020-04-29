import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import * as text from '../assets/textInGame/listTextGame';
import AnimatedOnPress from '../Animations/AnimatedOnPress';

import * as stl from '../assets/styles/styles';
import { green } from '../assets/colors';

export default class GameTabNav extends Component {
	constructor(props) {
		super(props);

		this.state = {
			buttonStateGame: 'pause',
			buttonAnimation: new Animated.Value(1)
		};
	}

	_animateBuyBouton() {
		Animated.sequence([
			Animated.spring(this.state.buttonAnimation, {
				toValue: 0.6,
				friction: 15,
				tension: 18,
				useNativeDriver: false
			}),
			Animated.spring(this.state.buttonAnimation, {
				toValue: 1,
				friction: 15,
				tension: 18,
				useNativeDriver: false
			})
		]).start();
	}

	_onPressInPressed() {
		Animated.spring(this.state.buttonAnimation, {
			toValue: 0.6,
			friction: 15,
			tension: 18,
			useNativeDriver: false
		}).start();
	}

	_onPressOutPressed() {
		Animated.spring(this.state.buttonAnimation, {
			toValue: 1,
			friction: 15,
			tension: 18,
			useNativeDriver: false
		}).start();
		this._onPlayPausePressedChild();
	}

	_onPlayPausePressedChild() {
		const buttonState = this.state.buttonStateGame == 'pause' ? 'play' : 'pause';
		this.setState(
			{
				buttonStateGame: buttonState
			},
			() => this.props.onPlayPausePressedTabNav()
		);
	}

	render() {
		const animatedStyleButton = {
			transform: [ { scale: this.state.buttonAnimation } ]
		};

		const sourceImage =
			this.state.buttonStateGame == 'pause'
				? require('../assets/button-images/button-pause.png')
				: require('../assets/button-images/button-play.png');
		const { language } = this.props;
		let buttonEndSource;
		if (language == 'FR') {
			buttonEndSource = require('../assets/button-images/button-quitter-FR.png');
		} else if (language == 'EN') {
			buttonEndSource = require('../assets/button-images/button-quitter-EN.png');
		}
		return (
			<View style={{ backgroundColor: green }}>
				<View style={stl.containerBottom}>
					<Animated.View style={[ styles.containerBoutons, animatedStyleButton ]}>
						<TouchableWithoutFeedback
							onPressIn={() => {
								this._onPressInPressed();
							}}
							onPressOut={() => {
								this._onPressOutPressed();
							}}
						>
							<Image style={stl.buttonBottomTabBarImage} source={sourceImage} />
						</TouchableWithoutFeedback>
					</Animated.View>
					<View style={styles.containerBoutons}>
						<AnimatedOnPress toggleOnPress={this.props.onStopPressedTabNav}>
							<Image style={stl.buttonBottomTabBarImage} source={buttonEndSource} />
						</AnimatedOnPress>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	containerBoutons: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
