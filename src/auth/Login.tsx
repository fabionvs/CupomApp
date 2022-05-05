import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Image,
    Dimensions,
    StyleSheet,
    Platform,
    SafeAreaView,
    Linking,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import Auth from '../../services/Auth';
import { AsyncStorage } from 'react-native';
import Logo from '../../assets/logo-256.png';

const DEFAULT_IMAGE = Image.resolveAssetSource(Logo).uri;

export default function Login({ navigation }) {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        Linking.removeEventListener
    })
    useEffect(() => {
        Auth.logout()
    },[])
    const handleLogin = () => {
        Auth.loginUrl().then(
            (response: any) => {
                setUrl(response.url);
                Linking.openURL(response.url);
                Linking.addEventListener('url', handleOpenURL)
            },
            (error: any) => {
                console.log(error)
            }
        );
    };
    const handleOpenURL = (event) => {
        const hasToken = event.url.includes('token')
        if(hasToken){
            const url = event.url.split('=')[1];
            Auth.storeUser(url);
            navigation.navigate('Home')
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Image source={{ uri: DEFAULT_IMAGE }} />
                <Text style={styles.text}>Esse é um aplicativo demonstrativo feito para o TCC Uniceub 01/2022</Text>
                <Button icon="google" mode="contained" onPress={() => handleLogin()}>
                    Faça login com Google
                </Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonSection: {
        width: '100%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        width: '50%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});