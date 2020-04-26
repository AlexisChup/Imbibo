import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Button, Dimensions } from 'react-native';
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

	render() {
		const { showAlert, language, listText, showAlertPremiumOrigin } = this.props;
		let textAlert;
		let textAlertTitle;

		// Take text.etc if listText == true
		if (listText) {
			if (language == 'FR') {
				textAlertTitle = text.alertTitleFR;
				textAlert = text.alertRecordFR;
			} else if (language == 'EN') {
				textAlert = text.alertRecordEN;
				textAlertTitle = text.alertTitleEN;
			}
		} else {
			if (showAlertPremiumOrigin == 'premium') {
				if (language == 'FR') {
					textAlertTitle = 'SUCCÈS !';
					textAlert = 'Vous êtes maintenant un imbibeur.';
				} else if (language == 'EN') {
					textAlert = 'SUCCESS !';
					textAlertTitle = "You're now an imbibeur.";
				}
			} else if (showAlertPremiumOrigin == 'store') {
				if (language == 'FR') {
					textAlertTitle = 'PROBLÈME !';
					textAlert = 'Il y a une erreur avec la connexion au Store.';
				} else if (language == 'EN') {
					textAlert = 'PROBLEM !';
					textAlertTitle = 'There was a problem with the Store.';
				}
			} else if (showAlertPremiumOrigin == 'pending') {
				if (language == 'FR') {
					textAlertTitle = 'INFORMATION';
					textAlert = 'La transaction est en cours.';
				} else if (language == 'EN') {
					textAlert = 'INFORMATION';
					textAlertTitle = 'The transaction is pending.';
				}
			} else if (showAlertPremiumOrigin == 'undefined') {
				if (language == 'FR') {
					textAlertTitle = 'PROBLÈME !';
					textAlert = 'Une erreur est survenue !.';
				} else if (language == 'EN') {
					textAlert = 'PROBLEM !';
					textAlertTitle = 'There was a problem !.';
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
					confirmText="Ok"
					cancelButtonColor={red}
					confirmButtonColor={green}
					confirmButtonTextStyle={{ fontFamily: 'montserrat-extra-bold' }}
					onCancelPressed={() => {
						this.hideAlert();
					}}
					onConfirmPressed={() => {
						this.hideAlert();
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
