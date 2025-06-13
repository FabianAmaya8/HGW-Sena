export const isLoggedIn = () => {
    if (localStorage.getItem('user')) return true;
    return false;
};
