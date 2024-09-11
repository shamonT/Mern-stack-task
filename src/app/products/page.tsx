import { getProducts } from "@/actions/productActions";
import { DEFAULT_PAGE_SIZE } from "../../../constant";
import PaginationSection from "@/components/PaginationSection";
import SortBy from "@/components/SortBy";
import Filter from "@/components/Filter";
import ProductTable from "@/components/ProductTable";
import { Suspense } from "react";
import { getCategories } from "@/actions/categoryActions";
import { getBrands } from "@/actions/brandActions";
import { useRouter } from "next/navigation";


export default async function Products({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

//This line of code is using destructuring assignment to extract specific properties from the searchParams object
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE,sortBy='',  brandId,
    categoryId,
    priceRangeTo,
    gender,
    occasions,
    discount, } = searchParams as any;
    
//hitting the get product function by taking all the params in the url
    const { products, lastPage, numOfResultsOnCurPage } = await getProducts(
      +page,
      +pageSize,
      sortBy, 
        brandId,
        categoryId,
        priceRangeTo,
        gender,
        occasions,
        discount,
      
    );

  const brands = await getBrands();
  const categories = await getCategories();
  
  return (
    <div className="pb-20 pt-8">
      <h1 className="text-4xl mb-8">Product List</h1>
      <div className="mb-8">
        <SortBy />
        <div className="mt-4">
          <Filter categories={categories} brands={brands} />
        </div>
      </div>

      <h1 className="text-lg font-bold mb-4">Products</h1>
      <Suspense
        fallback={<p className="text-gray-300 text-2xl">Loading Products...</p>} 
      >
        <ProductTable
          products={products}
          numOfResultsOnCurPage={numOfResultsOnCurPage}
        />
      </Suspense>
      {products.length > 0 && (
        <PaginationSection
          lastPage={lastPage}
          pageNo={+page}
          pageSize={+pageSize}
        />
      )}
    </div>
  );
}
