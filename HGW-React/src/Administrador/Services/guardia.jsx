import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Secure({ children }){
    let navigate = useNavigate();
    const [hasPermiso, setHasPermiso] = useState(true);
    useEffect(()=>{
        if(!hasPermiso){
            navigate("/no-autorizado");
        }
    }, [hasPermiso])
    if(hasPermiso){
        return children;
    }
}