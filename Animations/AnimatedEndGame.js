import React, { Component } from 'react';
import { Text, StyleSheet, View, Animated, TouchableWithoutFeedback, Dimensions, Easing } from 'react-native';
const { width, height } = Dimensions.get('window');
export default class AnimatedEndGame extends Component {
	constructor(props) {
		super(props);

		this.state = {
			spinValue: new Animated.Value(0),
			marginLeftValue: new Animated.Value(-1),
			scaleValue: new Animated.Value(1)
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this._animationImage();
		}, 1000);
	}

	componentWillUnmount() {
		this.animation.reset();
	}
	// ANIMATION FOR THE LOGO
	_animationImage = () => {
		const { spinValue, marginLeftValue, scaleValue } = this.state;
		this.animation = Animated.loop(
			Animated.sequence([
				Animated.parallel([
					Animated.spring(marginLeftValue, {
						tension: 18,
						friction: 10,
						delay: 1000,
						toValue: 0,
						useNativeDriver: false
					}),
					Animated.timing(scaleValue, {
						toValue: 1,
						delay: 1000,
						easing: Easing.ease,
						duration: 500,
						useNativeDriver: false
					})
				]),
				Animated.parallel(
					[
						Animated.timing(spinValue, {
							toValue: -0.3,
							easing: Easing.ease,
							duration: 1000,
							delay: 5000,
							useNativeDriver: false
						}),
						Animated.timing(scaleValue, {
							toValue: 1.2,
							easing: Easing.ease,
							duration: 1000,
							delay: 5000,
							useNativeDriver: false
						})
					],
					{}
				),
				Animated.parallel([
					Animated.timing(spinValue, {
						toValue: 2.2,
						easing: Easing.ease,
						duration: 1500,
						useNativeDriver: false
					}),
					Animated.timing(scaleValue, {
						toValue: 0.2,
						easing: Easing.ease,
						duration: 1500,
						useNativeDriver: false
					})
				]),
				Animated.parallel([
					Animated.timing(spinValue, {
						toValue: 2,
						easing: Easing.back(2),
						duration: 500,
						useNativeDriver: false
					}),
					Animated.timing(scaleValue, {
						toValue: 1,
						easing: Easing.back(2),
						duration: 500,
						useNativeDriver: false
					})
				]),
				Animated.parallel([
					Animated.spring(marginLeftValue, {
						tension: 18,
						friction: 10,
						delay: 2000,
						toValue: 1,
						useNativeDriver: false
					}),
					Animated.timing(scaleValue, {
						toValue: 0.2,
						delay: 2000,
						easing: Easing.ease,
						duration: 500,
						useNativeDriver: false
					})
				])
			])
		);
		this.animation.start();
	};

	render() {
		const { scaleValue } = this.state;
		const spin = this.state.spinValue.interpolate({
			inputRange: [ 0, 2 ],
			outputRange: [ '0deg', '720deg' ]
		});

		const marginLeft = this.state.marginLeftValue.interpolate({
			inputRange: [ -1, 1 ],
			outputRange: [ -width * 2, width * 2 ]
		});
		return (
			<Animated.View
				style={[
					this.props.style,
					{ marginLeft: marginLeft, transform: [ { rotate: spin }, { scale: scaleValue } ] }
				]}
			>
				{this.props.children}
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({});
