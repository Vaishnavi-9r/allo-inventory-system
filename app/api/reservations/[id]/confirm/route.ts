export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function POST(
  req: NextRequest,
  { params }: {
    params: Promise<{ id: string }>
  }
){

  try {

    const { id: reservationId } =
  await params;

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: reservationId,
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

    // Expired reservation
    if (
      reservation.expiresAt <
      new Date()
    ) {

      await prisma.inventory.updateMany({
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

      await prisma.reservation.update({
        where: {
          id: reservation.id,
        },

        data: {
          status:
            "RELEASED",
        },
      });

      return NextResponse.json(
        {
          error:
            "Reservation expired",
        },
        {
          status: 410,
        }
      );
    }

    const confirmedReservation =
      await prisma.$transaction(
        async (tx) => {

          // Reduce total stock
          await tx.inventory.updateMany({
            where: {
              productId:
                reservation.productId,

              warehouseId:
                reservation.warehouseId,
            },

            data: {
              totalStock: {
                decrement:
                  reservation.quantity,
              },

              reservedStock: {
                decrement:
                  reservation.quantity,
              },
            },
          });

          return await tx.reservation.update({
            where: {
              id: reservation.id,
            },

            data: {
              status:
                "CONFIRMED",
            },
          });
        }
      );

    return NextResponse.json(
      confirmedReservation
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to confirm reservation",
      },
      {
        status: 500,
      }
    );
  }
}