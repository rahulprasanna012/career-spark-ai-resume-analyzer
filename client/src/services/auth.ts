import { useNavigate } from "react-router-dom";
import type { LoginTypes, RegisterTypes } from "../types/auth";
import api from "../utils/api";
import Cookies from "js-cookie";



export const login = async (data: LoginTypes) => {
  try {
    const res = await api.post("/auth/login", data);

   
    if (res.data.token &&res.data.user) {
    localStorage.setItem("user",JSON.stringify(res.data.user)) 
      Cookies.set("token", res.data.token, { expires: 7 }); 
    }

    return res.data; 
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};



export const register = async (data: RegisterTypes) => {
  try {
    const res = await api.post("/auth/register", data);

   
    if (res.data.token &&res.data.user) {

    localStorage.setItem("user",JSON.stringify(res.data.user))        
      Cookies.set(res.data.token, res.data.token, {
      expires: 7,
      sameSite: "Lax",
      path: "/",
    });
    }

    return res.data; 
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

export const logout=()=>{

    Cookies.remove("token")
    localStorage.removeItem("user")
  


}