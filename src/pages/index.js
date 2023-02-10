import data from "../utils/data";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";


export default function Home() {
  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.products.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
    </Layout>
  )
}
