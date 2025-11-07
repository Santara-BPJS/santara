import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "../shared/components/ui/field";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-accent p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="size-12 rounded-full bg-primary" />
                <h1 className="font-bold text-xl">Daftar ke Santara</h1>
                <FieldDescription>
                  Mulai akses pengetahuan terverifikasi hari ini
                </FieldDescription>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Nama</FieldLabel>
                <Input
                  autoComplete="off"
                  id="name"
                  placeholder="Masukkan nama lengkap Anda"
                />
                <FieldError />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  autoComplete="off"
                  id="email"
                  placeholder="Masukkan email Anda"
                />
                <FieldError />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  autoComplete="off"
                  id="password"
                  placeholder="Masukkan kata sandi Anda"
                  type="password"
                />
                <FieldError />
              </Field>
              <Field>
                <Button>Register gratis</Button>
              </Field>
              <FieldSeparator>Atau</FieldSeparator>
              <Field>
                <Button type="button" variant="outline">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>Google</title>
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Register dengan Google
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Sudah punya akun?{" "}
                <Link
                  className="no-underline! font-semibold text-primary"
                  to="/login"
                >
                  Login di sini
                </Link>
              </FieldDescription>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Dengan mendaftar, Anda menyetujui{" "}
        {/** biome-ignore lint/a11y/useValidAnchor: // TODO */}
        <a href="#">Syarat & Kebijakan</a>
      </FieldDescription>
    </div>
  );
}
