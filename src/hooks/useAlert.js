import { useState } from "react";

export default function useAlert() {
    const [alertData, setAlertData] = useState({
        show: false,
        title: "",
        message: "",
        type: "alert", // 'alert' | 'confirm'
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

const closeAlert = () => setAlertData({ ...alertData, show: false });

    return { alertData, showAlert, showConfirm, closeAlert };
}



