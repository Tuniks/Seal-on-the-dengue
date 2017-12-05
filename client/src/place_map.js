import React, { Component } from 'react';
import {View, StyleSheet, Text} from 'react-native';
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

        fetch("http://192.168.86.23:3000/data.json")
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

                    {/*<MapView.Polygon coordinates={this.state.teste} fillColor={'rgba(0,0,0,0.2)'} />*/}

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
                    title="Denúncia"
                    placeholder="descrição"
                    defaultValue="ocorrido"
                    visible={this.state.promptVisible}
                    onCancel={() => this.undoMarker()}
                    onSubmit={(value) => this.updateMarker(value)}/>

                <View style={[styles.bubble, styles.latlng]}>
                    <Text style={{textAlign:'center'}}>
                        {this.state.currentPolygon["LIRAa_Março_2017"]}
                    </Text>
                </View>

            </View>
    );
    }

    checkRisk() {
        let normalized_point = [this.state.currentPosition["longitude"],
                                this.state.currentPosition["latitude"]];

        for (i in this.state.polygons) {
            let polygon = this.state.polygons[i];
            let normalized_polygon = polygon["geom"].map((coord) => [coord["longitude"], coord["latitude"]]);
            let even_more_normalized_polygon = [normalized_polygon]
			if (polygon["Município"] == "Rio de Janeiro") {
			}
            if (gju.pointInPolygon({type: "Point", coordinates: normalized_point},
                                   {type: "Polygon", coordinates: even_more_normalized_polygon})) {
                this.setState({currentPolygon: polygon});
                console.log("gente foi");
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
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
});
