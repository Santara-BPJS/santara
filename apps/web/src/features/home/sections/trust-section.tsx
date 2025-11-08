const companies = [
  { name: "BPJS Internal" },
  { name: "RS Rujukan" },
  { name: "Divisi Verifikasi" },
];

export default function TrustSection() {
  return (
    <section className="border-b px-4 py-12 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <p className="text-center text-muted-foreground text-sm">
          Dipercaya oleh ribuan tim di seluruh Indonesia
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 md:gap-12">
          {companies.map((company) => (
            <div
              className="text-center font-semibold text-sm"
              key={company.name}
            >
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
