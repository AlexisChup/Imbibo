import React from 'react';
import { Animated, StyleSheet, Text, View, StatusBar, Dimensions, Image, Button, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { green, red, blue, white } from '../assets/colors';
import BackgroundTimer from 'react-native-background-timer';
import { MultiArcCircle } from 'react-native-circles';
import * as random from '../assets/randomSipFolder';
const maxSeconds = 240;
const { width, height } = Dimensions.get('window');
const SIZE = width * 0.9;
const ECART_NEEDLE = 40;
//const ROT_ECART_NEEDLE = ECART_NEEDLE /18

//Ne pas y toucher :
// Permet de faire 90° en 50 secondes
// const TICK_INTERVAL = 50;
// const DECREMENT = 0.12;

//Pour les Test
// Permet de faire 90° en 5 secondes
const TICK_INTERVAL = 50;
const DECREMENT = 2;

var audioObjectNames = new Audio.Sound();
var audioObjectActions = new Audio.Sound();

export default class Chronometer extends React.Component {
	constructor(props) {
		super(props);
		//this._testCallBack = this._testCallBack.bind(this)

		//this.goToChild = this.props._goToChild
		this.audioSampleAction;
		this._tickInterval = null;
		this._rN = 0;
		this._rNInit1 = 0;
		this._rNInit2 = 0;
		this._rTimeLimit = -1;
		this.actualName = '';
		this.actualAction = '';
		this.groupAction = false;
		this.state = {
			//Pour les animations du début
			scales: [ ...Array(5).keys() ].map(() => new Animated.Value(0.01)),

			//Pour la rotation de l'aiguille
			rotationNeedle: new Animated.Value(0),
			rotationLimit: new Animated.Value(-1),

			displayTimeLimit: 0,
			isPlaying: true,
			gameStarted: true,
			nbJoueurs: null
		};
	}

	componentDidMount() {
		const { records } = this.props;

		this.setState({
			nbJoueurs: records.names.length
		});
		//console.log("Nombre de joueur" + records.names.length)
		console.log(
			"Nombre d'actions" + records.actions.length + ' State scale: : ' + this.state.scales[0].__getValue()
		);
		const valuesSlider = this.props.valuesSlider;
		// maxSeconds sec = 360°
		this._rNInit1 = valuesSlider[0] * 360 / maxSeconds;
		this._rNInit2 = valuesSlider[1] * 360 / maxSeconds;
		//this._initTimeOut();
		//this._initNeedle()

		//let time to load images
		setTimeout(() => this._animate(), this._initNeedle(), 500);
	}

	_animate = () => {
		const scaleStaggerAnimations = this.state.scales.map((animated) => {
			return Animated.spring(animated, {
				//reach the val
				toValue: 1,
				// strength to goal
				tension: 18,
				//resistance to goal
				friction: 3,
				useNativeDriver: false
			});
		});

		Animated.stagger(200, scaleStaggerAnimations).start();
	};

	componentWillUnmount() {
		this._stopChrono();
	}

	async _stopChrono() {
		BackgroundTimer.clearInterval(this._tickInterval);
		this._tickInterval = null;
		if (this.state.isPlaying && this.state.gameStarted) {
			audioObjectNames = null;
			await audioObjectActions.unloadAsync();
		}
	}

	_initNeedle() {
		//random location between extremeties
		const positionTrigger = Math.round(Math.random() * (this._rNInit2 - this._rNInit1)) + this._rNInit1;

		//position of needle
		this._rN = 0;

		//where will be trigger the audio
		this._rTimeLimit = positionTrigger;

		//rotation of needle
		this.state.rotationNeedle.setValue(this._rN);

		//fixing position of red stick
		this.state.rotationLimit.setValue(this._rTimeLimit);
		this.setState({
			displayTimeLimit: 0
		});

		//Si le jeu n'est pas en pause on joue
		if (this.state.isPlaying) {
			this._initInterval();
		}
	}

	_initInterval() {
		this._tickInterval = BackgroundTimer.setInterval(() => {
			this._moveNeedle();
		}, TICK_INTERVAL);
	}

	_moveNeedle() {
		this._rN += DECREMENT;

		if (this._rN < this._rTimeLimit) {
			this.state.rotationNeedle.setValue(this._rN);

			this.setState({
				displayTimeLimit: Math.round((this.state.displayTimeLimit + TICK_INTERVAL / 1000) * 50) / 50
			});
		} else {
			this.state.rotationNeedle.setValue(this.state.rotationLimit.__getValue());
			this._stopInterval();
			this.setState({
				displayTimeLimit: 0
			});
		}
	}

	_stopInterval() {
		BackgroundTimer.clearInterval(this._tickInterval);
		// BackgroundTimer.clearInterval(this._tickInterval);

		// L'aiguille a atteint le TimeOut
		if (
			this.state.rotationNeedle.__getValue() == this.state.rotationLimit.__getValue() &&
			this.state.rotationNeedle.__getValue() != -1
		) {
			Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				staysActiveInBackground: true,
				interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
				playsInSilentModeIOS: true,
				playThroughEarpieceAndroid: false,
				interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
				shouldDuckAndroid: true
			});
			this.state.rotationLimit.setValue(-1);
			//S'il y a plus d'un joueur
			if (this.state.nbJoueurs > 0) {
				this._playRandomName();
			} else {
				//console.log("On va joueur une action")
				this.actualName = null;
				this.groupAction = true;
				this._playRandomAction();
			}
			this.setState({
				displayTimeLimit: 0
			});
		}
	}

	async _playRandomName() {
		if (this.state.isPlaying && this.state.gameStarted) {
			const random = Math.random() * 100;
			// 90% that is individual action
			if (random < 90) {
				// to choose an individual action
				this.groupAction = false;

				audioObjectNames = null;

				const records = this.props.records;
				const index = Math.round(Math.random() * (records.names.length - 1));

				audioObjectNames = records.names[index];
				this.actualName = records.namesName[index];
				try {
					audioObjectNames.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdateName);
					//await audioObject.loadAsync(records.names[index])
					await audioObjectNames.replayAsync();
				} catch (error) {
					console.log('error : ' + error);
				}
			} else {
				// 10% that is Group action, we do nothing
				// to choose a group action
				this.groupAction = true;
				this.actualName = null;
				this._playRandomAction();
			}
		}
	}

	async _playRandomAction() {
		if (this.state.isPlaying && this.state.gameStarted) {
			//add to the history with appropriate language
			const { language, mod } = this.props;

			//find random index
			//const index = Math.round(Math.random() * (this.audioSampleAction.length-1))
			const audio = random.randomSipFolder(mod, this.props.records.actions.length, language, this.groupAction);

			//si ce n'est pas un user action
			if (audio != 'UserAction') {
				this.actualAction = audio.actionName;

				try {
					audioObjectActions.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdateAction);
					// await audioObjectActions.loadAsync({ uri: 'asset:/21_fr.m4a' });
					await audioObjectActions.loadAsync(audio.actionAudio);

					await audioObjectActions.playAsync();
				} catch (error) {
					console.log('error : ' + error);
				}
			} else {
				//user actions
				audioObjectNames = null;

				const index = Math.round(Math.random() * (this.props.records.actions.length - 1));

				audioObjectNames = records.actions[index];
				this.actualAction = records.actionsName[index];
				try {
					audioObjectNames.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdateAction);
					//await audioObject.loadAsync(records.names[index])
					await audioObjectNames.replayAsync();
				} catch (error) {
					console.log('error : ' + error);
				}
			}
		} else {
			this._stopInterval();
		}
	}

	_onPlaybackStatusUpdateName = async (playbackStatus) => {
		if (!playbackStatus.isLoaded) {
			// Update your UI for the unloaded state
			if (playbackStatus.error) {
				console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
				// Send Expo team the error on Slack or the forums so we can help you debug!
			}
		} else {
			if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
				// await audioObject.unloadAsync().then(() => {
				//   if(this.state.isPlaying){
				//     this._playRandomAction()
				//   }
				// })
				//le jeu est en cours
				if (this.state.isPlaying) {
					this._playRandomAction();
				} else {
					//le jeu est en pause
					BackgroundTimer.clearInterval(this._tickInterval);
					this._rN = 0;
					this._rTimeLimit = -1;
					this.state.rotationNeedle.setValue(0);
					this.state.rotationLimit.setValue(-3);
					this._tickInterval = null;
					this.setState(
						{
							displayTimeLimit: 0
						},
						() => this._initNeedle()
					);
				}
				await audioObjectNames.pauseAsync();
			}
		}
	};

	_onPlaybackStatusUpdateAction = async (playbackStatus) => {
		if (!playbackStatus.isLoaded) {
			// Update your UI for the unloaded state
			if (playbackStatus.error) {
				console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
				// Send Expo team the error on Slack or the forums so we can help you debug!
			}
		} else {
			if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
				// To fix duck on android
				await audioObjectActions.pauseAsync();
				await audioObjectActions.unloadAsync().then(() => {
					this.props.addHistorique(this.actualName, this.actualAction);
				});
				this._initNeedle();
			}
		}
	};

	_onPlayPausePressed() {
		//On remet le jeu, on était en pause
		if (!this.state.isPlaying && this.state.gameStarted) {
			this.setState(
				{
					isPlaying: true
				},
				() => this._initInterval()
			);
		} else if (this.state.isPlaying && this.state.gameStarted) {
			//On met en pause le jeu, le jeu était en cours
			BackgroundTimer.clearInterval(this._tickInterval);
			this._tickInterval = null;
			this.setState({
				isPlaying: false
			});
		} else if (!this.state.isPlaying && !this.state.gameStarted) {
			//Si le jeu était arrêter
			this.setState({
				isPlaying: true,
				gameStarted: true
			});
			this._initNeedle();
		}
	}

	_onPlayPressed() {
		this.setState({
			isPlaying: true,
			gameStarted: true
		});
		//C'était juste une pause
		if (this.state.gameStarted == true) {
			this._initInterval();
		} else {
			//on avait mis stop
			this._initNeedle();
		}
	}

	_onPausePressed() {
		BackgroundTimer.clearInterval(this._tickInterval);
		this._tickInterval = null;
		this.setState({
			isPlaying: false
		});
	}

	_onStopPressed() {
		BackgroundTimer.clearInterval(this._tickInterval);
		this._rN = 0;
		this._rTimeLimit = -1;
		this.state.rotationNeedle.setValue(0);
		this.state.rotationLimit.setValue(this._rTimeLimit);
		this._tickInterval = null;
		this.setState({
			isPlaying: false,
			displayTimeLimit: 0,
			gameStarted: false
		});
	}

	render() {
		const {
			rotationNeedle,
			rotationLimit,
			scales: [ chronometer, area, strokeChronometer, needle, buttons ]
		} = this.state;

		const interpolated = {
			inputRange: [ 0, 360 ],
			outputRange: [ '0deg', '360deg' ]
		};

		const transformNeedle = {
			transform: [ { rotate: rotationNeedle.interpolate(interpolated) }, { scale: needle } ]
		};

		const transformTimeLimit = {
			transform: [ { rotate: rotationLimit.interpolate(interpolated) } ]
		};

		const titleButton = this.state.isPlaying ? 'PAUSE' : 'PLAY';
		const { records, valuesSlider } = this.props;
		return (
			<View style={styles.container}>
				<StatusBar hidden={true} />

				{/* Affichage du contour du chronometre */}
				<Animated.Image
					style={[ styles.chronometer, { transform: [ { scale: chronometer } ] } ]}
					source={require('../assets/chronometer/chronometer-only-contour.png')}
				/>
				{/* <Animated.View style = { [styles.containerChronometer, { transform: [{ scale: chronometer}]}] }>
          <Image 
            source = {require('../assets/chronometer/chronometer-only-contour.png')}
            style = { styles.chronometer}
          />
        </Animated.View> */}

				{/* Zone verte */}
				<Animated.View style={[ styles.area, { transform: [ { scale: area } ] } ]}>
					<MultiArcCircle
						radius={width / 3.55}
						intervals={[ { start: this._rNInit1, end: this._rNInit2 } ]}
						color={green}
						backgroundColor="transparent"
						width={50}
					/>
				</Animated.View>

				{/* Traits du chronometre */}
				<Animated.View style={[ styles.stkChrono, { transform: [ { scale: strokeChronometer } ] } ]}>
					<Image
						style={styles.chronometer}
						source={require('../assets/chronometer/needle-and(circle).png')}
					/>
				</Animated.View>

				{/* Ombre du chronometre */}
				{/* <Animated.View style = { [styles.shadowChrono, { transform: [{ scale: chronometer}]}] } >
          <Image
            style = { styles.chronometer }
            source = { require('../assets/chronometer/shadow.png')}
          />          
        </Animated.View> */}

				{/* Aiguille qui tourne */}
				<Animated.Image
					style={[ transformNeedle, styles.needle ]}
					source={require('../assets/chronometer/needle-center.png')}
				/>

				{/* Boutons Play/Pause */}
				{/* <Animated.View style = {[styles.buttons, { transform: [{ scale: buttons}]}]}>
          <Button
            title = "PLAY"
            onPress = {() => this._onPlayPressed()}
            disabled = {this.state.isPlaying}
          />
          <Button
            title = "PAUSE"
            onPress = {() => this._onPausePressed()}
            disabled = {!this.state.isPlaying}
            color = "orange"
          />
          <Button
            title = {titleButton}
            onPress = {() => this._onPlayPausePressed()}
            color = "orange"
          />
          <Button
            title = "STOP"
            onPress = { () => this._onStopPressed()}
            color = "#B83B5E"
          />
        </Animated.View> */}

				{/* Stick red pour afficher le TimeOut et le compteur */}
				{/* <Animated.View
          style = {[ transformTimeLimit, styles.redStick ]}>
        </Animated.View>
        <View style = {{position: "absolute", backgroundColor: 'gray', borderRadius: 25, flex: 1}}>
          <Text style = {{color : 'white', margin : 5}}>
            {this.state.displayTimeLimit} s
          </Text>
          <Text style = {{color : 'white', margin : 5}}>
            {(Math.round(((this.state.rotationLimit.__getValue())/18)*100)/100)} s
          </Text>
        </View> */}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//backgroundColor: blue,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: height / 30
	},
	containerChronometer: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 12,
			height: 12
		},
		shadowOpacity: 0.6,
		shadowRadius: 6.0,
		elevation: 24,
		zIndex: 1
	},
	//The view that will be moved
	redStick: {
		position: 'absolute',
		height: '37%',
		width: 2,
		backgroundColor: 'red'
	},
	needle: {
		width: SIZE / 2.2,
		height: SIZE / 2.2,
		resizeMode: 'contain',

		position: 'absolute',
		zIndex: 6
	},
	chronometer: {
		height: width * 0.85,
		width: width * 0.85,
		resizeMode: 'contain',
		zIndex: 2,
		position: 'absolute'
	},

	shadowChrono: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 5
	},
	stkChrono: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 400
	},
	area: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 3
	},
	buttons: {
		backgroundColor: '#3B4A6B',
		width: width - 40,
		height: 120,
		marginTop: height / 1.5,
		marginHorizontal: 20,
		borderRadius: 30,
		borderColor: '#B83B5E',
		borderWidth: 7,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 6,
			height: 6
		},
		shadowOpacity: 0.8,
		shadowRadius: 6.0,

		elevation: 24
	}
});
