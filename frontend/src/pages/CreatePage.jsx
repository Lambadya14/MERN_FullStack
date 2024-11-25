import { useState } from "react";
import { useProductStore } from "../store/product";

const Homepage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const { createProduct } = useProductStore();
  const handleAddProduct = async () => {
    const { success, message } = await createProduct(newProduct);
    console.log("Success:", success);
    console.log("Message:", message);
    setNewProduct({ name: "", price: "", image: "" });
  };

  return (
    <div>
      <h1 className="text-2xl text-[#2b2b2b] font-bold">Buat Data Barang</h1>

      <div>
        <label htmlFor="nama">Nama</label>
        <br />
        <input
          type="text"
          id="nama"
          className="border-2 rounded-md"
          placeholder="Nama"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <br />
        <label htmlFor="price">Price</label>
        <br />
        <input
          type="text"
          id="price"
          className="border-2 rounded-md"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <br />

        <label htmlFor="image">Image</label>
        <br />
        <input
          type="text"
          id="image"
          className="border-2 rounded-md"
          placeholder="Image"
          value={newProduct.image}
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.value })
          }
        />
        <br />
        <button className="bg-sky-400 w-[100px]" onClick={handleAddProduct}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Homepage;
