import { CgDanger } from "react-icons/cg";

const Toast = ({ message, type = "error" }) => {
  return (
    <div
      className={`
        absolute top-3 left-1/2 -translate-x-1/2 z-[9999]
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