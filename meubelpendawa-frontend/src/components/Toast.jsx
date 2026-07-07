import { CgDanger } from "react-icons/cg";

const Toast = ({ show, message, type = "error" }) => {
  if (!show) return null;

  return (
    <div
      className={`
        fixed top-5 left-1/2 -translate-x-1/2 z-[9999]
        flex items-center gap-2
        px-4 py-2
        rounded-lg shadow-lg
        text-sm font-medium text-white
        animate-[slideDown_0.3s_ease-out]
        ${type === "success" ? "bg-green-600" : ""}
        ${type === "error" ? "bg-red-600" : ""}
        ${type === "warning" ? "bg-red-600" : ""}
      `}
    >
      <CgDanger size={18} />

      <span>{message}</span>
    </div>
  );
};

export default Toast;
