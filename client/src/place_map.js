import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';
import { Permissions, Location } from 'expo';

export default class PlaceMap extends Component {
    constructor() {
        super();

        this.polygons = [];
        this.markers = [];
        this.currentPosition = {latitude: 0, longitude: 0};

        Permissions.askAsync(Permissions.LOCATION).then((stat) => {
            if (stat == 'granted') {
                Location.watchPositionAsync(this.watchPosition.bind(this));
                Location.getCurrentPositionAsync((position) => {
                    console.log(position);
                    this.currentPosition = position.coords
                });
            }
        });

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
                onLongPress={this.addMarker.bind(this)}
                showsUserLocation={true}
                followUserLocation={true}>
            </MapView>
        );
    }

    addMarker(e){
        var newMark = {
            title: JSON.stringify(e.nativeEvent.coordinate),
            coordinates: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
            }};
        var markers = this.markers.slice();
        markers.push(newMark);
        this.setState({markers: markers});
    }

    watchPosition(position) {
        this.currentPosition = position.coords;
        // TODO check which polygon user is in
    }
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    }

});
