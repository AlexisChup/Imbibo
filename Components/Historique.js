import React, { Component } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Dimensions, StatusBar, FlatList, Animated } from 'react-native';
import { green, red, blue, white } from '../assets/colors';
const { height, width } = Dimensions.get('window');
export default class Historique extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showItem: new Animated.Value(1)
		};
	}

	_animateItem() {
		this.state.showItem.setValue(0.01);
		Animated.spring(this.state.showItem, {
			toValue: 1,
			tension: 18,
			friction: 5,
			useNativeDriver: false
		}).start();
	}

	render() {
		const { name, action, hours, minutes } = this.props;
		const animItemTransform = {
			transform: [ { scale: this.state.showItem } ]
		};
		let displayedName = name;
		if (name != null) {
			displayedName = displayedName + ' ';
		}
		return (
			<Animated.View style={[ styles.containerItem, animItemTransform ]}>
				<View style={styles.containerText}>
					<View style={styles.containerDesc}>
						<Text style={styles.text}>
							{' '}
							{displayedName}
							{action}{' '}
						</Text>
					</View>
					<View style={styles.containerHours}>
						<Text style={styles.textHours}>
							{' '}
							{hours} : {minutes}{' '}
						</Text>
					</View>
				</View>
			</Animated.View>
		);
	}
}

let fontSize;
if (height > 800) {
	fontSize = height / 60;
} else {
	fontSize = height / 50;
}

const styles = StyleSheet.create({
	containerItem: {
		flex: 1,
		backgroundColor: blue,
		borderRadius: 15,
		width: width - 50,
		alignSelf: 'center',
		marginVertical: 3,
		marginHorizontal: 15,
		elevation: 12
	},
	containerText: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 7
	},
	containerDesc: {
		//backgroundColor: red,
		flex: 1,
		marginLeft: 5
	},
	containerHours: {
		marginRight: 5
	},
	text: {
		fontFamily: 'montserrat-regular',
		fontSize: fontSize,
		color: white
	},
	textHours: {
		fontFamily: 'montserrat-bold',
		fontSize: fontSize,
		color: red
	}
});