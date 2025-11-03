export type DateLike = Date | number | string;

export type Opt<T> = T | undefined | null;

export enum RegistrationStatus {
  CONFIRMED = "CONFIRMED",
  RESERVED = "RESERVED",
}

export type Registration = {
  id: string;
  userId: string;
  status: RegistrationStatus;
  createdAt: DateLike;
  user?: { name?: string | null; email?: string | null; image?: string | null };
};

export type WorldEvent = {
  id: string;
  title: string;
  description: Opt<string>;
  startAt: DateLike;
  capacity: Opt<number>;
  reserveCapacity: Opt<number>;
  regs?: Registration[];
};
