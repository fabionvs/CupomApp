/* eslint-disable import/first */
import axios from "axios";
import auth from "./Auth";

const configValue: string = (process.env.REACT_APP_API_URL as string);
const apiService = axios.create({
    baseURL: "https://api.zenyv.com/api",
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