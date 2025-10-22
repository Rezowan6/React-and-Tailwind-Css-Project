/* eslint-disable no-unused-vars */
export default function AlertPopup({ show, onClose, title, message, type, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div
        className="bg-[#1E1E2F] text-white p-6 rounded-3xl w-80 md:w-96 text-center border border-teal-400 backdrop-blur-md shadow-[0_0_25px_rgba(20,184,166,0.4)]"
      >
        <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500">
          {title}
        </h3>

        <p className="text-gray-300 mb-4">{message}</p>

        <div className="flex justify-center gap-4">
          {type === "alert" && (
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-md w-full font-medium hover:opacity-90 transition"
            >
              OK
            </button>
          )}

          {type === "confirm" && (
            <>
              <button
                onClick={() => {
                  onConfirm && onConfirm();
                  onClose();
                }}
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white px-4 py-2 rounded-md w-1/2 font-medium hover:opacity-90 transition"
              >
                Yes
              </button>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 text-white px-4 py-2 rounded-md w-1/2 font-medium hover:opacity-90 transition"
              >
                No
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}














