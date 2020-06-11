import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	SafeAreaView,
	TouchableWithoutFeedback,
	Image,
	Animated
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';
import * as stl from '../assets/styles/styles';
import { Icon, Button } from 'react-native-elements';
import FlatListRecord from './FlatListRecord';
import FlatListRecordActions from './FlatListRecordActions';
import ModalRecord from './ModalRecord';
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
		this.joueurName = 1;
		this.actionName = 1;
		this.interval;
		this.state = {
			haveRecordingPermissions: false,
			isLoading: false,
			isRecording: false,
			soundEnded: true,
			buttonAnimationPlayers: new Animated.Value(1),
			buttonAnimationActions: new Animated.Value(1),
			origin: 'name',
			itemPlayAudio: false
		};
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
		//  If the user choose 'Don"t ask again"
		if (!response.permissions.audioRecording.canAskAgain) {
			setTimeout(() => {
				this.props.showAlertFunc('permissionAskAgain');
			}, 500);
		}
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
			// console.log('MAUVAISE ORIGINE');
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
			// console.log('MAUVAISE ORIGINE');
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
			// console.log('MAUVAISE ORIGINE');
		}
	}

	_getNamesNameBeforeLaunch() {
		this.records.namesName = this.rowRefs[0]._returnNames();
		// // console.log('ALL THE NAMES : ' + this.records.namesName);
	}

	_getNamesBeforeLaunch() {
		this.records.names = this.soundsArray;
		// // console.log('NOMBRE DE NAMES RECORDS : ' + this.records.names.length);
	}

	_getActionsNameBeforceLaunch() {
		this.records.actionsName = this.rowRefs[1]._returnActions();
		// // console.log('ALL THE ACTIONS : ' + this.records.actionsName);
	}

	_getActionsBeforceLaunch() {
		this.records.actions = this.actionsArray;
		// // console.log('NOMBRE DE ACTIONS RECORDS : ' + this.records.actions.length);
	}

	_getDatasBeforeNavigate() {
		// // console.log('##########################');
		this._stopItemRecord();
		this._getNamesNameBeforeLaunch();
		this._getNamesBeforeLaunch();
		this._getActionsNameBeforceLaunch();
		this._getActionsBeforceLaunch();
		// // console.log('##########################');
		return this.records;
	}

	_returnDatas() {
		this._getDatasBeforeNavigate();
		return this.records;
	}

	//On met à jour le state quand on lit le playBackde l'enregistrement
	_updateScreenForSoundStatus = async (status) => {
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
		}
		if (status.error) {
			// console.log(`FATAL PLAYER ERROR: ${status.error}`);
		}
	};

	//On met à jour le state quand le record s'effectue
	_updateScreenForRecordingStatus = (status) => {
		const origin = this.state.origin;
		// Si le son est trop long on le coupe
		// console.log(status.durationMillis)
		if (status.durationMillis >= 20000) {
				this._toggleModalRecord(origin);
		}
	};

	async _stopPlaybackAndBeginRecording(origin) {
		// SI un son est en cours on le met en pause
		if (this.soundPlayBack != null) {
			await this.soundPlayBack.pauseAsync();
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
		await this.recording.startAsync().then(() => {
			// this.setState({
			// 	isLoading: false
			// });
		});
	}

	// // WHEN RECORDING
	_toggleModalRecord = (origin) => {
		const { language, premium } = this.props;
		const { haveRecordingPermissions } = this.state;
		// If the user hasn't allow persmission to records -> PopUp Warning
		if (!haveRecordingPermissions) {
			this.props.showAlertFunc('permission');
		} else {
			if (this._timer == null) {
				// Trigger premium pop up
				if (!premium && origin == 'action') {
					this.props.triggerPopUp();
				} else {
					//_stopPlaybackAndBeginRecording
					if (!this.state.isLoading) {
						//Pour indiquer un chargement
						this.setState(
							{
								isLoading: true,
								origin: origin,
								soundEnded: true,
								isRecording: true
							},
							() => this._initTimer(),
							this._onRecordPressed(origin)
						);
						this._modalRecord._toggleModalRecord(origin);
						//disabled Sound buttons
						this.props.disablePopUp();
						this.rowRefs[0].disabledButtons(null);
						this.rowRefs[1].disabledButtons(null);
					} else {
						// _stopRecordingAndEnablePlayback
						this.setState(
							{
								isRecording: false
							},
							() => this._initTimer(),
							this._onRecordPressed(this.state.origin),
							this._modalRecord._toggleModalRecord(this.state.origin)
						);
					}
				}
			}
		}
	};

	async _stopRecordingAndEnablePlayback(origin) {
		const { language } = this.props;
		// USE FOR PLACEHOLDER
		let player, action;
		if (language == 'FR') {
			player = text.playerFR;
			action = text.actionFR;
		} else if (language == 'EN') {
			player = text.playerEN;
			action = text.actionEN;
		}

		//On stop l'enregistrement
		try {
			await this.recording.stopAndUnloadAsync();
		} catch (error) {
			// console.log('ERROR STOP RECORDING : ' + JSON.stringify(error, null, 2));
		}

		// ON REMET LE MODE POUR LA LECTURE DE SONS
		await Audio.setAudioModeAsync({
			staysActiveInBackground: true,
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
			playsInSilentModeIOS: true,
			playThroughEarpieceAndroid: false,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
			shouldDuckAndroid: true
		});

		// ON RECUPERE L'AUDIO ENREGISTRÉ
		const { sound, status } = await this.recording.createNewLoadedSoundAsync(
			{
				isLooping: false,
				volume: 1,
				rate: this.state.rate
			},
			this._updateScreenForSoundStatus
		);

		// ON CRÉÉ L'ITEM AUDIO
		if (origin == 'name') {
			if (this.soundsArray[0] == null || this.soundsArray[0] == undefined) {
				this.rowRefs[0]._addName(player + ' 1');
				// this.setState({ joueurName: 2 });
				this.joueurName = 2;
				this.soundsArray[0] = sound;
			} else {
				this.rowRefs[0]._addName(player + ' ' + this.joueurName);
				// this.rowRefs[0]._addName(player + ' ' + this.state.joueurName);
				// this.setState({ joueurName: this.state.joueurName + 1 });
				this.joueurName = this.joueurName + 1;
				this.soundsArray.push(sound);
			}
			//add nbPlayers for Home Screen
			this.props.addPlayers(this.joueurName - 1);
			// this.props.addPlayers(this.state.joueurName - 1);
		} else if (origin == 'action') {
			if (this.actionsArray[0] == null || this.actionsArray[0] == undefined) {
				this.rowRefs[1]._addAction(action + ' 1');
				this.actionName = 2;
				// this.setState({ actionName: 2 });

				this.actionsArray[0] = sound;
			} else {
				this.rowRefs[1]._addAction(action + ' ' + this.actionName);
				// this.rowRefs[1]._addAction(action + ' ' + this.state.actionName);
				// this.setState({ actionName: this.state.actionName + 1 });
				this.actionName = this.actionName + 1;
				this.actionsArray.push(sound);
			}
			//add actions to Home Screen
			this.props.addActions(this.actionName - 1);
			// this.props.addActions(this.state.actionName - 1);
		} else {
			// console.log('MAUVAISE ORIGINE');
		}

		this.props.enablePopUp();
		this.rowRefs[0].enabledButtons();
		this.rowRefs[1].enabledButtons();

		this.setState({
			isLoading: false
		});
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
		const flexWidth = this.actionsArray.length > 0 ? 1 : null;

		//From Language & premium
		const { language } = this.props;

		const { itemPlayAudio, isLoading, origin } = this.state;

		let displayPlayersButtonRecord;
		let displayActionsButtonRecord;
		if (language == 'FR') {
			displayPlayersButtonRecord = text.addPlayersFR;
			displayActionsButtonRecord = text.addActionsFR;
		} else if (language == 'EN') {
			displayPlayersButtonRecord = text.addPlayersEN;
			displayActionsButtonRecord = text.addActionsEN;
		}

		// TEXT NAME
		let disabledButton, opaButton;
		if (itemPlayAudio || isLoading) {
			disabledButton = true;
			opaButton = 0.2;
		} else {
			disabledButton = false;
			opaButton = 1;
		}

		return (
			<SafeAreaView style={[ styles.container, { opacity: 1 } ]}>
				<View style={{ flex: 1, paddingHorizontal: 20 }}>
					<TouchableWithoutFeedback
						onPressIn={() => this._animateRecordBouton('name')}
						onPressOut={() => this._resetScaleRecordBouton('name')}
						onPress={() => this._toggleModalRecord('name')}
						disabled={disabledButton}
					>
						<Animated.View
							style={[ styles.addButtons, animatedStyleButtonPlayers, { opacity: opaButton } ]}
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
						disabled={disabledButton}
					>
						<Animated.View
							style={[ styles.addButtons, animatedStyleButtonActions, { opacity: opaButton } ]}
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
				<ModalRecord
					ref={(ref) => (this._modalRecord = ref)}
					toggleModalRecord={this._toggleModalRecord}
					language={language}
					origin={origin}
				/>
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
// // WHEN RECORDING
// _toggleModalRecord = (origin) => {
// 	const { language, premium } = this.props;
// 	const { haveRecordingPermissions } = this.state;
// 	// If the user hasn't allow persmission to records -> PopUp Warning
// 	if (!haveRecordingPermissions) {
// 		this.props.showAlertFunc('permission');
// 	} else {
// 		if (this._timer == null) {
// 			// Trigger premium pop up
// 			if (!premium && origin == 'action') {
// 				this.props.triggerPopUp();
// 			} else {
// 				//_stopPlaybackAndBeginRecording
// 				if (!this.state.isModalVisible) {
// 					let addRecordTitle;
// 					if (origin == 'name') {
// 						if (language == 'FR') {
// 							addRecordTitle = text.addRecordNameFR;
// 						} else if (language == 'EN') {
// 							addRecordTitle = text.addRecordNameEN;
// 						}
// 					} else if (origin == 'action') {
// 						if (language == 'FR') {
// 							addRecordTitle = text.addRecordActionFR;
// 						} else if (language == 'EN') {
// 							addRecordTitle = text.addRecordActionEN;
// 						}
// 					}
// 					//disabled Sound buttons
// 					this.props.disablePopUp();
// 					this.rowRefs[0].disabledButtons(null);
// 					this.rowRefs[1].disabledButtons(null);
// 					//Pour indiquer un chargement
// 					this.setState(
// 						{
// 							isLoading: true,
// 							origin: origin,
// 							soundEnded: true,
// 							addRecordTitle,
// 							isModalVisible: true,
// 							isRecording: true
// 						},
// 						() => this._initTimer(),
// 						this._onRecordPressed(origin)
// 					);

// 					this._intervall = setInterval(() => {
// 						this.setState({
// 							recordingDurationTest: this.state.recordingDurationTest + 1
// 						});
// 					}, 1000);
// 				} else {
// 					// _stopRecordingAndEnablePlayback
// 					this.setState(
// 						{
// 							isLoading: true,
// 							recordingDurationTest: 0,
// 							isModalVisible: false,
// 							isRecording: false
// 						},
// 						() => this._initTimer(),
// 						this._onRecordPressed(this.state.origin)
// 					);

// 					clearInterval(this._intervall);
// 					this._intervall = null;
// 				}
// 			}
// 		}
// 	}
// };
