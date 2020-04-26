import React, { Component } from 'react';
import {
	Text,
	StyleSheet,
	View,
	Dimensions,
	TouchableOpacity,
	Image,
	Animated,
	TouchableWithoutFeedback
} from 'react-native';
import * as text from '../assets/textInGame/listTextGame';
import AnimatedOnPress from '../Animations/AnimatedOnPress';

const { height, width } = Dimensions.get('window');

import * as stl from '../assets/styles/styles';

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

	// _onStopPressedChild() {
	// 	this.props.onStopPressedTabNav();
	// }

	render() {
		const animatedStyleButton = {
			transform: [ { scale: this.state.buttonAnimation } ]
		};

		const sourceImage =
			this.state.buttonStateGame == 'pause'
				? require('../assets/button-images/button-pause.png')
				: require('../assets/button-images/button-play.png');
		const { language } = this.props;
		let title;
		let buttonEndSource;
		if (language == 'FR') {
			title = text.titleScreenFR;
			buttonEndSource = require('../assets/button-images/button-quitter-FR.png');
		} else if (language == 'EN') {
			title = text.titleScreenEN;
			buttonEndSource = require('../assets/button-images/button-quitter-EN.png');
		}
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.bottomTabBar}>
					<View style={styles.buttonsContainer}>
						{/* <View style = { styles.containerBoutons } >
                      <TouchableOpacity
                        onPress={() => {this.props.goToChoiceScreen()}}
                      >
                          <Image
                            style = {{ height: 40, width: 40, resizeMode: "contain" }}
                            source = { require('../assets/button-images/button-left.png') }
                          />
                      </TouchableOpacity>

                    </View> */}
						<Animated.View style={[ styles.containerBoutons, animatedStyleButton ]}>
							<TouchableWithoutFeedback
								onPressIn={() => {
									this._onPressInPressed();
								}}
								onPressOut={() => {
									this._onPressOutPressed();
								}}
							>
								<Image style={styles.buttonBottomTabBar} source={sourceImage} />
							</TouchableWithoutFeedback>
						</Animated.View>
						<View style={styles.containerBoutons}>
							<AnimatedOnPress toggleOnPress={this.props.onStopPressedTabNav}>
								<Image style={styles.buttonBottomTabBar} source={buttonEndSource} />
							</AnimatedOnPress>
						</View>
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
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	buttonBottomTabBar: {
		height: 65,
		width: 65,
		resizeMode: 'contain'
	},
	containerBoutons: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
