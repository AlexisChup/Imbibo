import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Dimensions, Animated } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Hideo } from 'react-native-textinput-effects';
import { green, red, blue, white } from '../assets/colors';
const { width } = Dimensions.get('window');

export default class FlatListItemActions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			actionName: '',
			showItem: new Animated.Value(0.01),
			scalePlayButton: new Animated.Value(1),
			scalePauseButton: new Animated.Value(1),
			scaleStopButton: new Animated.Value(1),
			disabled: false,
			opacity: 1,
			isOnePlaying: false,
			backgroundColor: blue
		};
		this._updateAction = this._updateAction.bind(this);
		this.rowRefs = {};
	}

	componentDidMount() {
		this._animateItem();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState == this.state) {
			return false;
		} else {
			return true;
		}
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
		this.props.changeAction(index, text);
		this.setState({ actionName: text });
	}

	_updateAction() {
		this.setState({
			actionName: this.props.action
		});
	}

	_deleteItem(index) {
		this.props.deleteItemRecord(index, 'action');
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
		const { index, item, action } = this.props;
		const {
			scalePlayButton,
			scalePauseButton,
			scaleStopButton,
			disabled,
			opacity,
			showItem,
			actionName,
			backgroundColor
		} = this.state;

		const animItemTransform = {
			transform: [ { scale: showItem } ]
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
		if (index == 0 && item == null) {
			return null;
		} else {
			return (
				<Animated.View style={[ styles.itemFlatList, animItemTransform, { backgroundColor: backgroundColor } ]}>
					<View
						style={{
							flex: 5
						}}
					>
						<Hideo
							value={actionName}
							onChangeText={(text) => this.onChangeText(index, text)}
							editable={!disabled}
							iconClass={Entypo}
							iconName={'game-controller'}
							iconColor={green}
							iconBackgroundColor={backgroundColor}
							placeholder={action}
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
							onPress={async () => this.props.playItemRecord(item, index, 'action')}
							disabled={disabled}
						>
							<Animated.View style={[ { opacity: opacity }, sPlayButton ]}>
								<Image
									style={styles.buttonFlatList}
									source={require('../assets/button-images/button-FL-play.png')}
								/>
							</Animated.View>
						</TouchableWithoutFeedback>

						<TouchableWithoutFeedback
							onPressIn={() => this._toggleOnPressIn(scalePauseButton)}
							onPressOut={() => this._toggleOnPressOut(scalePauseButton)}
							onPress={() => this.props.stopItemRecord(index, 'action')}
							disabled={disabled}
						>
							<Animated.View style={[ { opacity: opacity }, sPauseButton ]}>
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
							disabled={disabled}
						>
							<Animated.View style={[ { opacity: opacity }, sStopButton ]}>
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
	textFlatList: {
		flex: 1,
		fontStyle: 'italic',
		fontSize: 15,
		marginLeft: 20,
		color: white
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
