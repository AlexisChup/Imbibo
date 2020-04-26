import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { green } from '../assets/colors';
const { height, width } = Dimensions.get('window');
let fontSize;
let heightMarker;
if (height <= 592) {
	fontSize = 9;
	heightMarker = 110;
} else {
	fontSize = 12;
	heightMarker = 140;
}
export default class MarkerSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	_displayItemsSlider(text) {
		const { premium } = this.props;
		if (premium) {
			return (
				<View>
					<Image style={styles.markersImage} source={require('../assets/slider/marker.png')} />
					<View style={styles.containerMarkerText}>
						<Text style={styles.textMarker}> {text} </Text>
					</View>
				</View>
			);
		} else {
			return (
				<View>
					<Image style={styles.markersImage} source={require('../assets/slider/marker-locked.png')} />
					{/* <View style = { styles.containerMarkerText }>
                <Text style = { styles.textMarker }> {text} </Text>
    
              </View> */}
				</View>
			);
		}
	}

	render() {
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
		return <View style={styles.containerMarker}>{this._displayItemsSlider(text)}</View>;
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
		elevation: 20
	},
	markersImage: {
		height: heightMarker,
		width: heightMarker,
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
		fontSize: fontSize,
		fontFamily: 'montserrat-extra-bold'
	}
});