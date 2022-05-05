/* eslint-disable import/first */
import api from "./Api";

const getFiliais = (data) => {
    return api
        .get("/list/public", {
            params: data
        })
        .then((response) => {
            return response.data;
        });
};



export default {
    getFiliais
};