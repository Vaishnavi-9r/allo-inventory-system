import { prisma } from "@/lib/prisma";

import {
  NextResponse,
} from "next/server";

export async function GET(
  request: Request,
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

    return NextResponse.json(
      reservation
    );

  } catch (error) {

    console.error(
      "GET RESERVATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch reservation",
      },
      {
        status: 500,
      }
    );
  }
}