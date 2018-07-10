import React from 'react';
import { Button, View } from 'react-native';
import FetchDetails from '../Fetch/FetchDetails';


export default class DetailsScreen extends React.Component {
    constructor(props) {
          super(props);
	}
	
	componentDidMount() {
	}

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('itemId'),
     headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
        headerStyle:{
            backgroundColor:'white',
        },
  });

    render() {
      /* 2. Get the param, provide a fallback value if not available */
      const itemId = this.props.navigation.getParam('itemId');
      const otherParam = this.props.navigation.getParam('otherParam', 'some default value');
      
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <FetchDetails itemId={itemId}></FetchDetails>
          <Button
            title="Go back"
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      );
    }
}