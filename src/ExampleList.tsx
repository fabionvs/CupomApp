import React, { useState, useEffect } from 'react';
import { FlatList, Linking } from 'react-native';
import { List, Divider, useTheme, Button } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import ActivityIndicatorExample from './Examples/ActivityIndicatorExample';
import {
    ScrollView,
    View,
    Dimensions,
    StyleSheet,
    Platform,
} from 'react-native';
import { BottomNavigation, Card, Paragraph, Title, Text, Dialog, Portal, Snackbar, Searchbar } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Avatar } from 'react-native-paper';
import Filiais from '../services/Filiais';
import Cupons from '../services/Cupons';
import { useRoute } from '@react-navigation/native';
export const examples: Record<
    string,
    React.ComponentType<any> & { title: string }
> = {
    activityIndicator: ActivityIndicatorExample,
};

type RoutesState = Array<{
    key: string;
    title: string;
    icon: string;
    color?: string;
    badge?: boolean;
    getAccessibilityLabel?: string;
    getTestID?: string;
}>;
type Props = {
    navigation: StackNavigationProp<{ [key: string]: undefined }>;
    title: any;
};

type Item = {
    id: string;
    data: typeof examples[string];
};

const data = Object.keys(examples).map(
    (id): Item => ({ id, data: examples[id] })
);

export default function ExampleList({ navigation, title }: Props) {
    const route: any = useRoute();

    const keyExtractor = (item: { id: string }) => item.id;
    const { colors } = useTheme();
    const safeArea = useSafeArea();
    const [index, setIndex] = React.useState<number>(0);
    const [routes] = React.useState<RoutesState>([
        { key: 'sorteio', title: 'Sorteio', icon: 'tag-multiple-outline', color: '#6200ee' },
        {
            key: 'favorites',
            title: 'Meus Cupons',
            icon: 'image-album',
            color: '#6200ee',
        },
        {
            key: 'mapa',
            title: 'Buscar',
            icon: 'search-web',
            color: '#6200ee',
        },
        {
            key: 'estabelecimentos',
            title: 'Estabelecimentos',
            icon: 'store',
            color: '#6200ee',
        },
    ]);
    type Route = { route: { key: string } };
    React.useEffect(() => {
        let isApiSubscribed = true;
        if (route.params?.id <= 3) {
            setIndex(route.params.id)
        }
        return () => {
            // cancel the subscription
            isApiSubscribed = false;
        };
    }, [route.params?.id]);

    const Mapa = ({ route }: Route) => {

        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);
        const [filiais, setFiliais] = useState([] as any);
        const [categoria, setCategoria] = useState("");
        const [inputCard, setInputCard] = useState([] as any);
        const [inputCardActive, setInputCardActive] = useState(false);

        useEffect(() => {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                let geo: any = { latitude: location.coords.latitude, longitude: location.coords.longitude };
                setLocation(geo);
            })();
        }, []);

        useEffect(() => {
            if (location !== null) {
                getFiliais()
            }
        }, [location]);

        const getFiliais = async () => {
            await Filiais.getFiliais(location, categoria).then((response: any) => {
                setFiliais(response);
            })
        }

        const handleCategoria = async (text) => {
            setCategoria(text)
            setInputCardActive(false)
            await Filiais.getFiliais(location, text).then((response: any) => {
                setFiliais(response);
            })
        }

        const search = async (text) => {
            setCategoria(text)
            setInputCardActive(true)
            await Filiais.getCategorias(text).then((response: any) => {
                setInputCard(response);
            })
        }

        return (
            <>
                {location !== null &&
                    <View style={styles.container}>
                        <MapView style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            mapType={"terrain"}
                            initialRegion={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.2,
                                longitudeDelta: 0.2,

                            }}>
                            {filiais.length > 0 && filiais.map((filial: any, i: any) =>
                                <Marker
                                    key={i}
                                    coordinate={{ latitude: Number(filial.latitude), longitude: Number(filial.longitude) }}
                                >
                                    <Avatar.Image source={{ uri: filial.empresa.logo }} size={50} />
                                </Marker>
                            )}
                        </MapView>
                        <Searchbar style={styles.floatingInput}
                            placeholder="Digite a Categoria"
                            onChangeText={(text: any) => {
                                search(text)
                            }}
                            value={categoria}
                        />
                        {inputCard.length > 0 && categoria.length > 0 && inputCardActive == true && <Card style={styles.floatingInputCard}>
                            <Card.Content>
                                <ScrollView>
                                    {inputCard.length > 0 && inputCard.map((filial: any, i: any) =>
                                        <Text key={i} style={styles.floatInputText} onPress={(e) => {
                                            handleCategoria(filial.nm_categoria)
                                        }}>{filial.nm_categoria}</Text>
                                    )}
                                </ScrollView>
                            </Card.Content>
                        </Card>}
                    </View>
                }
            </>
        );
    };

    const ListaUserCupons = ({ route }: Route) => {
        const [cupons, setCupons] = useState({} as any);
        useEffect(() => {
            getCupons()
        }, []);

        const getCupons = async () => {
            await Cupons.userCupons().then((response: any) => {
                setCupons(response);
            })
        }

        const openMaps = (lat, lng) => {
            var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
            var url = scheme + `${lat},${lng}`;
            Linking.openURL(url);
            let f = Platform.select({
                ios: () => {
                    Linking.openURL('http://maps.apple.com/maps?daddr=' + scheme);
                },
                android: () => {
                    Linking.openURL('http://maps.google.com/maps?daddr=' + scheme).catch(err => console.error('An error occurred', err));;
                }
            });
        }

        return (
            <>
                <ScrollView>
                    <Text style={styles.title}>Meus Cupons</Text>
                    {cupons.length > 0 && cupons.map((cupom: any, i: any) =>
                        <Card style={styles.card} key={i}>
                            <Card.Content style={styles.imageCupomCardContainer}>
                                <View style={{ width: '20%' }}>
                                    <Avatar.Image source={{ uri: cupom.promocao.filial.empresa.logo }} size={60} />
                                </View>
                                <View style={{ width: '80%' }}>
                                    <Title>{cupom.promocao.nm_nome}</Title>
                                    <Paragraph><Text style={styles.cardText}>Estabelecimento:</Text> {cupom.promocao.filial.empresa.nm_nome}</Paragraph>
                                    <Paragraph><Text style={styles.cardText}>C??digo do Cupom:</Text> {cupom.cd_cupom}</Paragraph>
                                    <Paragraph><Text style={styles.cardText}>Utilizado?</Text> {(cupom.st_consumido == true) ? "Sim" : "N??o"}</Paragraph>
                                    <Paragraph><Text style={styles.cardText}>Endere??o</Text> {cupom.promocao.filial.ds_endereco}</Paragraph>
                                    <Button style={{ width: 140 }} icon="map" mode="text" onPress={() => openMaps(cupom.latitude, cupom.longitude)}>
                                        Ver no Maps
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                </ScrollView>
            </>
        )
    };

    const ListaEstabelecimentos = ({ route }: Route) => {
        const [cupons, setCupons] = useState({} as any);
        const [filiais, setFiliais] = useState([] as any);
        const [location, setLocation] = useState(null);
        const openMaps = (lat, lng) => {
            var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
            var url = scheme + `${lat},${lng}`;
            Linking.openURL(url);
            let f = Platform.select({
                ios: () => {
                    Linking.openURL('http://maps.apple.com/maps?daddr=' + scheme);
                },
                android: () => {
                    Linking.openURL('http://maps.google.com/maps?daddr=' + scheme).catch(err => console.error('An error occurred', err));;
                }
            });
        }
        useEffect(() => {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                await setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                getFiliais({ latitude: location.coords.latitude, longitude: location.coords.longitude })
            })();
        }, []);


        const getFiliais = async (geo) => {
            await Filiais.getFiliais(geo).then((response: any) => {
                setFiliais(response);
            })
        }

        return (
            <>
                <ScrollView>
                    <Text style={styles.title}>Lista de Estabelecimentos</Text>
                    {filiais.length > 0 && filiais.map((filial: any, i: any) =>
                        <Card style={styles.card} key={i}>
                            <Card.Content>
                                <Title><Avatar.Image source={{ uri: filial.empresa.logo }} size={30} /> {filial.empresa.nm_nome}</Title>
                                <Paragraph><Text style={styles.cardText}>Categoria:</Text> {filial.nm_categoria}</Paragraph>
                                <Paragraph><Text style={styles.cardText}>Dist??ncia:</Text> {filial.km_away} Km</Paragraph>
                                <Paragraph><Text style={styles.cardText}>Endere??o:</Text> {filial.ds_endereco}</Paragraph>
                                <Button style={{ width: 140 }} icon="map" mode="text" onPress={() => openMaps(filial.latitude, filial.longitude)}>
                                    Ver no Maps
                                </Button>
                            </Card.Content>
                        </Card>
                    )}
                </ScrollView>
            </>
        )
    };

    const Sorteio = ({ route }: Route) => {
        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);
        const [filiais, setFiliais] = useState([] as any);
        const [cupons, setCupons] = useState([] as any);
        const [selectedLocation, setSelectedLocation] = useState({} as any);
        const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
        const [selectedBusiness, setSelectedBusiness] = useState({} as any);
        const [userBlocked, setUserBlocked] = useState(false);
        const [userSuccess, setUserSuccess] = useState(false);
        useEffect(() => {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                await setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                getFiliais({ latitude: location.coords.latitude, longitude: location.coords.longitude })
            })();
        }, []);


        const getFiliais = async (geo) => {
            await Filiais.getFiliais(geo).then((response: any) => {
                setFiliais(response);
            })
        }

        const getCupons = async (filial) => {
            await Cupons.getCupons(filial).then((response: any) => {
                setCupons(response);
            })
        }

        const sorteio = async () => {
            let newLocation : number = selectedLocationIndex;
            if(newLocation < filiais.length){
                newLocation = newLocation + 1;
            }
            if(newLocation >= filiais.length){
                newLocation = 0;
            }
            console.log(newLocation + " - "+ filiais.length)
            setSelectedLocation(filiais[newLocation])
            setSelectedLocationIndex(newLocation)
            await setLocation({ latitude: Number(filiais[newLocation].latitude), longitude: Number(filiais[newLocation].longitude) });
        }

        const openBusiness = async () => {
            await getCupons({ filial_id: selectedLocation.id });
            setSelectedBusiness(selectedLocation);
        }

        function rand(min, max) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        const pegar = async (cupom: any) => {
            await Cupons.pegar({ promocao_id: cupom.id }).then((response: any) => {
                if (response.error == true) {
                    setUserBlocked(true)
                    setTimeout(() => {
                        setUserBlocked(false);
                    }, 5000)
                    return false;
                }
                setUserSuccess(true);
                setTimeout(() => {
                    setUserSuccess(false);
                }, 5000)
            })
        }

        return (
            <>
                {location !== null &&
                    <View style={styles.container}>
                        <MapView style={styles.map}
                            showsUserLocation={true}
                            provider={PROVIDER_GOOGLE}
                            mapType={"terrain"}
                            region={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 1,
                            }}>
                            {filiais.length > 0 && filiais.map((filial: any, i: any) =>
                                <Marker
                                    key={i}
                                    coordinate={{ latitude: Number(filial.latitude), longitude: Number(filial.longitude) }}
                                >
                                    <Avatar.Image source={{ uri: filial.empresa.logo }} size={50} />
                                </Marker>
                            )}
                        </MapView>
                        <Card style={styles.floatingCard}>
                            <Card.Content>
                                {'id' in selectedLocation &&
                                    <>
                                        <View style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            justifyContent: "flex-start",
                                        }}>
                                            <Avatar.Image source={{ uri: selectedLocation.empresa.logo }} size={30} />
                                            <Title>{selectedLocation.empresa.nm_nome}</Title>
                                        </View>
                                        <Paragraph><Text style={styles.cardText}>Categoria:</Text> {selectedLocation.nm_categoria}</Paragraph>
                                        <Paragraph><Text style={styles.cardText}>Dist??ncia:</Text> {selectedLocation.km_away} Km</Paragraph>
                                    </>
                                }
                                <View style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                }}>
                                    <Button icon="shuffle" style={{ marginTop: 10, width: '40%' }} mode="contained" onPress={() => { sorteio() }}>
                                        Sortear
                                    </Button>
                                    <Button color='#8e05d4' disabled={!('id' in selectedLocation)} icon="ticket-percent" style={{ marginTop: 10, width: '50%' }} mode="contained" onPress={() => { openBusiness() }}>
                                        Cupons
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                }
                {'id' in selectedBusiness &&
                    <Portal>
                        <Dialog visible={'id' in selectedBusiness} onDismiss={() => { }}>
                            <Dialog.Title>
                                <Avatar.Image source={{ uri: selectedBusiness.empresa.logo }} size={80} />
                                {selectedBusiness.empresa.nm_nome}
                            </Dialog.Title>
                            <Dialog.ScrollArea>
                                <ScrollView>
                                    <Paragraph style={{ marginTop: 10 }}><Text style={styles.cardText}>Dist??ncia:</Text> {selectedBusiness.km_away} Km</Paragraph>
                                    <Paragraph><Text style={styles.cardText}>Categoria:</Text> {selectedBusiness.nm_categoria}</Paragraph>
                                    <Paragraph><Text style={styles.cardText}>Endere??o:</Text> {selectedBusiness.ds_endereco}</Paragraph>
                                    <List.Section>
                                        <List.Subheader>Cupons</List.Subheader>
                                        {cupons.length > 0 && cupons.map((cupom: any, i: any) =>
                                            <List.Item
                                                key={i}
                                                title={cupom.nm_nome}
                                                description={cupom.nr_porcentagem + "% de desconto"}
                                                left={props => <Avatar.Image source={{ uri: selectedBusiness.empresa.logo }} size={20} style={{ marginTop: 10 }} />}
                                                right={props => <Button style={{ marginTop: 10 }} mode="text" onPress={() => pegar(cupom)}>
                                                    Pegar
                                                </Button>}
                                            />
                                        )}
                                    </List.Section>
                                </ScrollView>
                            </Dialog.ScrollArea>
                            <Dialog.Actions>
                                <Button onPress={() => setSelectedBusiness({})}>Fechar</Button>
                            </Dialog.Actions>
                        </Dialog>
                        {userBlocked == true &&
                            <Snackbar
                                visible={true}
                                onDismiss={() => { }}
                                action={{
                                    label: 'Undo',
                                    onPress: () => {
                                        // Do something
                                    },
                                }}>
                                Voc?? s?? pode ganhar 1 cupom por dia!
                            </Snackbar>
                        }
                        {userSuccess == true &&
                            <Snackbar
                                visible={true}
                                onDismiss={() => { }}
                                action={{
                                    label: 'Undo',
                                    onPress: () => {
                                        // Do something
                                    },
                                }}>
                                Cupom adquirido com sucesso!
                            </Snackbar>
                        }
                    </Portal>
                }
            </>
        );
    };


    return (
        <>

            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={index => setIndex(index)}
                renderScene={BottomNavigation.SceneMap({
                    sorteio: Sorteio,
                    favorites: ListaUserCupons,
                    mapa: Mapa,
                    estabelecimentos: ListaEstabelecimentos
                })}
                sceneAnimationEnabled={false}
            />
        </>
    );
}

const styles = StyleSheet.create({
    ...Platform.select({
        web: {
            content: {
                // there is no 'grid' type in RN :(
                display: 'grid' as 'none',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gridRowGap: '8px',
                gridColumnGap: '8px',
                padding: 8,
            },
            item: {
                width: '100%',
                height: 300,
            },
        },
        default: {
            content: {
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: 4,
            },
            item: {
                height: Dimensions.get('window').width / 2,
                padding: 4,
            },
        },
    }),
    photo: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    floatingMenuButtonStyle: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 35
    },
    floatingCard: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 35,
        width: Dimensions.get('window').width - 50,
    },
    floatingInput: {
        alignSelf: 'center',
        position: 'absolute',
        top: 2,
        width: Dimensions.get('window').width,
    },
    floatingInputCard: {
        alignSelf: 'center',
        position: 'absolute',
        top: 50,
        width: Dimensions.get('window').width,
    },
    cardText: {
        fontWeight: 'bold'
    },
    card: {
        marginTop: 10,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 10,
    },
    title: {
        marginLeft: 20,
        marginTop: 20,
        fontSize: 20
    },
    imageCupomCardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    floatInputText: {
        margin: 6,
    }
});