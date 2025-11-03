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
};

export type WorldEvent = {
  id: string;
  title: string;
  description?: Opt<string>;
  startAt: DateLike;
  capacity?: number;
  reserveCapacity?: number;
  regs?: Registration[];
};
