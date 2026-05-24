"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

type Reservation = {
  id: string;
  status: string;
  quantity: number;
  expiresAt: string;
};

export default function ReservationPage() {

  const params = useParams();

  const router = useRouter();

  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [timeLeft, setTimeLeft] =
    useState("");

  useEffect(() => {
    fetchReservation();
  }, []);

  useEffect(() => {

    if (!reservation) return;

    const interval = setInterval(() => {

      const expiry =
        new Date(
          reservation.expiresAt
        ).getTime();

      const now = Date.now();

      const difference =
        expiry - now;

      if (difference <= 0) {

        setTimeLeft("Expired");

        clearInterval(interval);

        return;
      }

      const minutes =
        Math.floor(
          difference / 1000 / 60
        );

      const seconds =
        Math.floor(
          (difference / 1000) % 60
        );

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );

    }, 1000);

    return () =>
      clearInterval(interval);

  }, [reservation]);

  async function fetchReservation() {

    try {

      const response = await fetch(
        `/api/reservations/${params.id}`
      );

      const data =
        await response.json();

      setReservation(data);

    } catch (error) {

      console.error(error);
    }
  }

  async function confirmReservation() {

    try {

      const response = await fetch(
        `/api/reservations/${params.id}/confirm`,
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (response.status === 410) {

        alert(data.error);

        return;
      }

      alert(
        "Purchase confirmed"
      );

      fetchReservation();

    } catch (error) {

      console.error(error);
    }
  }

  async function cancelReservation() {

    try {

      await fetch(
        `/api/reservations/${params.id}/release`,
        {
          method: "POST",
        }
      );

      alert(
        "Reservation cancelled"
      );

      fetchReservation();

    } catch (error) {

      console.error(error);
    }
  }

  if (!reservation) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <main className="p-10">

      <h1 className="text-4xl font-bold mb-6">
        Reservation
      </h1>

      <div className="border rounded-xl p-6 max-w-xl">

        <p>
          <strong>ID:</strong>{" "}
          {reservation.id}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {reservation.status}
        </p>

        <p>
          <strong>Quantity:</strong>{" "}
          {reservation.quantity}
        </p>

        <p>
          <strong>Expires In:</strong>{" "}
          {timeLeft}
        </p>

        <div className="flex gap-4 mt-6">

          <button
            onClick={
              confirmReservation
            }

            className="
              bg-green-600
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Confirm Purchase
          </button>

          <button
            onClick={
              cancelReservation
            }

            className="
              bg-red-600
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Cancel
          </button>

          <button
            onClick={() =>
              router.push("/")
            }

            className="
              border
              px-4
              py-2
              rounded-lg
            "
          >
            Back
          </button>

        </div>
      </div>
    </main>
  );
}