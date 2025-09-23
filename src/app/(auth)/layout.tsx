import Image from "next/image";
import Link from "next/link";
import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-light-gray p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src="/forli-logo.png" alt="Logo" width={120} height={24} />
        </Link>
        {children}
      </div>
    </main>
  );
}
