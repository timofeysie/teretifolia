# React 16 WikiData parsing app

This is the React Native version of a [similar app](https://github.com/timofeysie/loranthifolia) written using the new Ionic 4 alpha 7 framework.  The idea is to create a simple app with the same functionality to compare and contrast the two different approaches to hybrid mobile development.

The basic functionality of the app is a list of items pulled from the Wikipedia and WikiMedia APIs.  Choosing an item goes to a detail page with a description of the item.

We will start with the list first as detailed in [the basics](https://facebook.github.io/react-native/docs/using-a-listview).



## Table of Contents
* [Fixing the details route](#fixing-the-details-route)
* [Navigation](#navigation)
* [Debugging React Native](#debugging-react-native)
* [Using the curator package](#using-the-curator-package)
* [Getting the list](#getting-the-list)
* [Creating the list](#creating-the-list)
* [Creating this project](#creating-this-project)
* [Updating to New Releases](#updating-to-new-releases)
* [Available Scripts](#available-scripts)
  * [npm start](#npm-start)
  * [npm test](#npm-test)
  * [npm run ios](#npm-run-ios)
  * [npm run android](#npm-run-android)
  * [npm run eject](#npm-run-eject)
* [Writing and Running Tests](#writing-and-running-tests)
* [Environment Variables](#environment-variables)
  * [Configuring Packager IP Address](#configuring-packager-ip-address)
* [Customizing App Display Name and Icon](#customizing-app-display-name-and-icon)
* [Sharing and Deployment](#sharing-and-deployment)
  * [Publishing to Expo's React Native Community](#publishing-to-expos-react-native-community)
  * [Building an Expo "standalone" app](#building-an-expo-standalone-app)
  * [Ejecting from Create React Native App](#ejecting-from-create-react-native-app)
    * [Build Dependencies (Xcode & Android Studio)](#build-dependencies-xcode-android-studio)
    * [Should I Use ExpoKit?](#should-i-use-expokit)
* [Troubleshooting](#troubleshooting)
  * [Networking](#networking)
  * [iOS Simulator won't open](#ios-simulator-wont-open)
  * [QR Code does not scan](#qr-code-does-not-scan)


## The details screen

We already have the curator lib creating the url for a single page, and a function to parse the result from an API call.  A remaining issue is where to put the fetch code.  

In the home screen, we have a FetchExample component that does the call and creates the list.  The mixing of concerns makes an Angular developer a little uncomfortable.  But since this is React, probably it's OK to put the Fetch code in the DetailsScreen instead of creating another sub component like FetchExample2.  

There could be a base Fetch class and a base list class that are configurable by a screen to remove this duplication of code, but at this point in the app, it's not a big deal.  If the app were to grow into a monolith, it would certainly be worthwhile to think about a better architectural solution adhering to SOLID principals.

And after the above discussion, suddenly we created the FetchDetails.js file and decided that is more consistent with the app right now.  This class will make the ```curator.createSingleWikiMediaPageUrl()``` call.  But it seems like we may have a problem with the function already:
```
7:17:19 AM: TypeError: TypeError: undefined is not an object (evaluating 'pageName.replace')
...
This error is located at:
    in FetchDetails (at DetailsScreen.js:31)
    in RCTView (at View.js:60)
    in View (at DetailsScreen.js:29)
    in DetailsScreen (at SceneView.js:9)
    ...
This error is located at:
    in NavigationContainer (at registerRootComponent.js:35)
    ...
- node_modules/art-curator/dist/index.js:82:25 in createSingleWikiMediaPageUrl
* Fetch/FetchDetails.js:15:13 in componentDidMount
- node_modules/react-proxy/modules/createPrototypeProxy.js:61:45 in proxiedComponentDidMount
- node_modules/react-native/Libraries/Renderer/ReactNativeRenderer-dev.js:10627:12 in commitLifeCycles
- ... 17 more stack frames from framework internals
```

That's because the itemId prop was not passed down into the details screen.  After that, we get our url and response from the WikiData server:
```
7:48:05 AM: responseJson Object {
7:48:05 AM:   "parse": Object {
7:48:05 AM:     "pageid": 232445,
7:48:05 AM:     "text": Object {
7:48:05 AM:       "*": "<div class=\"mw-parser-output\"><table class=\"vertical-navbox nowraplinks hlist\" style=\"float:right;clear:right;width:22.0em;margin:0 0 1.0em 1.
```

Now we should be able to call ```curator.parseSingeWikiMediaPage(responseJson)``` to get a list of the <p> elements on that page.

But there might be a problem with THAT parse function:
```
7:48:10 AM: fetch error, [TypeError: undefined is not an object (evaluating 'responseJson.results.bindings')]
* Fetch/FetchDetails.js:27:18 in <unknown>
```

We haven't really tested this particular function in the curator lib, but it's worth noting why.  That function relies on creating a DOM element from a string contained in the '*' property shown above.  Then we can use normal document functions to get what we want without parsing the string by hand.  But if that object has different functions depending on the response object, then we have a problem.

Also, since the curator is a node package, it doesn't have a window or document object.  So to test the parse functions we would have to include a large library with many more functions that we will every use, just for a unit test.

What we can do now is use that function in the Ionic app (been a while since doing any work on that) by replacing the original that was refactored out into curator.  This will show any issues that happened during the extraction process.  We were able to get the ```responseJson.results.bindings``` from the WikiData url response in the home screen fetch call, so that one worked out OK.

You can see that function [in the curator index file](https://github.com/timofeysie/curator/blob/master/src/index.js):
```
function parseSingeWikiMediaPage(res) {
	const parse = res.json();
	const content = parse['parse']['text']['*'];
	let one = this.createElementFromHTML(content);
	const desc = one.getElementsByClassName('mw-parser-output')[0].children;
	let descriptions = [];
	for (let i = 0; i < desc.length;i++) {
	    descriptions.push(desc[i].innerText);
	}
	return descriptions;
}
```

First of all we should remove the ```res.json();``` from that.  This is something that can be handled in whatever http utility is used.

After removing that, the error we get is:
```
11:43:58 AM: fetch error, [ReferenceError: Can't find variable: parse]
* Fetch/FetchDetails.js:27:18 in <unknown>
- node_modules/promise/setimmediate/core.js:37:14 in tryCallOne
- node_modules/promise/setimmediate/core.js:123:25 in <unknown>
- ... 10 more stack frames from framework internals
```

Silly error.  Did you spot it up there?  After fixing ggtg athat another error on the next line:
```
12:51:03 PM: fetch error, [TypeError: undefined is not an object (evaluating 'res['parse']['text']')]
```

From the pasted ```responseJson``` above it certainly looks like parse/text is the proper route.  Let's try this inside the React Native app to see how it goes there.  It looks actually like objects not json despite the conversion inside the fetch block.

We will still run into the document issue.  Since React uses a virtual DOM, there's no "document object" in React Native.  So it seems like maybe it is a good idea to use a library inside the curator lib.  Or, just use string methods and scrape the content as was done in an earlier, simpler time.

Maybe we should just add the html content to the render method (React will scrub it, right?) and use the VDOM to show the content we want.  Right now actually the response looks like a redirect page...

And it is.  If we choose attitude polarization:
```
http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=attitude_polarization
```

We get a redirect.  I we replace the _ with a space %20:
```
https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=attitude%20polarization
```

Then we get another redirect:
```
<p>Redirect to:</p><ul class=\"redirectText\"><li><a href=\"/wiki/Group_polarization#Attitude_polarization\"
```

It looks like this bias is a sub-category of group polarization:
```
https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=Group_polarization#Attitude_polarization
```

This will give us the content we are looking for.  It we were to instead choose "fundamental attribution error", then the curator will create a url that leads directly to the desired content.  I'm thinking we need to look for re-directs now and create a new url when they are found.  I'm worried the hole goes a lot deeper than this however.

The simplest way forward right now is a regex: 
```
description.replace(/<[^>]+>/g, '');
```

This will get us 90% of the way to where we want to be.  Or so some of us here thought until we tried the "Dunning-Kruger effect":
```
2:13:31 PM: fetch error, [TypeError: undefined is not an object (evaluating 'responseJson.parse.text')]
```

The url created for us by the curator:
```
http://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=dunning–kruger_effect
```

Returns the following:
```
{"error":{"code":"missingtitle","info":"The page you specified doesn't exist.","*":"See https://en.wikipedia.org/w/api.php for API usage. Subscribe to the mediawiki-api-announce mailing list at &lt;https://lists.wikimedia.org/mailman/listinfo/mediawiki-api-announce&gt; for notice of API deprecations and breaking changes."},"servedby":"mw1339"}
```

Actually, if we use capitals with the proper name there, we will get the content:
https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=Dunning%E2%80%93Kruger_effect

So another thing to worry about, the titles are case sensitive.

There are also a lot of characters that slip by our regex.
```
&#91; = [
&#93; = ]
&#123; = {
&#125; } (on attitude polarization)
&#160; = CR?
&#8239; = link arrow
```

Without doing too much work, it is easy to just replace these characters each by hand like this:
```
unescapedHtml = unescapedHtml.replace(/&#91;/g, '[');
```

However, since we won't be reviewing each page to scan for unconverted characters, it would be better to automate this process and convert them all automatically.

So stay tuned for that.  For now the WikiMedia (aka Wikipedia content) items and their descriptions needs to be added to the main list in some sort of fashion.  Since this will be over 200, it would be nice to sort by category or alphabetize.  We also have to replace the functions now in curator that were refactored out and are now used in this app.


## Navigation

There are various choices for navigation, but the basic example given in [the docs](https://facebook.github.io/react-native/docs/navigation.html) is for react-navigation:
```
$ npm install --save react-navigation
```

After a brief example which includes using the App.js file, the reader is then thrown [this link](https://reactnavigation.org/docs/en/getting-started.html) for further reading.

This article talks about rendering the ```<RootStack />``` element in the App.js file.
Then we can use this:
```
const RootStack = createStackNavigator({
  Home: HomeScreen
});
```

The screens were put in a directory called Screens, but not it's unclear how to get the navigation to work in the child components.  The example shows everything in one file, which, I'm sorry, but is not going to happen on this project.  I know this is one way to keep example code simple, let's adhere to the SOLID principal of Single Responsibility

Trying this our in the HomeScreen set the title in the header:
```
static navigationOptions = {
		title: 'List of Cognitive Bias',
};
```

That was an unexpected way of learning it.  It was the next part of the navigation tutorial.  We were thinking of putting the title of the passed in bias in the header on the details page but because navigationOptions is a static property, it does not refer to an instance of the component so no props are available.

Apparently we will have to make navigationOptions a function then React Navigation will call it with an object containing ```{ navigation, navigationOptions, screenProps }```.

But that doesn't help us solve the current problem when trying to navigate to the detail screen:
```
undefined is not an object evaluating '_this3.props.navigation.navigate')
onPress
FetchExample.js:51:27
```

```
	render() {
		const { navigation } = this.props;
    // or 
    const { navigation } = this.props.navigation;
    // or 
    const { navigate } = this.props.navigation;
```

The first one works while the other two are syntax errors, but we still get the onPress error noted above.  Also tried putting ```createStackNavigator``` in a separate file and exporting the const from that, but then the error is: ``` The component for route 'Home' must be a React component.```

Well, HomeScreen is a component, and it's configured like name: className.  Even making the name the same as the class name doesn't fix the problem.  Unfortunately this means more reading.  What a drag!  Pirates are on TV tonight...

So during ads in between pirates I did quite a bit of Stack Overflowing. 
Instead of exporting the App class, export the ```export default RootStack;``` which remember is the ```const RootStack = createStackNavigator```.

Then use ```navigation.navigate('DetailsScreen'``` and I suppose this is necessary in the HomeScreen render function: ```<FetchExample navigation={this.props.navigation}></FetchExample>```.

Then go back to this ```this.props.navigation.navigate('DetailsScreen'```

And the error is gone but there is not navigation.  So, well, that's not very savvy.

Despite the pirates I'm going to sleep.

The next morning when trying to get back to solving the failing navigation problem, despite having installed Watchman, or because of it, when opening a fresh terminal with the 'Homebrew' theme (which is now the default React teminal theme), running ```npm start``` fails with the following output:
```
7:38:53 AM: Starting packager...
***ERROR STARTING PACKAGER***
Starting React Native packager...
Scanning folders for symlinks in /Users/tim/repos/loranthifolia-teretifolia-curator/teretifolia/node_modules (17ms)
Loading dependency graph.
dyld: Library not loaded: /usr/local/opt/pcre/lib/libpcre.1.dylib
  Referenced from: /usr/local/Cellar/watchman/4.4.0/libexec/bin/watchman
  Reason: image not found
***ERROR STARTING PACKAGER***
Watchman:  watchman --no-pretty get-sockname returned with exit code=null, signal=SIGTRAP, stderr= dyld: Library not loaded: /usr/local/opt/pcre/lib/libpcre.1.dylib
  Referenced from: /usr/local/Cellar/watchman/4.4.0/libexec/bin/watchman
  Reason: image not found
```

Doing this Google search:
```
stackoverflow Watchman: watchman --no-pretty get-sockname returned with exit code=null
```

[First link](https://stackoverflow.com/questions/50228034/watchman-watchman-no-pretty-get-sockname-returned-with-exit-code-null-signal) two months old with no answer.  Someone in the comments suggested installing watchman, to which the poster replied they had.
[Second link](https://stackoverflow.com/questions/35006695/unable-to-run-npm-start-for-react-native-project/35018487) the first answer suggests re-installing watchman.

Following the advice from the second link:
```
$ npm r -g watchman 
QuinquenniumF:teretifolia tim$ brew update && brew upgrade
/usr/local/Library/Homebrew/cmd/update.sh: line 13: /usr/local/Library/ENV/scm/git: No such file or directory
/usr/local/Library/Homebrew/cmd/update.sh: line 13: /usr/local/Library/ENV/scm/git: No such file or directory
/usr/local/Library/Homebrew/cmd/update.sh: line 13: /usr/local/Library/ENV/scm/git: No such file or directory
/usr/local/Library/Homebrew/cmd/update.sh: line 13: /usr/local/Library/ENV/scm/git: No such file or directory
/usr/local/Library/Homebrew/cmd/update.sh: line 13: /usr/local/Library/ENV/scm/git: No such file or directory
==> Downloading https://homebrew.bintray.com/bottles-portable-ruby/portable-ruby-2.3.3_2.leopard_64.bottle.tar.gz
######################################################################## 100.0%
==> Pouring portable-ruby-2.3.3_2.leopard_64.bottle.tar.gz
==> Homebrew has enabled anonymous aggregate user behaviour analytics.
Read the analytics documentation (and how to opt-out) here:
  https://docs.brew.sh/Analytics
Error: update-report should not be called directly!
```

Not sure if that's a show stopper, so moving on with the instructions:
```
brew install watchman
...
Homebrew no longer needs to have ownership of /usr/local. If you wish you can
return /usr/local to its default ownership with:
  sudo chown root:wheel /usr/local
Error: watchman 4.4.0 is already installed
To upgrade to 4.9.0, run `brew upgrade watchman`
```

Again, not sure if that's a problem, so trying ```npm start``` again.

No dice.  Still get the "image not found" error.  Great.  Keep looking.

[Third link](https://github.com/facebook/react-native/issues/4580) is a GitHub issue.  That's not good.  StackOverflow are focused on good answers and positive feedback.  GitHub issues however are a free-for-all unmediated sprawl off suggestions and people throwing their extra errors and problems in.  This means a great deal more sifting.

The first answer is from the official Facebook account:
```
facebook-github-bot commented on Dec 6, 2015
Hey adamski, thanks for reporting this issue!

React Native, as you've probably heard, is getting really popular and truth is we're getting a bit overwhelmed by the activity surrounding it. There are just too many issues for us to manage properly.

If this is a feature request or a bug that you would like to be fixed by the team, please report it on Product Pains. It has a ranking feature that lets us focus on the most important issues the community is experiencing.
If you don't know how to do something or not sure whether some behavior is expected or a bug, please ask on StackOverflow with the tag react-native or for more real time interactions, ask on Discord in the #react-native channel.
We welcome clear issues and PRs that are ready for in-depth discussion; thank you for your contributions!
```

Thanks bot!  You're a great help!  The next response is to open an issue on the Watchman GitHub, then close the issue.  No link to that though, so it's back to Google for us.

[Link four](https://github.com/facebook/react-native/issues/7006)

Another GitHub with the poster basically talking to themselves and no help.  They eventually solve their issue, but it seems different from the problem we're having.

Went back to the second link and realized there was some more advice if the first part didn't work, so trying that:
```
brew reinstall libtool --universal && brew unlink libtool && brew link
  libtool
```

 But ```npm start``` still fails with the same error.  The last piece of advice is to run ```brew uninstall libtool``` and try the above again.  That ends with this error:
```
Error: Invalid usage: This command requires a keg argument
```

Same error when starting the project.  So for now, going to try going back to the pre-watchman solution:
```
$ sudo sysctl -w kern.maxfiles=5242880
$ sudo sysctl -w kern.maxfilesperproc=524288
```

However, we have real problems now as this does not help the packager error.  ```npm start``` still hangs with that error.  Since running out of stack overflow questions with the initial search, starting a search for the line ```dyld: Library not loaded: /usr/local/opt/pcre/lib/libpcre.1.dylib```

```
brew reinstall libtool --universal && brew unlink libtool && brew link libtool
...
Unlinking /usr/local/Cellar/libtool/2.4.6_1... 20 symlinks removed
Linking /usr/local/Cellar/libtool/2.4.6_1... 20 symlinks created
```

No errors or warnings on that one.  This is promising.

While searching for more answers, came acroos [this one](https://github.com/facebook/react-native/issues/6729) in which the facebook-bot get's pretty heavy handed:
```
facebook-github-bot added the For Stack Overflow  label on Mar 31, 2016
@facebook-github-bot facebook-github-bot closed this on Mar 31, 2016
@facebook-github-bot facebook-github-bot added the Ran Commands  label on Mar 31, 2016
@jolt-temporary commented on Jun 23, 2016
Doesn't this seem like a bug though? I'm getting it too.
@facebook facebook locked as resolved and limited conversation to collaborators on May 25
```

Debate is not welcome here.  If I am unable to use the React Native packager, I would also say that this is React Native's problem and should be addressed by the team, not stifled.  Ionic has a similar bot, a.k.a. Justin Willis, but I have never seen an issue locked and comments locked like this before.

Finding anymore help for this problem is getting more and more difficult.  It looks like there are two issues, both Watchman related:
```
dyld: Library not loaded: /usr/local/opt/pcre/lib/libpcre.1.dylib
```
and
```
Watchman:  watchman --no-pretty get-sockname returned with exit code=null, ...
```

Will keep you all posted.

Right after that last commit which added the router work from the last few days, this was the solution to the issue.
```
brew upgrade watchman
==> make install
Error: The `brew link` step did not complete successfully
The formula built, but is not symlinked into /usr/local
...
Error: watchman 4.4.0 is already installed
To upgrade to 4.9.0, run `brew upgrade watchman`
QuinquenniumF:teretifolia tim$ brew upgrade watchman
```

So since it recommended upgrade, tried that.  It seriously took about an hour to complete on this slow home wireless broadband.  But then, starting the app!  It was a close call, but after the errors we got the QR code and the app was back up again:
```
$ npm start

> AwesomeProject@0.1.0 start /Users/tim/repos/loranthifolia-teretifolia-curator/teretifolia
> react-native-scripts start

4:57:40 PM: Starting packager...
***ERROR STARTING PACKAGER***
Starting React Native packager...
Scanning folders for symlinks in /Users/tim/repos/loranthifolia-teretifolia-curator/teretifolia/node_modules (15ms)
Loading dependency graph.
2018-07-09T16:58:58,639: [0x7fff761d8300] dirfd(/usr/local/var/run/watchman/tim-state): File exists
2018-07-09T16:58:58,640: [0x7fff761d8300] dirfd(/usr/local/var/run/watchman/tim-state): File exists
***ERROR STARTING PACKAGER***
2018-07-09T16:58:58,640: [0x7fff761d8300] dirfd(/usr/local/var/run/watchman/tim-state): File exists
***ERROR STARTING PACKAGER***
2018-07-09T16:59:18,403: [0x7fff761d8300] dirfd(/usr/local/var/run/watchman/tim-state): File exists
***ERROR STARTING PACKAGER***
2018-07-09T16:59:18,404: [0x7fff761d8300] dirfd(/usr/local/var/run/watchman/tim-state): File exists
2018-07-09T16:59:18,404: [0x7fff761d8300] dirfd(/usr/local/var/run/watchman/tim-state): File exists
Packager started!
```

All's well that ends well I suppose.  Still, if React Native depends on these tools, it has to deal with problems that arise in the tooling.

Anyhow, the problem with the app not navigating to the next screen was a difference in names between 'Detail' and 'Details'.  Because the screen filename was call Details, we went with that all over and now we get our if parameter and we can move on to getting the content for that item via an API called from a url created by the curator package and parsing it with another function.



## Debugging React Native

After installing the VSCome [React Native Tools](https://github.com/Microsoft/vscode-react-native) plugin, out of the box it gave me this error:
```
Exception has occurred: Error
SyntaxError: Unexpected token import
/Users/tim/repos/loranthifolia-teretifolia-curator/teretifolia/node_modules/expo/src/Expo.js:2
import './environment/validate';
^^^^^^
SyntaxError: Unexpected token import
```

We will not be friends if all this tool does is cough at code in the node_modules directory.  Then saw a warning in the Debug console that Node.js version 6.9.2 was detected.  Right.  I had switched to that version due to a problem with the Commitizen tool used by the Curator npm library when trying to publish a new version of the lib to npm.  So, did the old ```$ nvm use 8``` and another ```npm start``` and lets see how the debugging goes now.

Our console log finally comes out with the JSON version of the SPARQL API call response:
```
12:45:46: response.json Object {
12:45:46:   "head": Object {
12:45:46:     "vars": Array [
12:45:46:       "cognitive_bias",
12:45:46:       "cognitive_biasLabel",
12:45:46:       "cognitive_biasDescription",
12:45:46:     ],
12:45:46:   },
12:45:46:   "results": Object {
12:45:46:     "bindings": Array [
12:45:46:       Object {
12:45:46:         "cognitive_bias": Object {
12:45:46:           "type": "uri",
12:45:46:           "value": "http://www.wikidata.org/entity/Q18570",
12:45:46:         },
12:45:46:         "cognitive_biasDescription": Object {
12:45:46:           "type": "literal",
12:45:46:           "value": "social phenomenon",
12:45:46:           "xml:lang": "en",
12:45:46:         },
12:45:46:         "cognitive_biasLabel": Object {
12:45:46:           "type": "literal",
12:45:46:           "value": "Hawthorne effect",
12:45:46:           "xml:lang": "en",
12:45:46:         },
12:45:46:       },
```

The error holding us up is:
```
12:45:47: TypeError: undefined is not an object (evaluating 'item.cognitive_biasDescription.value')

This error is located at:
    in CellRenderer (at VirtualizedList.js:670)
```

One has to search through the stack trace to find the line in the project souce responsible:
```
This error is located at:
    in CellRenderer (at VirtualizedList.js:670)
    in RCTView (at View.js:60)
    in View (at ScrollView.js:791)
    in RCTScrollView (at ScrollView.js:887)
    in ScrollView (at VirtualizedList.js:1024)
    in VirtualizedList (at FlatList.js:644)
    in FlatList (at FetchExample.js:40)
    in RCTView (at View.js:60)
    in View (at FetchExample.js:39)
    in FetchExample (at App.js:10)
    in RCTView (at View.js:60)
    in View (at App.js:9)
    in App (at registerRootComponent.js:35)
    in RootErrorBoundary (at registerRootComponent.js:34)
    in ExpoRootComponent (at renderApplication.js:33)
    in RCTView (at View.js:60)
    in View (at AppContainer.js:102)
    in RCTView (at View.js:60)
    in View (at AppContainer.js:122)
    in AppContainer (at renderApplication.js:32)
* Fetch/FetchExample.js:43:44 in renderItem
- node_modules/react-native/Libraries/Lists/FlatList.js:623:24 in _renderItem
```

Can you find Waldo?  Waldo is right in the middle there:
```
in View (at FetchExample.js:39)
```

That's the beginning of the <View> element in the render function.
Some (OK many) items don't have descriptions.  So this ```item.cognitive_biasDescription.value```
was causing the error.  

What is the equivalent of *ngIf in React?  Well, it's not that simple.  Any tag you put in the render statement get's instantiated. *ngIf in angular does not instantiate the component that it is attached to. In React if you use an if statement within the return statement then it will still instantiate the component even though it isn't displayed. To achieve a true *ngIf type behavior in React you have to create a variable that holds the conditional component outside of the return statement.

But, we don't really want to show the description there anyhow.  And, since there are so few descriptions available on WikiData, we need to also parse Wikipedia's WikiMedia API call result to get a more complete list of cognitive bias and their brief descriptions.  As yet we haven't written this Map merge feature.  That will come soon.  
We can add routing and a call to the; Wikipedia page description when an item in our current list is called.  Then, functionality-wise, the React Native app will be on par with the Ionic 4 app.

For now, the React Native Tool for debugging is still stuck on Node.js v6.9.2.  Someone will have to figure out how to make VSCode us a more recent version since it's not picking up the changes nvm makes in the terminal.


## Using the curator package

After refactoring the parts needed to create the urls and parse the responses for the WikiData and WikiMedia API calls into an npm library called art-curator, this is how it's used:
```
import curator from 'art-curator';
```

To then get the SPARQL url to get the base list of cognitive bias, we call this function:
```
let wUrl = curator.createWikiDataUrl();
```

That url looks like this:
```
https://query.wikidata.org/sparql?format=json&query=%0A%20%20%20%20%20%20%20%20SELECT%20%3Fcognitive_bias%20%3Fcognitive_biasLabel%20%3Fcognitive_biasDescription%20WHERE%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20SERVICE%20wikibase%3Alabel%20%7B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cen%22.%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Fcognitive_bias%20wdt%3AP31%20wd%3AQ1127759
```

Then we use Fetch to call that url and then put the result in the list.

To test the app, this had to be done again:
```
$ sudo sysctl -w kern.maxfiles=5242880
$ sudo sysctl -w kern.maxfilesperproc=524288
```

I assumed that was a one time change, but apparently not.  That's one more reason to install Watchman.

After a while and the app was finally running we get this response:
```
6:06:51 PM: wUrl Promise {
6:06:51 PM:   "_40": 0,
6:06:51 PM:   "_55": null,
6:06:51 PM:   "_65": 0,
6:06:51 PM:   "_72": null,
6:06:51 PM: }
```

Maybe it's having a problem with the https?

9:13:58 PM: Starting packager...
9:16, the app loads in the device.
Made some more changes to the code to show the list from the result even though not sure if the result is being parsed the same was as the rxjs behaviour subject is in the Ionic version.
Finally, at 9:26 saw a blank screen, then a red screen with an error:
```
9:26:40 PM: TypeError: undefined is not an object (evaluating 'item.cognitive_biasDescription.value')
```
There are eight of those each with a long stack trace.  Then at the end we get this also:
```
9:26:42 PM: [Unhandled promise rejection: TypeError: undefined is not an object (evaluating 'response1.results.bindings')]
* Fetch/FetchExample.js:17:39 in <unknown>
- node_modules/promise/setimmediate/core.js:37:14 in tryCallOne
- node_modules/promise/setimmediate/core.js:123:25 in <unknown>
- ... 10 more stack frames from framework internals
```

The result object looks like this:
```
Response {
9:26:39 PM:   "_bodyBlob": Blob {
9:26:39 PM:     "_data": Object {
9:26:39 PM:       "blobId": "7a2fc193-6c9a-4f50-be57-352da8aa336b",
9:26:39 PM:       "offset": 0,
9:26:39 PM:       "size": 28461,
9:26:39 PM:     },
9:26:39 PM:   },
9:26:39 PM:   "_bodyInit": Blob {
9:26:39 PM:     "_data": Object {
9:26:39 PM:       "blobId": "7a2fc193-6c9a-4f50-be57-352da8aa336b",
9:26:39 PM:       "offset": 0,
9:26:39 PM:       "size": 28461,
9:26:39 PM:     },
9:26:39 PM:   },
9:26:39 PM:   "headers": Headers {
9:26:39 PM:     "map": Object {
9:26:39 PM:       "accept-ranges": Array [
9:26:39 PM:         "bytes",
9:26:39 PM:       ],
9:26:39 PM:       "access-control-allow-origin": Array [
9:26:39 PM:         "*",
9:26:39 PM:       ],
9:26:39 PM:       "age": Array [
9:26:39 PM:         "0",
9:26:39 PM:       ],
9:26:39 PM:       "cache-control": Array [
9:26:39 PM:         "public, max-age=300",
9:26:39 PM:       ],
9:26:39 PM:       "content-type": Array [
9:26:40 PM:         "application/sparql-results+json",
9:26:40 PM:       ],
9:26:40 PM:       "date": Array [
9:26:40 PM:         "Thu, 05 Jul 2018 11:25:45 GMT",
9:26:40 PM:       ],
9:26:40 PM:       "server": Array [
9:26:40 PM:         "nginx/1.13.6",
9:26:40 PM:       ],
9:26:40 PM:       "strict-transport-security": Array [
9:26:40 PM:         "max-age=106384710; includeSubDomains; preload",
9:26:40 PM:       ],
9:26:40 PM:       "vary": Array [
9:26:40 PM:         "Accept, Accept-Encoding",
9:26:40 PM:       ],
9:26:40 PM:       "via": Array [
9:26:40 PM:         "1.1 varnish (Varnish/5.1), 1.1 varnish (Varnish/5.1)",
9:26:40 PM:       ],
9:26:40 PM:       "x-analytics": Array [
9:26:40 PM:         "WMF-Last-Access=05-Jul-2018;WMF-Last-Access-Global=05-Jul-2018;https=1",
9:26:40 PM:       ],
9:26:40 PM:       "x-cache": Array [
9:26:40 PM:         "cp2018 miss, cp2006 miss",
9:26:40 PM:       ],
9:26:40 PM:       "x-cache-status": Array [
9:26:40 PM:         "miss",
9:26:40 PM:       ],
9:26:40 PM:       "x-client-ip": Array [
9:26:40 PM:         "49.195.40.73",
9:26:40 PM:       ],
9:26:40 PM:       "x-served-by": Array [
9:26:40 PM:         "wdqs2001",
9:26:40 PM:       ],
9:26:40 PM:       "x-varnish": Array [
9:26:40 PM:         "239826340, 50947718",
9:26:40 PM:       ],
9:26:40 PM:     },
9:26:40 PM:   },
9:26:40 PM:   "ok": true,
9:26:40 PM:   "status": 200,
9:26:40 PM:   "statusText": undefined,
9:26:40 PM:   "type": "default",
9:26:40 PM:   "url": "https://query.wikidata.org/sparql?format=json&query=%0A%20%20%20%20%20%20%20%20SELECT%20%3Fcognitive_bias%20%3Fcognitive_biasLabel%20%3Fcognitive_biasDescription%20WHERE%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20SERVICE%20wikibase%3Alabel%20%7B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cen%22.%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Fcognitive_bias%20wdt%3AP31%20wd%3AQ1127759.%0A%20%20%20%20%20%20%20%20%7D%0A%09%09LIMIT%201000",
9:26:40 PM: }
```

Lets look at the result from the Ionic app.  Ionic serve run at 9:33.
9:35 the list of bias are in the browser.

It might be helpful to look at what is happening in the Ionic app's http call to compare with the Fetch we're doing in this React native app.

```
this.http.get(url).map((res: any) => {
    return res.json();
  }).subscribe ((data: any) => {
    this.myData.next(data.results.bindings);
  },(err: any) => console.error("loadAllPackages: ERROR"),
    () => {
      console.log("loadAllPackages: always")
    }
);
```

The res object looks like this:
```
Response {_body: "head": { vars": [ "cognitive_bias",  "cognitive_biasLabel", "cognitive_biasDescription" ]↵  },↵  "results" : {↵    "bindings" : [ {↵      "cognitive_bias" : {↵        "type" : "uri",↵        "value" : "http://www.wikidata.org/entity/Q18570"↵      },↵      "cognitive_biasLabel" : {↵        "xml:lang" : "en",↵        "type" : "literal",↵        "value" : "Hawthorne effect"↵      },↵      "cognitive_biasDescription" : {↵        "xml:lang" : "en",↵        "type" : "literal",↵        "value" : "social phenomenon"↵      }↵    }, {↵   ]}}

The object also has the standard headers with url and status info.  The data object is little different in that now it's a JSON version which is a JSON object with two parameters: ```{head: {...}, results: {...}}```.

The myData object is a Behavior Subject using an interface to label and description field names. The results.bindings value is an array of 90 objects that look like this:
```
cognitive_bias: {type: "uri", value: "http://www.wikidata.org/entity/Q18570"}
cognitive_biasDescription: {xml:lang: "en", type: "literal", value: "social phenomenon"}
cognitive_biasLabel: {xml:lang: "en", type: "literal", value: "Hawthorne effect"}
```

These are the things that can be shown in the template.

However, we're getting a blank screen now and now console log out.  That's probably our fault for relying on dumb console loges.  There must be some good debugging tools out there for React Native, right?

There might also be a problem with the way we are using Fetch.  If the API we're working with is returning HTML, instead of returning resp.json() return resp.text() like this:
```
fetch(url).then((resp)=>{ return resp.text() }).then((text)=>{ console.log(text) })
```



## Getting the list

We will be getting the list from a WikiData API call first.  We will also get a larger list from Wikipedia and merge them all together.  But first things first.  We will be starting with [this page](https://facebook.github.io/react-native/docs/network).

Using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) comes with two basic options for asynchronous work: a Promise or async/await.  We used a Promise for the Ionic app so lets start with that first.

In the example code, the http call code is in the same file as the rendered flat list template.  I will go with that for now, but it doesn't seem like a good idea.  After the basics of this app are done, it is intended to move the parsing code into a third party lib and use it in both the Ionic and React Native app to compare and contrast how smoothing that goes in each project.

So for now, we will go with the basics.

Getting no changes after adding the Fetch class was a little frustrating.  Restarting the build and adding a console log comment made it compile and then we saw the red screen on the device with an error which was lost when we grabbed it (it's a touch screen!  another advantage to being able to debug in a browser safe from touching) the error went away and there was an organge strip at the bottom that said: 
```Warning: Failed child context type: Invalid child context 'virtualizedCell.cellKey' of type 'n```
And still no output in the temrinal to show any problems except the comment that was added.

Re-scanning the QR code again shown the red screen error message again:
```
Cannot add a child that doesn't have a YogaNode to a parent without a measure function! (Trying ot add a 'RCTRawText[text:jij] to a 'RCTView')
```

That was something we put in the render html to try and get the source to reload.  After removing that we have the result from the http call, but the orange warning message on the bottom of the screen was still there.  I figured out how to show the whole message and then reduce it again.

```
22:50:05: Warning: Failed child context type: Invalid child context `virtualizedCell.cellKey` of type `number` supplied to `CellRenderer`, expected `string`.
- node_modules/prop-types/checkPropTypes.js:19:20 in printWarning
...
```

Can deal with that a little later.  One thing we haven't put in the Ionic app yet is a loader.  In our Fetch example, it's done like this:
```
if (this.state.isLoading){ return(<ActivityIndicator/>) }
```

Ionic might be a little more hands on, but not much more.

We're think now where to put the logic to assemble the url.  It should probably be in the state and lifted up to the top level.  We can work on that next.


## Creating the list

We'll start off with the FlatList which only renders elements that are currently showing on the screen, not all the elements at once.  Seems like a good start.

After creating the basic flat list, forgot to export the default class and saw the error come up on the device:
```
21:09:48: Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
Check your code at App.js:9.
    in App (at registerRootComponent.js:35)
```

There seems to be a long delay from the error showing up on the device and the console log showing the same thing.   Sometimes the lag is shorter.

Anyhow, the error was due to a type, which fixed, changed the error to this:
```
Invariant Violation: Element type is invalid: expected a string
```

The solution from [this post](https://stackoverflow.com/questions/34130539/uncaught-error-invariant-violation-element-type-is-invalid-expected-a-string) showed a slight change in import style.

In the App.js file, we went from this:
```
import { FlatListBasic } from './FlatList/FlatListBasic';
```

to this:
```
import FlatListBasic from './FlatList/FlatListBasic';
```

The difference is { MyComponent } imports the export 'MyComponent' from the file but the other one imports the default export from the file.  Now we have our basic list.

There is no header for the page yet which we will need.  But next, lets get the list from WikiData.



## Creating this project

Starting the project with the Create React Native App CLI:
```
$ create-react-native-app AwesomeProject
Creating a new React Native app in /Users/tim/react/AwesomeProject.

Using package manager as npm with npm interface.
Installing packages. This might take a couple minutes.
Installing react-native-scripts...

npm WARN deprecated socks@1.1.10: If using 2.x branch, please upgrade to at least 2.1.6 to avoid a serious bug with socket data flow and an import issue introduced in 2.1.0
WARN notice [SECURITY] hoek has the following vulnerability: 1 moderate. Go here for more details: https://nodesecurity.io/advisories?search=hoek&version=2.16.3 - Run `npm i npm@latest -g` to upgrade your npm version, and then `npm audit` to get more info.
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-darwin-ia32@2.2.8 (node_modules/@expo/ngrok-bin-darwin-ia32):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-darwin-ia32@2.2.8: wanted {"os":"darwin","arch":"ia32"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-freebsd-ia32@2.2.8 (node_modules/@expo/ngrok-bin-freebsd-ia32):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-freebsd-ia32@2.2.8: wanted {"os":"freebsd","arch":"ia32"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-linux-arm64@2.2.8 (node_modules/@expo/ngrok-bin-linux-arm64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-linux-arm64@2.2.8: wanted {"os":"linux","arch":"arm64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-freebsd-x64@2.2.8 (node_modules/@expo/ngrok-bin-freebsd-x64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-freebsd-x64@2.2.8: wanted {"os":"freebsd","arch":"x64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-sunos-x64@2.2.8 (node_modules/@expo/ngrok-bin-sunos-x64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-sunos-x64@2.2.8: wanted {"os":"sunos","arch":"x64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-linux-ia32@2.2.8 (node_modules/@expo/ngrok-bin-linux-ia32):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-linux-ia32@2.2.8: wanted {"os":"linux","arch":"ia32"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-linux-arm@2.2.8 (node_modules/@expo/ngrok-bin-linux-arm):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-linux-arm@2.2.8: wanted {"os":"linux","arch":"arm"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-linux-x64@2.2.8 (node_modules/@expo/ngrok-bin-linux-x64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-linux-x64@2.2.8: wanted {"os":"linux","arch":"x64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-win32-ia32@2.2.8-beta.1 (node_modules/@expo/ngrok-bin-win32-ia32):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-win32-ia32@2.2.8-beta.1: wanted {"os":"win32","arch":"ia32"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-win32-x64@2.2.8-beta.1 (node_modules/@expo/ngrok-bin-win32-x64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-win32-x64@2.2.8-beta.1: wanted {"os":"win32","arch":"x64"} (current: {"os":"darwin","arch":"x64"})

+ react-native-scripts@1.14.0
added 442 packages in 111.759s
Installing dependencies using npm...

npm WARN deprecated istanbul-lib-hook@1.2.1: 1.2.0 should have been a major version bump
WARN notice [SECURITY] lodash has the following vulnerability: 1 low. Go here for more details: https://nodesecurity.io/advisories?search=lodash&version=4.16.2 - Run `npm i npm@latest -g` to upgrade your npm version, and then `npm audit` to get more info.
WARN notice [SECURITY] ws has the following vulnerability: 1 high. Go here for more details: https://nodesecurity.io/advisories?search=ws&version=2.3.1 - Run `npm i npm@latest -g` to upgrade your npm version, and then `npm audit` to get more info.
WARN notice [SECURITY] lodash has the following vulnerability: 1 low. Go here for more details: https://nodesecurity.io/advisories?search=lodash&version=3.10.1 - Run `npm i npm@latest -g` to upgrade your npm version, and then `npm audit` to get more info.

> fsevents@1.2.4 install /Users/tim/react/AwesomeProject/node_modules/fsevents
> node install

[fsevents] Success: "/Users/tim/react/AwesomeProject/node_modules/fsevents/lib/binding/Release/node-v57-darwin-x64/fse.node" already installed
Pass --update-binary to reinstall or --build-from-source to recompile
npm WARN react-native-maps@0.21.0 requires a peer of react-native@^0.51 || ^0.52 || ^0.53 || ^0.54 but none is installed. You must install peer dependencies yourself.
npm WARN react-native-web-maps@0.1.0 requires a peer of react-native-web@* but none is installed. You must install peer dependencies yourself.
npm WARN react-google-maps@7.3.0 requires a peer of react@15.5.4 but none is installed. You must install peer dependencies yourself.
npm WARN react-google-maps@7.3.0 requires a peer of react-dom@15.5.4 but none is installed. You must install peer dependencies yourself.
npm WARN react-prop-types-element-of-type@2.2.0 requires a peer of react@^0.14.6 || ^15.0.0-0 but none is installed. You must install peer dependencies yourself.
npm WARN eslint-plugin-react-native@3.2.1 requires a peer of eslint@^3.17.0 || ^4.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-win32-x64@2.2.8-beta.1 (node_modules/@expo/ngrok-bin-win32-x64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-win32-x64@2.2.8-beta.1: wanted {"os":"win32","arch":"x64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-win32-ia32@2.2.8-beta.1 (node_modules/@expo/ngrok-bin-win32-ia32):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-win32-ia32@2.2.8-beta.1: wanted {"os":"win32","arch":"ia32"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-linux-x64@2.2.8 (node_modules/@expo/ngrok-bin-linux-x64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-linux-x64@2.2.8: wanted {"os":"linux","arch":"x64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-sunos-x64@2.2.8 (node_modules/@expo/ngrok-bin-sunos-x64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-sunos-x64@2.2.8: wanted {"os":"sunos","arch":"x64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-linux-arm64@2.2.8 (node_modules/@expo/ngrok-bin-linux-arm64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-linux-arm64@2.2.8: wanted {"os":"linux","arch":"arm64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-linux-ia32@2.2.8 (node_modules/@expo/ngrok-bin-linux-ia32):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-linux-ia32@2.2.8: wanted {"os":"linux","arch":"ia32"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-linux-arm@2.2.8 (node_modules/@expo/ngrok-bin-linux-arm):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-linux-arm@2.2.8: wanted {"os":"linux","arch":"arm"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-freebsd-x64@2.2.8 (node_modules/@expo/ngrok-bin-freebsd-x64):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-freebsd-x64@2.2.8: wanted {"os":"freebsd","arch":"x64"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-freebsd-ia32@2.2.8 (node_modules/@expo/ngrok-bin-freebsd-ia32):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-freebsd-ia32@2.2.8: wanted {"os":"freebsd","arch":"ia32"} (current: {"os":"darwin","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: @expo/ngrok-bin-darwin-ia32@2.2.8 (node_modules/@expo/ngrok-bin-darwin-ia32):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for @expo/ngrok-bin-darwin-ia32@2.2.8: wanted {"os":"darwin","arch":"ia32"} (current: {"os":"darwin","arch":"x64"})

added 829 packages and updated 1 package in 133.94s

Success! Created AwesomeProject at /Users/tim/react/AwesomeProject
Inside that directory, you can run several commands:

  npm start
    Starts the development server so you can open your app in the Expo
    app on your phone.
  npm run ios
    (Mac only, requires Xcode)
    Starts the development server and loads your app in an iOS simulator.
  npm run android
    (Requires Android build tools)
    Starts the development server and loads your app on a connected Android
    device or emulator.
  npm test
    Starts the test runner.
  npm run eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!
We suggest that you begin by typing:
  cd AwesomeProject
  npm start
Happy hacking!
```

The hacking was not so happy without building Watchman from source.
```
someProject/
QuinquenniumF:AwesomeProject tim$ npm start

> AwesomeProject@0.1.0 start /Users/tim/react/AwesomeProject
> react-native-scripts start

19:18:27: Unable to start server
See https://git.io/v5vcn for more information, either install watchman or run the following snippet:
  sudo sysctl -w kern.maxfiles=5242880
  sudo sysctl -w kern.maxfilesperproc=524288
        
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! AwesomeProject@0.1.0 start: `react-native-scripts start`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the AwesomeProject@0.1.0 start script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/tim/.npm/_logs/2018-07-01T09_18_27_827Z-debug.log
```

I went with the kernel hacking option.  Since I was told to hack happily...

But oddly, there was no source directory.  After running npm start, and following this:
```
Your app is now running at URL: exp://192.168.8.102:19000
```

What we got was this in the browser:
```
{"sdkVersion":"27.0.0","name":"AwesomeProject","slug":"awesomeproject","version":"0.1.0","xde":true,"developer":{"tool":"crna","projectRoot":"/Users/tim/react/AwesomeProject"},"packagerOpts":{"hostType":"tunnel","lanType":"ip","dev":true,"minify":false,"urlRandomness":null},"env":{},"bundleUrl":"http://192.168.8.102:19001/./node_modules/react-native-scripts/build/bin/crna-entry.bundle?platform=ios&dev=true&minify=false&hot=false&assetPlugin=%2FUsers%2Ftim%2Freact%2FAwesomeProject%2Fnode_modules%2Fexpo%2Ftools%2FhashAssetFiles","debuggerHost":"192.168.8.102:19001","mainModuleName":"./node_modules/react-native-scripts/build/bin/crna-entry","logUrl":"http://192.168.8.102:19000/logs","id":"@anonymous/awesomeproject-aa43f5cf-1843-43b5-8d25-51d1251f50ae"}
```

Noticed that nvm had reverted to an old version of node.
Did ```nvm use 8``` and started again.  Ionic wont work with older version of node either.

Unsure of why there was no App.js, I created a new project this time using node 8.  Same thing.  Then I opened up the directory and there it was, App.js.  Doh!  My VSCode settings are set up globally for TypeScript which is compiled to .js files.  To work with React I have to create a directory .vscode and create a file settings.json with the following:
```
{
    "files.exclude": {
        "**/*.js": false
    },
}
```

Then I can see it.  The file at least.  Running npm start still shows the JSON instead of serving the app.

But it still shows a warning that I'm using an older version of npm:
```
$ node -v
v8.9.4
QuinquenniumF:AwesomeProject tim$ npm start

> AwesomeProject@0.1.0 start /Users/tim/react/AwesomeProject
> react-native-scripts start

03:10:01: Starting packager...
Packager started!
...
Your app is now running at URL: exp://192.168.8.102:19000

View your app with live reloading:

  Android device:
    -> Point the Expo app to the QR code above.
       (You'll find the QR scanner on the Projects tab of the app.)
  iOS device:
    -> Press s to email/text the app URL to your phone.
  Emulator:
    -> Press a (Android) or i (iOS) to start an emulator.

Your phone will need to be on the same local network as this computer.
For links to install the Expo app, please visit https://expo.io.

Logs from serving your app will appear here. Press Ctrl+C at any time to stop.

 › Press a to open Android device or emulator, or i to open iOS emulator.
 › Press s to send the app URL to your phone number or email address
 › Press q to display QR code.
 › Press r to restart packager, or R to restart packager and clear cache.
 › Press d to toggle development mode. (current mode: development)

03:12:44: Warning: You are using npm version 5.6.0. There may be bugs in this version, use it at your own risk. We recommend version latest.
03:12:47: Warning: You are using npm version 5.6.0. There may be bugs in this version, use it at your own risk. We recommend version latest.
03:13:12: Warning: You are using npm version 5.6.0. There may be bugs in this version, use it at your own risk. We recommend version latest.
03:15:20: ::1 - - [01/Jul/2018:17:15:20 +0000] "GET /favicon.ico HTTP/1.1" 404 150 "http://localhost:19001/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
Building JavaScript bundle [===============================================                                                     ] 47%

```

The npm start command was run at 03:09:31 (yes, I'm up late).
five minutes later the bundle is still only at 65%.

```
03:25:08: Finished building JavaScript bundle in 608545ms
```

Aside from unbearable build times, why is it using npm version 5.6.9.  I realize that nvm is not updating the npm version.  What is current? There is no mention of the current version on the npmjs.com install page.  They also recommend using nvm, but in this case, it seems to not be updating npm, only node.

```
npm install npm@latest -g
$ npm -v
6.1.0
```

Since this is my first React Native project, I'm not sure what's normal.  Trying npm start again.  Still the same thing.  The command line is saying:
```
Your app is now running at URL: exp://192.168.8.102:19000
```

What the hell is the exp protocol anyhow?  Chrome doesn't like it.  Using http just serves that json shown above.  What's going on here?  I'm going to sleep!

[Next Day]
This [issue](https://github.com/react-community/create-react-native-app/issues/81) mentions a solution:
```
My phone was connected via mu WIFI so I gave the wireless the highest
priority so it was first on
ipconfig
in this case CRNA broadcasted with the IP from the WIFI
```

Decided to give the Expo app a try.  The expo.io link didn't show any download links and had to choose the getting starting menu item and scroll down to find the install on Android link.

Then, turned off mobile data and enable home wifi which the laptop is using.

After scanning the QR code that is shown in the terminal npm start output, the message says:
```
Building JavaScript bundle
```
It's still going after three minutes.

While that's happening, I'm wondering if the Expo app has had similar issues with Apple as the Ionic <name> test app.

This [blog entry](https://forums.expo.io/t/upcoming-limitations-to-ios-expo-client/8177) indicates that React IS having the same issue.  The blog quotes ```3.1.4 Content Codes```.

The last thing I [read about the Ionic situation](https://blog.ionicframework.com/ionic-view-sunsetting-on-9-1-18/) was titled ```Ionic View Sunsetting on 9/1/18```.  This following the [first blog](https://blog.ionicframework.com/update-on-ionic-view-for-ios/) regarding the situation.  In the sunsetting blog, they said:
```
Apple has decided to take a new stance against any testing and sharing apps that allow you to preview in-progress applications, and is removing any app from the App Store that does so, including Ionic View and all similar products for other frameworks or platforms.
```

That would seem to include the React Expo app.  But we'll have to see.  The React forum entry said: ```we are a small fish and Apple owns the ocean```.

It may be difficult dealing the Apple as a small fish, but not impossible.  A client I worked with had an app I build accepted then updates rejected due to a controversy over the apps 'in-house' customer base.  Their decision was eventually reversed after a few months and a lot of back and forth with Cupertino.  It's a mistake to assume anything about big Silicon Valley companies.  Don't give up the fight I say.  The horse might always learn to sing.

After writing this, the app is live on the device.  A change to the App.js was shown within a few seconds.  This is nice, but I would prefer to do initial development on a machine and test later on a device.  Still, it's nice to know something is finally working with React Native.  Once would think that it's easy to run a web app on a laptop than on a device.  Maybe there is another CLI that can be used?

Then I get the bright idea to try the App.test.js

```
 PASS  ./App.test.js (25.021s)
  ✓ renders without crashing (13581ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        40.003s
Ran all test suites.
```

Run the test three times more:
```
Time:        0.787s, estimated 26s
Time:        5.462s
Time:        1.179s, estimated 4s
```

So that app can run.  Just how to preview in a browser? 

Then I read this StackOverflow question: [Can React Native apps be tested in a browser?](https://stackoverflow.com/questions/35973914/can-react-native-apps-be-tested-in-a-browser).


The accepted answer?
```
No, React Native can be tested only in mobile simulators like IOS and Android
```

Well that answers that!  That's the price of the 'Native' part of the name.
There are no web alternatives.  Or maybe there are and I just have to find them.  It has been great using Google developer tools to debug Ionic apps which run in a browser as they are web stack apps anyhow.  Any native plugins used (such as fingerprint authentication) will not work in the browser and require the developer to make a workaround for browser testing.

I will have to suspend my previous Ionic experiences and take React Native on its own terms.


## Project structure

With other React apps I've worked on, none have a flat directory structure such as the one created by this React Native installation.

In a usual React app, there is a node_modules, a public and a src folder.  Sub-folders by feature are encouraged.

In the React Native, there is just a basic App.js and App.test.js.  They are leaving all the decision up to the developer here.  I know a few developers whom I would not trust to create a project directory structure ... just saying.


## Original readme blurb

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

Below you'll find information about performing common tasks. The most recent version of this guide is available [here](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md).

## Updating to New Releases

You should only need to update the global installation of `create-react-native-app` very rarely, ideally never.

Updating the `react-native-scripts` dependency of your app should be as simple as bumping the version number in `package.json` and reinstalling your project's dependencies.

Upgrading to a new version of React Native requires updating the `react-native`, `react`, and `expo` package versions, and setting the correct `sdkVersion` in `app.json`. See the [versioning guide](https://github.com/react-community/create-react-native-app/blob/master/VERSIONS.md) for up-to-date information about package version compatibility.

## Available Scripts

If Yarn was installed when the project was initialized, then dependencies will have been installed via Yarn, and you should probably use it to run these commands as well. Unlike dependency installation, command running syntax is identical for Yarn and NPM at the time of this writing.

### `npm start`

Runs your app in development mode.

Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

```
npm start --reset-cache
# or
yarn start --reset-cache
```

#### `npm test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

#### `npm run ios`

Like `npm start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

#### `npm run android`

Like `npm start`, but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup). We also recommend installing Genymotion as your Android emulator. Once you've finished setting up the native build environment, there are two options for making the right copy of `adb` available to Create React Native App:

##### Using Android Studio's `adb`

1. Make sure that you can run adb from your terminal.
2. Open Genymotion and navigate to `Settings -> ADB`. Select “Use custom Android SDK tools” and update with your [Android SDK directory](https://stackoverflow.com/questions/25176594/android-sdk-location).

##### Using Genymotion's `adb`

1. Find Genymotion’s copy of adb. On macOS for example, this is normally `/Applications/Genymotion.app/Contents/MacOS/tools/`.
2. Add the Genymotion tools directory to your path (instructions for [Mac](http://osxdaily.com/2014/08/14/add-new-path-to-path-command-line/), [Linux](http://www.computerhope.com/issues/ch001647.htm), and [Windows](https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/)).
3. Make sure that you can run adb from your terminal.

#### `npm run eject`

This will start the process of "ejecting" from Create React Native App's build scripts. You'll be asked a couple of questions about how you'd like to build your project.

**Warning:** Running eject is a permanent action (aside from whatever version control system you use). An ejected app will require you to have an [Xcode and/or Android Studio environment](https://facebook.github.io/react-native/docs/getting-started.html) set up.

## Customizing App Display Name and Icon

You can edit `app.json` to include [configuration keys](https://docs.expo.io/versions/latest/guides/configuration.html) under the `expo` key.

To change your app's display name, set the `expo.name` key in `app.json` to an appropriate string.

To set an app icon, set the `expo.icon` key in `app.json` to be either a local path or a URL. It's recommended that you use a 512x512 png file with transparency.

## Writing and Running Tests

This project is set up to use [jest](https://facebook.github.io/jest/) for tests. You can configure whatever testing strategy you like, but jest works out of the box. Create test files in directories called `__tests__` or with the `.test` extension to have the files loaded by jest. See the [the template project](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/App.test.js) for an example test. The [jest documentation](https://facebook.github.io/jest/docs/en/getting-started.html) is also a wonderful resource, as is the [React Native testing tutorial](https://facebook.github.io/jest/docs/en/tutorial-react-native.html).

## Environment Variables

You can configure some of Create React Native App's behavior using environment variables.

### Configuring Packager IP Address

When starting your project, you'll see something like this for your project URL:

```
exp://192.168.0.2:19000
```

The "manifest" at that URL tells the Expo app how to retrieve and load your app's JavaScript bundle, so even if you load it in the app via a URL like `exp://localhost:19000`, the Expo client app will still try to retrieve your app at the IP address that the start script provides.

In some cases, this is less than ideal. This might be the case if you need to run your project inside of a virtual machine and you have to access the packager via a different IP address than the one which prints by default. In order to override the IP address or hostname that is detected by Create React Native App, you can specify your own hostname via the `REACT_NATIVE_PACKAGER_HOSTNAME` environment variable:

Mac and Linux:

```
REACT_NATIVE_PACKAGER_HOSTNAME='my-custom-ip-address-or-hostname' npm start
```

Windows:
```
set REACT_NATIVE_PACKAGER_HOSTNAME='my-custom-ip-address-or-hostname'
npm start
```

The above example would cause the development server to listen on `exp://my-custom-ip-address-or-hostname:19000`.

## Sharing and Deployment

Create React Native App does a lot of work to make app setup and development simple and straightforward, but it's very difficult to do the same for deploying to Apple's App Store or Google's Play Store without relying on a hosted service.

### Publishing to Expo's React Native Community

Expo provides free hosting for the JS-only apps created by CRNA, allowing you to share your app through the Expo client app. This requires registration for an Expo account.

Install the `exp` command-line tool, and run the publish command:

```
$ npm i -g exp
$ exp publish
```

### Building an Expo "standalone" app

You can also use a service like [Expo's standalone builds](https://docs.expo.io/versions/latest/guides/building-standalone-apps.html) if you want to get an IPA/APK for distribution without having to build the native code yourself.

### Ejecting from Create React Native App

If you want to build and deploy your app yourself, you'll need to eject from CRNA and use Xcode and Android Studio.

This is usually as simple as running `npm run eject` in your project, which will walk you through the process. Make sure to install `react-native-cli` and follow the [native code getting started guide for React Native](https://facebook.github.io/react-native/docs/getting-started.html).

#### Should I Use ExpoKit?

If you have made use of Expo APIs while working on your project, then those API calls will stop working if you eject to a regular React Native project. If you want to continue using those APIs, you can eject to "React Native + ExpoKit" which will still allow you to build your own native code and continue using the Expo APIs. See the [ejecting guide](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md) for more details about this option.

## Troubleshooting

### Networking

If you're unable to load your app on your phone due to a network timeout or a refused connection, a good first step is to verify that your phone and computer are on the same network and that they can reach each other. Create React Native App needs access to ports 19000 and 19001 so ensure that your network and firewall settings allow access from your device to your computer on both of these ports.

Try opening a web browser on your phone and opening the URL that the packager script prints, replacing `exp://` with `http://`. So, for example, if underneath the QR code in your terminal you see:

```
exp://192.168.0.1:19000
```

Try opening Safari or Chrome on your phone and loading

```
http://192.168.0.1:19000
```

and

```
http://192.168.0.1:19001
```

If this works, but you're still unable to load your app by scanning the QR code, please open an issue on the [Create React Native App repository](https://github.com/react-community/create-react-native-app) with details about these steps and any other error messages you may have received.

If you're not able to load the `http` URL in your phone's web browser, try using the tethering/mobile hotspot feature on your phone (beware of data usage, though), connecting your computer to that WiFi network, and restarting the packager. If you are using a VPN you may need to disable it.

### iOS Simulator won't open

If you're on a Mac, there are a few errors that users sometimes see when attempting to `npm run ios`:

* "non-zero exit code: 107"
* "You may need to install Xcode" but it is already installed
* and others

There are a few steps you may want to take to troubleshoot these kinds of errors:

1. Make sure Xcode is installed and open it to accept the license agreement if it prompts you. You can install it from the Mac App Store.
2. Open Xcode's Preferences, the Locations tab, and make sure that the `Command Line Tools` menu option is set to something. Sometimes when the CLI tools are first installed by Homebrew this option is left blank, which can prevent Apple utilities from finding the simulator. Make sure to re-run `npm/yarn run ios` after doing so.
3. If that doesn't work, open the Simulator, and under the app menu select `Reset Contents and Settings...`. After that has finished, quit the Simulator, and re-run `npm/yarn run ios`.

### QR Code does not scan

If you're not able to scan the QR code, make sure your phone's camera is focusing correctly, and also make sure that the contrast on the two colors in your terminal is high enough. For example, WebStorm's default themes may [not have enough contrast](https://github.com/react-community/create-react-native-app/issues/49) for terminal QR codes to be scannable with the system barcode scanners that the Expo app uses.

If this causes problems for you, you may want to try changing your terminal's color theme to have more contrast, or running Create React Native App from a different terminal. You can also manually enter the URL printed by the packager script in the Expo app's search bar to load it manually.
