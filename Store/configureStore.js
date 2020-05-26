// Store/configureStore.js
import { AsyncStorage } from 'react-native';
import { createStore, combineReducers } from 'redux';
import setLanguage from './Reducers/defaultLanguage';
import togglePremium from './Reducers/enablePremium';
import ringBellReducer from './Reducers/ringBellReducer';
import { persistCombineReducers } from 'redux-persist';
//import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
	key: 'root',
	storage: AsyncStorage
};
//for multiple reducers

export default createStore(
	persistCombineReducers(rootPersistConfig, {
		setLanguage,
		togglePremium,
		ringBellReducer
	})
);
