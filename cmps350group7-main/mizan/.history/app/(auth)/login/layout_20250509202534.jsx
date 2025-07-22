
export const metadata = {
  title: "Mizān",
  description: "Your Assessment Companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="no-extension-interference">
        <Header />
        {children}
      </body>
    </html>
  );
}