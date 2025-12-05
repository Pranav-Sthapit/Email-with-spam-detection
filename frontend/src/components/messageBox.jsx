export default function MessageBox({ visible, message, color, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
      
      <div className="rounded-xl bg-white shadow-lg relative w-[320px] break-words">

        {/* Top Blue Bar */}
        <div className="w-full h-10 bg-blue-600 rounded-t-xl flex items-center justify-between px-3">
          <span className="text-white font-semibold">Message</span>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-700"
          >
            ✖
          </button>
        </div>

        {/* Message Body (auto height) */}
        <div className={`p-4 text-center ${color}`}>
          {message}
        </div>
      </div>

    </div>
  );
}
