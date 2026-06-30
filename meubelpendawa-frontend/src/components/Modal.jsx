const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
    bg-black/40 backdrop-blur-sm
        transition-all duration-300"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5
        animate-[modalShow_0.25s_ease-out]"
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
