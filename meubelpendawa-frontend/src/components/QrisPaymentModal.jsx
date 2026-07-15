import { FaSpinner, FaExclamationCircle } from "react-icons/fa";
import Modal from "./Modal";

// Modal QRIS
const QrisPaymentModal = ({ isOpen, status = "loading", message, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pembayaran QRIS" maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center gap-3 py-3">
        {status === "error" ? (
          <>
            <FaExclamationCircle className="text-red-500" size={28} />
            <p className="text-sm text-gray-600">{message || "Gagal menyiapkan pembayaran QRIS."}</p>
          </>
        ) : (
          <>
            <FaSpinner className="text-orange-500 animate-spin" size={28} />
            <p className="text-sm text-gray-600">{message || "Menyiapkan pembayaran, mohon tunggu..."}</p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default QrisPaymentModal;