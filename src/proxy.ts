import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const role = request.cookies.get("role")?.value;
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  console.log(pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/teacher/:path*"],
};
