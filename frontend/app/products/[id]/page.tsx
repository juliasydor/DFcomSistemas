import { ProductDetail } from "@/components/product-detail";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  return <ProductDetail productId={params.id} />;
}
