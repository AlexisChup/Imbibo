import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import FlatListItemAction from './FlatListItemAction';

export default class FlatListRecordActions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			actions: []
		};
		this._changeAction = this._changeAction.bind(this);
		this.rowRefs = [];
	}

	_addAction(a) {
		this.setState((state) => {
			const actions = state.actions.concat(a);

			return {
				actions
			};
		});
	}

	_deleteAction(i) {
		this.setState(
			(state) => {
				const actions = state.actions.filter((item, index) => i !== index);

				return {
					actions
				};
			},
			() => this._updAfterRemove()
		);
	}

	_returnActions() {
		return this.state.actions;
	}

	_changeAction(index, text) {
		this.setState((state) => {
			const actions = state.actions.map((item, i) => {
				if (index === i) {
					return text;
				} else {
					return item;
				}
			});

			return {
				actions
			};
		});
	}

	_updAfterRemove() {
		for (let i = 0; i < this.props.actionsArray.length; i++) {
			this.rowRefs[i]._updateAction();
		}
	}

	_renderFooter() {
		return <View style={{ height: 20 }} />;
	}

	// @params: index. if not null, not disable button -> it's one who play the audio
	disabledButtons(index) {
		for (let i = 0; i < this.props.actionsArray.length; i++) {
			if (!(index === i)) {
				this.rowRefs[i]._disabledButtons();
			} else {
				this.rowRefs[i]._startAnimation();
			}
		}
	}

	// @params: index. if not null, not enable button -> it's all execpt one who play the audio
	enabledButtons(index) {
		for (let i = 0; i < this.props.actionsArray.length; i++) {
			if (!(index === i)) {
				this.rowRefs[i]._enabledButtons();
			}
			this.rowRefs[i]._endAnimation();
		}
	}

	render() {
		this.rowRefs = [];
		return (
			<View style={{ marginTop: 10, flex: 1 }}>
				<FlatList
					ref={(ref) => (this._flatlist = ref)}
					data={this.props.actionsArray}
					extraData={this.state}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => (
						<FlatListItemAction
							index={index}
							item={item}
							playItemRecord={this.props.playItemRecord}
							deleteItemRecord={this.props.deleteItemRecord}
							stopItemRecord={this.props.stopItemRecord}
							changeAction={this._changeAction}
							action={this.state.actions[index]}
							ref={(FlatListItem) => {
								this.rowRefs[index] = FlatListItem;
							}}
						/>
					)}
					ListFooterComponent={this._renderFooter()}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({});
