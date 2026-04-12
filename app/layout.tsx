import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "د. سيف عبد الفتاح",
    template: "%s | د. سيف عبد الفتاح",
  },
  description:
    "الموقع الرسمي للدكتور سيف الدين عبد الفتاح - كتابات ومقالات في الفكر الحضاري الإسلامي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-100 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} د. سيف عبد الفتاح. جميع الحقوق
              محفوظة.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
