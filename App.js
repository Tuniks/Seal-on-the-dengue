import React, { Component } from 'react';
import { AppRegistry, TabBarIOS, StyleSheet, Text, View, MapView } from 'react-native';
import PlaceMap from './place_map';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedTab: 0,
            markers: [{
                title: 'home',
                coordinates: {
                    latitude: -22.9856,
                    longitude: -43.2338
                }}
                ,
                {
                title: 'ocean',
                coordinates: {
                    latitude: -23,
                    longitude: -43.2338
                }}
            ]
        };
    }

  render() {
    return (
      <View style={styles.view}>
          <TabBarIOS>
              <TabBarIOS.Item
                  systemIcon="favorites"
                  title="map"
                  selected={this.state.selectedTab === 0}
                  onPress={this.handleTabPress.bind(this, 0)}
              >
                  <PlaceMap markers={this.state.markers}/>
              </TabBarIOS.Item>

              <TabBarIOS.Item
                  title="places"
                  icon={require('./assets/pin.png')}
                  selected={this.state.selectedTab === 1}
                  onPress={this.handleTabPress.bind(this, 1)}
              >
                  <View style={styles.view}>
                      <Text style={styles.text}>Add Place</Text>
                  </View>
              </TabBarIOS.Item>
          </TabBarIOS>
      </View>
    );
  }
    handleTabPress(tab) {
        this.setState({ selectedTab: tab })
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
    },
    map: {
        flex: 1
    }
});
