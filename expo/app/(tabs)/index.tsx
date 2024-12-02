import { View, Platform, StyleSheet } from "react-native";
import { useTheme, MD3Theme, Text } from "react-native-paper";
import MapView, { UrlTile } from "react-native-maps";
import { useCallback, useEffect, useRef, useState } from "react";

const MAPTILER_API_KEY = "Qt785BgyGLt4XZ7bFUK7";
const LINZ_API_KEY = "384d440d6f6442698d19b6735ec4ebd7";

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    map: {
      width: "75%",
      height: "75%",
      backgroundColor: "green",
    },
    view: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
  });

function Index() {
  const theme = useTheme();
  const [location, setLocation] = useState({
    latitude: -44.6945,
    longitude: 169.141037,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [isMapReady, setMapReady] = useState(false);
  const _map = useRef(null);
  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, [setMapReady]);

  console.log(isMapReady);

  return (
    <View style={styles(theme).view}>
      <MapView
        key={`mapView`}
        mapType={isMapReady ? "none" : "satellite"}
        ref={_map}
        style={isMapReady ? styles(theme).map : { width: "75%", height: "50%" }}
        onMapReady={handleMapReady}
        initialRegion={location}
        onRegionChange={(location) => {
          setLocation(location);
          setMapReady(true);
        }}
        zoomControlEnabled={true}
        // showsUserLocation={false}
      >
        {isMapReady && (
          <UrlTile
            urlTemplate={`http://tilesa.tilescdn.koordinates.com/services;key=${LINZ_API_KEY}/tiles/v4/layer=50767/EPSG:CRS/{z}/{x}/{y}.png`}
          />
        )}
      </MapView>
    </View>
  );
}

export default Index;
