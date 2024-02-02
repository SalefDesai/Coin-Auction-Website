import axios from "axios";
import { checkIsAuthenticated, getUserProfile } from "./Routes";


export const isAuthenticatedFromClient = async () => {
    const data = await JSON.parse(localStorage.getItem("coin-auction"));

    if (!data) return false;

    const response = await axios.post(`${getUserProfile }`,{
        token : data.jwtToken
    });

    // console.log("respones : ", response);


    return response.data;

        // if (response.data.success) {
        //   setUser(response.data.user);
        //   setIsLogin(true);
        // } else {
        //   setIsLogin(false);
        //   localStorage.removeItem("coin-auction");
        //   setUser({});
        // }
}