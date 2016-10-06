/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  PushNotificationIOS,
  StyleSheet,
  Text,
  View,
  Dimensions,
  AlertIOS,
  TouchableHighlight,
  WebView
} from 'react-native';
var PushNotification = require('react-native-push-notification');
import Camera from 'react-native-camera';

class Button extends React.Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor={'white'}
        style={styles.button}
        onPress={this.props.onPress}>
        <Text style={styles.buttonLabel}>
          {this.props.label}
        </Text>
      </TouchableHighlight>
    );
  }
}

class SfoIos extends Component {
  state: any;
  componentWillMount() {
    PushNotificationIOS.addEventListener('register', this._onRegistered);
    PushNotificationIOS.addEventListener('registrationError', this._onRegistrationError);
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);

    PushNotificationIOS.requestPermissions();
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this._onRegistered);
    PushNotificationIOS.removeEventListener('registrationError', this._onRegistrationError);
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }

  constructor(props) {
    super(props);
    this.state = {permissions: null, cameraPath: 'initial image path'};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          SFO
        </Text>
        <Button
          onPress={this._sendLocalNotification}
          label="Send notification - wait 10s"
        />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>

        <Text>{this.state.cameraPath}</Text>
        <WebView source={{uri: 'https://sfo-demo.herokuapp.com//portfolio'}}
          style={{marginTop: 20, height: 100, width: Dimensions.get('window').width}}
          />
      </View>
    );
  }
  takePicture() {
    this.camera.capture()
      .then((data) =>
        this.setState(Object.assign(this.state, { cameraPath: data['path'] }))
      )
      .catch(err => console.error(err));
  }
  _sendLocalNotification() {
    PushNotification.localNotificationSchedule({
      message: "Delayed Local Notification Message",
      date: Date.now() + 10*1000
    });
  }
  _onRegistered(deviceToken) {
    AlertIOS.alert(
      'Registered For Remote Push',
      `Device Token: ${deviceToken}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _onRegistrationError(error) {
    AlertIOS.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }
  _onLocalNotification(notification){
    AlertIOS.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'blue',
  }
});

AppRegistry.registerComponent('SfoIos', () => SfoIos);
