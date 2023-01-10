import Head from "next/head";
import ProductList from "../../components/ProductList/ProductList";

const products = [
  {
    title: "AMD Ryzen 5 2600",
    description: "Rate it for the first time!",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
    isRatedAlready: false,
  },
  {
    title: "AMD Ryzen 5 2600",
    description: "Already rated! Want to change it?",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
    isRatedAlready: true,
  },
  {
    title: "AMD Ryzen 5 2600",
    description: "Rate it for the first time!",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
    isRatedAlready: false,
  },
  {
    title: "AMD Ryzen 5 2600",
    description: "Already rated! Want to change it?",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
    isRatedAlready: true,
  },
  {
    title: "AMD Ryzen 5 2600",
    description: "Rate it for the first time!",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
    isRatedAlready: false,
  },
  {
    title: "AMD Ryzen 5 2600",
    description: "Already rated! Want to change it?",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
    isRatedAlready: true,
  },
  {
    title: "AMD Ryzen 5 2600",
    description: "Rate it for the first time!",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
    isRatedAlready: false,
  },
  {
    title: "AMD Ryzen 5 2600",
    description: "Already rated! Want to change it?",
    image:
      "https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg",
    isRatedAlready: true,
  },
];

export default function ProductsPage() {
  return (
    <>
      <Head>
        <title>RateItFair - Products</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="A list with the products of your favourite companies!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <ProductList products={products} />
      </div>
    </>
  );
}
