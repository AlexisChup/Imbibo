import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, Dimensions, TouchableWithoutFeedback, Animated } from 'react-native';
import { blue, red, white } from '../assets/colors';

const { width } = Dimensions.get('window');
import * as text from '../assets/textInGame/listTextMods';

export default class ItemChoice extends Component {
	constructor(props) {
		super(props);

		this.state = {
			colorBG: blue,
			colorBorder: red,
			itemScale: new Animated.Value(1)
		};
	}

	_reverseColor() {
		if (this.state.colorBG == blue) {
			this.setState({
				colorBG: red,
				colorBorder: blue
			});
		} else {
			this.setState({
				colorBG: blue,
				colorBorder: red
			});
		}
	}

	_handleToggleMod(mod) {
		const modActual = this.props.returnMod();
		if (modActual != mod) {
			this._reverseColor();
			this.props.toggleItemMod(mod);
		}
	}

	_toggleOnPressIn() {
		const { premium, title } = this.props;
		if (title == 'Normal' || premium) {
			Animated.spring(this.state.itemScale, {
				toValue: 0.7,
				friction: 15,
				tension: 18,
				useNativeDriver: false
			}).start();
		}
	}

	_toggleOnPressOut(mod) {
		const { premium, title } = this.props;
		if (title == 'Normal' || premium) {
			Animated.spring(this.state.itemScale, {
				toValue: 1,
				friction: 4,
				tension: 20,
				useNativeDriver: false
			}).start();
		}
	}

	_toggleOnPress(mod) {
		const { premium, title } = this.props;
		if (title != 'Normal' && !premium) {
			this.props.triggerPopUp();
		}
		if (premium) {
			this._handleToggleMod(mod);
		}
	}

	_displayLogoMod() {
		const { premium, title, mod } = this.props;
		if (premium || title == 'Normal') {
			let sourceIconsMods;
			if (mod == 0) {
				sourceIconsMods = require('../assets/mods/mod_normal.png');
			} else if (mod == 1) {
				sourceIconsMods = require('../assets/mods/mod_shots.png');
			} else if (mod == 2) {
				sourceIconsMods = require('../assets/mods/mod_distribution.png');
			} else if (mod == 3) {
				sourceIconsMods = require('../assets/mods/mod_hardcore.png');
			}
			return <Image style={styles.lockedMods} source={sourceIconsMods} />;
		} else {
			return <Image style={styles.lockedMods} source={require('../assets/button-images/button-lock-mod.png')} />;
		}
	}

	render() {
		const animatedScale = {
			transform: [ { scale: this.state.itemScale } ]
		};
		const { mod, language, premium } = this.props;
		const { colorBG, colorBorder } = this.state;
		let title;
		let description;
		if (mod == 0) {
			//normal
			if (language == 'FR') {
				title = text.normalTitleFR;
				description = text.normalFR;
			} else if (language == 'EN') {
				title = text.normalTitleEN;
				description = text.normalEN;
			}
		} else if (mod == 1) {
			//rapide
			if (language == 'FR') {
				title = text.rapideTitleFR;
				description = text.rapideFR;
			} else if (language == 'EN') {
				title = text.rapideTitleEN;
				description = text.rapideEN;
			}
		} else if (mod == 2) {
			//missile
			if (language == 'FR') {
				title = text.missileTitleFR;
				description = text.missileFR;
			} else if (language == 'EN') {
				title = text.missileTitleEN;
				description = text.missileEN;
			}
		} else if (mod == 3) {
			//hardcore
			if (language == 'FR') {
				title = text.hardcoreTitleFR;
				description = text.hardcoreFR;
			} else if (language == 'EN') {
				title = text.hardcoreTitleEN;
				description = text.hardcoreEN;
			}
		}

		let bg, opa;
		if (!premium && title != 'Normal') {
			bg = null;
			opa = 0.4;
		} else if (title == 'Normal' || premium) {
			bg = white;
			opa = 1;
		}
		let fontFamily;
		if (title == 'HARDCORE') {
			fontFamily = 'cinzel-black';
		} else {
			fontFamily = 'montserrat-bold';
		}
		return (
			<TouchableWithoutFeedback
				onPressIn={() => this._toggleOnPressIn()}
				onPressOut={() => this._toggleOnPressOut(mod)}
				onPress={() => this._toggleOnPress(mod)}
				style={{ flex: 1 }}
			>
				<Animated.View
					style={[
						styles.containerGameCard,
						animatedScale,
						{ backgroundColor: colorBG, borderColor: colorBorder, opacity: opa }
					]}
				>
					<View style={[ styles.containerImage ]}>{this._displayLogoMod()}</View>
					<View style={styles.containerTexts}>
						<View style={styles.containerTextTitle}>
							<Text style={[ styles.textTitle, { fontFamily: fontFamily } ]}>{title}</Text>
						</View>
						<View style={styles.containerTextDesc}>
							<Text style={styles.textDesc}>{description}</Text>
						</View>
					</View>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	containerGameCard: {
		marginVertical: 5,
		borderRadius: 15,
		width: width - 30,
		borderWidth: 3,
		alignSelf: 'center',
		flexDirection: 'row'
	},
	containerImage: {
		flex: 2,
		borderRadius: 30,
		marginLeft: 10,
		marginRight: 10,
		marginVertical: 5,
		alignItems: 'center'
	},
	containerTexts: {
		flex: 5,
		flexDirection: 'column',
		marginLeft: 10,
		marginRight: 10,
		marginVertical: 10
	},
	containerTextTitle: {},
	containerTextDesc: {},
	textTitle: {
		fontSize: 24,
		fontFamily: 'montserrat-bold',
		color: white
	},
	textDesc: {
		fontSize: 12,
		color: white,
		fontFamily: 'montserrat-regular'
	},
	lockedMods: {
		height: 70,
		width: 70,
		resizeMode: 'contain'
	}
});
