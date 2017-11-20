import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';

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
                }}>

                <MapView.Polygon coordinates={this.state.coordinates} fillColor={'rgba(0,0,0,0.2)'} />

                {this.props.markers.map((item,idx) => (
                    <MapView.Marker
                        key={idx}
                        title ={item.title}
                        coordinate={item.coordinates}
                        />
                ))}

                {/*<MapView.Polygon coordinates={this.state.coordinates} />*/}
            </MapView>
        );
    }
}


const styles = StyleSheet.create({
    map: {
        flex: 1
    }

});