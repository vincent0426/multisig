import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        typeof document !== undefined
            ? require("bootstrap/dist/js/bootstrap")
            : null;
    }, []);
    return <Component {...pageProps} />;
}

export default MyApp;
