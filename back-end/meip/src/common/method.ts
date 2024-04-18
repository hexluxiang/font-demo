import axios from "axios";
import {GET_ACCESS_TOKEN_URL} from './constAndType'

/**
 * 
 * @returns 令牌
 */
export const getAccessToken = async () => {
    const {data}  = await axios.get(GET_ACCESS_TOKEN_URL);  
    return data;
}