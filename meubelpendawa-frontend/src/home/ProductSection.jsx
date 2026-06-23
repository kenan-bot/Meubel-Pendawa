function ProductSection() {
  return (
    <section className="max-w-7xl mx-auto py-12">

      <SearchBar />

      <ProductFilter />

      <ProductCard />

      <Pagination />

    </section>
  );
}

export default ProductSection;