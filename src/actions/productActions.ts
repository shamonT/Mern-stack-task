//@ts-nocheck
"use server";

import { sql } from "kysely";
import { DEFAULT_PAGE_SIZE } from "../../constant";
import { db } from "../../db";
import { InsertProducts, UpdateProducts } from "@/types";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/utils/authOptions";
import { cache } from "react";




export async function getProducts(
  pageNo = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sortBy = '',
  brandId?: string | string[],  
  categoryId?: string | string[], 
  priceRangeTo?: number,  
  gender?: string,       
  occasions?: string,    
  discount?: string    
) {
  try {
    let sortField = 'created_at';  
    let sortOrder = 'asc';       

  //Checking  the field and order  and storing in the above fields
    if (sortBy) {
      const [field, order] = sortBy.split('-');
      if (['price', 'created_at', 'rating'].includes(field)) {
        sortField = field;
      }
      if (['asc', 'desc'].includes(order)) {
        sortOrder = order;
      }
    }
//
    let query = db
    .selectFrom('products')
    .innerJoin('product_categories', 'products.id', 'product_categories.product_id') 
    .innerJoin('categories', 'product_categories.category_id', 'categories.id') 
    .selectAll('products')
    .distinct()
    .offset((pageNo - 1) * pageSize)
    .limit(pageSize)
    .orderBy(sortField, sortOrder);
   console.log(query,"query");
   
   if (categoryId) {
      
      
      const categoryIds = categoryId.split(',').map(categoryId => categoryId.trim());
     
      
      query = query.where('product_categories.category_id', 'in', categoryIds);  
    }
    // Price range filtering
    if (priceRangeTo) {
      query = query.where('products.price', '<=', priceRangeTo);
    }

    // Gender filtering
    if (gender) {
      query = query.where('products.gender', '=', gender);
    }

    // Occasions filtering

    
    if (occasions) {
      query = query.where('products.occasion', '=', occasions);
    }

    // Discount filtering
    if (discount) {
      const [discountFrom, discountTo] = discount.split('-').map(Number);
      query = query
        .where('products.discount', '>=', discountFrom)
        .where('products.discount', '<=', discountTo);
    }

  
    let products = await query.execute();
    if (brandId) {
     
      const brandIds = brandId.split(',').map(id => id.trim());
      products = products.filter(product => {
      
        const productBrands = JSON.parse(product.brands); 

const productBrandIds = productBrands.map(id => id.toString());
return brandIds.some(id => productBrandIds.includes(id));
          });}
 
    
    const numOfResultsOnCurPage = products.length;

    
    const countResult = await db
      .selectFrom('products')
      .select(db.fn.count('products.id').as('count'))
      .executeTakeFirst();  

    const count = countResult?.count ?? 0;
    const lastPage = Math.ceil(count / pageSize);


    return { products, count, lastPage, numOfResultsOnCurPage };
  } catch (error) {
    throw error;
  }
}



export const getProduct = cache(async function getProduct(productId: number) {
  console.log("run");
  try {
    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .execute();

    return product;
  } catch (error) {
    return { error: "Could not find the product" };
  }
});

async function enableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 1`.execute(db);
}

async function disableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 0`.execute(db);
}

export async function deleteProduct(productId: number) {
  try {
    await disableForeignKeyChecks();
    await db
      .deleteFrom("product_categories")
      .where("product_categories.product_id", "=", productId)
      .execute();
    await db
      .deleteFrom("reviews")
      .where("reviews.product_id", "=", productId)
      .execute();

    await db
      .deleteFrom("comments")
      .where("comments.product_id", "=", productId)
      .execute();

    await db.deleteFrom("products").where("id", "=", productId).execute();

    await enableForeignKeyChecks();
    revalidatePath("/products");
    return { message: "success" };
  } catch (error) {
    return { error: "Something went wrong, Cannot delete the product" };
  }
}

export async function MapBrandIdsToName(brandsId) {

  
  const brandsMap = new Map();
  console.log(brandsId,"hhhh");
  try {
    for (let i = 0; i < brandsId.length; i++) {
   
      const brandId = brandsId.at(i);
      const brand = await db
        .selectFrom("brands")
        .select("name")
        .where("id", "=", +brandId)
        .executeTakeFirst();
      brandsMap.set(brandId, brand?.name);
    }
 
    
    return brandsMap;
  } catch (error) {
    throw error;
  }
}

export async function getAllProductCategories(products: any) {
  try {
    const productsId = products.map((product) => product.id);
    const categoriesMap = new Map();

    for (let i = 0; i < productsId.length; i++) {
      const productId = productsId.at(i);
      const categories = await db
        .selectFrom("product_categories")
        .innerJoin(
          "categories",
          "categories.id",
          "product_categories.category_id"
        )
        .select("categories.name")
        .where("product_categories.product_id", "=", productId)
        .execute();
      categoriesMap.set(productId, categories);
    }
    return categoriesMap;
  } catch (error) {
    throw error;
  }
}

export async function getProductCategories(productId: number) {
  try {
    const categories = await db
      .selectFrom("product_categories")
      .innerJoin(
        "categories",
        "categories.id",
        "product_categories.category_id"
      )
      .select(["categories.id", "categories.name"])
      .where("product_categories.product_id", "=", productId)
      .execute();

    return categories;
  } catch (error) {
    throw error;
  }
}


export async function addProduct(values) {
  try {
  
    const price = values.old_price - (values.old_price * values.discount / 100);
    await db
      .insertInto('products')
      .values({
        name: values.name,
        description: values.description,
        price: price,
        rating: values.rating,
        old_price: values.old_price,
        discount: values.discount,
        colors: values.colors,
        gender: values.gender,
        brands: JSON.stringify(values.brands.map(brand => brand.value)), 
        occasion: values.occasion.map(o => o.value).join(','), 
        image_url:values.image_url,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute(); 

//fetching the id of current entry to add data into product categories table to make relation
    const data = await db
      .selectFrom('products')
      .select('id')
      .orderBy('id', 'desc')
      .limit(1)
      .executeTakeFirst();


   
    if (values.categories.length > 0) {
      await db
        .insertInto('product_categories')
        .values(
          values.categories.map(category => ({
            category_id: category.value, 
            product_id: data.id, 
            created_at: new Date(),
            updated_at: new Date(),
          }))
        )
        .execute(); 
    }

    return true; 
  } catch (error) {
    console.error("Error adding product:", error);
    return false 
  }
}

//update functionality
export async function updateProduct(values) {
  try {
   const oldPrice = parseFloat(values.values.old_price);
    const discount = parseFloat(values.values.discount);
     const price = oldPrice - (oldPrice * (discount / 100));
    
   
     //updating the values into the products table
    await db
      .updateTable('products')
      .set({
        name: values.values.name,
        description: values.values.description,
        price: price,
        rating: values.values.rating,
        old_price: oldPrice,
        discount: discount,
        colors: values.values.colors, 
        gender: values.values.gender,
        brands: values.values.brands ? JSON.stringify(values.values.brands.map(brand => brand.value)) : '[]', 
        occasion: values.values.occasion ? values.values.occasion.map(o => o.value).join(',') : '', 
        image_url:values.values.image_url,

        updated_at: new Date(),
      })
      .where('id', '=', values.id)
      .execute();

    //deleting the preexisting product_categories row related to the product
    await db
      .deleteFrom('product_categories')
      .where('product_id', '=', values.id)
      .execute();

//adding a new product_categories row related to the product
    if (values.values.categories) {
      await db
        .insertInto('product_categories')
        .values(
          values.values.categories.map(category => ({
            category_id: category.value,
            product_id: values.id,
            created_at: new Date(),
            updated_at: new Date(),
          }))
        )
        .execute();
    }

    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
}










