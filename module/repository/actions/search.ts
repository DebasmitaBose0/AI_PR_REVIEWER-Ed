"use server";

import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type RepositorySearchFilter = {
  query?: string;
  installationStatus?: string;
  limit?: number;
};

export async function searchRepositories(filter?: RepositorySearchFilter) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const { query = "", limit = 20 } = filter || {};

    const repositories = await prisma.repository.findMany({
      where: {
        userid: session.user.id,
        ...(query
          ? {
              name: {
                contains: query,
                mode: "insensitive",
              },
            }
          : {}),
      },
      take: Math.min(limit, 50),
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: repositories,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search repositories",
    };
  }
}
