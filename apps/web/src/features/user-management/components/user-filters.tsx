import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";

type UserFiltersProps = {
  search: string;
  onSearchChange: (search: string) => void;
  role: number | undefined;
  onRoleChange: (role: number | undefined) => void;
  status: "active" | "invited" | "inactive" | undefined;
  onStatusChange: (
    status: "active" | "invited" | "inactive" | undefined
  ) => void;
};

export function UserFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama atau email..."
          type="search"
          value={search}
        />
      </div>
      <Select
        onValueChange={(value) =>
          onRoleChange(value === "all" ? undefined : Number.parseInt(value, 10))
        }
        value={role !== undefined ? role.toString() : "all"}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Semua Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Role</SelectItem>
          {[
            { idx: 0, label: "User", key: "user" },
            { idx: 1, label: "Staf", key: "staff" },
            { idx: 2, label: "Verifikator", key: "verificator" },
            { idx: 3, label: "Supervisor", key: "supervisor" },
          ].map((r) => (
            <SelectItem key={r.idx} value={r.idx.toString()}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) =>
          onStatusChange(
            value === "all"
              ? undefined
              : (value as "active" | "invited" | "inactive")
          )
        }
        value={status || "all"}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="active">Aktif</SelectItem>
          <SelectItem value="invited">Diundang</SelectItem>
          <SelectItem value="inactive">Tidak Aktif</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
