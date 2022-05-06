/* eslint-disable import/first */
import axios from "axios";
import auth from "./Auth";

const configValue: string = (process.env.REACT_APP_API_URL as string);
const apiService = axios.create({
    baseURL: "https://f682-2804-1b2-81-fe8f-9509-7383-a8c9-51a6.ngrok.io/api",
});

apiService.interceptors.request.use(async config => {
    config.headers = {
        Accept: 'application/json',
        ContentType: 'application/json',
    };
    const token: any = await auth.getToken();
    if (token !== null) {
        config.headers = {
            Accept: 'application/json',
            ContentType: 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});


export default apiService;