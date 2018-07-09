import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';

export default class DetailsScreen extends React.Component {
    constructor(props) {
          super(props);
	}
	
	componentDidMount() {
	}

    // static navigationOptions = ({ navigation }) => {
    //   return {
    //     title: this.props.navigation.getParam('itemId', 'Problem'),
    //   };
    // };

    render() {
      /* 2. Get the param, provide a fallback value if not available */
      const itemId = this.props.navigation.getParam('itemId');
      console.log('itemId',itemId)
      const otherParam = this.props.navigation.getParam('otherParam', 'some default value');
      
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Details Screen</Text>
          <Text>itemId: {JSON.stringify(itemId)}</Text>
          <Button
            title="Go back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      );
    }
}