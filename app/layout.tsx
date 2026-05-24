import "./globals.css";

export const metadata = {
  title: "Allo Inventory",
  description:
    "Inventory Reservation System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}