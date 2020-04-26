import { Dimensions, Platform } from 'react-native';
const { height, width } = Dimensions.get('window');
import { green, red, blue, white } from '../colors';

const topHeight = Platform.OS == 'android' ? -65 : -75;

console.log('Height :' + height);

let heightTopBar;
if (height > 800) {
	heightTopBar = height / 7.5;
} else {
	heightTopBar = height / 5.55;
}

export const topTabBar = {
	backgroundColor: '#3B4A6B',
	borderRadius: 100,
	borderWidth: 3,
	borderColor: '#FFFFFF',
	borderBottomWidth: 3,
	borderBottomColor: '#FFFFFF',
	width: width + 25,
	alignSelf: 'center',
	height: heightTopBar,
	position: 'absolute',
	alignContent: 'center',
	justifyContent: 'flex-end',
	top: topHeight,
	marginTop: 10,
	paddingBottom: heightTopBar / 10
};

export const headerContainer = {
	// marginTop: 66,
	alignSelf: 'center',
	flexDirection: 'row',
	justifyContent: 'space-around'
};

export const headerTitle = {
	fontFamily: 'montserrat-extra-bold',
	fontSize: height / 32,
	color: '#FFFFFF'
};

export const bottomTabBar = {
	backgroundColor: '#3B4A6B',
	borderRadius: 100,
	borderWidth: 3,
	borderColor: '#FFFFFF',
	borderTopWidth: 3,
	borderTopColor: '#FFFFFF',
	width: width + 15,
	//left: width-(width-10),
	alignSelf: 'center',
	height: 120,
	position: 'absolute',
	alignContent: 'center',
	justifyContent: 'center',
	bottom: -65
};

let posTop;
let posBottom;
let fontSizeM;
let titleI;
let descI;
let sizeI;
let flexPNoRate;
let flexPAlreadyRate;
if (height > 800) {
	posTop = height / 10;
	posBottom = height / 8;
	fontSizeM = height / 35;
	titleI = height / 30;
	descI = height / 60;
	sizeI = width / 5;
	flexPNoRate = 0.5;
	flexPAlreadyRate = 0.4;
} else {
	posTop = height / 13;
	posBottom = height / 10;
	fontSizeM = height / 32;
	titleI = height / 30;
	sizeI = width / 6;
	descI = height / 50;
	flexPNoRate = 0.65;
	flexPAlreadyRate = 0.53;
}
export const titleItem = titleI;
export const descItem = descI;
export const sizeItem = sizeI;
export const flexParamsNoRate = flexPNoRate;
export const flexParamsAlreadyRate = flexPAlreadyRate;
export const fontSizeMenu = fontSizeM;
export const fontSizeRecordText = fontSizeM * 0.9;
export const containerView = {
	position: 'absolute',
	top: posTop,
	bottom: posBottom
};
