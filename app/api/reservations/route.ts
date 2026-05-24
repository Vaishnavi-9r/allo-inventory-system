import { prisma } from "@/lib/prisma";

import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function POST(
  req: NextRequest
) {

  try {

    const body = await req.json();

    console.log(body);

    const {
      productId,
      warehouseId,
      quantity,
    } = body;

    if (
      !productId ||
      !warehouseId ||
      !quantity
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const reservation =
      await prisma.$transaction(
        async (tx) => {

          const inventory =
            await tx.inventory.findUnique({
              where: {
                productId_warehouseId: {
                  productId,
                  warehouseId,
                },
              },
            });

          if (!inventory) {
            throw new Error(
              "Inventory not found"
            );
          }

          const availableStock =
            inventory.totalStock -
            inventory.reservedStock;

          if (
            availableStock < quantity
          ) {

            return null;
          }

          await tx.inventory.update({
            where: {
              id: inventory.id,
            },

            data: {
              reservedStock: {
                increment:
                  quantity,
              },
            },
          });

          const newReservation =
            await tx.reservation.create({
              data: {
                productId,
                warehouseId,
                quantity,

                status:
                  "PENDING",

                expiresAt:
                  new Date(
                    Date.now() +
                    10 * 60 * 1000
                  ),
              },
            });

          return newReservation;
        }
      );

    if (!reservation) {

      return NextResponse.json(
        {
          error:
            "Not enough stock available",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      reservation
    );

  } catch (error) {

    console.error(
      "RESERVATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create reservation",
      },
      {
        status: 500,
      }
    );
  }
}