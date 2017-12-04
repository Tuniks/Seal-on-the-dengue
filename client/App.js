import React, { Component } from 'react';
import { AppRegistry, TabBarIOS, StyleSheet, Text, View, MapView } from 'react-native';
import PlaceMap from './place_map';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedTab: 0
        };
    }

  render() {
    return (
      <View style={styles.view}>
          <PlaceMap/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        color: '#333333',
        marginTop: 50,
    },
    view: {
        backgroundColor: '#fed',
        flex: 1
    }
});
