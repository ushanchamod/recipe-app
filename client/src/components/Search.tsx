import { useEffect } from "react";
import { SearchIcon } from "lucide-react";
import useSearchDebounce from "../hooks/useSearchDebounce";

type Props = {
  searchQuery: {
    field: string;
    fieldDebounceValue: string;
  };
  setSearchQuery: (query: any) => void;
};

const SearchComponent = ({ searchQuery, setSearchQuery }: Props) => {
  const debouncedSearchTerm = useSearchDebounce(searchQuery.field);

  useEffect(() => {
    console.log(`Debounced search term: ${debouncedSearchTerm}`);

    setSearchQuery((prv: any) => ({
      ...prv,
      fieldDebounceValue: debouncedSearchTerm,
    }));
  }, [debouncedSearchTerm]);

  return (
    <div className="relative mb-8 max-w-lg">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery.field}
        onChange={(e) =>
          setSearchQuery((prv: any) => ({
            ...prv,
            field: e.target.value,
          }))
        }
        className="w-full pl-10 pr-4 py-3 text-base bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all overflow-hidden"
      />

      {/* clear button */}
      <button
        onClick={() =>
          setSearchQuery((prv: any) => ({
            ...prv,
            field: "",
            fieldDebounceValue: "",
          }))
        }
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-600 h-full px-4.5 rounded-br-lg rounded-tr-lg text-white font-medium hover:bg-orange-700 transition-colors duration-200 cursor-pointer flex items-center justify-center"
      >
        Clear
      </button>
    </div>
  );
};

export default SearchComponent;
