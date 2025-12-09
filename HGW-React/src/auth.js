import { jwtDecode } from "jwt-decode"

export const isLoggedIn = () => {
    if (localStorage.getItem('token')) return true;
    return false;
};

export const datosToken = ()=>{
  let token = localStorage.getItem("token");
  if(!token) return null;
  return jwtDecode(token);
}