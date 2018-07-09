import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';

export default class DetailsScreen extends React.Component {
    constructor(props) {
          super(props);
	}
	
	componentDidMount() {
		console.log('Yes I did!');
	}

    static navigationOptions = ({ navigation }) => {
      return {
        title: navigation.getParam('itemId', 'Problem'),
      };
    };

    render() {
      /* 2. Get the param, provide a fallback value if not available */
      const itemId = navigation.getParam('itemId', 'NO-ID');
      const otherParam = navigation.getParam('otherParam', 'some default value');
      
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Details Screen</Text>
          <Text>itemId: {JSON.stringify(itemId)}</Text>
          <Button
            title="Go to Home"
            onPress={() => this.props.navigation.navigate('Home')}
          />
          <Button
            title="Go back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      );
    }
}