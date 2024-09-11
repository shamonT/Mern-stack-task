import { getProduct } from "@/actions/productActions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log(id);
  
  const product: any = await getProduct(+id);
  const productArr: any = product[0];
console.log(productArr);

  return {
    title: productArr.name,
    description: productArr.description,
  };
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
