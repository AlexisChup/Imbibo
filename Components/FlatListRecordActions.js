import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, Button } from 'react-native'
import FlatListItemAction from './FlatListItemAction'


export default class FlatListRecordActions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            actions: []
        }
        this._changeAction = this._changeAction.bind(this)
        this.rowRefs = [];
    }

    _refTest2(){
        console.log("LES REFS MAscscsRCHENT")
    }

    _addAction(a){
        //console.log("ADD ACTION")
        this.setState(state => {
            const actions = state.actions.concat(a)

            return {
                actions
            }
        })
    }

    _deleteAction(i){
        this.setState(state => {
            const actions = state.actions.filter((item, index) => i !== index)

            return {
                actions
            }
        }, () => this._updAfterRemove())
        
    }
    
    _returnActions(){
        return this.state.actions;
    }

    _changeAction(index, text){
        this.setState(state => {
            const actions = state.actions.map((item, i) => {
                if(index === i) {
                    return text
                }else {
                    return item
                }
            })

            return {
                actions
            }
        })

    }

    _updAfterRemove(){
        for(let i= 0; i<this.props.actionsArray.length ; i++){
            this.rowRefs[i]._updateAction()  
        }


    }

    _renderFooter(){
        return(
            <View style = {{ height: 20 }} >

            </View>
        )
    }

    disabledButtons(){
        for(let i= 0; i<this.props.actionsArray.length ; i++){
            this.rowRefs[i]._disabledButtons()  
        }
    }

    enabledButtons(){
        for(let i= 0; i<this.props.actionsArray.length ; i++){
            this.rowRefs[i]._enabledButtons()  
        } 
    }
    
    render() {
        this.rowRefs = []
        return (
            <View style = {{ marginTop: 10, flex: 1 }} >
                <FlatList
                    ref={(ref) => this._flatlist = ref}
                    data = { this.props.actionsArray }
                    extraData = {this.state}
                    keyExtractor = {(item, index) => index.toString()}
                    renderItem = {({item, index}) => (

                        <FlatListItemAction 
                            index = { index }
                            item = { item }
                            playItemRecord = { this.props.playItemRecord }
                            deleteItemRecord = { this.props.deleteItemRecord }
                            stopItemRecord = { this.props.stopItemRecord }
                            changeAction = { this._changeAction }
                            action = { this.state.actions[index] }
                            ref={(FlatListItem) => { this.rowRefs[index] = FlatListItem; }}
                        />
                    )}
                    ListFooterComponent={this._renderFooter()}
                 />
            </View>
        )
    }
}

const styles = StyleSheet.create({

})


// _displayCardRecord(){
//     const color = this.state.enTrainDeRecord ? "red" : "white";
//     if(this.state.gameStarted){
//       return null
//     }else {
//       return(
//         <View style = {styles.cardRecord}>
//           <Text style = {styles.textTitle}>Record des Joueurs</Text>
//           <View style = {{flexDirection: "row", alignContent: "center", borderColor: "black", borderWidth: 2, alignItems: "center", marginBottom: 10}}>
//             <Button 
//               title = "Record"
//               onPress = {() => this._onRecordPressed()}
//               disabled= {!this.state.soundEnded}
//             />
//             <View style = {[styles.redRecord, {backgroundColor: color, borderWidth: 3, borderColor: "black"}]}></View>
//           </View>
//           {/* <FlatList
//             data = { this.soundsArray }
//             //data = {this.state.soundsArray}
//             keyExtractor = {(item, index) => index.toString()}
//             renderItem = {({item, index}) => (
//               this._displayItemFlatList(item, index)
//             )}
//           /> */}
          
//         </View>
//       )
//     }
  
//   }