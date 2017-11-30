import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';
import Data from './saude_liraa.js';

export default class PlaceMap extends Component {
    constructor() {
        super();

        this.state = {
            coordinates: [
                {
                    latitude: -23.1,
                    longitude: -43.2
                },
                {
                    latitude: -23.2,
                    longitude: -43.3
                },
                {
                    latitude: -22.8,
                    longitude: -43.2
                }
            ],
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
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -22.9844,
                    longitude: -43.2324,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onLongPress={(e) => this.addMarker(e)}
                showsUserLocation={true}>

                <MapView.Polygon coordinates={this.state.coordinates} fillColor={'rgba(0,0,0,0.2)'} />

                {this.state.markers.map((item,idx) => (
                    <MapView.Marker
                        key={idx}
                        title ={item.title}
                        coordinate={item.coordinates}
                        />
                ))}

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
        var markers_ = this.state.markers.slice();
        markers_.push(newMark);
        this.setState({markers: markers_});
    }
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    }

});
