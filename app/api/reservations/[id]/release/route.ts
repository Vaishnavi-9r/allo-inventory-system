import { prisma } from "@/lib/prisma";

import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const params =
      await context.params;

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: params.id,
        },
      });

    if (!reservation) {

      return NextResponse.json(
        {
          error:
            "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    // Already released
    if (
      reservation.status ===
      "RELEASED"
    ) {

      return NextResponse.json(
        {
          error:
            "Reservation already released",
        },
        {
          status: 400,
        }
      );
    }

    const releasedReservation =
      await prisma.$transaction(
        async (tx) => {

          // RETURN RESERVED STOCK
          await tx.inventory.updateMany({
            where: {
              productId:
                reservation.productId,

              warehouseId:
                reservation.warehouseId,
            },

            data: {
              reservedStock: {
                decrement:
                  reservation.quantity,
              },
            },
          });

          // UPDATE RESERVATION STATUS
          return await tx.reservation.update({
            where: {
              id: reservation.id,
            },

            data: {
              status:
                "RELEASED",
            },
          });
        }
      );

    return NextResponse.json(
      releasedReservation
    );

  } catch (error) {

    console.error(
      "RELEASE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to release reservation",
      },
      {
        status: 500,
      }
    );
  }
}