import { Dimensions, Platform } from 'react-native';
const { height, width } = Dimensions.get('window');
import { green, red, blue, white } from '../colors';
import { getStatusBarHeight } from 'react-native-status-bar-height';

// BODER FOR TOP/BOTTOM BAR
const borderWidth = Platform.select({
	ios: 5,
	android: 0
});

// ALL IN TITLE
const fontSizeHeaderTitle = Platform.select({
	ios: 25,
	android: 23
});

// MARGIN BOTTOM FOR HEADER TOP BAR
const marginHeaderTitle = getStatusBarHeight(true);

// FOR TOP BAR
export const containerHeader = {
	backgroundColor: blue,
	height: 70,
	width: width + 20,
	alignSelf: 'center',
	justifyContent: 'center',
	alignItems: 'center',
	borderWidth: 5,
	borderBottomLeftRadius: width / 2,
	borderBottomRightRadius: width / 2,
	borderColor: white,
	borderTopColor: blue,
	borderTopWidth: borderWidth
};
export const headerTitle = {
	color: white,
	fontSize: fontSizeHeaderTitle,
	paddingBottom: marginHeaderTitle,
	fontFamily: 'montserrat-extra-bold'
};

// FOR BOTTOM BAR
export const containerBottom = {
	backgroundColor: blue,
	height: 70,
	width: width + 20,
	alignSelf: 'center',
	justifyContent: 'center',
	alignItems: 'center',
	borderWidth: 5,
	borderTopLeftRadius: 70,
	borderTopRightRadius: 70,
	borderColor: white,
	borderBottomColor: blue,
	borderBottomWidth: borderWidth,
	justifyContent: 'space-evenly',
	flexDirection: 'row'
};

// FOR CONTAINER VIEW (THE REST)
export const containerView = {
	backgroundColor: green,
	flex: 1
};

// FOR BUTTON BOTTOM BAR
export const buttonBottomTabBar = {
	height: 40,
	width: 40,
	resizeMode: 'contain'
};
export const buttonBottomTabBarImage = {
	height: 65,
	width: 65,
	resizeMode: 'contain'
};

// FOR PREMIUM CONTENT
let fontSizeM;
let sizeI;
let flexPNoRate;
let flexPAlreadyRate;
if (height > 800) {
	fontSizeM = height / 35;
	sizeI = width / 5;
	flexPNoRate = 0.5;
	flexPAlreadyRate = 0.4;
} else {
	fontSizeM = height / 32;
	sizeI = width / 6;
	flexPNoRate = 0.65;
	flexPAlreadyRate = 0.53;
}
// TITLE & DESCRIPTION
export const titleItem = Platform.select({
	ios: 18,
	android: 16
});
export const descItem = Platform.select({
	ios: 13,
	android: 11
});

// SIZE LOGO
export const sizeItem = sizeI;

//  FLEX FOR PARAMS POP UP
export const flexParamsNoRate = flexPNoRate;
export const flexParamsAlreadyRate = flexPAlreadyRate;

export const fontSizeMenu = fontSizeM;
export const fontSizeRecordText = fontSizeM * 0.9;
