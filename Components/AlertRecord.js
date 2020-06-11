import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { red, blue, green, white } from '../assets/colors';
import * as text from '../assets/textInGame/listTextHome';
import AwesomeAlert from 'react-native-awesome-alerts';

const { height, width } = Dimensions.get('window');

export default class AlertRecord extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showAlert: this.props.showAlert
		};
	}

	hideAlert = () => {
		this.props.hideAlert();
	};

	handleOnConfirmPressed = (orgin) => {
		const { showPermissionAlert } = this.props;
		if (showPermissionAlert === undefined) {
			this.hideAlert();
		} else {
			this.hideAlert();
			if (orgin !== 'permissionAskAgain') {
				this.props.showPermissionAlert();
			}
		}
	};

	handleOnCancelPressed = () => {
		const { showPermissionAlert } = this.props;
		if (!showPermissionAlert) {
			this.hideAlert();
		} else {
			this.hideAlert();
		}
	};

	render() {
		const { showAlert, language, listText, showAlertPremiumOrigin, showPermissionAlert } = this.props;
		let confirmText;
		let cancelText;
		let showCancelButton = false;
		confirmText = 'Ok';
		cancelText = null;
		let textAlert;
		let textAlertTitle;

		// Take text.etc if listText == true
		if (listText) {
			if (language == 'FR') {
				textAlertTitle = text.alertTitleFR;
				textAlert = text.alertRecordFR;
			} else if (language == 'EN') {
				textAlertTitle = text.alertTitleEN;
				textAlert = text.alertRecordEN;
			}
		} else {
			if (showAlertPremiumOrigin == 'premium') {
				if (language == 'FR') {
					textAlertTitle = 'SUCCÈS !';
					textAlert = 'Vous êtes maintenant un imbibeur.';
				} else if (language == 'EN') {
					textAlertTitle = 'SUCCESS !';
					textAlert = "You're now an imbibeur.";
				}
			} else if (showAlertPremiumOrigin == 'store') {
				if (language == 'FR') {
					textAlertTitle = 'PROBLÈME !';
					textAlert = 'Il y a une erreur avec la connexion au Store.';
				} else if (language == 'EN') {
					textAlertTitle = 'PROBLEM !';
					textAlert = 'There was a problem with the Store.';
				}
			} else if (showAlertPremiumOrigin == 'pending') {
				if (language == 'FR') {
					textAlertTitle = 'INFORMATION';
					textAlert = 'La transaction est en cours.';
				} else if (language == 'EN') {
					textAlertTitle = 'INFORMATION';
					textAlert = 'The transaction is pending.';
				}
			} else if (showAlertPremiumOrigin == 'network') {
				if (language == 'FR') {
					textAlertTitle = 'PROBLÈME !';
					textAlert = 'Vous avez un problème de connexion internet.';
				} else if (language == 'EN') {
					textAlertTitle = 'PROBLEM !';
					textAlert = 'You have internet connection issue.';
				}
			} else if (showAlertPremiumOrigin == 'permission') {
				if (language == 'FR') {
					textAlertTitle = 'PERMISSION';
					textAlert = "Vous devez autoriser l'accès au micro.";
					confirmText = 'Autoriser';
					cancelText = 'Plus tard';
				} else if (language == 'EN') {
					textAlertTitle = 'PERMISSION';
					textAlert = 'You need to allow microphone acces.';
					confirmText = 'Allow';
					cancelText = 'Later';
				}
				showCancelButton = true;
			} else if (showAlertPremiumOrigin == 'permissionAskAgain') {
				if (language == 'FR') {
					textAlertTitle = 'PROBLÈME !';
					textAlert =
						"Veuillez allez dans vos paramètres pour autoriser l'accès au microphone pour l'application Imbibo.";
				} else if (language == 'EN') {
					textAlertTitle = 'PROBLEM !';
					textAlert = "Please go to your setting and allow access to the microphone for Imbibo's app";
				}
			} else if (showAlertPremiumOrigin == 'warningStart') {
				if (language == 'FR') {
					textAlertTitle = 'ATTENTION';
					textAlert =
						"L'abus d'alcool est dangereux pour la santé. Buvez avec modération. En poursuivant vous reconnaissez être responsable de vos actes.";
				} else if (language == 'EN') {
					textAlertTitle = 'WARNING';
					textAlert =
						'Please drink with moderation. By continuing, you agree that you are responsible for any consequences of your acts.';
				}
			} else if (showAlertPremiumOrigin == 'undefined') {
				if (language == 'FR') {
					textAlertTitle = 'PROBLÈME !';
					textAlert = 'Une erreur est survenue !.';
				} else if (language == 'EN') {
					textAlertTitle = 'PROBLEM !';
					textAlert = 'There was a problem !.';
				}
			}
		}
		return (
			<View style={styles.container}>
				<AwesomeAlert
					alertContainerStyle={{ width: width, heihgt: height, top: 0, right: -width / 2 }}
					show={showAlert}
					showProgress={false}
					title={textAlertTitle}
					titleStyle={{ color: white, fontFamily: 'montserrat-extra-bold', fontSize: height / 35 }}
					message={textAlert}
					messageStyle={{
						color: white,
						fontFamily: 'montserrat-bold',
						fontSize: height / 50,
						textAlign: 'center'
					}}
					contentContainerStyle={{
						backgroundColor: blue,
						borderRadius: 30,
						height: height / 3,
						width: width - 30,
						justifyContent: 'center',
						borderWidth: 5,
						borderColor: white
					}}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={true}
					showConfirmButton={true}
					showCancelButton={showCancelButton}
					confirmText={confirmText}
					cancelText={cancelText}
					cancelButtonColor={red}
					confirmButtonColor={green}
					cancelButtonTextStyle={{ fontFamily: 'montserrat-extra-bold' }}
					confirmButtonTextStyle={{ fontFamily: 'montserrat-extra-bold' }}
					onCancelPressed={() => {
						this.handleOnCancelPressed();
					}}
					onConfirmPressed={() => {
						this.handleOnConfirmPressed(showAlertPremiumOrigin);
					}}
					onDismiss={() => {
						this.hideAlert();
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: 0,
		height: 0
	}
});
