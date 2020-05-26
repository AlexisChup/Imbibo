import * as actions from '../actionTypes';

const initialState = {
	ringBell: {
		uri: { uri: 'asset:/not_1.mp3' },
		number: 1
	}
};

const handleRingBell = (state = initialState, action) => {
	switch (action.type) {
		case actions.RINGBELL_NO_SOUND:
			return {
				...state,
				ringBell: {
					uri: 0,
					number: 0
				}
			};
		case actions.RINGBELL_1:
			return {
				...state,
				ringBell: {
					uri: { uri: 'asset:/not_1.mp3' },
					number: 1
				}
			};
		case actions.RINGBELL_2:
			return {
				...state,
				ringBell: {
					uri: { uri: 'asset:/not_2.mp3' },
					number: 2
				}
			};
		case actions.RINGBELL_3:
			return {
				...state,
				ringBell: {
					uri: { uri: 'asset:/not_3.mp3' },
					number: 3
				}
			};
		case actions.RINGBELL_4:
			return {
				...state,
				ringBell: {
					uri: { uri: 'asset:/not_4.mp3' },
					number: 4
				}
			};

		default:
			return state;
			break;
	}
};

export default handleRingBell;
