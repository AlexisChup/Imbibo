import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, Animated } from 'react-native';

export default class MarkerSlider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			scale: new Animated.Value(1)
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.pressed === this.props.pressed && nextProps.value === this.props.value) {
			return false;
		} else {
			if (nextProps.pressed && !this.props.pressed) {
				this._reduceScale();
			} else if (!nextProps.pressed && this.props.pressed) {
				this._increaseScale();
			}
			return true;
		}
	}

	_reduceScale() {
		const { scale } = this.state;
		Animated.spring(scale, {
			toValue: 0.6,
			friction: 15,
			tension: 18,
			useNativeDriver: false
		}).start();
	}

	_increaseScale() {
		const { scale } = this.state;
		Animated.spring(scale, {
			toValue: 1,
			friction: 15,
			tension: 18,
			useNativeDriver: false
		}).start();
	}

	render() {
		const { scale } = this.state;
		const animatedScale = {
			transform: [ { scale } ]
		};
		const { pressed } = this.props;

		let value = this.props.value;
		let zero = '';
		let text;
		if (value < 60) {
			if (value < 10) {
				zero = '0';
			}
			text = zero + value + ' s';
		} else if (value < 120 && value >= 60) {
			if (value < 70) {
				zero = '0';
			}
			text = '1   min' + '\n' + zero + (value - 60) + ' s';
		} else if (value < 180 && value >= 120) {
			if (value < 130) {
				zero = '0';
			}
			text = '2   min' + '\n' + zero + (value - 120) + ' s';
		} else if (value < 240 && value >= 180) {
			if (value < 190) {
				zero = '0';
			}
			text = '3   min' + '\n' + zero + (value - 180) + ' s';
		} else if (value < 300 && value >= 240) {
			if (value < 250) {
				zero = '0';
			}
			text = '4   min' + '\n' + zero + (value - 240) + ' s';
		}
		return (
			<Animated.View style={[ styles.containerMarker, animatedScale ]}>
				<Image
					style={[ styles.markersImage ]}
					source={
						pressed ? require('../assets/slider/markerGreen.png') : require('../assets/slider/marker.png')
					}
				/>
				<View style={styles.containerMarkerText}>
					<Text style={styles.textMarker}> {text} </Text>
				</View>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	containerMarker: {
		shadowColor: '#000',
		shadowOffset: {
			width: 12,
			height: 12
		},
		shadowOpacity: 0.6,
		shadowRadius: 6.0,
		elevation: 12
	},
	markersImage: {
		height: 125,
		width: 125,
		resizeMode: 'contain'
	},
	containerMarkerText: {
		position: 'absolute',
		textAlign: 'center',
		alignSelf: 'center',
		top: 11
	},
	textMarker: {
		color: 'white',
		fontSize: 10,
		fontFamily: 'montserrat-extra-bold'
	}
});
