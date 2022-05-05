import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
    Drawer,
    Switch,
    TouchableRipple,
    Text,
    Colors,
    useTheme,
} from 'react-native-paper';
type Props = {
    toggleTheme: () => void;
    toggleRTL: () => void;
    isRTL: boolean;
    isDarkTheme: boolean;
};

const DrawerItemsData = [
    { label: 'Meus Cupons', icon: 'inbox', key: 0, route: 'Home' },
    { label: 'Configurações', icon: 'star', key: 1, route: 'Home' },
    { label: 'Descontos', icon: 'send', key: 2, route: 'Home' },
    { label: 'Sair da Conta', icon: 'logout', key: 3, route: 'Login' },
];


const DrawerItems = ({ toggleTheme, toggleRTL, isRTL, isDarkTheme, navigation }: any) => {


    const [drawerItemIndex, setDrawerItemIndex] = React.useState<number>(0);
    const _setDrawerItem = (index: number) => {
        setDrawerItemIndex(index);
        navigation.navigate(DrawerItemsData[index].route);
    }

    const { colors } = useTheme();

    return (
        <View style={[styles.drawerContent, { backgroundColor: colors.surface }]}>
            <Drawer.Section title="Menu de Usuário">
                {DrawerItemsData.map((props, index) => (
                    <Drawer.Item
                        {...props}
                        key={props.key}
                        active={drawerItemIndex === index}
                        onPress={() => _setDrawerItem(index)}
                    />
                ))}
            </Drawer.Section>

            <Drawer.Section title="Tema">
                <TouchableRipple onPress={toggleTheme}>
                    <View style={styles.preference}>
                        <Text>Tema Escuro</Text>
                        <View pointerEvents="none">
                            <Switch value={isDarkTheme} />
                        </View>
                    </View>
                </TouchableRipple>
            </Drawer.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 22,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});

export default DrawerItems;
