import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';

export default class PlaceMap extends Component {
    constructor() {
        super();

        
        this.polygons = [];
        this.markers = [];

        fetch("http://192.168.43.210:3000/data.json")
            .then((response) => response.json())
            .then((json) => {
                this.polygons = json.map((element) => {
                    return element["geom"].map((coord) => {
                          return {
                              latitude: coord["lat"],
                              longitude: coord["lng"]
                          };
                    });
                });
            });
    }
    render() {
        return (
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -22.9844,
                    longitude: -43.2324,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onLongPress={(e) => this.addMarker(e)}>
            </MapView>
        );
    }

    addMarker(e){
        var newMark = {
            title: 'new',
            coordinates: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
            }};
        this.markers.push(newMark);
        this.setState({markers: this.markers});
    }
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    }

});
