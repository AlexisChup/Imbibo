import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions} from 'react-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import MarkerSlider from './MarkerSlider'
import { white, green } from '../assets/colors'

const { width, height } = Dimensions.get("window")

export default class CustomSlider extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
        
        }
      }
      
      // _toggleValueChanged(values){
      //   console.log("Values : " + values)
      // }
    
      render(){
        const { defaultValuesSlider, premium } = this.props
        let enabled;
        if(premium){
          enabled = true;
        }else{
          enabled = false;
        }
        return (
          <View style={styles.container}>
            <View style = { styles.containerSlider } >
    
              <MultiSlider
                values = {defaultValuesSlider}
                sliderLength = { width-150 }
                enabledOne = { enabled }
                enabledTwo = { enabled }
                isMarkersSeparated={true}
                touchDimensions ={{height: 50,width: 50,borderRadius: 15,slipDisplacement: height} }
                min = {30}
                max = {240}
                step = {5}
                selectedStyle = { styles.selectedStyle }
                unselectedStyle = { styles.unselectedStyle }
                trackStyle = {{ height: 25 }}
                minMarkerOverlapDistance = {15}
                onValuesChange = {(values)=> this.props.toggleSliderValues(values)}
                customMarkerLeft={(e) => {
                  return (
                    <MarkerSlider
                      value = { e.currentValue }
                      premium = { premium }
                    />
                  )
                  }}
                customMarkerRight={(e) => {
                  return (
                    <MarkerSlider
                      value = { e.currentValue }
                      premium = { premium }
                    />
                  )
                  }}
              />
            </View>
          </View>
        )
    
      }
      
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-end",
        alignSelf: "center"
      },
      containerSlider: {
        alignItems:"center",
        justifyContent: "flex-end",
      },
    selectedStyle: {  
        backgroundColor: green, 
        borderRadius: 30
    },
    unselectedStyle: {
        height: 10, 
        alignSelf: 'center', 
        backgroundColor: white, 
        opacity: 0.7, 
        borderRadius: 50
    }

})
