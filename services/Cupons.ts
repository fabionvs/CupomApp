/* eslint-disable import/first */
import api from "./Api";

const getCupons = (data) => {
    return api
        .get("/list/public/cupons", {
            params: data
        })
        .then((response) => {
            return response.data;
        });
};

const pegar = (data) => {
    return api
        .get("/cupom/pegar", {
            params: data
        })
        .then((response) => {
            return response.data;
        });
};

const userCupons = () => {
    return api
        .get("/user/cupons")
        .then((response) => {
            return response.data;
        });
};



export default {
    getCupons,
    pegar,
    userCupons
};