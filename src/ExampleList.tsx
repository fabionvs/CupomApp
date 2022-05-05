import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { List, Divider, useTheme, Button } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import ActivityIndicatorExample from './Examples/ActivityIndicatorExample';
import AppbarExample from './Examples/AppbarExample';
import AvatarExample from './Examples/AvatarExample';
import BadgeExample from './Examples/BadgeExample';
import BannerExample from './Examples/BannerExample';
import BottomNavigationExample from './Examples/BottomNavigationExample';
import ButtonExample from './Examples/ButtonExample';
import CardExample from './Examples/CardExample';
import CheckboxExample from './Examples/CheckboxExample';
import ChipExample from './Examples/ChipExample';
import DataTableExample from './Examples/DataTableExample';
import DialogExample from './Examples/DialogExample';
import DividerExample from './Examples/DividerExample';
import FABExample from './Examples/FABExample';
import IconButtonExample from './Examples/IconButtonExample';
import ListAccordionExample from './Examples/ListAccordionExample';
import ListAccordionExampleGroup from './Examples/ListAccordionGroupExample';
import ListSectionExample from './Examples/ListSectionExample';
import MenuExample from './Examples/MenuExample';
import ProgressBarExample from './Examples/ProgressBarExample';
import RadioButtonExample from './Examples/RadioButtonExample';
import RadioButtonGroupExample from './Examples/RadioButtonGroupExample';
import SearchbarExample from './Examples/SearchbarExample';
import SnackbarExample from './Examples/SnackbarExample';
import SurfaceExample from './Examples/SurfaceExample';
import SwitchExample from './Examples/SwitchExample';
import TextExample from './Examples/TextExample';
import TextInputExample from './Examples/TextInputExample';
import ToggleButtonExample from './Examples/ToggleButtonExample';
import TouchableRippleExample from './Examples/TouchableRippleExample';
import {
    ScrollView,
    View,
    Image,
    Dimensions,
    StyleSheet,
    Platform,
} from 'react-native';
import { BottomNavigation, Card, Paragraph } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Avatar } from 'react-native-paper';

export const examples: Record<
    string,
    React.ComponentType<any> & { title: string }
> = {
    activityIndicator: ActivityIndicatorExample,
    appbar: AppbarExample,
    avatar: AvatarExample,
    badge: BadgeExample,
    banner: BannerExample,
    bottomNavigation: BottomNavigationExample,
    button: ButtonExample,
    card: CardExample,
    checkbox: CheckboxExample,
    chip: ChipExample,
    dataTable: DataTableExample,
    dialog: DialogExample,
    divider: DividerExample,
    fab: FABExample,
    iconButton: IconButtonExample,
    listAccordion: ListAccordionExample,
    listAccordionGroup: ListAccordionExampleGroup,
    listSection: ListSectionExample,
    menu: MenuExample,
    progressbar: ProgressBarExample,
    radio: RadioButtonExample,
    radioGroup: RadioButtonGroupExample,
    searchbar: SearchbarExample,
    snackbar: SnackbarExample,
    surface: SurfaceExample,
    switch: SwitchExample,
    text: TextExample,
    textInput: TextInputExample,
    toggleButton: ToggleButtonExample,
    touchableRipple: TouchableRippleExample,
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

export default function ExampleList({ navigation }: Props) {
    const renderItem = ({ item }: { item: Item }) => (
        <List.Item
            title={item.data.title}
            onPress={() => navigation.navigate(item.id)}
        />
    );

    const keyExtractor = (item: { id: string }) => item.id;
    const { colors } = useTheme();
    const safeArea = useSafeArea();
    const [index, setIndex] = React.useState<number>(0);
    const [routes] = React.useState<RoutesState>([
        { key: 'sorteio', title: 'Sorteio', icon: 'image-album', color: '#6200ee' },
        {
            key: 'mapa',
            title: 'Mapa',
            icon: 'map',
            color: '#6200ee',
            badge: true,
        },
        {
            key: 'favorites',
            title: 'Meus Cupons',
            icon: 'image-album',
            color: '#6200ee',
        },
    ]);
    type Route = { route: { key: string } };
    const Mapa = ({ route }: Route) => {

        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);

        useEffect(() => {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            })();
        }, []);

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
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}>
                            <Marker
                                key={1}
                                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                                title={"teste"}
                                description={"Teste"}
                            >
                                <Avatar.Image source={{ uri: 'https://acontecendoaqui.com.br/wp-content/uploads/2018/01/mcdonalds_16.jpg' }} size={48}/>
                            </Marker>
                        </MapView>
                    </View>
                }
            </>
        );
    };

    const Sorteio = ({ route }: Route) => {

        const [location, setLocation] = useState(null);
        const [errorMsg, setErrorMsg] = useState(null);

        useEffect(() => {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            })();
        }, []);

        return (
            <>
                {location !== null &&
                    <View style={styles.container}>
                        <MapView style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            mapType={"standard"}
                            region={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}>
                            <Marker
                                key={1}
                                coordinate={{ latitude: location.latitude, longitude: location.longitude }}

                            >
                                <Avatar.Image source={{ uri: 'https://acontecendoaqui.com.br/wp-content/uploads/2018/01/mcdonalds_16.jpg' }} size={48}/>
                            </Marker>
                        </MapView>
                        <Button icon="play" mode="contained" style={styles.floatingMenuButtonStyle} onPress={() => { setLocation({latitude: -14.135759353637695, longitude: -47.514862060546875})}}>
                            Iniciar Sorteio
                        </Button>
                    </View>
                }
            </>
        );
    };

    const NavBar = ({ route }: Route) => {
        const PHOTOS = Array.from({ length: 24 }).map(
            (_, i) => `https://unsplash.it/300/300/?random&__id=${route.key}${i}`
        );

        return (
            <FlatList
                contentContainerStyle={{
                    backgroundColor: colors.background,
                    paddingBottom: safeArea.bottom,
                }}
                ItemSeparatorComponent={Divider}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                data={data}
            />
        );
    };

    return (
        <>

            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={index => setIndex(index)}
                renderScene={BottomNavigation.SceneMap({
                    mapa: Mapa,
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
    }
});