// src/hooks/useAlert.js
import { useState } from "react";

export default function useAlert() {
    const [alertData, setAlertData] = useState({
        show: false,
        title: "",
        message: "",
        type: "alert",
        onConfirm: null,
        autoHide: 0,
    });

    const showAlert = (title, message, autoHide = 6000) => {
        setAlertData({
        show: true,
        title,
        message,
        type: "alert",
        onConfirm: null,
        autoHide,
        });
    };

    const showConfirm = (title, message, onConfirm) => {
        const data = { show: true, title, message, type: "confirm", onConfirm, autoHide: 0 };
        if (alertData.show) {
        setAlertData((prev) => ({ ...prev, show: false }));
        setTimeout(() => setAlertData(data), 100);
        } else {
        setAlertData(data);
        }
    };

    const closeAlert = () => setAlertData((prev) => ({ ...prev, show: false }));

    const confirmAction = () => {
        if (typeof alertData.onConfirm === "function") {
        const callback = alertData.onConfirm;
        closeAlert();
        setTimeout(callback, 100);
        }
    };

    return { alertData, showAlert, showConfirm, closeAlert, confirmAction };
}








