import React, { Component } from 'react';
import { Text, StyleSheet, View, Animated, TouchableWithoutFeedback } from 'react-native';

export default class AnimatedOnPress extends Component {
	constructor(props) {
		super(props);

		this.state = {
			scale: new Animated.Value(1)
		};
	}

	_toggleOnPressIn() {
		const { scale } = this.state;
		Animated.spring(scale, {
			toValue: 0.6,
			friction: 15,
			tension: 18,
			useNativeDriver: false
		}).start();
	}

	_toggleOnPressOut() {
		const { scale } = this.state;
		Animated.spring(scale, {
			toValue: 1,
			friction: 15,
			tension: 18,
			useNativeDriver: false
		}).start();
	}

	render() {
		const animatedScale = {
			transform: [ { scale: this.state.scale } ]
		};

		return (
			<TouchableWithoutFeedback
				style={[ { alignItems: 'center', justifyContent: 'center' } ]}
				onPressIn={() => this._toggleOnPressIn()}
				onPressOut={() => this._toggleOnPressOut()}
				onPress={() => this.props.toggleOnPress()}
			>
				<Animated.View style={[ animatedScale ]}>{this.props.children}</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({});
