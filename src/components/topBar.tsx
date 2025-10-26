"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Trash from "../../public/trash.json";

function TopBarButton({ name, link }: { name: string; link?: string }) {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-white px-10 py-2 rounded-md text-sm font-bold hover:bg-gray-700"
    >
      {name}
    </button>
  );
}

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; description: string; id: number; disposeMethod: string }[]
  >([]);

  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const trashResults = Trash.trashItems.filter((item) => {
        if (item.name.toLowerCase().includes(searchTerm)) {
          return true;
        }
        return false;
      });
      setSearchResults(trashResults);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const router = useRouter();

  const ChangeWebpage = (id: number) => {
    router.push(`/item/${id}`);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Search..."
        className="px-4 w-50 h-9 rounded-md border-1 border-gray-300 font-bold focus:ring-blue-500"
        onChange={(Bar) => {
          setSearchTerm(Bar.target.value.toLowerCase());
        }}
        onFocus={() => setInFocus(true)}
        onBlur={() => {
          setTimeout(() => {
            setInFocus(false);
          }, 50);
        }}
      />
      <div
        className={`mt-2 top-full w-50 text-white font-bold absolute bg-gray-800 ${
          inFocus ? "block" : "hidden"
        }`}
      >
        {searchResults.map((result) => (
          <button
            key={result.id}
            onClick={() => ChangeWebpage(result.id)}
            onMouseDown={(e) => e.preventDefault()}
            className="hover:bg-gray-700 cursor-pointer pl-2 w-50 text-left"
          >
            {result.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TopBar() {
  const router = useRouter();

  const handleTitleClick = () => {
    router.push("/home");
  };

  return (
    <div className="w-full h-12 bg-gray-800 text-white flex items-center px-4">
      <button className="text-lg font-semibold" onClick={handleTitleClick}>
        Trash App
      </button>
      <div className="ml-auto flex space-x-2">
        <SearchBar />
        <TopBarButton name="Home" link="/home" />
        <TopBarButton name="Identify" link="/identify" />
        <TopBarButton name="Catalog" link="/catalog" />
        <TopBarButton name="About" link="/about" />
      </div>
    </div>
  );
}
