import React from 'react';
import { ActivityIndicator, Text, View, ScrollView  } from 'react-native';
import curator from 'art-curator';


export default class FetchDetails extends React.Component {

	constructor(props) {
		super(props);
		this.state = { isLoading: true}
	}

  	componentDidMount() {
		let wUrl = curator.createSingleWikiMediaPageUrl(this.props.itemId);
		console.log('wUrl',wUrl);
		return fetch(wUrl)
			.then((response) => response.json())
			.then((responseJson) => {
				// get the content, remove the html and convert special characters
				let description = responseJson.parse.text['*'];
				let unescapedHtml = curator.removeHtml(description);
				let descriptions = curator.removeWikiDataPreambles(unescapedHtml);
				this.setState({
				isLoading: false,
				dataSource: descriptions,
				}, function() {
				});
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
			<ScrollView style={{flex: 1, padding:20}}>
                <Text>{this.state.dataSource}</Text>
			</ScrollView>
		);
	}
}
