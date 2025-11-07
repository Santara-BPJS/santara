export function ChatEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <div className="flex size-20 animate-pulse items-center justify-center rounded-full bg-primary/10">
        <div className="size-10 rounded-full bg-primary" />
      </div>
      <p className="text-center text-muted-foreground">
        Mulai percakapan dengan bertanya tentang verifikasi klaim
      </p>
    </div>
  );
}
