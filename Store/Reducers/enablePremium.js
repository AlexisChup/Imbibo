//reducer to enable Premium mode

//initialize the fisrt state
const initialState = { premium: false };

function togglePremium(state = initialState, action) {
	let nextState;
	switch (action.type) {
		case 'TOGGLE_PREMIUM':
			nextState = {
				...state,
				premium: action.value
			};

			//switch the premium mod
			// const premium = state.premium;
			// //Si l'on est premium on l'enlève
			// if(premium){
			//     nextState = {
			//         ...state,
			//         premium: false
			//     }
			// }
			// //Si l'on est pas premium on le met
			// else if (!premium){
			//     nextState = {
			//         ...state,
			//         premium: true
			//     }
			// }
			return nextState || state;
		default:
			return state;
	}
}

export default togglePremium;
