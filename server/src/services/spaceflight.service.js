import axios from "axios";

export const fetchSpaceflightNews = async () => {

    const { data } = await axios.get(
        "https://api.spaceflightnewsapi.net/v4/articles"
    );

    return data.results;
};