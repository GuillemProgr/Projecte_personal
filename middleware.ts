import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/comunidades/:path*",
    "/ajustes/:path*",
    "/api/documentos/:path*",
    "/api/chat/:path*",
    "/api/comunidades/:path*",
    "/api/propietarios/:path*",
  ],
};
