import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Button,
	FlatList,
	Dimensions,
	SafeAreaView,
	Alert,
	TouchableWithoutFeedback,
	Image,
	Modal,
	Animated,
	TextInput,
	Easing
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';
import * as stl from '../assets/styles/styles';
import { Icon } from 'react-native-elements';

import FlatListRecord from './FlatListRecord';
import FlatListRecordActions from './FlatListRecordActions';

import * as text from '../assets/textInGame/listTextHome';
import { green, red, blue, white } from '../assets/colors';
const { height, width } = Dimensions.get('window');
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
				recordPrepared: false
			});
		this.rowRefs = [];
		this._intervall = null;
		this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
		this._playItemRecord = this._playItemRecord.bind(this);
		this._stopItemRecord = this._stopItemRecord.bind(this);
		this._deleteItemRecord = this._deleteItemRecord.bind(this);
		this._returnState = this._returnState.bind(this);

		// // UNCOMMENT THIS TO TEST maxFileSize:
		// this.recordingSettings.android['maxFileSize'] = 12000;

		// this.textButtonName;
		// this.bgName;
		// this.bcName;

		// this.textButtonAction;
		// this.bgAction;
		// this.bcAction;
	}

	//to check if user can navigate between scree
	_returnState() {
		const stateRecords = [ this.state.isLoading, this.state.isRecording ];
		return stateRecords;
	}

	async componentDidMount() {
		this._askForPermissions();
		const { language } = this.props;
		// if( language == "FR" ){
		//   this.textButtonName = text.addPlayersFR
		// }
		// else if ( language == "EN" ){
		//   this.textButtonName = text.addPlayersEN
		// }
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

	_askForPermissions = async () => {
		const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
		this.setState({
			haveRecordingPermissions: response.status === 'granted'
		});
	};
	z;

	async _playItemRecord(item) {
		if (this.state.soundEnded) {
			this.props.disablePopUp();
			if (this.soundPlayBack == item) {
				await this.soundPlayBack.replayAsync();
				this.setState({ soundEnded: false });
			} else {
				this.soundPlayBack = null;
				this.soundPlayBack = item;

				this.soundPlayBack.setOnPlaybackStatusUpdate(this._updateScreenForSoundStatus);
				await this.soundPlayBack.replayAsync();
				this.setState({ soundEnded: false });
			}
		} else {
		}
	}

	_stopItemRecord = () => {
		if (this.soundPlayBack != null) {
			this.soundPlayBack.stopAsync();
			this.setState({ soundEnded: true }, () => this.props.enablePopUp());
		}
	};

	_deleteItemRecord(i, origin) {
		if (!this.state.soundEnded) {
			this.soundPlayBack.stopAsync();
			this.props.enablePopUp();
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
		this.setState({ soundEnded: true });
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
				// soundDuration: status.durationMillis,
				// soundPosition: status.positionMillis,
				// shouldPlay: status.shouldPlay,
				isPlaying: status.isPlaying
				// rate: status.rate,
				// muted: status.isMuted,
				// volume: 1,
				// isPlaybackAllowed: true,
			});
		}
		if (status.didJustFinish && !status.isLooping) {
			this.setState(
				{
					soundEnded: true
				},
				() => this.props.enablePopUp()
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
				//console.log(`FATAL PLAYER ERROR: ${status.error}`);
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
		this.rowRefs[0].disabledButtons();
		this.rowRefs[1].disabledButtons();
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
		//launch scale button
		//this._animateRecordBouton(origin)
		// L'enregistrement commence
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
				//this._resetScaleRecordBouton(origin);
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

	render() {
		const animatedStyleButtonPlayers = {
			transform: [ { scale: this.state.buttonAnimationPlayers } ]
		};
		const animatedStyleButtonActions = {
			transform: [ { scale: this.state.buttonAnimationActions } ]
		};
		//const opa = (this.state.isLoading) ? 0.2 : 1
		//const bg = (this.state.isRecording) ? red : blue
		//const borderCol = (this.state.isRecording) ? blue : red
		const nbActions = this.actionsArray.length;
		const flexWidth = nbActions > 0 ? 1 : null;

		let bgName = blue;
		let borderColName = red;
		let bgAction = blue;
		let borderColAction = red;

		//From Language & premium
		const { language, premium } = this.props;
		let displayPlayersButtonRecord;
		let displayActionsButtonRecord;
		if (language == 'FR') {
			displayPlayersButtonRecord = text.addPlayersFR;
			displayActionsButtonRecord = text.addActionsFR;
		} else if (language == 'EN') {
			displayPlayersButtonRecord = text.addPlayersEN;
			displayActionsButtonRecord = text.addActionsEN;
		}

		var disabledActionButton;
		var opaActionButton;

		//Si l'on est en train de record un Name
		if (this.state.isLoading || (this.state.isRecording && this.state.origin == 'name')) {
			disabledActionButton = true;
			opaActionButton = 0.2;
			if (this.state.isRecording && this.state.origin == 'name') {
				bgName = red;
				borderColName = blue;
				if (language == 'FR') {
					displayPlayersButtonRecord = text.addRecordingFR;
				} else if (language == 'EN') {
					displayPlayersButtonRecord = text.addRecordingEN;
				}
			}
		} else {
			disabledActionButton = false;
			opaActionButton = 1;
		}

		var disabledNameButton;
		var opaNameButton;
		//Si l'on est en train de record une Action
		if (this.state.isLoading || (this.state.isRecording && this.state.origin == 'action')) {
			disabledNameButton = true;
			opaNameButton = 0.2;
			if (this.state.isRecording && this.state.origin == 'action') {
				bgAction = red;
				borderColAction = blue;
				if (language == 'FR') {
					displayActionsButtonRecord = text.addRecordingFR;
				} else if (language == 'EN') {
					displayActionsButtonRecord = text.addRecordingEN;
				}
			}
		} else {
			disabledNameButton = false;
			opaNameButton = 1;
		}
		return (
			<SafeAreaView style={[ styles.container, { opacity: 1 } ]}>
				<View style={{ flex: 1 }}>
					<TouchableWithoutFeedback
						onPressIn={() => this._animateRecordBouton('name')}
						onPressOut={() => this._resetScaleRecordBouton('name')}
						onPress={() => this._onRecordPressed('name')}
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
						//ref = 'flrecord'
						ref={(ref) => (this.rowRefs[0] = ref)}
						soundsArray={this.soundsArray}
						playItemRecord={this._playItemRecord}
						stopItemRecord={this._stopItemRecord}
						deleteItemRecord={this._deleteItemRecord}
						extraData={this.state}
					/>
				</View>
				<View style={{ flex: flexWidth, marginTop: 10 }}>
					<TouchableWithoutFeedback
						onPressIn={() => this._animateRecordBouton('action')}
						onPressOut={() => this._resetScaleRecordBouton('action')}
						onPress={() => this._onRecordPressed('action')}
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
						//ref = 'flrecordActions'
						ref={(ref) => (this.rowRefs[1] = ref)}
						//ref = {(ref) => this.refFLaction = ref}
						actionsArray={this.actionsArray}
						playItemRecord={this._playItemRecord}
						stopItemRecord={this._stopItemRecord}
						deleteItemRecord={this._deleteItemRecord}
						extraData={this.state}
					/>
				</View>
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
	addButtons: {
		width: width - 40,
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

// _recordAnimation(origin){
//   this._animateRecordBouton(origin)
//   //this.setState({ isLoading: true, canRecord: true, recordingDuration: 0, isRecording: false })
//   this._onRecordPressed(origin)
//   this._intervall = setInterval(() => {
//     this._animateRecordBouton(origin)
//   }, 1000)
// }

// async _clearAnimation(origin){
//   if(this.state.recordingDuration > 0){
//   }else {
//     this.setState({
//       canRecord: false,
//       isRecording: false,
//       isLoading: false,
//       recordPrepared: "notReady"
//     })
//   }
//   this._onRecordPressed(origin)
//   clearInterval(this._intervall)
//   this._intervall = null;
//   this.state.buttonAnimationPlayers.setValue(1)
//   this.state.buttonAnimationActions.setValue(1)
// }
