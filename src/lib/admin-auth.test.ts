import { describe, expect, it } from "vitest";
import {
  AdminAuthError,
  authenticateAdmin,
  loadAdminRecords,
  usernameExists,
} from "@/lib/admin-auth";

function createMemoryStorage() {
  const map = new Map<string, string>();

  return {
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
    removeItem(key: string) {
      map.delete(key);
    },
  };
}

describe("admin auth helpers", () => {
  it("seeds default admins when storage is empty", () => {
    const admins = loadAdminRecords(createMemoryStorage());

    expect(admins.length).toBeGreaterThanOrEqual(4);
    expect(admins.some((admin) => admin.role === "SUPER_ADMIN")).toBe(true);
  });

  it("rejects wrong password with explicit error", () => {
    const admins = loadAdminRecords(createMemoryStorage());

    expect(() =>
      authenticateAdmin(admins, {
        username: "superadmin",
        password: "wrong-password",
        location: "Delhi",
      }),
    ).toThrowError(AdminAuthError);

    try {
      authenticateAdmin(admins, {
        username: "superadmin",
        password: "wrong-password",
        location: "Delhi",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AdminAuthError);
      expect((error as AdminAuthError).code).toBe("PASSWORD");
    }
  });

  it("rejects wrong location with explicit error", () => {
    const admins = loadAdminRecords(createMemoryStorage());

    try {
      authenticateAdmin(admins, {
        username: "delhi.admin",
        password: "Delhi@123",
        location: "Lucknow",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AdminAuthError);
      expect((error as AdminAuthError).code).toBe("LOCATION");
    }
  });

  it("checks username uniqueness case-insensitively", () => {
    const admins = loadAdminRecords(createMemoryStorage());

    expect(usernameExists(admins, "SUPERADMIN")).toBe(true);
    expect(usernameExists(admins, "new.admin")).toBe(false);
  });
});
