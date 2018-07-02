import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FlatListBasic from './FlatList/FlatListBasic';
import FetchExample from './Fetch/FetchExample';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FetchExample></FetchExample>
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
