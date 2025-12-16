import { useState, useRef, useEffect } from "react";
import { findWorkingBaseUrl } from "../../../urlDB";
import { Box, Button, TextField, Typography, InputBase } from '@mui/material';

const BACKEND = findWorkingBaseUrl().replace(/\/$/, "");

export default function ChatBot() {
    const [IsChat, setIsChat] = useState(false);
    const [conversacion, setConversacion] = useState([]);
    const [mensaje, setMensaje] = useState({el: "", bot: null});
    const [estado, setEstado] = useState("usuario");
    const input = useRef();
    const agregar = async ()=>{
            let respuesta = await fetch(BACKEND+"/ChatBot", {
                    method: "POST",
                    headers: {"content-type": "application/json"},
                    body: JSON.stringify(mensaje)
            });
            respuesta = await respuesta.json();
            setConversacion((value)=>{
                const arreglo = [...value];
                let copia = {...mensaje};
                copia["bot"] = respuesta;
                arreglo.push(copia)
                input.current.value = "";
                setMensaje({el: "", bot: null});
                return arreglo
        })};
    return (
        <div className="dropup-center dropup chat-bot" style={IsChat ? {background: "gray", width: "20%", height: "60%", transition: "200ms", borderRadius: "15px"}: {}}>
            {
                <>
                {!IsChat &&
                    <>
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bx bxs-bot"></i>
                        </button>
                        <ul className="dropdown-menu">
                            {['Español', 'Ingles', 'Chat Bot'].map((item) => {
                                return (
                                    <li key={item}>
                                        <button className="dropdown-item" onClick={()=>item.toLowerCase() == "chat bot" && setIsChat(true)}>
                                            {item}
                                        </button>
                                    </li>   
                            )})}
                        </ul>
                    </>
                }
                    <Box sx={{...(IsChat ? {width: "100%", height: "100%"} : {width: 0, height: 0}), display:"flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", overflow: "hidden"}}>
                        <Box sx={{display:"flex", flexDirection: "row", justifyContent:"space-between", flex: 1, width: "100%",px: "1%"}}>
                            <Box></Box>
                            <Button onClick={()=>setIsChat(false)} sx={{color:"black"}}>
                                X
                            </Button>
                        </Box>
                        <Box sx={{overflowY: "auto", backgroundColor: "white", height: "75%", width: "100%", padding: "5%"}}>
                            {
                                conversacion.map((dato, index)=>{
                                    return <Box key={index} sx={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                        <Box sx={{wordBreak: "break-word", whiteSpace: "normal", display: "flex", background: "green", width: "max-content", maxWidth: "100%", px: "5%", py: "3%", color: "white", marginBottom: "3%"}}>{dato["el"]}</Box>
                                        <Box sx={{display: "flex", justifyContent:"space-between", marginBottom: "3%"}}><Box></Box><Box sx={{wordBreak: "break-word", whiteSpace: "normal", display: "flex", background: "green", width: "max-content", px: "5%", py: "3%",color: "white"}}>{dato["bot"] ?? ". . ."}</Box></Box>
                                    </Box>
                                })
                            }
                        </Box>
                        <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "5%", overflow: "hidden", gap: "4%", backgroundColor: "white", flex: 1}}>
                            <InputBase
                                placeholder="Escriba su mensaje"
                                inputRef={input}
                                variant="outlined"
                                fullWidth={false}
                                onChange={(e)=>setMensaje({el: e.target.value, bot: null})}
                                onKeyUp={(e)=>{
                                        e.keyCode == 13 && agregar();
                                    }
                                }
                                sx={{
                                    marginTop: 0,
                                    marginBottom: 0,
                                    borderBottomLeftRadius: 20,
                                    height: "100%",
                                    width: "100%",
                                    backgroundColor: "gray",  
                                        "& .MuiOutlinedInput-root": {
                                            height: "100%",
                                            "& fieldset": {
                                                height: "100%",
                                                borderColor: "#29293D",
                                    },
                                        "&:hover fieldset": {
                                            borderColor: "#29293D",
                                    },    
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#29293D",
                                    },
                                    },
                                        "& .MuiInputBase-input": {
                                            padding: "10px 12px",
                                    },
                                }}
                            />
                            <Button
                                onClick={agregar}
                                sx={{width: "30%", borderRadius: "0px 10px 10px 0px", border: "none", color: "black"}}>Enviar</Button>
                        </Box>
                    </Box>
                </>
            }
        </div>
    );
}

