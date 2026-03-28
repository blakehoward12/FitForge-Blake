export const env = {
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL!,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
};
