import "./globals.css";

export default async function RootLayout({ children }) {
  return (
    <html >
      <body >
       {children}
      </body>
    </html>
  );
}