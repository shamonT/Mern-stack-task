"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const sortingOptions = [
  { value: "price-asc", label: "Sort by price (asc)" },
  { value: "price-desc", label: "Sort by price (desc)" },
  { value: "created_at-asc", label: "Sort by created at (asc)" },
  { value: "created_at-desc", label: "Sort by created at (desc)" },
  { value: "rating-asc", label: "Sort by rating (asc)" },
  { value: "rating-desc", label: "Sort by rating (desc)" },
];

function SortBy() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    const currentSort = searchParams.get("sortBy") || "";
    setSortOption(currentSort);
  }, [searchParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    // Build the new URL with updated sort parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSortOption);

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="text-black flex gap-2">
      <p className="text-white text-lg">Sort By</p>
      <select
        name="sorting"
        id="sorting"
        value={sortOption}
        onChange={handleSortChange}
      >
        <option value="">None</option>
        {sortingOptions.map((option, i) => (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortBy;
