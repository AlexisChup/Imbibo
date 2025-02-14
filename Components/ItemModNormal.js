import React, {Component, PureComponent} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {blue, red, white} from '../assets/colors';
import * as stl from '../assets/styles/styles';
const {width} = Dimensions.get('window');
import * as text from '../assets/textInGame/listTextMods';
export default class ItemModNormal extends PureComponent {
  constructor(props) {
    super(props);
    this.mod = 0;
    this.state = {
      colorBG: blue,
      colorBorder: red,
      itemScale: new Animated.Value(1),
      marginLeft: new Animated.Value(width * 2),
    };
  }

  _animatedItem = () => {
    const {marginLeft} = this.state;
    Animated.timing(marginLeft, {
      useNativeDriver: false,
      toValue: 0,
      duration: 700,
      easing: Easing.elastic(2),
    }).start();
  };

  _reverseColor() {
    if (this.state.colorBG == blue) {
      this.setState({
        colorBG: red,
        colorBorder: blue,
      });
    } else {
      this.setState({
        colorBG: blue,
        colorBorder: red,
      });
    }
  }

  _handleToggleMod() {
    // get the current mod
    const modActual = this.props.returnMod();

    //change only if it's a different mod
    if (modActual != this.mod) {
      this._reverseColor();
      this.props.toggleItemMod(this.mod);
    }
  }

  _toggleOnPressIn() {
    Animated.spring(this.state.itemScale, {
      toValue: 0.7,
      friction: 15,
      tension: 18,
      useNativeDriver: false,
    }).start();
  }

  _toggleOnPressOut() {
    Animated.spring(this.state.itemScale, {
      toValue: 1,
      friction: 4,
      tension: 20,
      useNativeDriver: false,
    }).start();
  }

  _toggleOnPress() {
    const {premium} = this.props;

    //change mod only if premium
    if (premium) {
      this._handleToggleMod(this.mod);
    }
  }

  render() {
    const {colorBG, colorBorder, marginLeft, itemScale} = this.state;
    const animatedScale = {
      transform: [{scale: itemScale}],
      marginLeft: marginLeft,
    };
    const {language} = this.props;
    let title;
    let description;
    if (language == 'FR') {
      title = text.normalTitleFR;
      description = text.normalFR;
    } else if (language == 'EN') {
      title = text.normalTitleEN;
      description = text.normalEN;
    }

    const bg = white;
    const opa = 1;
    return (
      <TouchableWithoutFeedback
        onPressIn={() => this._toggleOnPressIn()}
        onPressOut={() => this._toggleOnPressOut()}
        onPress={() => this._toggleOnPress()}
        style={stl.touchableItemChoice}>
        <Animated.View
          style={[
            styles.containerGameCard,
            animatedScale,
            {backgroundColor: colorBG, borderColor: colorBorder, opacity: opa},
          ]}>
          <View style={[styles.containerImage]}>
            <Image
              style={styles.logoMod}
              source={require('../assets/mods/mod_normal.png')}
              // onLoadEnd={() => this.props.lauchAnimationItem()}
            />
          </View>
          <View style={styles.containerTexts}>
            <View style={styles.containerTextTitle}>
              <Text style={[styles.textTitle]}>{title}</Text>
            </View>
            <View style={styles.containerTextDesc}>
              <Text style={styles.textDesc}>{description}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  containerGameCard: {
    marginVertical: 5,
    borderRadius: 15,
    width: width - 30,
    borderWidth: 3,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  containerImage: {
    flex: 2,
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerTexts: {
    flex: 5,
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 10,
  },
  containerTextTitle: {},
  containerTextDesc: {},
  textTitle: {
    fontSize: stl.titleItem,
    fontFamily: 'montserrat-bold',
    color: white,
  },
  textDesc: {
    fontSize: stl.descItem,
    color: white,
    fontFamily: 'montserrat-regular',
  },
  logoMod: {
    height: stl.sizeItem,
    width: stl.sizeItem,
    resizeMode: 'contain',
  },
});
