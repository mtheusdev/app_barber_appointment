import React, {useState, useEffect} from 'react';
import Api from '../../Api';
import {Platform, RefreshControl} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import BarberItem from '../../components/BarberItem';
import {
  Container,
  Scroller,
  HeaderArea,
  HeaderTitle,
  SearchButton,
  LocationArea,
  LocationInput,
  LocationFinder,
  LoadingIcon,
  ListArea,
} from './styles';
import SearchIcon from '../../assets/search.svg';
import MyLocationIcon from '../../assets/my_location.svg';
import {useNavigation} from '@react-navigation/native';

export default () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getBarbers = async () => {
    setLoading(true);
    setList([]);

    let lat = null;
    let lng = null;

    if (coords) {
      lat = coords.latitude;
      lng = coords.longitude;
    }

    let res = await Api.getBarbers(lat, lng, location);

    if (!res.error) {
      if (res.loc) {
        setLocation(res.loc);
      }
      setList(res.data);
    } else {
      alert('Erro: ' + res.error);
    }

    setLoading(false);
  };

  const onRefresh = () => {
    setRefreshing(false);
    getBarbers();
  };

  const handleLocationFinder = async () => {
    setCoords(null);
    let result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (result === 'granted') {
      setLoading(true);
      setLocation('');
      setList('');
      Geolocation.getCurrentPosition(
        info => {
          setCoords(info.coords);
          getBarbers();
        },
        error => console.log(error),
        {
          enableHighAccuracy: false,
          timeout: 2000,
          maximumAge: 3600000,
        },
      );
    }
  };

  useEffect(() => {
    getBarbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocationSource = () => {
    setCoords({});
    getBarbers();
  };

  return (
    <Container>
      <Scroller
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <HeaderArea>
          <HeaderTitle numberOfLines={2}>
            Encontre o seu barbeiro favorito
          </HeaderTitle>
          <SearchButton onPress={() => navigation.navigate('Search')}>
            <SearchIcon width="26" height="26" fill="#FFFFFF" />
          </SearchButton>
        </HeaderArea>
        <LocationArea>
          <LocationInput
            placeholder="Onde você está"
            placeholderTextColor="#fff"
            value={location}
            onChangeText={t => setLocation(t)}
            onEndEditing={handleLocationSource}
          />
          <LocationFinder onPress={handleLocationFinder}>
            <MyLocationIcon width="24" height="24" fill="#FFFFFF" />
          </LocationFinder>
        </LocationArea>
        {loading && <LoadingIcon size="large" color="#fff" />}

        <ListArea>
          {list
            ? list.map((item, k) => {
                return <BarberItem key={k} data={item} />;
              })
            : null}
        </ListArea>
      </Scroller>
    </Container>
  );
};
