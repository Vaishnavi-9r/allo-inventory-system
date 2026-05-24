import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // Warehouses
  const hyderabad =
    await prisma.warehouse.create({
      data: {
        name:
          "Hyderabad Warehouse",
        location:
          "Hyderabad",
      },
    });

  const bangalore =
    await prisma.warehouse.create({
      data: {
        name:
          "Bangalore Warehouse",
        location:
          "Bangalore",
      },
    });

  // Products
  const iphone =
    await prisma.product.create({
      data: {
        name: "iPhone 15",
        description:
          "Apple flagship smartphone",
      },
    });

  const laptop =
    await prisma.product.create({
      data: {
        name:
          "Gaming Laptop",
        description:
          "High performance gaming laptop",
      },
    });

  const airpods =
    await prisma.product.create({
      data: {
        name:
          "AirPods Pro",
        description:
          "Wireless Apple earbuds",
      },
    });

  const ps5 =
    await prisma.product.create({
      data: {
        name:
          "PlayStation 5",
        description:
          "Sony gaming console",
      },
    });

  // Inventory
  await prisma.inventory.createMany({
    data: [

      {
        productId:
          iphone.id,

        warehouseId:
          hyderabad.id,

        totalStock: 10,
        reservedStock: 0,
      },

      {
        productId:
          iphone.id,

        warehouseId:
          bangalore.id,

        totalStock: 8,
        reservedStock: 0,
      },

      {
        productId:
          laptop.id,

        warehouseId:
          hyderabad.id,

        totalStock: 5,
        reservedStock: 0,
      },

      {
        productId:
          airpods.id,

        warehouseId:
          bangalore.id,

        totalStock: 15,
        reservedStock: 0,
      },

      {
        productId:
          ps5.id,

        warehouseId:
          hyderabad.id,

        totalStock: 4,
        reservedStock: 0,
      },
    ],
  });

  console.log(
    "Seed data inserted"
  );
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });