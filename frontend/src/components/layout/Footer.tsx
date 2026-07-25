import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white py-8 border-t border-gray-100">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Gatra Access. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-500 hover:text-primary transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="text-gray-500 hover:text-primary transition-colors">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
