import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import FlatListItem from './FlatListItem';

export default class FlatListRecord extends Component {
	constructor(props) {
		super(props);
		this.state = {
			names: [],
			opacity: 1
		};
		this._changeName = this._changeName.bind(this);
		this.rowRefs = [];
	}

	_addName(n) {
		this.setState(
			(state) => {
				const names = state.names.concat(n);

				return {
					names
				};
			},
			() => {
				this._scrollToEnd();
			}
		);
	}

	_scrollToEnd() {
		setTimeout(() => {
			this._flatlist.scrollToEnd();
		}, 200);
	}

	_deleteName(i) {
		this.setState(
			(state) => {
				const names = state.names.filter((item, index) => i !== index);

				return {
					names
				};
			},
			() => this._updAfterRemove()
		);
	}

	_returnNames() {
		var names = [];
		names = this.state.names;
		for (let i = 0; i < names.length; i++) {
			if (names[i] == '') {
				names[i] = 'JOUEUR ' + (i + 1);
			}
		}
		return names;
	}

	_changeName(index, text) {
		this.setState((state) => {
			const names = state.names.map((item, i) => {
				if (index === i) {
					return text;
				} else {
					return item;
				}
			});

			return {
				names
			};
		});
	}

	_updAfterRemove() {
		for (let i = 0; i < this.props.soundsArray.length; i++) {
			this.rowRefs[i]._updateName();
		}
	}

	_renderFooter() {
		return <View style={{ height: 10 }} />;
	}
	_renderEmptyComponent() {
		return (
			<View>
				<Text />
			</View>
		);
	}

	// @params: index. if not null, not disable button -> it's one who play the audio
	disabledButtons(index) {
		for (let i = 0; i < this.props.soundsArray.length; i++) {
			if (!(index === i)) {
				this.rowRefs[i]._disabledButtons();
			} else {
				this.rowRefs[i]._startAnimation();
			}
		}
	}

	// @params: index. if not null, not enable button -> it's all execpt one who play the audio
	enabledButtons(index) {
		for (let i = 0; i < this.props.soundsArray.length; i++) {
			if (!(index === i)) {
				this.rowRefs[i]._enabledButtons();
			}
			this.rowRefs[i]._endAnimation();
		}
	}

	render() {
		this.rowRefs = [];

		return (
			<View style={{ marginTop: 10, flex: 1, opacity: this.state.opacity }}>
				<FlatList
					ref={(ref) => (this._flatlist = ref)}
					ListEmptyComponent={this._renderEmptyComponent()}
					data={this.props.soundsArray}
					extraData={this.state}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => (
						<FlatListItem
							index={index}
							item={item}
							playItemRecord={this.props.playItemRecord}
							deleteItemRecord={this.props.deleteItemRecord}
							stopItemRecord={this.props.stopItemRecord}
							changeName={this._changeName}
							name={this.state.names[index]}
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
