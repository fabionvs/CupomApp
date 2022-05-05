/* eslint-disable import/first */
import api from "./Api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginUrl = () => {
    return api
        .get("/auth/google")
        .then((response) => {
            return response.data;
        });
};

const storeUser = async (value) => {
    try {
        await AsyncStorage.setItem('user', value)
    } catch (e) {
        // saving error
    }
}

const logout = async () => {
    try {
        await AsyncStorage.removeItem('user')
    } catch (e) {
        // saving error
    }
}


const getToken = async () => {
    let user = await AsyncStorage.getItem('user');
    return user;
};

const callApiUrl = (url: string, body: any) => {
    return api
        .get(url, {
            params: body
        })
        .then((response) => {
            return response;
        });
};



export default {
    logout,
    getToken,
    callApiUrl,
    loginUrl,
    storeUser
};