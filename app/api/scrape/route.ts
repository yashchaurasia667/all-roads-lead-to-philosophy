import { NextResponse } from "next/server";

import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim();
    const $articleBody = $("#mw-content-text, article, main").first();
    let firstLink: string | null = null;

    $articleBody.find("p a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href && !href.startsWith("#")) {
        firstLink = href.startsWith("/") ? new URL(href, url).href : href;
        return false;
      }
    });

    return NextResponse.json({ success: true, title, next: firstLink });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
