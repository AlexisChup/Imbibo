import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Home from '../Components/Home';
import Choice from '../Components/Choice';
import Game from '../Components/Game';
import End from '../Components/End';

const MainStack = createStackNavigator(
  {
    HomeScreen: {
      screen: Home,
    },
    ChoiceScreen: {
      screen: Choice,
    },
    GameScreen: {
      screen: Game,
    },
    EndScreen: {
      screen: End,
    },
  },
  {
    index: 0,
    headerMode: 'none',

    /*
            PENSER A DECOMMENTER SES LIGNES !!!!!
        */
    defaultNavigationOptions: {
      gestureEnabled: false,
    },
  },
);

const Navigation = createAppContainer(MainStack);

export default Navigation;
