import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FlatListBasic from './FlatList/FlatListBasic';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatListBasic></FlatListBasic>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
