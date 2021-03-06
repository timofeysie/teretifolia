import React from 'react';
import { FlatList, ActivityIndicator, Text, View  } from 'react-native';
import { navigation } from 'react-navigation';
import curator from 'art-curator';


export default class FetchExample extends React.Component {

	constructor(props) {
		super(props);
		this.state = { isLoading: true}
	}

  	componentDidMount() {
		let wUrl = curator.createWikiDataUrl();
		return fetch(wUrl)
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
				isLoading: false,
				dataSource: responseJson.results.bindings,
				}, function() {
				});
				const section1Url = curator.createWikiMediaUrl(1);
				return fetch(section1Url)
					.then((response) => response.json())
					.then((responseJson) => {
						console.log('responseJson',responseJson);
						this.setState({
						isLoading: false,
						dataSource: responseJson.results.bindings,
						}, function() {
						});
				});
				const section2Url = curator.createWikiMediaUrl(2);
				const section3Url = curator.createWikiMediaUrl(3);
			})
			.catch((error) => {
				console.error('fetch error',error);
			}
		);
  	}

	render() {
		if (this.state.isLoading) {
			return(
				<View style={{flex: 1, padding: 20}}>
				<ActivityIndicator/>
				</View>
			)
		}

		return(
			<View style={{flex: 1, paddingTop:0}}>
				<FlatList
				data={this.state.dataSource}
				renderItem={({item}) => <Text 
					onPress={() => {
						this.props.navigation.navigate('Details', {
							itemId: item.cognitive_biasLabel.value,
						});
					}}
					>{item.cognitive_biasLabel.value}</Text>}
				keyExtractor={(item, index) => index}
				/>
			</View>
		);
	}
}
