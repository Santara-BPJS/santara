import { authClient } from "@/shared/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  return (
    <Avatar>
      <AvatarImage src={session.user.image ?? undefined} />
      <AvatarFallback>{session.user.name[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
