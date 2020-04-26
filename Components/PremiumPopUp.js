import React from 'react';
import {
	Text,
	TouchableHighlight,
	View,
	Alert,
	StyleSheet,
	Button,
	Image,
	Dimensions,
	Animated,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import AnimatedOnPress from '../Animations/AnimatedOnPress';
import Modal from 'react-native-modal';
import * as text from '../assets/textInGame/listTextPopUpPremium';
import * as textHome from '../assets/textInGame/listTextHome';
import AwesomeAlert from 'react-native-awesome-alerts';
import Purchases, { PURCHASE_TYPE } from 'react-native-purchases';

import { blue, green, red, white } from '../assets/colors';
const { width, height } = Dimensions.get('window');
const popUpBoutonWidth = width / 1.4;
const popUpBoutonHeight = height / 6;

// IAP imbibeur
const itemIAP = Platform.select({
	ios: [ 'com.example.coins100' ],
	android: [ 'imbibeur' ]
});

class PremiumPopUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalVisible: this.props.isVisible,
			buttonAnimation: new Animated.Value(1),
			showAlert: false
		};
		this.productToBuy = null;
		this.toggleModal = this.toggleModal.bind(this);
		this._becomePremium = this._becomePremium.bind(this);
		this._interval = null;
		this.purchaserInfo = undefined;
		this.packageImbibo = undefined;
	}

	async componentDidMount() {}

	componentWillUnmount() {
		if (this.purchaserInfoUpdateListener !== undefined)
			Purchases.removePurchaserInfoUpdateListener(this.purchaserInfoUpdateListener);
	}

	_triggerPopUp() {
		this.setState(
			{
				isModalVisible: true
			},
			() => this._toggleIntervalAnimation()
		);
	}

	// Nécessaire car si l'utilisateur clique trop vite il va quitter et revenir sur le Modal
	_initTimer() {
		this._timer = true;
		this._toggleIntervalAnimation();
		setTimeout(() => this._destroyTimer(), 500);
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

	_toggleIntervalAnimation() {
		if (this.state.isModalVisible) {
			//console.log("On fait l'iterval");

			this._interval = setInterval(() => {
				//console.log("Interval")
				this._animateBuyBouton();
			}, 3000);
		} else {
			//console.log("On quitte l'interval")
			clearInterval(this._interval);
			this._interval = null;
		}
	}

	_animateBuyBouton() {
		Animated.sequence([
			Animated.spring(this.state.buttonAnimation, {
				toValue: 1.2,
				friction: 5,
				tension: 18,
				useNativeDriver: false
			}),
			Animated.spring(this.state.buttonAnimation, {
				toValue: 1,
				friction: 5,
				tension: 100,
				useNativeDriver: false
			})
		]).start();
	}

	// Check if payment is possible when user toggle modal
	// if not -> close modal + alert
	async _isPaymentPossible() {
		// Get the offer from revenuecat
		try {
			// function for purchase Listener
			this.purchaserInfoUpdateListener = (info) => {
				checkIfPro(info, this._becomePremium);
			};

			// add this function to Purchases's Listener
			Purchases.addPurchaserInfoUpdateListener(this.purchaserInfoUpdateListener);

			// checkIfPro
			const purchaserInfo = await Purchases.getPurchaserInfo();
			this.purchaserInfo = purchaserInfo;
			checkIfPro(purchaserInfo, this._becomePremium);

			const productToBuyArray = await Purchases.getProducts(itemIAP, PURCHASE_TYPE.INAPP);
			const productToBuy = productToBuyArray[0];

			const purchaserProducts = await Purchases.getOfferings();
			const packageImbibo = purchaserProducts.current.availablePackages[0];
			this.packageImbibo = packageImbibo;

			if (productToBuy !== null && productToBuy.length !== 0) {
				// console.log('On affiche :' + JSON.stringify(productToBuy, null, 4));
				this.productToBuy = productToBuy;
			} else {
				this.setState(
					{
						isModalVisible: false
					},
					() => Alert.alert('ERROR : Pas de produit à acheter')
				);
			}
		} catch (e) {
			console.log('ERREUR DISPLAYING : ' + JSON.stringify(e));
			// Close modal + alert :
			this.setState(
				{
					isModalVisible: false
				},
				() => Alert.alert('ERROR : Service non disponible')
			);
		}
	}

	async _purchasePremium() {
		const itemToPurchase = itemIAP[0];
		try {
			const { purchaserInfo, productIdentifier } = await Purchases.purchaseProduct(
				itemToPurchase,
				null,
				Purchases.PURCHASE_TYPE.INAPP
			);
			// const { purchaserInfo, productIdentifier } = await Purchases.purchasePackage(this.packageImbibo);
			this.purchaserInfo = purchaserInfo;

			// checkIfPro(purchaserInfo, this._becomePremium);
		} catch (e) {
			if (e.userInfo.readableErrorCode == 'ProductAlreadyPurchasedError') {
				console.log('Déjà le produit ! ' + JSON.stringify(e, null, 2));
				this.purchaserInfo.entitlements.active.premium = true;
				checkIfPro(this.purchaserInfo, this._becomePremium);
				// this._becomePremium();
			} else if (e.userInfo.readableErrorCode == 'PaymentPendingError') {
				console.log('Payment pending :/');
				this.toggleModal();
				this.props.showAlertFuncPremium('pending');
			} else if (e.userInfo.readableErrorCode == 'StoreProblemError') {
				console.log('Problème avec le store');
				this.toggleModal();
				this.props.showAlertFuncPremium('store');
			} else if (!e.userCancelled) {
				console.log('ERROR : ', JSON.stringify(e, null, 2));
				this.toggleModal();
				this.props.showAlertFuncPremium('undefined');
			}
		}
	}

	async _getPurchaserInfo() {
		const purchaserInfo = await Purchases.getPurchaserInfo();
		this.purchaserInfo = purchaserInfo;
		console.log('###############\nPurchaser INFO : ' + JSON.stringify(purchaserInfo, null, 3));
		checkIfPro(purchaserInfo, this._becomePremium);
	}
	async _getOfferings() {
		const purchaserProducts = await Purchases.getOfferings();
		const packageImbibo = purchaserProducts.current.availablePackages[0];
		// this.purchaserInfo = purchaserInfo;
		// console.log(
		// 	'###############\n Package Offerings : \n###############' + JSON.stringify(purchaserProducts, null, 3)
		// );
		console.log('###############\n Package Imbibo INFO : \n####' + JSON.stringify(packageImbibo, null, 3));
		// checkIfPro(purchaserInfo, this._becomePremium);
	}
	async _restorPurchases() {
		console.log('###############\nRestor Purchases : ');
		// try {
		// 	const rep = await Purchases.restoreTransactions();
		// 	console.log(JSON.stringify(rep));
		// } catch (error) {
		// 	console.log('ERROR : ' + JSON.stringify(error));
		// }
		try {
			const purchaserInfo = await Purchases.restoreTransactions();
			// ... check restored purchaserInfo to see if entitlement is now active
			console.log(JSON.stringify(purchaserInfo, null, 2));
		} catch (e) {
			console.log('ERROR : ' + JSON.stringify(error));
		}
	}

	async _resetUser() {
		console.log('RESET ');
		try {
			const purchaserInfo = await Purchases.reset();
			// ... check restored purchaserInfo to see if entitlement is now active
			this.purchaserInfo = this.purchaserInfo;
			this._isPaymentPossible();
			console.log(JSON.stringify(purchaserInfo, null, 2));
		} catch (e) {
			console.log('ERROR : ' + JSON.stringify(error));
		}
	}

	_becomePremium() {
		if (this.purchaserInfoUpdateListener !== undefined)
			Purchases.removePurchaserInfoUpdateListener(this.purchaserInfoUpdateListener);

		// close modal
		// this.toggleModal();
		//action for reducers
		this.props.becomePremium();
	}

	_awesomeAlert() {}

	render() {
		const animatedStyleButton = {
			transform: [ { scale: this.state.buttonAnimation } ]
		};
		//set good languge
		const language = this.props.language;
		let title;
		let features;
		let enableMods;
		let adjustable;
		let addActions;
		let joke;
		let become;
		if (language == 'FR') {
			title = text.titleFR;
			features = text.featuresFR;
			enableMods = text.enableModsFR;
			adjustable = text.adjustableFR;
			addActions = text.addActionsFR;
			joke = text.jokeFR;
			become = text.becomeFR;
		} else if (language == 'EN') {
			title = text.titleEN;
			features = text.featuresEN;
			enableMods = text.enableModsEN;
			adjustable = text.adjustableEN;
			addActions = text.addActionsEN;
			joke = text.jokeEN;
			become = text.becomeEN;
		}

		// Toggle modal ->
		// Check if payment is possible
		if (this.state.isModalVisible) {
			this._isPaymentPossible();
		} else {
			// hide modal ->
			// remove listener
			if (this.purchaserInfoUpdateListener !== undefined)
				Purchases.removePurchaserInfoUpdateListener(this.purchaserInfoUpdateListener);
		}

		return (
			<View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
				<AnimatedOnPress toggleOnPress={this.toggleModal}>
					<Image style={styles.iconPremium} source={require('../assets/button-images/button-premium.png')} />
				</AnimatedOnPress>
				{this._awesomeAlert()}

				<Modal
					// isVisible={true}
					isVisible={this.state.isModalVisible}
					backdropColor="#B4B3DB"
					backdropOpacity={0.8}
					animationIn="zoomInDown"
					animationOut="zoomOutUp"
					animationInTiming={600}
					animationOutTiming={600}
					backdropTransitionInTiming={600}
					backdropTransitionOutTiming={600}
					//onBackdropPress = {() => this.setState({isModalVisible: false})}
					onBackdropPress={() => this.toggleModal()}
					// onPress = {() => this.toggleModal()}
				>
					<View style={styles.premiumPopUp}>
						<View style={styles.header}>
							<View
								style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15 }}
							>
								<View />
								<Button title="Test Premium" onPress={() => this._becomePremium()} />
								{/* <Button title="PurchaserInfo" onPress={async () => this._getPurchaserInfo()} />
								<Button title="Reset" onPress={async () => this._resetUser()} />
								<Button title="Restore Product" onPress={async () => this._restorPurchases()} /> */}
								<TouchableHighlight
									style={{
										backgroundColor: red,
										width: 35,
										height: 35,
										borderRadius: 30,
										marginTop: 0,
										marginRight: -10,
										justifyContent: 'center',
										alignItems: 'center'
									}}
									onPress={() => this.toggleModal()}
									underlayColor={white}
								>
									<Icon
										size={35}
										type="entypo"
										name="cross"
										color="white"
										iconStyle={styles.exitPopUp}
									/>
								</TouchableHighlight>
							</View>
							<View style={{ marginTop: -10 }}>
								<Text style={styles.popUpTitle}>{title}</Text>
							</View>
						</View>
						{/* <Button title="Get Offerings" onPress={async () => this._getOfferings()} /> */}

						<View style={styles.popUpLogo}>
							<Image
								style={styles.popUpLogoImage}
								source={require('../assets/button-images/button-popUP-shadow.png')}
							/>
						</View>
						<View style={{ flex: 1, justifyContent: 'space-around' }}>
							<View>
								<Text style={styles.popUpSubTitle}>{features}</Text>
								<View>
									<View style={styles.popUpDescriptionContainer}>
										<Text style={styles.popUpDescriptionBulletPoint}>{'\u2B24'}</Text>
										<Text style={styles.popUpDescription}>{enableMods}</Text>
									</View>
									<View style={styles.popUpDescriptionContainer}>
										<Text style={styles.popUpDescriptionBulletPoint}>{'\u2B24'}</Text>
										<Text style={styles.popUpDescription}>{adjustable}</Text>
									</View>
									<View style={styles.popUpDescriptionContainer}>
										<Text style={styles.popUpDescriptionBulletPoint}>{'\u2B24'}</Text>
										<Text style={styles.popUpDescription}>{addActions}</Text>
									</View>
								</View>
							</View>
							<Text style={styles.popUpSubTitle}>{joke}</Text>
						</View>
						<TouchableWithoutFeedback onPress={async () => this._purchasePremium()}>
							<Animated.View style={[ styles.buttonPremiumContainer, animatedStyleButton ]}>
								<Text style={[ styles.popUpSubTitle, { marginHorizontal: 8, textAlign: 'center' } ]}>
									{become}
									{'\n'}4.99€
								</Text>
							</Animated.View>
						</TouchableWithoutFeedback>
					</View>
				</Modal>
			</View>
		);
	}
}

// Purchase Listenner
function checkIfPro(purchaserInfo, callbackFunction) {
	// Check when function is called
	console.log('checkIfPro is called ! ');
	if (typeof purchaserInfo.entitlements.active.premium !== 'undefined') {
		// Unlock premium content :
		console.log('####################""\n JE VAIS ETRE imbibeur !\n################');

		// Toggle modal & show alert & remover listener
		callbackFunction();
	} else {
		console.log('Not premium');
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 0.8,
		backgroundColor: '#2EB872',
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		backgroundColor: blue,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingBottom: 10
	},
	premiumPopUp: {
		flex: 0.95,
		backgroundColor: green,
		borderRadius: 30,
		borderWidth: 5,
		borderColor: blue,
		//justifyContent: 'center'
		alignContent: 'center'
	},
	iconPremium: {
		width: 40,
		height: 40,
		resizeMode: 'contain'
	},
	exitPopUp: {},
	popUpTitle: {
		fontSize: height / 28,
		color: 'white',
		textAlign: 'center',
		fontFamily: 'montserrat-extra-bold'
	},
	popUpLogoImage: {
		width: width / 3,
		height: width / 3,
		resizeMode: 'contain',
		alignSelf: 'center',
		marginLeft: 20,
		marginTop: 15
	},
	popUpSubTitle: {
		fontSize: height / 35,
		color: 'white',
		marginLeft: 15,
		fontFamily: 'montserrat-bold'
	},
	popUpDescription: {
		fontSize: height / 50,
		fontFamily: 'montserrat-regular',
		color: 'white',
		marginLeft: 15,
		marginVertical: 15
	},
	popUpDescriptionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 15,
		marginVertical: -10
	},
	popUpDescriptionBulletPoint: {
		fontSize: 10,
		color: 'white',
		marginRight: -10
	},
	buttonPremiumContainer: {
		backgroundColor: blue,
		borderColor: '#B83B5E',
		borderWidth: 10,
		borderRadius: 50,
		alignSelf: 'center',
		width: popUpBoutonWidth,
		height: popUpBoutonHeight,
		justifyContent: 'center',
		marginVertical: 15
	}
});

export default PremiumPopUp;