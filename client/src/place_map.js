import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView from 'react-native-maps';
import gju from 'geojson-utils';
import Prompt from 'rn-prompt'

export default class PlaceMap extends Component {
    constructor() {
        super();

        this.state = {};
        this.state.polygons = [];
        this.state.markers = [];
        this.state.currentPosition = {latitude: -22.9844, longitude: -43.2324};
        this.state.currentPolygon = {"LIRAa_Março_2017": "Carregando..."};
        this.state.promptVisible = false;


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

                this.checkRisk();
            });

        this.getLocation();
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: this.state.currentPosition.latitude,
                        longitude: this.state.currentPosition.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onLongPress={this.addMarker.bind(this)}
                    showsUserLocation={true}
                    followUserLocation={true}>

                    <MapView.Marker
                        key={"location"}
                        title={this.state.currentPolygon["LIRAa_Março_2017"]}
                        coordinate={this.state.currentPosition} />

                    {this.state.markers.map((item, id) => (
                        <MapView.Marker
                            key={id}
                            title={item.title}
                            coordinate={item.coordinates} />
                    ))}
                </MapView>
                <Prompt
                    title="Say something"
                    placeholder="Start typing"
                    defaultValue="Hello"
                    visible={this.state.promptVisible}
                    onCancel={() => this.undoMarker()}
                    onSubmit={(value) => this.updateMarker(value)}/>
            </View>
    );
    }

    checkRisk() {
        let normalized_point = [this.state.currentPosition["longitude"],
                                this.state.currentPosition["latitude"]];

        for (i in this.state.polygons) {
            let polygon = this.state.polygons[i];
            let normalized_polygon = polygon["geom"].map((coord) => [coord["longitude"], coord["latitude"]]);
			if (polygon["Município"] == "Rio de Janeiro") {
				// Era pra ta detectando, mas não ta, ve se isso ajuda a debuggar
				console.log(normalized_polygon);
				console.log(normalized_point);
			}

            if (gju.pointInPolygon({type: "Point", coordinates: normalized_point},
                                   {type: "Polygon", coordinates: normalized_polygon})) {
                this.setState({currentPolygon: polygon});
                return;
            }
        }

        this.setState({currentPolygon: {"LIRAa_Março_2017": "Fora do Rio de Janeiro"}});
    }

    updateMarker(name){
        this.state.promptVisible = false;
        let markers = this.state.markers.slice();
        markers[markers.length-1].title = name;
        this.setState({markers: markers});
    }

    undoMarker(){
        this.state.promptVisible = false;
        let markers = this.state.markers.slice();
        markers.pop();
        this.setState({markers: markers});
    }

    addMarker(e){
        this.state.promptVisible = true;
        let newMark = {
            key: JSON.stringify(e.nativeEvent.coordinate),
            title: "Alerta",
            coordinates: {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
            }
        };
        let markers = this.state.markers.slice();
        markers.push(newMark);
        this.setState({markers: markers});
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition((position) => this.setState({currentPosition: position.coords}));
    }
}


const styles = StyleSheet.create({
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
