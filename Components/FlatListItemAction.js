import React, { Component } from 'react';
import {
	Text,
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	TextInput,
	Image,
	Dimensions,
	Animated,
	TouchableHighlight
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Hideo } from 'react-native-textinput-effects';
import { green, red, blue, white } from '../assets/colors';
const { height, width } = Dimensions.get('window');

export default class FlatListItemActions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			actionName: '',
			showItem: new Animated.Value(0.01),
			disabled: false,
			opacity: 1,
			isOnePlaying: false,
			backgroundColor: blue
		};
		this._updateAction = this._updateAction.bind(this);
		this.rowRefs = {};
	}

	componentDidMount() {
		// this.setState({
		//     actionName : this.props.action
		// })
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
		//console.log("AVANT CHANGER")
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
		console.log('YES ANIMATIONS');
		this.setState({
			isOnePlaying: true,
			backgroundColor: red
		});
	};

	// END ANIMATIONS WHEN FINISHING PLAYING AUDIO
	_endAnimation = () => {
		const { isOnePlaying } = this.state;
		if (isOnePlaying) {
			console.log('FIN ANIMATION');
			this.setState({
				isOnePlaying: false,
				backgroundColor: blue
			});
		}
	};

	render() {
		const { index, item } = this.props;
		const animItemTransform = {
			transform: [ { scale: this.state.showItem } ]
		};
		if (index == 0 && item == null) {
			return null;
		} else {
			const { backgroundColor } = this.state;
			return (
				<Animated.View style={[ styles.itemFlatList, animItemTransform, { backgroundColor: backgroundColor } ]}>
					{/* <TextInput 
                        style = {styles.textFlatList}
                        value = { this.state.actionName }
                        onChangeText= {text =>  this.onChangeText(index,text)}
                        editable = { !this.state.disabled }
                        placeholder = { this.props.action }
                        //defaultValue = {this.props.name}
                    />  */}
					<View
						style={{
							flex: 5
						}}
					>
						<Hideo
							value={this.state.actionName}
							onChangeText={(text) => this.onChangeText(index, text)}
							editable={!this.state.disabled}
							iconClass={Entypo}
							iconName={'game-controller'}
							iconColor={green}
							iconBackgroundColor={backgroundColor}
							placeholder={this.props.action}
							placeholderTextColor={'#b7b7b7'}
							inputStyle={[ styles.inputText, { backgroundColor: backgroundColor } ]}
							style={styles.inputStyle}
							useNativeDriver={false}
						/>
					</View>
					<View style={styles.iconFlatList}>
						<TouchableWithoutFeedback
							onPress={async () => this.props.playItemRecord(item, index, 'action')}
							disabled={this.state.disabled}
						>
							<View style={{ opacity: this.state.opacity }}>
								<Image
									style={styles.buttonFlatList}
									source={require('../assets/button-images/button-FL-play.png')}
								/>
							</View>
						</TouchableWithoutFeedback>

						<TouchableWithoutFeedback
							onPress={() => this.props.stopItemRecord(index, 'action')}
							disabled={this.state.disabled}
						>
							<View style={{ opacity: this.state.opacity }}>
								<Image
									style={styles.buttonFlatList}
									source={require('../assets/button-images/button-FL-stop.png')}
								/>
							</View>
						</TouchableWithoutFeedback>

						<TouchableWithoutFeedback
							onPress={() => this._deleteItem(index)}
							disabled={this.state.disabled}
						>
							<View style={{ opacity: this.state.opacity }}>
								<Image
									style={styles.buttonFlatList}
									source={require('../assets/button-images/button-FL-trash.png')}
								/>
							</View>
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
		fontStyle: 'italic',
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

// _displayItemFlatList(item, index){
//     if(index == 0 && this.soundsArray[0] == null){
//     //if(index == 0 && this.state.soundsArray[0] == null){
//       return null
//     }else {
//       //console.log("STATE : " + this.state.soundsArray.length())
//       //const text = this.state.soundsArray.length

//       return (
//         <View style = {styles.itemFlatList}>
//           {/* <Text
//             style = {styles.textFlatList}
//           >
//             {this.state.namesArray[index]}
//           </Text> */}
//           <TextInput
//             style = {styles.textFlatList}
//             value = { this.state.namesArray[index] }
//             onChangeText= {text =>  this._onChangeText(index, text)}
//           />
//           <View style = {styles.iconFlatList}>
//             <TouchableWithoutFeedback
//               onPress = {async() => this._playItemRecord(item, this._updateScreenForSoundStatus)}
//             >
//               <Image
//                 style = { styles.buttonFlatList }
//                 source = { require('./assets/button-images/button-FL-play.png') }
//               />
//             </TouchableWithoutFeedback>

//             <TouchableWithoutFeedback
//               onPress = {() => this._stopItemRecord()}
//             >
//               <Image
//                 style = { styles.buttonFlatList }
//                 source = { require('./assets/button-images/button-FL-stop.png') }
//               />
//             </TouchableWithoutFeedback>

//             <TouchableWithoutFeedback
//               onPress= {() => this._deleteItemRecord(index)}
//             >
//               <Image
//                 style = { styles.buttonFlatList }
//                 source = { require('./assets/button-images/button-FL-trash.png') }
//               />
//             </TouchableWithoutFeedback>

//           </View>
//         </View>

//       )
//     }
//   }
