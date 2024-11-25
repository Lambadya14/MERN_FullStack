import axios from "axios";
import { useEffect, useState } from "react";

const Homepage = () => {
  const [dataProduct, setDataProdct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDataProduct = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:5000/api/products/",
          headers: {},
        };

        const response = await axios.request(config);
        setDataProdct(response.data.data); // Sesuaikan dengan struktur data Anda
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getDataProduct();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {dataProduct.length > 0 ? (
        dataProduct.map((product, index) => (
          <div key={index}>
            <p>{product.name}</p>
            <p>{product.price}</p>
            <img className="w-[50px ]" src={product.image} alt="image" />
          </div>
        ))
      ) : (
        <p>Data kosong</p>
      )}
    </div>
  );
};

export default Homepage;
