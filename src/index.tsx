import * as React from 'react';
import { I18nManager, Platform, YellowBox } from 'react-native';
import { Updates } from 'expo';
import { useKeepAwake } from 'expo-keep-awake';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InitialState, NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
    Provider as PaperProvider,
    DarkTheme,
    DefaultTheme,
    Theme,
} from 'react-native-paper';
import App from './RootNavigator';
import Sorteio from './sorteio/Sorteio';
import Login from './auth/Login';
import DrawerItems from './DrawerItems';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Auth from '../services/Auth';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

const PreferencesContext = React.createContext<any>(null);


const DrawerContent = ({ state, navigation, ...props }) => {
    return (
        <PreferencesContext.Consumer>
            {preferences => (
                <DrawerItems
                    toggleTheme={preferences.toggleTheme}
                    toggleRTL={preferences.toggleRtl}
                    isRTL={preferences.rtl}
                    isDarkTheme={preferences.theme === DarkTheme}
                    navigation={navigation}
                />
                
            )}
        </PreferencesContext.Consumer>
    );
};

const Drawer = createDrawerNavigator<{ Home: undefined }>();

export default function PaperExample() {
    useKeepAwake();

    const [isReady, setIsReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState<
        InitialState | undefined
    >();

    const [theme, setTheme] = React.useState<Theme>(DefaultTheme);
    const [rtl, setRtl] = React.useState<boolean>(I18nManager.isRTL);
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const restoreState = async () => {
            try {
                const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                const state = JSON.parse(savedStateString || '');

                setInitialState(state);
            } catch (e) {
                // ignore error
            } finally {
                setIsReady(true);
            }
        };

        if (!isReady) {
            restoreState();
        }
    }, [isReady]);

    React.useEffect(() => {
        const restorePrefs = async () => {
            try {
                const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
                const preferences = JSON.parse(prefString || '');

                if (preferences) {
                    // eslint-disable-next-line react/no-did-mount-set-state
                    setTheme(preferences.theme === 'dark' ? DarkTheme : DefaultTheme);

                    if (typeof preferences.rtl === 'boolean') {
                        setRtl(preferences.rtl);
                    }
                }
            } catch (e) {
                // ignore error
            }
        };

        restorePrefs();
    }, []);

    React.useEffect(() => {
        const savePrefs = async () => {
            try {
                await AsyncStorage.setItem(
                    PREFERENCES_KEY,
                    JSON.stringify({
                        theme: theme === DarkTheme ? 'dark' : 'light',
                        rtl,
                    })
                );
            } catch (e) {
                // ignore error
            }

            if (I18nManager.isRTL !== rtl) {
                I18nManager.forceRTL(rtl);
                Updates.reloadFromCache();
            }
        };

        savePrefs();
    }, [rtl, theme]);

    React.useEffect(() => {
        getUser
    }, []);

    const getUser = async () => {
        let user = await Auth.getToken();
        setUser(user);
    }

    const preferences = React.useMemo(
        () => ({
            toggleTheme: () =>
                setTheme(theme => (theme === DefaultTheme ? DarkTheme : DefaultTheme)),
            toggleRtl: () => setRtl(rtl => !rtl),
            rtl,
            theme,
        }),
        [rtl, theme]
    );

    if (!isReady) {
        return null;
    }

    return (
        <PaperProvider theme={theme}>
            <SafeAreaProvider>
                <PreferencesContext.Provider value={preferences}>
                    <React.Fragment>
                        <NavigationContainer
                            initialState={initialState}
                            onStateChange={(state: any) =>
                                AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
                            }
                        >
                            {Platform.OS === 'web' ? (
                                <App />
                            ) : (

                                <Drawer.Navigator initialRouteName={(user) ? "Home" : "Login"} drawerContent={(props) => (
                                    <DrawerContent {...props} />
                                )}>
                                    <Drawer.Screen name="Home" component={App} options={{ title: 'Início' }} />
                                    <Drawer.Screen name="Login" component={Login} />
                                </Drawer.Navigator>
                            )}
                        </NavigationContainer>
                    </React.Fragment>
                </PreferencesContext.Provider>
            </SafeAreaProvider>
        </PaperProvider>
    );
}
