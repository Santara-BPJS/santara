import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { AUTH_CONSTANTS } from "@/shared/constant/auth";
import { authClient } from "@/shared/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

export function LoginForm() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: z.object({
        email: z.email().min(1, "Email wajib diisi"),
        password: z
          .string()
          .min(1, "Password wajib diisi")
          .min(
            AUTH_CONSTANTS.MIN_PASSWORD_LENGTH,
            "Password minimal 8 karakter"
          ),
      }),
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success("Login berhasil");

            navigate({ to: "/dashboard" });
          },
          onError: (ctx) => {
            toast.error("Login gagal", {
              description: ctx.error.message || "Silakan coba lagi.",
            });
          },
        }
      );
    },
  });

  const handleGoogleSignIn = async () => {
    // try {
    //   await authClient.signIn.social({
    //     provider: "google",
    //     callbackURL: "/dashboard",
    //   });
    // } catch (err) {
    //   toast.error("Login dengan Google gagal", {
    //     description: "Silakan coba lagi.",
    //   });
    // }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldSet>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="size-12 rounded-full bg-primary" />
                  <h1 className="font-bold text-xl">Login ke Santara</h1>
                  <FieldDescription>
                    Akses platform pengetahuan untuk verifikasi klaim
                  </FieldDescription>
                </div>

                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          aria-invalid={isInvalid}
                          autoComplete="email"
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Masukkan email Anda"
                          type="email"
                          value={field.state.value}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          aria-invalid={isInvalid}
                          autoComplete="current-password"
                          id={field.name}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Masukkan kata sandi Anda"
                          type="password"
                          value={field.state.value}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Subscribe>
                  {(state) => (
                    <Field>
                      <Button
                        disabled={!state.canSubmit || state.isSubmitting}
                        form="login-form"
                        type="submit"
                      >
                        {state.isSubmitting ? "Loading..." : "Login"}
                      </Button>
                    </Field>
                  )}
                </form.Subscribe>

                <FieldSeparator>Atau</FieldSeparator>

                <form.Subscribe>
                  {(state) => (
                    <Field>
                      <Button
                        disabled={state.isSubmitting}
                        onClick={handleGoogleSignIn}
                        type="button"
                        variant="outline"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Google</title>
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        Login dengan Google
                      </Button>
                    </Field>
                  )}
                </form.Subscribe>

                <FieldDescription className="text-center">
                  Belum punya akun?{" "}
                  <Link
                    className="no-underline! font-semibold text-primary"
                    to="/register"
                  >
                    Register di sini
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Dengan masuk, Anda menyetujui{" "}
        {/** biome-ignore lint/a11y/useValidAnchor: // TODO */}
        <a href="#">Syarat & Kebijakan</a>
      </FieldDescription>
    </div>
  );
}
