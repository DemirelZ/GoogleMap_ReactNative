import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import Etimesgut from './src/Assets/Ilceler/Etimesgut.json';
import Kecioren from './src/Assets/Ilceler/Kecioren.json';
import Mamak from './src/Assets/Ilceler/Mamak.json';
import Altindag from './src/Assets/Ilceler/Altindag.json';
import Cankaya from './src/Assets/Ilceler/Cankaya.json';
import Golbasi from './src/Assets/Ilceler/Golbasi.json';
import {currentPosition} from './src/Assets/images';
import FloatActionButton from './src/components/floatActionButton';
import {Map} from 'iconsax-react-native';
import {IndexPath, Select, SelectItem} from '@ui-kitten/components';

const App = () => {
  const [mycoordinates, setMycoordinates] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [polygon, setPolygon] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  //console.log(mycoordinates);

  const Homes = [
    {
      coordinate: {
        latitude: 39.970684,
        longitude: 32.73165,
      },
      title: 'Restaurant 111',
      description: 'Best Delicious',
      rating: '4.7',
    },

    {
      coordinate: {
        latitude: 41.0492233,
        longitude: 29.002234,
      },
      title: 'Restaurant 222',
      description: 'Best Delicious',
      rating: '3.8',
    },

    {
      coordinate: {
        latitude: 41.059375,
        longitude: 29.0011011,
      },
      title: 'Restaurant 333',
      description: 'Best Delicious',
      rating: '5.0',
    },
  ];

  const CoordsAnkara = {
    latitude: 39.94755,
    longitude: 32.782695,
    latitudeDelta: 0.25,
    longitudeDelta: 0.25,
  };

  const imhere = {
    latitude: mycoordinates?.latitude,
    longitude: mycoordinates?.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const [growValue] = useState(new Animated.Value(0));
  const grow = growValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  useEffect(() => {}, []);

  const myCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      info => setMycoordinates(info?.coords),
      error => console.log(error),
      {
        enableHighAccuracy: true,
      },
    );

    Animated.loop(
      Animated.timing(growValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const changeMapType = () => {
    if (mapType == 'standard') {
      setMapType('satellite');
    } else {
      setMapType('standard');
    }
  };

  // ---create a random Polygon--

  const handleMapPress = event => {
    const newCoordinate = event.nativeEvent.coordinate;
    setPolygonCoordinates([...polygonCoordinates, newCoordinate]);
  };

  const clearPolygon = () => {
    setPolygonCoordinates([]);
  };

  // ---select a Country Polygon--

  const handleCountryPolygon = index => {
    let newPolygon;
    switch (index.row) {
      case 0:
        newPolygon = [];
        break;
      case 1:
        newPolygon = Cankaya.coordinates[0][0].map(c => {
          return {longitude: c[0], latitude: c[1]};
        });
        break;
      case 2:
        newPolygon = Etimesgut.coordinates[0][0].map(c => {
          return {longitude: c[0], latitude: c[1]};
        });
        break;
      case 3:
        newPolygon = Kecioren.coordinates[0][0].map(c => {
          return {longitude: c[0], latitude: c[1]};
        });
        break;
      case 4:
        newPolygon = Mamak.coordinates[0][0].map(c => {
          return {longitude: c[0], latitude: c[1]};
        });
        break;
      case 5:
        newPolygon = Altindag.coordinates[0][0].map(c => {
          return {longitude: c[0], latitude: c[1]};
        });
        break;
      case 6:
        newPolygon = Golbasi.coordinates[0][0].map(c => {
          return {longitude: c[0], latitude: c[1]};
        });
        break;
      default:
        newPolygon = [];
    }
    setPolygon(newPolygon);
  };

  // ---Zoom In and Zoom Out--

  const map = useRef(null);

  const [region, setRegion] = useState(CoordsAnkara);

  const onRegionChange = changedRegion => {
    setRegion(changedRegion);
  };
  const zoomDelta = 0.015;

  const onZoom = zoomSign => {
    const zoomedRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta - zoomDelta * zoomSign,
      longitudeDelta: region.longitudeDelta - zoomDelta * zoomSign,
    };
    setRegion(zoomedRegion);
    if (map.current) {
      map.current.animateToRegion(zoomedRegion);
    }
  };

  const onZoomIn = () => onZoom(5);
  const onZoomOut = () => onZoom(-5);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <>
        <FloatActionButton
          onPress={() => changeMapType()}
          icon={
            <Map
              size={40}
              color="green"
              variant={mapType == 'standard' ? 'Bold' : 'Outline'}
            />
          }
          customStyle={{right: 20, top: 70}}
        />

        <Select
          style={styles.selectContainer}
          selectedIndex={selectedIndex}
          onSelect={index => {
            setSelectedIndex(index);
            handleCountryPolygon(index);
          }}
          value={
            [
              'Select a district..',
              'Çankaya',
              'Etimesgut',
              'Keçiören',
              'Mamak',
              'Altındağ',
              'Gölbaşı',
            ][selectedIndex.row]
          }>
          <SelectItem title="İlçe seçiniz.." />
          <SelectItem title="Çankaya" />
          <SelectItem title="Etimesgut" />
          <SelectItem title="Keçiören" />
          <SelectItem title="Mamak" />
          <SelectItem title="Altındağ" />
          <SelectItem title="Gölbaşı" />
        </Select>

        <MapView
          ref={map}
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          region={CoordsAnkara}
          onRegionChange={onRegionChange}
          mapType={mapType}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}>
          <Marker
            title="I'm here"
            pinColor="green"
            coordinate={imhere}
            anchor={{x: 0.5, y: 0.5}}>
            <View
              style={{
                width: 100,
                height: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Animated.View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  transform: [{scale: grow}],
                  backgroundColor: '#1976d299',
                }}
              />
            </View>
          </Marker>
          <Marker
            style={{position: 'absolute', zIndex: 99}}
            coordinate={imhere}
          />
          {polygon.length > 0 && <Polygon coordinates={polygon} />}
          {polygonCoordinates.length > 0 && (
            <Polygon
              coordinates={polygonCoordinates}
              fillColor="rgba(39, 255, 255, 0.5)"
              strokeColor="#27f"
              strokeWidth={2}
            />
          )}
          {Homes.map((marker, index) => (
            <Marker key={index} coordinate={marker.coordinate}>
              <Callout
                onPress={() => console.warn('tıkland')}
                title={marker.title}
                description={marker.description}
                rating={marker.rate}>
                <View
                  style={{
                    width: 70,
                    height: 25,
                    padding: 0,
                    margin: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'pink',
                  }}>
                  <Text>MErhaba</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <View style={styles.PolygonButtonContainer}>
          <TouchableOpacity style={styles.PolygonButton} onPress={clearPolygon}>
            <Text style={styles.PolygonButtonText}>Clear Polygon</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.positionContainer}>
          <TouchableOpacity onPress={() => myCurrentLocation()}>
            <Image style={styles.positionImage} source={currentPosition} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onZoomIn}>
            <Text style={styles.text}>+</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.button} onPress={onZoomOut}>
            <Text style={styles.text}>-</Text>
          </TouchableOpacity>
        </View>
      </>
    </ApplicationProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  selectContainer: {
    position: 'absolute',
    zIndex: 99,
    width: '50%',
    top: 70,
    start: 30,
  },
  positionImage: {
    width: '100%',
    height: '100%',
  },
  positionContainer: {
    width: 42,
    height: 40,
    position: 'absolute',
    bottom: 150,
    end: 30,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 12,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    end: 30,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 12,
  },
  button: {},
  text: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  spacer: {
    marginVertical: 7,
  },

  PolygonButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: '25%',
    transform: [{translateX: -75}],
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  PolygonButton: {
    padding: 10,
    backgroundColor: '#023E8A',
    borderRadius: 5,
  },
  PolygonButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
