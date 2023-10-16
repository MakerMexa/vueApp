import axios from "axios";

//definiendo api que vamos a consumir
const instance = axios.create({
    baseURL: "https://restcountries.com/v3.1",
});

export default instance;

