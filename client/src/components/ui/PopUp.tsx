import { X } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Loading from "./Loading";
import type { recipeType } from "../../pages/Home";

type Props = {
  children: ReactNode;
  title: string;
  setAddNewPopup: (recipe: null | recipeType) => void;
  loading: boolean;
};

const PopUp = ({
  children,
  title = "title",
  setAddNewPopup,
  loading,
}: Props) => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div
        className="
          bg-white backdrop-blur-md rounded-lg shadow-lg text-gray-800 relative
          w-full max-w-[95%] sm:max-w-[600px] md:max-w-[700px]
          max-h-[95%] flex flex-col overflow-hidden
        "
      >
        {loading && (
          <div className="absolute w-full h-full top-0 left-0 z-2">
            <Loading />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <p className="font-bold text-lg sm:text-2xl">{title}</p>
          <motion.button
            className="
              p-1 rounded-md bg-gray-100/80 
              hover:bg-red-50 dark:hover:bg-red-900/20 
              text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400
              transition-all duration-200 ease-out
              ring-1 ring-gray-200/50 dark:ring-gray-700/50
              hover:ring-red-200 dark:hover:ring-red-800/50 cursor-pointer
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAddNewPopup(null)}
            aria-label="Close dialog"
          >
            <X size={20} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-auto flex-1">{children}</div>
      </div>
    </motion.div>
  );
};

export default PopUp;
