import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	SafeAreaView,
	Alert,
	TouchableWithoutFeedback,
	Image,
	Animated
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';
import * as stl from '../assets/styles/styles';
import { Icon, Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import Spinner from 'react-native-spinkit';
import FlatListRecord from './FlatListRecord';
import FlatListRecordActions from './FlatListRecordActions';

import * as text from '../assets/textInGame/listTextHome';
import { green, red, blue, white } from '../assets/colors';
const { width } = Dimensions.get('window');
var startRecord, endRecord;
class RecordsAccueil extends Component {
	constructor(props) {
		super(props);
		this.recording = null;
		this.soundPlayBack = null;
		this.soundsArray = [];
		this.actionsArray = [];
		this.records = {
			names: [ null ],
			namesName: [ null ],
			actions: [ null ],
			actionsName: [ null ]
		};
		this.interval,
			this.intervalRemaining,
			(this.state = {
				haveRecordingPermissions: false,
				isLoading: false,
				isPlaybackAllowed: false,
				muted: false,
				soundPosition: null,
				soundDuration: null,
				recordingDuration: null,
				recordingDurationTest: 0,
				shouldPlay: false,
				isPlaying: false,
				isRecording: false,
				volume: 1.0,
				soundEnded: true,
				enTrainDeRecord: false,
				gameStarted: false,
				timeRemainig: 0,
				showModal: false,
				buttonAnimationPlayers: new Animated.Value(1),
				buttonAnimationActions: new Animated.Value(1),
				joueurName: 1,
				actionName: 1,
				namesArray: [],
				nbActions: 1,
				origin: 'name',
				canRecord: true,
				recordPrepared: false,
				itemPlayAudio: false,
				isModalVisible: false,
				addRecordTitle: ''
			});
		this.rowRefs = [];
		this._timer = null;
		this._intervall = null;
		this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
		this._playItemRecord = this._playItemRecord.bind(this);
		this._stopItemRecord = this._stopItemRecord.bind(this);
		this._deleteItemRecord = this._deleteItemRecord.bind(this);
		this._returnState = this._returnState.bind(this);
	}

	//to check if user can navigate between scree
	_returnState() {
		const stateRecords = [ this.state.isLoading, this.state.isRecording ];
		return stateRecords;
	}

	async componentDidMount() {
		this._askForPermissions();
		await Audio.setAudioModeAsync({
			staysActiveInBackground: true,
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
			playsInSilentModeIOS: true,
			playThroughEarpieceAndroid: false,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
			shouldDuckAndroid: true
		});
	}

	async componentWillUnmount() {}

	_askForPermissions = async () => {
		const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
		this.setState({
			haveRecordingPermissions: response.status === 'granted'
		});
	};
	z;

	/*
		@params: item : the Audio Object
		@params: index : the index in the Flatlist Of records
		@params: orgin : Where the function come from ? "name" : "action"

	*/
	async _playItemRecord(item, index, origin) {
		if (this.state.soundEnded) {
			//disabled Sound buttons
			this.props.disablePopUp();
			if (origin === 'name') {
				this.rowRefs[0].disabledButtons(index);
				this.rowRefs[1].disabledButtons(null);
			} else if (origin === 'action') {
				this.rowRefs[0].disabledButtons(null);
				this.rowRefs[1].disabledButtons(index);
			}
			if (this.soundPlayBack == item) {
				this.setState({ soundEnded: false, itemPlayAudio: true }, async () => {
					await this.soundPlayBack.replayAsync();
				});
			} else {
				this.soundPlayBack = null;
				this.soundPlayBack = item;

				this.soundPlayBack.setOnPlaybackStatusUpdate(this._updateScreenForSoundStatus);
				this.setState({ soundEnded: false, itemPlayAudio: true }, async () => {
					await this.soundPlayBack.replayAsync();
				});
			}
		} else {
		}
	}
	/*
		@params: index : the index in the Flatlist Of records
		@params: orgin : Where the function come from ? "name" : "action"

	*/
	_stopItemRecord = (index, origin) => {
		if (this.soundPlayBack != null) {
			this.setState({ soundEnded: true, itemPlayAudio: false }, () => {
				this.props.enablePopUp();
				if (origin === 'name') {
					this.rowRefs[0].enabledButtons(index);
					this.rowRefs[1].enabledButtons(null);
				} else if (origin === 'action') {
					this.rowRefs[0].enabledButtons(null);
					this.rowRefs[1].enabledButtons(index);
				} else {
					this.rowRefs[0].enabledButtons(null);
					this.rowRefs[1].enabledButtons(null);
				}
				this.soundPlayBack.stopAsync();
			});
		}
	};

	/*
		@params: index : the index in the Flatlist Of records
		@params: orgin : Where the function come from ? "name" : "action"

	*/
	_deleteItemRecord(i, origin) {
		if (!this.state.soundEnded) {
			this.soundPlayBack.stopAsync();
			this.props.enablePopUp();

			if (origin === 'name') {
				this.rowRefs[0].enabledButtons(i);
				this.rowRefs[1].enabledButtons(null);
			} else if (origin === 'action') {
				this.rowRefs[0].enabledButtons(null);
				this.rowRefs[1].enabledButtons(i);
			}
		}
		if (origin == 'name') {
			this.rowRefs[0]._deleteName(i);

			//update HomeScreen nb
			this.props.addPlayers(-70);
			const newArray = this.soundsArray.filter((item, index) => index !== i);
			this.soundsArray = newArray;
		} else if (origin == 'action') {
			this.rowRefs[1]._deleteAction(i);

			//update HomeScreen nb
			this.props.addActions(-70);
			const newArray = this.actionsArray.filter((item, index) => index !== i);
			this.actionsArray = newArray;
		} else {
			console.log('MAUVAISE ORIGINE');
		}
		this.setState({ soundEnded: true, itemPlayAudio: false });
	}

	_animateRecordBouton(origin) {
		if (origin == 'name') {
			Animated.spring(this.state.buttonAnimationPlayers, {
				toValue: 0.7,
				tension: 18,
				friction: 5,
				useNativeDriver: true
			}).start();
		} else if (origin == 'action') {
			Animated.spring(this.state.buttonAnimationActions, {
				toValue: 0.7,
				tension: 18,
				friction: 5,
				useNativeDriver: false
			}).start();
		} else {
			console.log('MAUVAISE ORIGINE');
		}
	}

	_resetScaleRecordBouton(origin) {
		if (origin == 'name') {
			Animated.spring(this.state.buttonAnimationPlayers, {
				toValue: 1,
				tension: 18,
				friction: 5,
				useNativeDriver: true
			}).start();
		} else if (origin == 'action') {
			Animated.spring(this.state.buttonAnimationActions, {
				toValue: 1,
				tension: 18,
				friction: 5,
				useNativeDriver: false
			}).start();
		} else {
			console.log('MAUVAISE ORIGINE');
		}
	}

	_getNamesNameBeforeLaunch() {
		this.records.namesName = this.rowRefs[0]._returnNames();
		console.log('ALL THE NAMES : ' + this.records.namesName);
	}

	_getNamesBeforeLaunch() {
		this.records.names = this.soundsArray;
		console.log('NOMBRE DE NAMES RECORDS : ' + this.records.names.length);
	}

	_getActionsNameBeforceLaunch() {
		this.records.actionsName = this.rowRefs[1]._returnActions();
		console.log('ALL THE ACTIONS : ' + this.records.actionsName);
	}

	_getActionsBeforceLaunch() {
		this.records.actions = this.actionsArray;
		console.log('NOMBRE DE ACTIONS RECORDS : ' + this.records.actions.length);
	}

	_getDatasBeforeNavigate() {
		console.log('##########################');
		this._stopItemRecord();
		this._getNamesNameBeforeLaunch();
		this._getNamesBeforeLaunch();
		this._getActionsNameBeforceLaunch();
		this._getActionsBeforceLaunch();
		console.log('##########################');
		return this.records;
	}

	_returnDatas() {
		this._getDatasBeforeNavigate();
		return this.records;
	}

	//On met à jour le state quand on lit le playBackde l'enregistrement
	_updateScreenForSoundStatus = async (status) => {
		if (status.isLoaded) {
			this.setState({
				isPlaying: status.isPlaying
			});
		}
		if (status.didJustFinish && !status.isLooping) {
			this.setState(
				{
					soundEnded: true,
					itemPlayAudio: false
				},
				() => this.props.enablePopUp(),
				this.rowRefs[0].enabledButtons(),
				this.rowRefs[1].enabledButtons()
			);
			if (this.soundPlayBack != null) {
				this.soundPlayBack.pauseAsync();
			}
		} else {
			this.setState({
				soundDuration: null,
				soundPosition: null,
				isPlaybackAllowed: false
			});

			if (status.error) {
				console.log(`FATAL PLAYER ERROR: ${status.error}`);
			}
		}
	};

	//On met à jour le state quand le record s'effectue
	_updateScreenForRecordingStatus = (status) => {
		const origin = this.state.origin;
		if (status.durationMillis < 20000) {
			if (status.canRecord) {
				this.setState({
					isRecording: status.isRecording,
					recordingDuration: status.durationMillis
				});
			} else if (status.isDoneRecording) {
				this.setState({
					isRecording: false,
					recordingDuration: status.durationMillis
				});
				if (!this.state.isLoading) {
					this._stopRecordingAndEnablePlayback(origin);
				}
			}
		} else {
			this.setState({
				isRecording: false,
				recordingDuration: status.durationMillis
			});
			if (!this.state.isLoading) {
				this._stopRecordingAndEnablePlayback(origin);
			}
		}
	};

	async _stopPlaybackAndBeginRecording(origin) {
		//disabled Sound buttons
		this.rowRefs[0].disabledButtons(null);
		this.rowRefs[1].disabledButtons(null);
		//Pour indiquer un chargement
		this.setState(
			{
				isLoading: true,
				origin: origin,
				soundEnded: true
			},
			() => this.props.disablePopUp()
		);

		// SI un son est en cours on le met en pause
		if (this.soundPlayBack != null) {
			this.soundPlayBack.pauseAsync();
		}
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: true,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: false,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			playThroughEarpieceAndroid: false,
			staysActiveInBackground: true
		});

		if (this.recording !== null) {
			this.recording.setOnRecordingStatusUpdate(null);
			this.recording = null;
		}

		const recording = new Audio.Recording();
		recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);
		await recording.prepareToRecordAsync(this.recordingSettings);

		this.recording = recording;
		await this.recording.startAsync().then(() => {});
		this.setState({
			isLoading: false
		});
	}

	async _stopRecordingAndEnablePlayback(origin) {
		const { language } = this.props;
		let player;
		let action;
		if (language == 'FR') {
			player = text.playerFR;
			action = text.actionFR;
		} else if (language == 'EN') {
			player = text.playerEN;
			action = text.actionEN;
		}
		this.setState({
			origin: origin,
			isLoading: true
		});

		//On stop l'enregistrement
		try {
			await this.recording.stopAndUnloadAsync();
		} catch (error) {}

		await Audio.setAudioModeAsync({
			staysActiveInBackground: true,
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
			playsInSilentModeIOS: true,
			playThroughEarpieceAndroid: false,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
			shouldDuckAndroid: true
		});
		const { sound, status } = await this.recording.createNewLoadedSoundAsync(
			{
				isLooping: false,
				isMuted: this.state.muted,
				volume: 1,
				rate: this.state.rate
			},
			this._updateScreenForSoundStatus
		);
		if (origin == 'name') {
			if (this.soundsArray[0] == null || this.soundsArray[0] == undefined) {
				this.rowRefs[0]._addName(player + ' 1');
				this.setState({ joueurName: 2 });

				this.soundsArray[0] = sound;
			} else {
				this.rowRefs[0]._addName(player + ' ' + this.state.joueurName);
				this.setState({ joueurName: this.state.joueurName + 1 });

				this.soundsArray.push(sound);
			}
			//add nbPlayers for Home Screen
			this.props.addPlayers(this.state.joueurName - 1);
		} else if (origin == 'action') {
			if (this.actionsArray[0] == null || this.actionsArray[0] == undefined) {
				this.rowRefs[1]._addAction(action + ' 1');
				this.setState({ actionName: 2 });

				this.actionsArray[0] = sound;
			} else {
				this.rowRefs[1]._addAction(action + ' ' + this.state.actionName);
				this.setState({ actionName: this.state.actionName + 1 });

				this.actionsArray.push(sound);
			}
			//add actions to Home Screen
			this.props.addActions(this.state.actionName - 1);
		} else {
			console.log('MAUVAISE ORIGINE');
		}

		this.setState(
			{
				isLoading: false
			},
			() => {
				this.rowRefs[0].enabledButtons();
				this.rowRefs[1].enabledButtons();
				this.props.enablePopUp();
			}
		);
	}

	_onRecordPressed = (origin) => {
		if (origin == 'name' || (origin == 'action' && this.props.premium)) {
			//On va terminer le record
			if (this.state.isRecording) {
				this._stopRecordingAndEnablePlayback(origin);
			} else {
				//On va commencer le record
				this._stopPlaybackAndBeginRecording(origin);
			}
		} else {
			this.props.triggerPopUp();
		}
	};

	//either enable or not
	_displayActionRecord() {
		const { premium } = this.props;
		if (premium) {
			return <Icon name="ios-microphone" type="ionicon" iconStyle={{ marginTop: 3 }} size={33} color={red} />;
		} else {
			return <Image style={styles.lockedPremium} source={require('../assets/button-images/button-lock.png')} />;
		}
	}

	// WHEN RECORDIN
	_toggleModalRecord = (origin) => {
		const { language } = this.props;
		if (this._timer == null) {
			// Reset var and save record
			if (this.state.isModalVisible) {
				this._onRecordPressed(this.state.origin);
				clearInterval(this._intervall);
				this._intervall = null;
				this.setState({
					recordingDurationTest: 0
				});
			} else {
				this._onRecordPressed(origin);
				// Set var and start record
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
				this._intervall = setInterval(() => {
					this.setState({
						recordingDurationTest: this.state.recordingDurationTest + 1,
						addRecordTitle
					});
				}, 1000);
			}
			this.setState({ isModalVisible: !this.state.isModalVisible }, () => this._initTimer());
		}
	};

	// TO AVOID REPETITION WITH MODAL
	_initTimer = () => {
		this._timer = true;
		setTimeout(() => this._destroyTimer(), 1000);
	};

	_destroyTimer = () => {
		this._timer = null;
	};

	render() {
		const animatedStyleButtonPlayers = {
			transform: [ { scale: this.state.buttonAnimationPlayers } ]
		};
		const animatedStyleButtonActions = {
			transform: [ { scale: this.state.buttonAnimationActions } ]
		};
		const nbActions = this.actionsArray.length;
		const flexWidth = nbActions > 0 ? 1 : null;

		let bgName = blue;
		let borderColName = red;
		let bgAction = blue;
		let borderColAction = red;

		// For duration records in modal
		let lengthRecord, endRecord;
		//From Language & premium
		const { language, premium } = this.props;

		const { itemPlayAudio, recordingDurationTest, addRecordTitle } = this.state;

		let displayPlayersButtonRecord;
		let displayActionsButtonRecord;
		if (language == 'FR') {
			displayPlayersButtonRecord = text.addPlayersFR;
			displayActionsButtonRecord = text.addActionsFR;
			endRecord = text.endRecordFR;
			lengthRecord = text.lengthRecordFR;
		} else if (language == 'EN') {
			displayPlayersButtonRecord = text.addPlayersEN;
			displayActionsButtonRecord = text.addActionsEN;
			endRecord = text.endRecordEN;
			lengthRecord = text.lengthRecordEN;
		}

		var disabledActionButton;
		var opaActionButton;

		var disabledNameButton;
		var opaNameButton;

		//  IF NONE ITEM PLAY AUDIO -> ACT NORMALLY
		if (!itemPlayAudio) {
			// if (!itemPlayAudio) {
			//Si l'on est en train de record un Name
			if (this.state.isLoading || (this.state.isRecording && this.state.origin == 'name')) {
				disabledActionButton = true;
				opaActionButton = 0.2;
				// if (this.state.isRecording && this.state.origin == 'name') {
				// 	bgName = red;
				// 	borderColName = blue;
				// 	if (language == 'FR') {
				// 		displayPlayersButtonRecord = text.addRecordingFR;
				// 	} else if (language == 'EN') {
				// 		displayPlayersButtonRecord = text.addRecordingEN;
				// 	}
				// }
			} else {
				disabledActionButton = false;
				opaActionButton = 1;
			}

			//Si l'on est en train de record une Action
			if (this.state.isLoading || (this.state.isRecording && this.state.origin == 'action')) {
				disabledNameButton = true;
				opaNameButton = 0.2;
				// if (this.state.isRecording && this.state.origin == 'action') {
				// 	bgAction = red;
				// 	borderColAction = blue;
				// 	if (language == 'FR') {
				// 		displayActionsButtonRecord = text.addRecordingFR;
				// 	} else if (language == 'EN') {
				// 		displayActionsButtonRecord = text.addRecordingEN;
				// 	}
				// }
			} else {
				disabledNameButton = false;
				opaNameButton = 1;
			}
		} else {
			disabledNameButton = true;
			opaNameButton = 0.2;
			disabledActionButton = true;
			opaActionButton = 0.2;
		}

		return (
			<SafeAreaView style={[ styles.container, { opacity: 1 } ]}>
				<View style={{ flex: 1, paddingHorizontal: 20 }}>
					<TouchableWithoutFeedback
						onPressIn={() => this._animateRecordBouton('name')}
						onPressOut={() => this._resetScaleRecordBouton('name')}
						onPress={() => this._toggleModalRecord('name')}
						disabled={disabledNameButton}
					>
						<Animated.View
							style={[
								styles.addButtons,
								animatedStyleButtonPlayers,
								{ backgroundColor: bgName, borderColor: borderColName, opacity: opaNameButton }
							]}
						>
							<Text style={[ styles.addText ]}>{displayPlayersButtonRecord}</Text>
							<View style={styles.addButtonIcon}>
								<Icon
									name="ios-microphone"
									type="ionicon"
									iconStyle={{ marginTop: 3 }}
									size={33}
									color={red}
								/>
							</View>
						</Animated.View>
					</TouchableWithoutFeedback>

					<FlatListRecord
						ref={(ref) => (this.rowRefs[0] = ref)}
						soundsArray={this.soundsArray}
						playItemRecord={this._playItemRecord}
						stopItemRecord={this._stopItemRecord}
						deleteItemRecord={this._deleteItemRecord}
						extraData={this.state}
					/>
				</View>
				<View style={{ flex: flexWidth, marginTop: 10, paddingHorizontal: 20 }}>
					<TouchableWithoutFeedback
						onPressIn={() => this._animateRecordBouton('action')}
						onPressOut={() => this._resetScaleRecordBouton('action')}
						onPress={() => this._toggleModalRecord('action')}
						disabled={disabledActionButton}
					>
						<Animated.View
							style={[
								styles.addButtons,
								animatedStyleButtonActions,
								{ backgroundColor: bgAction, borderColor: borderColAction, opacity: opaActionButton }
							]}
						>
							<Text style={[ styles.addText ]}>{displayActionsButtonRecord}</Text>
							<View style={styles.addButtonIcon}>{this._displayActionRecord()}</View>
						</Animated.View>
					</TouchableWithoutFeedback>
					<FlatListRecordActions
						ref={(ref) => (this.rowRefs[1] = ref)}
						actionsArray={this.actionsArray}
						playItemRecord={this._playItemRecord}
						stopItemRecord={this._stopItemRecord}
						deleteItemRecord={this._deleteItemRecord}
						extraData={this.state}
					/>
				</View>
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
					onBackdropPress={() => this._toggleModalRecord()}
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
							isVisible={this.state.isModalVisible}
							size={100}
							type="Bounce"
							color={red}
						/>
						<Button
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
								this._toggleModalRecord();
							}}
						/>
					</View>
				</Modal>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: green,
		justifyContent: 'center',
		alignContent: 'center'
	},
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
	},
	addButtons: {
		width: '100%',
		backgroundColor: '#3B4A6B',
		borderColor: '#B83B5E',
		borderWidth: 5,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		borderRadius: 40,
		alignContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 6,
			height: 6
		},
		shadowOpacity: 0.6,
		shadowRadius: 6.0,
		elevation: 10
	},
	addText: {
		fontSize: stl.fontSizeRecordText,
		color: '#FFFFFF',
		marginVertical: 10,
		fontFamily: 'montserrat-extra-bold'
	},
	addButtonIcon: {
		width: 37,
		height: 37,
		backgroundColor: white,
		borderRadius: 33,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonFlatList: {
		width: 30,
		height: 30,
		resizeMode: 'contain'
	},
	lockedPremium: {
		width: 40,
		height: 40,
		resizeMode: 'contain'
	}
});

export default RecordsAccueil;
