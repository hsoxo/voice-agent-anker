import { NextRequest, NextResponse } from "next/server";

const BASIC_AUTH_USER = "admin";
const BASIC_AUTH_PASS = "newcast";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  console.log(path);
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  const base64 = authHeader.split(" ")[1];
  const [user, pass] = atob(base64).split(":");

  if (user !== BASIC_AUTH_USER || pass !== BASIC_AUTH_PASS) {
    return new Response("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
