import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FlatListBasic from './FlatList/FlatListBasic';
import HomeScreen from './Screens/HomeScreen';
import DetailsScreen from './Screens/DetailsScreen';
import { createStackNavigator } from 'react-navigation';

const RootStack = createStackNavigator({
  Home: { screen: HomeScreen },
  Detail: { screen: DetailsScreen },
}, { 
  initialRouteName: 'Home', 
});

class App extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return <RootStack />;
  }
}

export default RootStack;