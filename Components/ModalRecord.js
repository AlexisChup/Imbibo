import React, { Component } from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import Spinner from 'react-native-spinkit';
import { Button } from 'react-native-elements';
import * as stl from '../assets/styles/styles';
import Modal from 'react-native-modal';
import { green, red, blue, white } from '../assets/colors';
import * as text from '../assets/textInGame/listTextHome';
const { width } = Dimensions.get('window');

export default class ModalRecord extends Component {
	constructor(props) {
		super(props);
		this._intervall = null;
		this.state = {
			recordingDurationTest: 0,
			addRecordTitle: '',
			isModalVisible: false
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState == this.state) {
			return false;
		} else {
			return true;
		}
	}

	// 	// WHEN RECORDING
	_toggleModalRecord = (origin) => {
		const { isModalVisible } = this.state;
		const { language } = this.props;
		// If the user hasn't allow persmission to records -> PopUp Warning

		//_stopPlaybackAndBeginRecording
		if (!isModalVisible) {
			let addRecordTitle;
			if (origin == 'name') {
				if (language == 'FR') {
					addRecordTitle = text.addRecordNameFR;
				} else if (language == 'EN') {
					addRecordTitle = text.addRecordNameEN;
				}
			} else if (origin == 'action') {
				if (language == 'FR') {
					addRecordTitle = text.addRecordActionFR;
				} else if (language == 'EN') {
					addRecordTitle = text.addRecordActionEN;
				}
			}

			this.setState({
				addRecordTitle,
				isModalVisible: true
			});

			this._intervall = setInterval(() => {
				this.setState({
					recordingDurationTest: this.state.recordingDurationTest + 1
				});
			}, 1000);
		} else {
			// _stopRecordingAndEnablePlayback

			clearInterval(this._intervall);
			this._intervall = null;
			this.setState({
				isModalVisible: false,
				recordingDurationTest: 0
			});
		}
	};

	render() {
		const { recordingDurationTest, addRecordTitle, isModalVisible } = this.state;
		const { language, toggleModalRecord } = this.props;
		// For duration records in modal
		let lengthRecord, endRecord;
		if (language == 'FR') {
			endRecord = text.endRecordFR;
			lengthRecord = text.lengthRecordFR;
		} else if (language == 'EN') {
			endRecord = text.endRecordEN;
			lengthRecord = text.lengthRecordEN;
		}
		return (
			<Modal
				// isVisible={true}
				isVisible={isModalVisible}
				backdropColor="#B4B3DB"
				backdropOpacity={0.8}
				animationIn="slideInUp"
				animationOut="slideOutDown"
				animationInTiming={300}
				animationOutTiming={300}
				backdropTransitionInTiming={300}
				backdropTransitionOutTiming={300}
				onBackdropPress={() => toggleModalRecord()}
			>
				<View
					style={[
						styles.modalRecord,
						{
							marginBottom: 20,
							alignItems: 'center',
							paddingVertical: 10,
							width: width / 2,
							alignSelf: 'center'
						}
					]}
				>
					<Text style={[ styles.modalText, { fontFamily: 'montserrat-regular' } ]}>{lengthRecord} :</Text>
					<Text style={styles.modalText}>{recordingDurationTest} s</Text>
				</View>
				<View style={[ styles.modalRecord, { paddingTop: 30 } ]}>
					<Text style={styles.modalText}>{addRecordTitle}</Text>
					<Spinner
						style={{ marginVertical: 15, alignSelf: 'center' }}
						isVisible={isModalVisible}
						size={100}
						type="Bounce"
						color={red}
					/>
					<Button
						title="TES"
						title={endRecord}
						type="solid"
						buttonStyle={{
							backgroundColor: red,
							borderBottomRightRadius: 25,
							borderBottomLeftRadius: 25
						}}
						titleStyle={{
							color: white,
							fontFamily: 'montserrat-bold',
							fontSize: stl.descItem
						}}
						onPress={() => {
							toggleModalRecord();
						}}
					/>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	modalRecord: {
		backgroundColor: blue,
		borderRadius: 30,
		borderWidth: 5,
		borderColor: white,
		alignContent: 'center',
		justifyContent: 'center'
	},
	modalText: {
		fontFamily: 'montserrat-extra-bold',
		color: white,
		fontSize: stl.titleItem,
		textAlign: 'center'
	}
});
