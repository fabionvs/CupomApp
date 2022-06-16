import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import ExampleList, { examples } from './ExampleList';
import { BottomNavigation} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import Sorteio from './Sorteio';

const Stack = createStackNavigator();
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
export default function Root(props:any) {
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
    ]);
    type Route = { route: { key: string } };
    
    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    header: ({ navigation, scene, previous }) => (
                        <Appbar.Header style={{ marginTop: 0 }}>
                            {previous ? (
                                <Appbar.BackAction onPress={() => navigation.goBack()} />
                            ) : (navigation as any).openDrawer ? (
                                <Appbar.Action
                                    icon="menu"
                                    onPress={() =>
                                        ((navigation as any) as DrawerNavigationProp<{}>).openDrawer()
                                    }
                                />
                            ) : null}
                            <Appbar.Content title={scene.descriptor.options.title} />
                        </Appbar.Header>
                    ),
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={ExampleList}
                    options={{ title: 'Zenyv' }}
                />
            </Stack.Navigator>
        </>
    );
}
