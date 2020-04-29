import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Dimensions, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Hideo } from 'react-native-textinput-effects';

import { green, red, blue, white } from '../assets/colors';
const { height, width } = Dimensions.get('window');

export default class FlatListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			joueurName: '',
			showItem: new Animated.Value(0.01),
			scalePlayButton: new Animated.Value(1),
			scalePauseButton: new Animated.Value(1),
			scaleStopButton: new Animated.Value(1),
			disabled: false,
			opacity: 1,
			isOnePlaying: false,
			backgroundColor: blue
		};
		this._updateName = this._updateName.bind(this);
		this.rowRefs = {};
	}

	componentDidMount() {
		this._animateItem();
	}

	_animateItem() {
		Animated.spring(this.state.showItem, {
			toValue: 1,
			tension: 18,
			friction: 5,
			useNativeDriver: false
		}).start();
	}

	onChangeText(index, text) {
		this.props.changeName(index, text);
		this.setState({ joueurName: text });
	}

	_updateName() {
		this.setState({
			joueurName: this.props.name
		});
	}

	_deleteItem(index) {
		this.props.deleteItemRecord(index, 'name');
	}

	_disabledButtons() {
		this.setState({
			disabled: true,
			opacity: 0.2
		});
	}

	_enabledButtons() {
		this.setState({
			disabled: false,
			opacity: 1
		});
	}

	// START ANIMATIONS WHEN PLAY AUDIO
	_startAnimation = () => {
		this.setState({
			isOnePlaying: true,
			backgroundColor: red
		});
	};

	// END ANIMATIONS WHEN FINISHING PLAYING AUDIO
	_endAnimation = () => {
		const { isOnePlaying } = this.state;
		if (isOnePlaying) {
			this.setState({
				isOnePlaying: false,
				backgroundColor: blue
			});
		}
	};

	// Animations for the 3 little buttons
	_toggleOnPressIn = (buttonOrigin) => {
		Animated.spring(buttonOrigin, {
			toValue: 0.6,
			friction: 15,
			tension: 18,
			useNativeDriver: false
		}).start();
	};

	_toggleOnPressOut = (buttonOrigin) => {
		Animated.spring(buttonOrigin, {
			toValue: 1,
			friction: 15,
			tension: 18,
			useNativeDriver: false
		}).start();
	};

	render() {
		const { index, item } = this.props;
		const { scalePlayButton, scalePauseButton, scaleStopButton } = this.state;

		const animItemTransform = {
			transform: [ { scale: this.state.showItem } ]
		};
		const sPlayButton = {
			transform: [ { scale: scalePlayButton } ]
		};
		const sPauseButton = {
			transform: [ { scale: scalePauseButton } ]
		};
		const sStopButton = {
			transform: [ { scale: scaleStopButton } ]
		};

		if (index == 0 && (item == null || item == undefined)) {
			return null;
		} else {
			const { backgroundColor } = this.state;
			return (
				<Animated.View style={[ styles.itemFlatList, animItemTransform, { backgroundColor: backgroundColor } ]}>
					<View
						style={{
							flex: 5
						}}
					>
						<Hideo
							value={this.state.joueurName}
							onChangeText={(text) => this.onChangeText(index, text)}
							editable={!this.state.disabled}
							iconClass={Ionicons}
							iconName={'md-person'}
							iconColor={green}
							iconBackgroundColor={backgroundColor}
							placeholder={this.props.name}
							placeholderTextColor={'#b7b7b7'}
							inputStyle={[ styles.inputText, { backgroundColor: backgroundColor } ]}
							style={styles.inputStyle}
							useNativeDriver={false}
						/>
					</View>
					<View style={styles.iconFlatList}>
						<TouchableWithoutFeedback
							onPressIn={() => this._toggleOnPressIn(scalePlayButton)}
							onPressOut={() => this._toggleOnPressOut(scalePlayButton)}
							onPress={async () => this.props.playItemRecord(item, index, 'name')}
							disabled={this.state.disabled}
						>
							<Animated.View style={[ { opacity: this.state.opacity }, sPlayButton ]}>
								<Image
									style={styles.buttonFlatList}
									source={require('../assets/button-images/button-FL-play.png')}
								/>
							</Animated.View>
						</TouchableWithoutFeedback>

						<TouchableWithoutFeedback
							onPressIn={() => this._toggleOnPressIn(scalePauseButton)}
							onPressOut={() => this._toggleOnPressOut(scalePauseButton)}
							onPress={() => this.props.stopItemRecord(index, 'name')}
							disabled={this.state.disabled}
						>
							<Animated.View style={[ { opacity: this.state.opacity }, sPauseButton ]}>
								<Image
									style={styles.buttonFlatList}
									source={require('../assets/button-images/button-FL-stop.png')}
								/>
							</Animated.View>
						</TouchableWithoutFeedback>

						<TouchableWithoutFeedback
							onPressIn={() => this._toggleOnPressIn(scaleStopButton)}
							onPressOut={() => this._toggleOnPressOut(scaleStopButton)}
							onPress={() => this._deleteItem(index)}
							disabled={this.state.disabled}
						>
							<Animated.View style={[ { opacity: this.state.opacity }, sStopButton ]}>
								<Image
									style={styles.buttonFlatList}
									source={require('../assets/button-images/button-FL-trash.png')}
								/>
							</Animated.View>
						</TouchableWithoutFeedback>
					</View>
				</Animated.View>
			);
		}
	}
}

const styles = StyleSheet.create({
	itemFlatList: {
		width: width - 40,
		height: 40,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		alignSelf: 'center',
		borderRadius: 30,
		margin: 5,
		flex: 1
	},
	textFlatList: {
		flex: 1,
		fontStyle: 'italic',
		fontSize: height / 10 - 50,
		marginLeft: 20,
		color: white
	},
	inputText: {
		fontSize: 15,
		color: white,
		fontFamily: 'montserrat-regular'
	},
	inputStyle: {
		marginVertical: 5,
		borderRadius: 30,
		flex: 0,
		height: 30,
		overflow: 'hidden',
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center'
	},
	buttonFlatList: {
		width: 30,
		height: 30,
		resizeMode: 'contain'
	},
	iconFlatList: {
		flex: 3,
		flexDirection: 'row',
		justifyContent: 'space-around'
	}
});
