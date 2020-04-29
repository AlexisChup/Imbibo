import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import ParamsButton from './ParamsButton';
import PremiumPopUp from './PremiumPopUp';
import AnimatedOnPress from '../Animations/AnimatedOnPress';
import * as text from '../assets/textInGame/listTextHome';
import * as stl from '../assets/styles/styles';
import { green } from '../assets/colors';
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
		return (
			<View style={{ backgroundColor: green }}>
				<View style={stl.containerBottom}>
					{this._displayPremiumIcon()}

					<ParamsButton
						isVisible={false}
						triggerIntroSliders={this.props.triggerIntroSliders}
						language={this.props.language}
						permitPopUp={this._permitPopUp}
						showAlertFunc={this.props.showAlertFunc}
					/>
					<AnimatedOnPress toggleOnPress={this.props.goToChoiceScreen}>
						<Image
							style={stl.buttonBottomTabBar}
							source={require('../assets/button-images/button-right.png')}
						/>
					</AnimatedOnPress>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({});

export default HomeTabNaviga;
