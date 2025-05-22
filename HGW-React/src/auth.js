export const isLoggedIn = () => {
    // Esto es solo un ejemplo, puedes cambiarlo por tu lógica real de login
    return localStorage.getItem("auth") === "true";
};
