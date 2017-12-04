import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';

export default class PlaceMap extends Component {
    constructor() {
        super();

        this.state = {};
        this.state.polygons = [];
        this.state.markers = [];
        this.state.currentPosition = undefined;

        fetch("http://192.168.43.210:3000/data.json")
            .then((response) => response.json())
            .then((json) => {
                this.setState({polygons: json.map((element) => {
                    element["geom"] = element["geom"].map((coord) => {
                          return {
                              latitude: coord["lat"],
                              longitude: coord["lng"]
                          };
                    });

                    return element;
                })});
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

                {this.state.markers.map((item, id) => (
                    <MapView.Marker
                        key={id}
                        title={item.title}
                        coordinate={item.coordinates} />
                ))}
            </MapView>
        );
    }

    addMarker(e){
        var newMark = {
            title: JSON.stringify(e.nativeEvent.coordinate),
            coordinates: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
            }
        };
        var markers = this.state.markers.slice();
        markers.push(newMark);
        this.setState({markers: markers});
    }
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    }

});
