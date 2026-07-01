import { CgDanger } from "react-icons/cg";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/40 backdrop-blur-sm p-3"
    >
      <div
        className="animate-modal-show bg-white rounded-xl shadow-xl
        w-[95%] sm:w-[90%] max-w-md p-5"
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center mb-3">
          <div className="bg-red-100 p-3 rounded-full">
            <CgDanger
              size={35}
              className="text-red-500"
            />
          </div>
        </div>

        <h2 className="text-center text-lg font-bold">
          {title}
        </h2>

        <p className="text-center text-gray-600 mt-2">
          {message}
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-md
              border border-gray-300
              hover:bg-gray-100
              transition-all duration-200
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-md
              bg-red-500 text-white
              hover:bg-red-600
              hover:scale-105
              active:scale-95
              transition-all duration-200
            "
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;