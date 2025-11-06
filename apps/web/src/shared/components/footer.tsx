import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="bg-secondary px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b pb-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary" />
                <span className="font-bold text-lg">Santara</span>
              </div>
              <p className="font-medium text-primary text-sm">
                Satu pengetahuan untuk sehatnya Nusantara.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Produk</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Perusahaan</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Tentang
                  </Link>
                </li>
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Karir
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Syarat Layanan
                  </Link>
                </li>
                <li>
                  <Link className="transition hover:text-foreground" to="/">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-center text-muted-foreground text-sm">
          <p>Developed by Tim BPJS otw Lunas - Supported by BPJS Kesehatan</p>
          <p>© 2025 Santara. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
