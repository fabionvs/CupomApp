/* eslint-disable import/first */
import api from "./Api";

const getFiliais = (location, categoria = null) => {
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

const getCategorias = (categoria) => {
    return api
        .get("/list/categories", {
            params: {nm_categoria : categoria}
        })
        .then((response) => {
            return response.data;
        });
};


export default {
    getFiliais,
    getCategorias
};