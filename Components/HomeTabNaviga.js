import React, { Component } from 'react';
import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Image, Switch } from 'react-native';
import ParamsButton from './ParamsButton';
import PremiumPopUp from './PremiumPopUp';
import AnimatedOnPress from '../Animations/AnimatedOnPress';
import { connect } from 'react-redux';
import * as text from '../assets/textInGame/listTextHome';
import * as stl from '../assets/styles/styles';
import { green, red, blue, white } from '../assets/colors';

const { height, width } = Dimensions.get('window');
class HomeTabNaviga extends Component {
	constructor(props) {
		super(props);
		this.rowRefs = [];
		this.state = {
			permitPopUp: true
		};
		this._permitPopUp = this._permitPopUp.bind(this);
	}

	triggerPopUp() {
		const { language } = this.props;
		const stateRecords = this.props.returnStateRecord();
		// console.log('stateRecords !!!' + stateRecords);
		if (stateRecords[0] || stateRecords[1]) {
			let textAlert;
			if (language == 'FR') {
				textAlert = text.alertRecordFR;
			} else if (language == 'EN') {
				textAlert = text.alertRecordEN;
			}
			alert(textAlert);
		} else {
			this.rowRefs[0]._triggerPopUp();
			// this.rowRefs[0].toggleModal();
		}
	}

	_displayPremiumIcon() {
		const { premium } = this.props;
		if (premium) {
			return null;
		} else {
			return (
				<PremiumPopUp
					ref={(ref) => (this.rowRefs[0] = ref)}
					isVisible={false}
					language={this.props.language}
					permitPopUp={this._permitPopUp}
					showAlertFunc={this.props.showAlertFunc}
					showAlertFuncPremium={this.props.showAlertFuncPremium}
					becomePremium={this.props.becomePremium}
				/>
			);
		}
	}

	//to disable popUp when recording
	_disablePopUp() {
		this.setState({
			permitPopUp: false
		});
	}

	//to enable popUp when finish recording
	_enablePopUp() {
		this.setState({
			permitPopUp: true
		});
	}

	//to know if we can launch popUp
	_permitPopUp() {
		return this.state.permitPopUp;
	}

	render() {
		// language from Redux
		const language = this.props.language;
		let displayNameNaviga;
		if (language == 'FR') {
			displayNameNaviga = text.nameNavigaFR;
		} else if (language == 'EN') {
			displayNameNaviga = text.nameNavigaEN;
		}
		//console.log('stateRecord' + this.props.returnStateRecord[0])

		return (
			<View style={{ flex: 1 }}>
				<View style={styles.bottomTabBar}>
					<View style={styles.buttonsContainer}>
						{this._displayPremiumIcon()}
						{/* <ParamsButton
							triggerIntroSliders={this.props.triggerIntroSliders}
							permitPopUp={this.state.permitPopUp}
						/> */}
						<ParamsButton
							isVisible={false}
							triggerIntroSliders={this.props.triggerIntroSliders}
							language={this.props.language}
							permitPopUp={this._permitPopUp}
							showAlertFunc={this.props.showAlertFunc}
						/>
						<AnimatedOnPress toggleOnPress={this.props.goToChoiceScreen}>
							<Image
								style={styles.buttonBottomTabBar}
								source={require('../assets/button-images/button-right.png')}
							/>
						</AnimatedOnPress>
					</View>
				</View>
				<View style={styles.topTabBar}>
					<View style={styles.headerContainer}>
						<Text style={styles.headerTitle}>{displayNameNaviga}</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	topTabBar: stl.topTabBar,
	headerContainer: stl.headerContainer,
	headerTitle: stl.headerTitle,
	bottomTabBar: stl.bottomTabBar,
	buttonsContainer: {
		marginBottom: 50,
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	buttonBottomTabBar: {
		height: 40,
		width: 40,
		resizeMode: 'contain'
	}
});

export default HomeTabNaviga;
