export function getYouTubeId(url) {
    if (!url) return null;
    try {
        if (url.includes("youtu.be/")) {
            return url.split("youtu.be/")[1].split("?")[0];
        }
        if (url.includes("watch?v=")) {
            return url.split("v=")[1].split("&")[0];
        }
        if (url.includes("/embed/")) {
            return url.split("/embed/")[1].split("?")[0];
        }
        if (url.includes("/shorts/")) {
            return url.split("/shorts/")[1].split("?")[0];
        }
        return null;
    } catch {
        return null;
    }
}
