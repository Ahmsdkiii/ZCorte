import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "./prisma";

export type TransactionClient = Prisma.TransactionClient;

export function withTransaction<TResult>(
  callback: (transaction: TransactionClient) => Promise<TResult>
): Promise<TResult> {
  return prisma.$transaction(callback);
}
