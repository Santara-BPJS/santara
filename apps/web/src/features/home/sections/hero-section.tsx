import { Link } from "@tanstack/react-router";
import { Button } from "../../../shared/components/ui/button";
import HeroSearchDemo from "../components/hero-search-demo";

export default function HeroSection() {
  return (
    <section className="min-h-dvh w-screen overflow-hidden bg-accent" id="hero">
      <div className="container mx-auto grid min-h-dvh grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="font-extrabold text-2xl leading-tight sm:text-5xl md:text-5xl">
              Santara: <br /> Satu Pengetahuan untuk{" "}
              <span className="text-primary">Sehatnya Nusantara</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
              Platform pengetahuan valid dan cepat pertama untuk Verifikator
              Klaim BPJS. Akses regulasi, SOP, dan kebijakan dalam hitungan
              detik selalu terverifikasi, selalu aman.
            </p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Link to="/register">
              <Button size="lg">Sign Up gratis</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
        <div>
          <HeroSearchDemo />
        </div>
      </div>
    </section>
  );
}
