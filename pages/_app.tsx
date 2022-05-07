import "swiper/css/bundle";
import "../styles/globals.css";
import "../styles/fontawesome/css/fontawesome.min.css";
import "../styles/fontawesome/css/brands.min.css";
import "../styles/fontawesome/css/solid.min.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
