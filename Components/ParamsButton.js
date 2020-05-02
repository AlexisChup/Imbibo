import React from 'react';
import {
	Text,
	TouchableHighlight,
	View,
	StyleSheet,
	Image,
	Dimensions,
	Animated,
	TouchableWithoutFeedback,
	Share,
	Platform,
	AsyncStorage,
	ScrollView
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import AnimatedOnPress from '../Animations/AnimatedOnPress';
import * as text from '../assets/textInGame/listTextParams';
import * as textShare from '../assets/textInGame/listTextSelectLanguage';
import { white, red, blue, green } from '../assets/colors';
import * as stl from '../assets/styles/styles';
import Rate, { AndroidMarket } from 'react-native-rate';
import AlertRecord from './AlertRecord';
import { connect } from 'react-redux';

import Purchases, { PURCHASE_TYPE } from 'react-native-purchases';
const { width, height } = Dimensions.get('window');
class ParamsButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: this.props.isVisible,
			language: this.props.language,
			scaleLogoFR: new Animated.Value(1),
			scaleLogoEN: new Animated.Value(1),
			showAlert: false,
			isAlreadyRate: false
		};

		this._interval = null;
		this._timer = null;
		this.triggerIntroSliders = this.triggerIntroSliders.bind(this);
		this._toggleSharing = this._toggleSharing.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this._toggleRating = this._toggleRating.bind(this);
		this._setStateRating = this._setStateRating.bind(this);
	}

	async componentDidMount() {
		// User have rated the app ?
		const isAlreadyRate = await AsyncStorage.getItem('isAlreadyRate');
		const stateIsAlreadyRate = isAlreadyRate == 'true' || isAlreadyRate == true ? true : false;
		this.setState({
			isAlreadyRate: stateIsAlreadyRate
		});
	}

	//action for reducer setLanguage
	_setLanguage(type, value) {
		const action = { type: type, value: value };
		this.props.dispatch(action);
	}

	_toggleOnPressIn(type, value) {
		if (value == 'FR') {
			Animated.spring(this.state.scaleLogoFR, {
				toValue: 0.4,
				friction: 15,
				tension: 18,
				useNativeDriver: false
			}).start();
		} else if (value == 'EN') {
			Animated.spring(this.state.scaleLogoEN, {
				toValue: 0.4,
				friction: 15,
				tension: 18,
				useNativeDriver: false
			}).start();
		}
	}

	_toggleOnPressOut(type, value) {
		if (value == 'FR') {
			Animated.spring(this.state.scaleLogoFR, {
				toValue: 1,
				friction: 4,
				tension: 18,
				useNativeDriver: false
			}).start();
		} else if (value == 'EN') {
			Animated.spring(this.state.scaleLogoEN, {
				toValue: 1,
				friction: 4,
				tension: 18,
				useNativeDriver: false
			}).start();
		}
		// this._setLanguage(type, value);
	}

	_toggleOnPress(type, value) {
		this._setLanguage(type, value);
	}

	triggerIntroSliders() {
		this.toggleModal();
		this.props.triggerIntroSliders();
	}

	// DELETE THIS IN PROD
	async _getPurchaserInfo() {
		try {
			const purchaserInfo = await Purchases.getPurchaserInfo();
			console.log('###############\nPurchaser INFO : ' + JSON.stringify(purchaserInfo, null, 3));
		} catch (e) {
			console.log('ERROR : ' + JSON.stringify(e));
		}
	}
	async _getOfferings() {
		try {
			const purchaserProducts = await Purchases.getOfferings();
			const packageImbibo = purchaserProducts.current.availablePackages[0];
			console.log('###############\n Package Imbibo INFO : \n####' + JSON.stringify(packageImbibo, null, 3));
			// checkIfPro(purchaserInfo, this._becomePremium);
		} catch (e) {
			console.log('ERROR : ' + JSON.stringify(e));
		}
	}
	async _restorPurchases() {
		console.log('###############\nRestor Purchases : ');
		try {
			const purchaserInfo = await Purchases.restoreTransactions();
			// ... check restored purchaserInfo to see if entitlement is now active
			console.log(JSON.stringify(purchaserInfo, null, 2));
		} catch (e) {
			console.log('ERROR : ' + JSON.stringify(e));
		}
	}

	async _resetUser() {
		console.log('RESET ');
		try {
			const purchaserInfo = await Purchases.reset();
			// ... check restored purchaserInfo to see if entitlement is now active
			this.purchaserInfo = this.purchaserInfo;
			console.log(JSON.stringify(purchaserInfo, null, 2));
		} catch (e) {
			console.log('ERROR : ' + JSON.stringify(e));
		}
	}

	async _toggleSharing() {
		const { language } = this.props;
		let message;
		if (language == 'FR') {
			if (Platform.OS == 'ios') {
				message = textShare.iOSMsgFR;
			} else {
				message = textShare.androidMsgFR;
			}
		} else if (language == 'EN') {
			if (Platform.select == 'ios') {
				message = textShare.iOSMsgEN;
			} else {
				message = textShare.androidMsgEN;
			}
		}
		Share.share({
			title: 'IMBIBO \n',
			message: message
		});
	}

	// Nécessaire car si l'utilisateur clique trop vite il va quitter et revenir sur le Modal
	_initTimer() {
		this._timer = true;
		setTimeout(() => this._destroyTimer(), 1000);
	}

	_destroyTimer() {
		this._timer = null;
	}

	//unless there is a record
	toggleModal() {
		if (this.props.permitPopUp()) {
			if (this._timer == null) {
				this.setState({ isModalVisible: !this.state.isModalVisible }, () => this._initTimer());
			}
		} else {
			this.props.showAlertFunc();
		}
	}

	// Call just after rate succes
	_setStateRating() {
		this.setState(
			{
				isAlreadyRate: true
			},
			() => this.toggleModal()
		);
	}

	// When user tap on Rate
	_toggleRating() {
		setTimeout(() => {
			let options = {
				GooglePackageName: 'com.DevAle.BieRatio',
				preferInApp: true,
				openAppStoreIfInAppFails: true
			};
			Rate.rate(options, async (success) => {
				if (success) {
					await AsyncStorage.setItem('isAlreadyRate', 'true').then(() => this._setStateRating());
				}
			});
		}, 500);
	}

	// Determine wheter displaying rate section or not
	_displayRate() {
		const { isAlreadyRate } = this.state;
		const { language } = this.props;
		let rate;
		if (language == 'FR') {
			rate = text.rateFR;
		} else if (language == 'EN') {
			rate = text.rateEN;
		}
		// if (true) {
		if (!isAlreadyRate) {
			return (
				<View>
					<View style={[ styles.subCat ]}>
						<View style={{ flex: 1 }}>
							<Text style={styles.popUpSubTitle}>{rate}</Text>
						</View>
						<View style={[ styles.shadow, { alignItems: 'center' } ]}>
							<AnimatedOnPress toggleOnPress={this._toggleRating}>
								<View style={[ styles.posIcon, { marginBottom: 5 } ]}>
									<Icon name="star" type="font-awesome" color="#B83B5E" size={30} />
								</View>
							</AnimatedOnPress>
						</View>
					</View>
					<View style={styles.div} />
				</View>
			);
		} else {
			return null;
		}
	}

	render() {
		//set good languge
		const { language, permitPopUp } = this.props;

		let title;
		let share;
		let flag;
		let tuto;
		// Border color des flags
		const borderColorFR = language == 'FR' ? red : white;
		const borderColorEN = language == 'EN' ? red : white;
		if (language == 'FR') {
			title = text.titleFR;
			share = text.shareFR;
			flag = text.flagFR;
			tuto = text.tutoFR;
		} else if (language == 'EN') {
			title = text.titleEN;
			share = text.shareEN;
			flag = text.flagEN;
			tuto = text.tutoEN;
		}

		const animatedScaleFR = {
			transform: [ { scale: this.state.scaleLogoFR } ]
		};

		const animatedScaleEN = {
			transform: [ { scale: this.state.scaleLogoEN } ]
		};

		return (
			<View style={{}}>
				<AnimatedOnPress toggleOnPress={this.toggleModal}>
					<View style={styles.iconContainer}>
						<Icon name="settings" color="#B83B5E" size={35} />
					</View>
				</AnimatedOnPress>

				<Modal
					// isVisible={true}
					isVisible={this.state.isModalVisible}
					backdropColor="#B4B3DB"
					backdropOpacity={0.8}
					animationIn="slideInUp"
					animationOut="slideOutDown"
					animationInTiming={600}
					animationOutTiming={600}
					backdropTransitionInTiming={600}
					backdropTransitionOutTiming={600}
					onBackdropPress={() => this.toggleModal()}
				>
					<View style={[ styles.paramsPopUp ]}>
						<View style={styles.header}>
							<View
								style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15 }}
							>
								<View />
								<AnimatedOnPress toggleOnPress={() => this.toggleModal()} style={styles.cross}>
									<Icon
										size={35}
										type="entypo"
										name="cross"
										color="white"
										iconStyle={styles.exitPopUp}
									/>
								</AnimatedOnPress>
							</View>
							<View style={{ marginTop: -10 }}>
								<Text style={styles.popUpTitle}>{title}</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'row', width: width }}>
							<Button
								title="PurchaserInfo"
								onPress={async () => this._getPurchaserInfo()}
								buttonStyle={{ width: width / 4 - 15 }}
							/>
							<Button
								title="Reset"
								onPress={async () => this._resetUser()}
								buttonStyle={{ width: width / 4 - 15 }}
							/>
							<Button
								title="Restore Product"
								onPress={async () => this._restorPurchases()}
								buttonStyle={{ width: width / 4 - 15 }}
							/>
							<Button
								title="Get Offerings"
								onPress={async () => this._getOfferings()}
								buttonStyle={{ width: width / 4 - 15 }}
							/>
						</View>
						<ScrollView style={styles.containerCategories}>
							<View style={[ styles.subCat ]}>
								<View style={{ flex: 1 }}>
									<Text style={styles.popUpSubTitle}>{share}</Text>
								</View>
								<View style={styles.shadow}>
									<AnimatedOnPress toggleOnPress={this._toggleSharing}>
										<View style={styles.posIcon}>
											<Icon name="share-alt" type="font-awesome" color="#B83B5E" size={30} />
										</View>
									</AnimatedOnPress>
								</View>
							</View>
							<View style={styles.div} />
							<View style={styles.subCat}>
								<View style={{}}>
									<Text style={[ styles.popUpSubTitle, { textAlign: 'left' } ]}>{flag}</Text>
								</View>
								<View style={styles.containerFlags}>
									<TouchableWithoutFeedback
										onPress={() => this._toggleOnPress('SET_FR', 'FR')}
										onPressIn={() => this._toggleOnPressIn('SET_FR', 'FR')}
										onPressOut={() => this._toggleOnPressOut('SET_FR', 'FR')}
									>
										<Animated.View style={animatedScaleFR}>
											<View style={[ styles.borderFlag, { backgroundColor: borderColorFR } ]}>
												<Image
													source={require('../assets/flags/france.png')}
													style={[ styles.flag ]}
												/>
											</View>
										</Animated.View>
									</TouchableWithoutFeedback>
									<TouchableWithoutFeedback
										onPress={() => this._toggleOnPress('SET_EN', 'EN')}
										onPressIn={() => this._toggleOnPressIn('SET_EN', 'EN')}
										onPressOut={() => this._toggleOnPressOut('SET_EN', 'EN')}
									>
										<Animated.View style={animatedScaleEN}>
											<View
												style={[
													styles.borderFlag,
													{ backgroundColor: borderColorEN, marginRight: -6, marginLeft: 30 }
												]}
											>
												<Image
													source={require('../assets/flags/united-kingdom.png')}
													style={[ styles.flag ]}
												/>
											</View>
										</Animated.View>
									</TouchableWithoutFeedback>
								</View>
							</View>
							<View style={styles.div} />
							{this._displayRate()}
							<View style={[ styles.subCat, { paddingBottom: 20 } ]}>
								<View style={{ flex: 1 }}>
									<Text style={styles.popUpSubTitle}>{tuto}</Text>
								</View>
								<View style={styles.shadow}>
									<AnimatedOnPress toggleOnPress={this.triggerIntroSliders}>
										<View style={styles.posIcon}>
											<Icon name="question" type="font-awesome" color="#B83B5E" size={30} />
										</View>
									</AnimatedOnPress>
								</View>
							</View>
						</ScrollView>
					</View>
				</Modal>
				<AlertRecord showAlert={this.state.showAlert} hideAlert={this._hideAlert} language={language} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: white,
		borderRadius: 30,
		width: 40,
		height: 40
	},
	header: {
		backgroundColor: blue,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingBottom: 10
	},
	paramsPopUp: {
		backgroundColor: green,
		borderRadius: 30,
		borderWidth: 5,
		borderColor: blue,
		alignContent: 'center',
		maxHeight: height / 2,
		flexDirection: 'column'
		// width: width - 50,
	},
	containerCategories: {
		paddingTop: 10
		// backgroundColor: 'yellow'
	},
	subCat: {
		marginHorizontal: 20,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 5
		// backgroundColor: red
		// height: 40
	},
	posIcon: {
		justifyContent: 'flex-end',
		width: 44,
		height: 44,
		backgroundColor: white,
		borderRadius: 30,
		justifyContent: 'center',
		alignContent: 'center'
	},
	borderFlag: {
		height: 56,
		width: 56,
		borderRadius: 45,
		justifyContent: 'center',
		alignItems: 'center'
	},
	flag: {
		width: 44,
		height: 44,
		resizeMode: 'contain'
	},
	containerFlags: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	popUpTitle: {
		fontSize: stl.fontSizeMenu,
		color: white,
		textAlign: 'center',
		marginTop: -15,
		fontFamily: 'montserrat-extra-bold'
	},
	popUpSubTitle: {
		fontSize: stl.fontSizeRecordText,
		color: white,
		fontFamily: 'montserrat-bold'
	},
	div: {
		width: width - 40,
		height: 3,
		backgroundColor: blue,
		alignSelf: 'center',
		borderRadius: 30,
		marginVertical: 5
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 6,
			height: 5
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.0,
		elevation: 5
	},
	cross: {
		backgroundColor: red,
		width: 35,
		height: 35,
		borderRadius: 30,
		marginTop: 0,
		marginRight: -10,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

const mapStateToProps = (state) => {
	// get only what we need
	return {
		language: state.setLanguage.language,
		premium: state.togglePremium.premium
	};
};

export default connect(mapStateToProps)(ParamsButton);
