import { createContext, useContext, useState } from "react";
import AlertPopup from "../components/AlertPopup.jsx";

const AlertContext = createContext();

export function AlertProvider({ children }) {
    const [alertData, setAlertData] = useState({
        show: false,
        title: "",
        message: "",
        type: "alert",
        onConfirm: null,
    });

    const showAlert = (title, message) => {
        setAlertData({
        show: true,
        title,
        message,
        type: "alert",
        onConfirm: null,
        });
    };

    const showConfirm = (title, message, onConfirm) => {
        setAlertData({
        show: true,
        title,
        message,
        type: "confirm",
        onConfirm,
        });
    };

    const closeAlert = () => {
        setAlertData({ ...alertData, show: false });
    };

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
        {children}
        <AlertPopup
            show={alertData.show}
            onClose={closeAlert}
            title={alertData.title}
            message={alertData.message}
            type={alertData.type}
            onConfirm={alertData.onConfirm}
        />
        </AlertContext.Provider>
    );
}

export function useAlertContext() {
    return useContext(AlertContext);
}
