import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // রুট পরিবর্তন হলে smooth scroll করবে top এ
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    return null;
}
