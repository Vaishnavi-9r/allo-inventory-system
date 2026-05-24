"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Inventory = {
  warehouseId: string;
  warehouseName: string;
  location: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  inventories: Inventory[];
};

export default function HomePage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {

    fetchProducts();

    const interval =
      setInterval(() => {
        fetchProducts();
      }, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  async function fetchProducts() {

    try {

      const response =
        await fetch("/api/products");

      const data =
        await response.json();

      setProducts(data);

    } catch (error) {

      console.error(error);
    }
  }

  async function handleReserve(
    productId: string,
    warehouseId: string
  ) {

    setLoadingId(productId);

    try {

      const response =
        await fetch(
          "/api/reservations",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              productId,
              warehouseId,
              quantity: 1,
            }),
          }
        );

      const data =
        await response.json();

      if (response.status === 409) {

        alert(data.error);

        return;
      }

      router.push(
        `/reservation/${data.id}`
      );

    } catch (error) {

      console.error(error);

      alert(
        "Reservation failed"
      );

    } finally {

      setLoadingId(null);
    }
  }

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-gray-100
        to-gray-200
        p-8
      "
    >

      {/* Header */}
      <div className="text-center mb-12">

        <h1
          className="
            text-6xl
            font-extrabold
            text-gray-900
            mb-4
          "
        >
          Allo Inventory
        </h1>

        <p
          className="
            text-lg
            text-gray-600
          "
        >
          Real-time Inventory Reservation System
        </p>

      </div>

      {/* Product Grid */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-8
        "
      >

        {products.map((product) => (

          <div
            key={product.id}

            className="
              bg-white
              rounded-3xl
              shadow-lg
              border
              border-gray-200
              p-8
              hover:shadow-2xl
              transition
              duration-300
            "
          >

            {/* Product Header */}
            <div className="mb-6">

              <h2
                className="
                  text-3xl
                  font-bold
                  text-gray-900
                  mb-2
                "
              >
                {product.name}
              </h2>

              <p
                className="
                  text-gray-600
                "
              >
                {product.description}
              </p>

            </div>

            {/* Warehouses */}
            <div className="space-y-5">

              {product.inventories.map(
                (inventory) => (

                  <div
                    key={
                      inventory.warehouseId
                    }

                    className="
                      bg-gray-50
                      rounded-2xl
                      border
                      p-5
                    "
                  >

                    <div className="flex justify-between items-center mb-4">

                      <div>

                        <h3
                          className="
                            text-lg
                            font-semibold
                            text-gray-800
                          "
                        >
                          {
                            inventory.warehouseName
                          }
                        </h3>

                        <p
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          {
                            inventory.location
                          }
                        </p>

                      </div>

                      <div
                        className="
                          bg-black
                          text-white
                          px-4
                          py-2
                          rounded-full
                          text-sm
                          font-semibold
                        "
                      >
                        {
                          inventory.availableStock
                        }{" "}
                        Left
                      </div>

                    </div>

                    {/* Stock Info */}
                    <div
                      className="
                        grid
                        grid-cols-3
                        gap-3
                        text-center
                        mb-5
                      "
                    >

                      <div
                        className="
                          bg-white
                          rounded-xl
                          p-3
                        "
                      >
                        <p
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          Total
                        </p>

                        <p
                          className="
                            text-xl
                            font-bold
                          "
                        >
                          {
                            inventory.totalStock
                          }
                        </p>
                      </div>

                      <div
                        className="
                          bg-white
                          rounded-xl
                          p-3
                        "
                      >
                        <p
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          Reserved
                        </p>

                        <p
                          className="
                            text-xl
                            font-bold
                          "
                        >
                          {
                            inventory.reservedStock
                          }
                        </p>
                      </div>

                      <div
                        className="
                          bg-white
                          rounded-xl
                          p-3
                        "
                      >
                        <p
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          Available
                        </p>

                        <p
                          className="
                            text-xl
                            font-bold
                            text-green-600
                          "
                        >
                          {
                            inventory.availableStock
                          }
                        </p>
                      </div>

                    </div>

                    {/* Reserve Button */}
                    <button
                      onClick={() =>
                        handleReserve(
                          product.id,
                          inventory.warehouseId
                        )
                      }

                      disabled={
                        loadingId ===
                          product.id ||
                        inventory.availableStock <=
                          0
                      }

                      className="
                        w-full
                        bg-black
                        text-white
                        py-3
                        rounded-2xl
                        font-semibold
                        hover:opacity-90
                        transition
                        disabled:bg-gray-400
                      "
                    >

                      {loadingId ===
                      product.id
                        ? "Reserving..."
                        : inventory.availableStock <=
                          0
                        ? "Out of Stock"
                        : "Reserve Now"}

                    </button>

                  </div>
                )
              )}

            </div>
          </div>
        ))}
      </div>
    </main>
  );
}