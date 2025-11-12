// TODO: Speed up everything in Indonesian for the label
export const Roles = [
  { idx: 0, label: "User", key: "user" },
  { idx: 1, label: "Staf", key: "staff" },
  { idx: 2, label: "Verifikator", key: "verificator" },
  { idx: 3, label: "Supervisor", key: "supervisor" },
] as const;
export type Role = (typeof Roles)[number];

export function getRoleByIdx(idx: number): Role | undefined {
  return Roles.find((role) => role.idx === idx);
}

export function getRoleByKey(key: string): Role | undefined {
  return Roles.find((role) => role.key === key);
}

export function getRoleByLabel(label: string): Role | undefined {
  return Roles.find((role) => role.label === label);
}
