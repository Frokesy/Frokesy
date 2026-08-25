import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const site = (import.meta.env.PUBLIC_SITE_URL || "https://frokesy.vercel.app").replace(/\/$/, "");
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
