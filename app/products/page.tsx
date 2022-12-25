import ProductList from '../../components/ProductList/ProductList';

const products = [
  {
    title: 'AMD Ryzen 5 2600',
    description: 'Rate it for the first time!',
    image:
      'https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg',
    isRatedAlready: false,
  },
  {
    title: 'AMD Ryzen 5 2600',
    description: 'Already rated! Want to change it?',
    image:
      'https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg',
    isRatedAlready: true,
  },
  {
    title: 'AMD Ryzen 5 2600',
    description: 'Rate it for the first time!',
    image:
      'https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg',
    isRatedAlready: false,
  },
  {
    title: 'AMD Ryzen 5 2600',
    description: 'Already rated! Want to change it?',
    image:
      'https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg',
    isRatedAlready: true,
  },
  {
    title: 'AMD Ryzen 5 2600',
    description: 'Rate it for the first time!',
    image:
      'https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg',
    isRatedAlready: false,
  },
  {
    title: 'AMD Ryzen 5 2600',
    description: 'Already rated! Want to change it?',
    image:
      'https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg',
    isRatedAlready: true,
  },
  {
    title: 'AMD Ryzen 5 2600',
    description: 'Rate it for the first time!',
    image:
      'https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg',
    isRatedAlready: false,
  },
  {
    title: 'AMD Ryzen 5 2600',
    description: 'Already rated! Want to change it?',
    image:
      'https://www.notebookcheck.net/fileadmin/Notebooks/AMD/ryzen5_badge.jpg',
    isRatedAlready: true,
  },
];

const ProductsPage = () => {
  return (
    <div>
      <ProductList products={products} />
    </div>
  );
};

export default ProductsPage;
