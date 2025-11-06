import { Button } from "@/shared/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link className="flex items-center gap-2 font-bold text-xl" to="/">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <span>Santara</span>
        </Link>

        <div className="flex items-center gap-1">
          <Button onClick={() => handleScroll("benefits")} variant="ghost">
            Produk
          </Button>
          <Button onClick={() => handleScroll("integrations")} variant="ghost">
            Integrasi
          </Button>
          <Button onClick={() => handleScroll("security")} variant="ghost">
            Keamanan
          </Button>
          <Button onClick={() => handleScroll("contact")} variant="ghost">
            Kontak
          </Button>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Sign up gratis</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
