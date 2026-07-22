import axios from "axios";

export const fetchApod = async () => {

    const { data } = await axios.get(

`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`

    );

    return data;
};