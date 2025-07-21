import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { isLoggedIn } from '../../auth';

export default function Secure({ children }){
    let navigate = useNavigate();
    const [hasPermiso, setHasPermiso] = useState(isLoggedIn);
    useEffect(()=>{
        if(!hasPermiso){
            navigate("/Administrador/no-autorizado");
        }
    }, [hasPermiso])
    if(hasPermiso){
        return children;
    }
}