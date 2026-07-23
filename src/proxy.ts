import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    const role = token.role as string;
    
    if (path.startsWith("/customer") && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, req.url));
    }
    if (path.startsWith("/collector") && role !== "COLLECTOR") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, req.url));
    }
    if (path.startsWith("/recycler") && role !== "RECYCLER") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, req.url));
    }
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/customer/:path*", "/collector/:path*", "/recycler/:path*", "/admin/:path*", "/api/protected/:path*"],
};
