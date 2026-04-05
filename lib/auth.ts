import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";

const teacherEmails = (process.env.TEACHER_EMAILS || "")
  .split(",")
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);

const schoolDomain = (process.env.NEXT_PUBLIC_SCHOOL_DOMAIN || "").toLowerCase();

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Demo Access",
    credentials: {
      name: { label: "Name", type: "text" },
      email: { label: "Email", type: "email" },
      role: { label: "Role", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email) return null;
      const email = String(credentials.email).toLowerCase();
      const role = credentials.role === "teacher" ? "teacher" : "pupil";
      return {
        id: email,
        name: String(credentials.name || email.split("@")[0]),
        email,
        role,
      } as any;
    },
  }),
];

if (
  process.env.MICROSOFT_CLIENT_ID &&
  process.env.MICROSOFT_CLIENT_SECRET &&
  process.env.MICROSOFT_TENANT_ID
) {
  providers.unshift(
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_TENANT_ID,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "pupil";
      }
      const email = String(token.email || "").toLowerCase();
      const isTeacher =
        token.role === "teacher" ||
        teacherEmails.includes(email) ||
        (!!schoolDomain && email.endsWith(`@${schoolDomain}`) && email.includes("staff"));
      if (isTeacher) token.role = "teacher";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || "pupil";
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
