import React from 'react';
import FetchExample from '../Fetch/FetchExample';
import { StyleSheet, Button, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
	}

	static navigationOptions = {
		title: 'List of Cognitive Bias',
	};

	render() {
		const { navigation } = this.props;
		return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<FetchExample navigation={this.props.navigation}></FetchExample>
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