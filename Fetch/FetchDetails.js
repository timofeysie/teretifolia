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
				// let description = curator.parseSingeWikiMediaPage(responseJson);
				var stripedHtml = responseJson.replace(/<[^>]+>/g, '');
				let unescapedHtml = unescape(stripedHtml);
				unescapedHtml = unescapedHtml.replace(/&#91;/g, '[');
				unescapedHtml = unescapedHtml.replace(/&#93;/g, ']');
				unescapedHtml = unescapedHtml.replace(/&#8239;/g, '->');
				unescapedHtml = unescapedHtml.replace(/&#123;/g, '{');
				unescapedHtml = unescapedHtml.replace(/&#125;/g, '}');
				unescapedHtml = unescapedHtml.replace(/&#160;/g, '');
				unescapedHtml = unescapedHtml.replace(/&amp;/g, '&');
				// remove preambles
				const preamble = unescapedHtml.indexOf('This article is about');
				if (preamble !== -1) {
					const endOfSentence = unescapedHtml.indexOf('.');
					unescapedHtml = unescapedHtml.slice(endOfSentence+1, unescapedHtml.length);
				}
				const preamble2 = unescapedHtml.indexOf('For other uses, see');
				if (preamble2 !== -1) {
					const endOfSentence = unescapedHtml.indexOf('.');
					unescapedHtml = unescapedHtml.slice(endOfSentence+1, unescapedHtml.length);
				}

				this.setState({
				isLoading: false,
				dataSource: description,
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
