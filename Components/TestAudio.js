import React from 'react';
import { StyleSheet, View, StatusBar, Dimensions, Button, Alert, Text } from 'react-native';
import { Audio } from 'expo-av';
import SplashScreen from 'react-native-splash-screen';
import * as Permissions from 'expo-permissions';

var audioObjectActions = new Audio.Sound();

export default class TestAudio extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	async componentDidMount() {
		SplashScreen.hide();
		await Permissions.askAsync(Permissions.AUDIO_RECORDING);
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

	async _playRandomAction() {
		try {
			audioObjectActions.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdateAction);
			await audioObjectActions.loadAsync({ uri: 'asset:/song_sound.m4a' });
			await audioObjectActions.playAsync();
		} catch (error) {
			Alert.alert('ERROR : ', '' + JSON.stringify(error));
		}
	}

	_onPlaybackStatusUpdateAction = async (playbackStatus) => {
		if (!playbackStatus.isLoaded) {
			// Update your UI for the unloaded state
			if (playbackStatus.error) {
				// console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
				// Send Expo team the error on Slack or the forums so we can help you debug!
			}
		} else {
			if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
			}
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<StatusBar hidden={true} />
				<Text>YUIOP</Text>
				<Button onPress={async () => this._playRandomAction()} title="Play action" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
