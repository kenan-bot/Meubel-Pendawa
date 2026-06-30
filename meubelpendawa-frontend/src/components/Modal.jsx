const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
    bg-black/40 backdrop-blur-sm p-3"
    >
      <div
        className="animate-modal-show bg-white rounded-xl shadow-xl
        w-[95%] sm:w-[90%] md:w-full max-w-3xl
        p-4 md:p-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">{title}</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
