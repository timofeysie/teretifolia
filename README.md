# React 16 WikiData parsing app


## Table of Contents

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

Then, turned off mobile data and enable home wife which the laptop is using.

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


## Project structure

With other React apps I've worked on, none have a flat directory structure such as the one created by this React Native installation.

In a usual React app, there is a node_modules, a public and a src folder.  Sub-folders by feature are encouraged.

In the React Native, there is just a basic App.js and App.test.js.


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
