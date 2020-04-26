// reducer use for set the default Language of the App

// initialize the first state 
const initialState = { language: null }


function setLanguage(state = initialState, action) {
    let nextState;
    switch(action.type) {
        case 'SET_FR' :
            //set language in FR
            nextState = { 
                ...state,
                language: action.value
            }
            return nextState || state

        case 'SET_EN' : 
            //set language in EN
            nextState = {
                ...state,
                language: action.value
            }
            return nextState || state

        default :
            return state
    }
}


export default setLanguage