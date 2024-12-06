import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import Negotiator from "negotiator";
import linguiConfig from "../lingui.config";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);
const { locales } = linguiConfig;

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest, .well-known
     */
    "/((?!api/|_next/|_proxy/|static|favicon.ico|https://kelseyi.com/sitemap-0.xml.xml|robots.txt|manifest.webmanifest|.well-known).*)",
  ],
};
export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getRequestLocale(req.headers);
  nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(nextUrl);
});

function getRequestLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get("accept-language") || undefined;
  const languages = new Negotiator({
    headers: { "accept-language": langHeader },
  }).languages(locales.slice());

  const activeLocale = languages[0] || locales[0] || "en";

  return activeLocale;
}
