/* eslint-disable import/first */
import api from "./Api";

const getFiliais = (location, categoria) => {
    let data :any = {latitude: location.latitude, longitude: location.longitude};
    if(categoria !== ""){
        data.nm_categoria = categoria;
    }
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