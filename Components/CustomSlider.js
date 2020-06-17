import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import MarkerSlider from './MarkerSlider';
import {white, green, red, blue} from '../assets/colors';

const {width, height} = Dimensions.get('window');

export default class CustomSlider extends Component {
  render() {
    const {defaultValuesSlider, premium} = this.props;
    let min, max;
    if (premium) {
      min = 30;
      max = 240;
    } else {
      min = 105;
      max = 165;
    }
    return (
      <View style={styles.container}>
        <View style={styles.containerSlider}>
          <MultiSlider
            values={defaultValuesSlider}
            sliderLength={width - 150}
            enabledOne={true}
            enabledTwo={true}
            isMarkersSeparated={true}
            touchDimensions={{
              height: 50,
              width: 50,
              borderRadius: 15,
              slipDisplacement: height,
            }}
            min={min}
            max={max}
            step={5}
            markerContainerStyle={{
              position: 'absolute',
              top: -67.5,
              height: 125,
            }}
            selectedStyle={styles.selectedStyle}
            unselectedStyle={styles.unselectedStyle}
            trackStyle={{height: 25, backgroundColor: green}}
            minMarkerOverlapDistance={30}
            onValuesChange={(values) => this.props.toggleSliderValues(values)}
            customMarkerLeft={(e) => {
              return (
                <MarkerSlider
                  value={e.currentValue}
                  premium={premium}
                  index={1}
                  pressed={e.pressed}
                />
              );
            }}
            customMarkerRight={(e) => {
              return (
                <MarkerSlider
                  value={e.currentValue}
                  premium={premium}
                  index={2}
                  pressed={e.pressed}
                />
              );
            }}
            // customMarker={<MarkerSlider premium={premium} index={2} />}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  containerSlider: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  selectedStyle: {
    backgroundColor: green,
    borderRadius: 30,
  },
  unselectedStyle: {
    height: 10,
    alignSelf: 'center',
    backgroundColor: white,
    opacity: 0.7,
    borderRadius: 50,
  },
});
