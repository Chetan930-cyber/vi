import React, { useState, useEffect } from "react";
import ProductSlider from '../components/ProductSlider';

const Package = () => {
  const [selected, setSelected] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Native fetch with POST request
        const response = await fetch("http://139.59.46.251:3300/product/product-list-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ limit: 56 }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        let fetchedPackages = data?.data?.list || [];
        if (!Array.isArray(fetchedPackages) || fetchedPackages.length === 0) {
          throw new Error("Empty or invalid API Response");
        }
        setPackages(fetchedPackages);
      } catch (error) {
        console.error("Error fetching packages:", error.message);
        // Static fallback data (56 products ka sample, aapka JSON based)
        const fallbackPackages = [
          {
            _id: "66c9d0af9a698676faae418e",
            name: "Electric Kettle",
            priceRange: [{ price: 95 }],
            oldPrice: 145,
            description: "Portable electric kettle with fast boiling technology.",
            images: ["https://via.placeholder.com/300?text=Kettle1", "https://via.placeholder.com/300?text=Kettle2"],
          },
          {
            _id: "66c9d0af9a698676faae4190",
            name: "Air Conditioner",
            priceRange: [{ price: 1200 }],
            oldPrice: 1600,
            description: "Energy-efficient cooling solution.",
            images: ["https://via.placeholder.com/300?text=AC"],
          },
          {
            _id: "66c9d0af9a698676faae4192",
            name: "Washing Machine",
            priceRange: [{ price: 800 }],
            oldPrice: 1000,
            description: "Fully automatic washing machine.",
            images: ["https://via.placeholder.com/300?text=WashingMachine"],
          },
          // Add more products here if needed, maine 3 daale hain example ke liye
        ];
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="max-w-[900px] mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      {loading ? (
        <p className="text-center text-gray-500">Loading packages...</p>
      ) : packages.length === 0 ? (
        <p className="text-center text-gray-500">No packages available. Please try again later.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 min-h-[450px]">
          {/* Package Selection */}
          <div className="lg:w-2/5 w-full bg-white p-0 flex flex-col min-h-full">
            <h2 className="text-lg font-semibold mb-3">Select a Package</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 flex-grow overflow-y-auto max-h-[500px]">
              {packages.map((item) => (
                <div
                  key={item._id}
                  className={`p-4 rounded-md cursor-pointer text-sm text-center transition-all duration-300 ${
                    selected === item.name ? "bg-black text-white" : "bg-gray-100 text-black"
                  }`}
                  onClick={() => setSelected(item.name)}
                >
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="font-semibold">
                    AED {item.priceRange[0]?.price || "N/A"}{" "}
                    {item.oldPrice && (
                      <span className="text-gray-400 line-through text-xs">
                        AED {item.oldPrice}
                      </span>
                    )}
                  </p>
                  <p className={`text-xs mt-1 ${selected === item.name ? "text-white" : "text-gray-600"}`}>
                    {item.description}
                  </p>
                  {item.images && item.images.length > 0 && (
                    <ProductSlider images={item.images} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Section */}
          <div className="lg:w-3/5 w-full bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col min-h-full">
            {selected ? (
              <>
                <p className="text-center text-sm font-bold">
                  Total:{" "}
                  <span className="text-green-500 font-bold text-lg">
                    AED {packages.find((p) => p.name === selected)?.priceRange[0]?.price || "0"}
                  </span>
                  {packages.find((p) => p.name === selected)?.oldPrice && (
                    <span className="text-gray-400 line-through ml-2">
                      AED {packages.find((p) => p.name === selected)?.oldPrice}
                    </span>
                  )}
                </p>

                <div className="bg-gray-800 text-white text-sm py-2 px-3 mt-2 rounded-md text-center">
                  <span>
                    ✔️ OFFER CLAIMED! You save AED{" "}
                    {(packages.find((p) => p.name === selected)?.oldPrice || 0) -
                      (packages.find((p) => p.name === selected)?.priceRange[0]?.price || 0)}
                  </span>
                </div>

                <div className="mt-4 text-sm space-y-2 flex-grow">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Product</span>
                    <span>{selected || "N/A"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="text-gray-400">Undefined</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="text-gray-400">Undefined</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>
                      AED {packages.find((p) => p.name === selected)?.oldPrice || "0"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span>
                      AED{" "}
                      {(packages.find((p) => p.name === selected)?.oldPrice || 0) -
                        (packages.find((p) => p.name === selected)?.priceRange[0]?.price || 0)}
                    </span>
                  </p>
                </div>

                {packages.find((p) => p.name === selected)?.images?.length > 0 && (
                  <div className="mt-4">
                    <ProductSlider images={packages.find((p) => p.name === selected).images} customHeight="h-64 sm:h-80" highQuality={true} />
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg mt-4 flex justify-between">
                  <p className="text-lg font-bold">Amount to pay:</p>
                  <p className="text-lg font-bold text-black">
                    AED {packages.find((p) => p.name === selected)?.priceRange[0]?.price || "0"}
                  </p>
                </div>

                <button className="w-full bg-black text-white py-2 mt-3 rounded-md flex justify-center items-center">
                  Pay AED {packages.find((p) => p.name === selected)?.priceRange[0]?.price || "0"} →
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-center">Please select a package.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Package;