import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
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
};

type Item = {
    id: string;
    data: typeof examples[string];
};

const data = Object.keys(examples).map(
    (id): Item => ({ id, data: examples[id] })
);

export default function Root({ navigation }: Props) {

    const Sorteio = () => {

        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);
        const [filiais, setFiliais] = useState([] as any);
        const [cupons, setCupons] = useState([] as any);
        const [selectedLocation, setSelectedLocation] = useState({} as any);
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
            let newLocation = rand(0, filiais.length - 1);
            setSelectedLocation(filiais[newLocation])
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
        top: 35,
        width: Dimensions.get('window').width - 50,
    },
    cardText: {
        fontWeight: 'bold'
    },
    card: {
        margin: 20
    },
    title: {
        marginLeft: 20,
        marginTop: 20,
        fontSize: 20
    }
});