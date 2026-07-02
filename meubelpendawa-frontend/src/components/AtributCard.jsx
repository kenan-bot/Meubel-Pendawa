import { FiEdit2 } from "react-icons/fi";
import AnimatedSection from "./AnimatedSection";

const AtributCard = ({ nama, onClick }) => {
  return (
    <AnimatedSection>
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-orange-200
      bg-white cursor-pointer hover:border-orange-500 hover:shadow-md hover:-translate-y-0.5
      active:translate-y-0 active:scale-[0.99] transition-all duration-200"
      >
        <span className="font-medium text-gray-800 truncate text-left">
          {nama}
        </span>

        <div
          className="
          p-2 rounded-lg
          text-orange-500
          bg-orange-50
        "
        >
          <FiEdit2 size={16} />
        </div>
      </button>
    </AnimatedSection>
  );
};

export default AtributCard;
