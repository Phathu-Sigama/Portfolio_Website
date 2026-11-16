import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { cv } from "@/data/cv";

export const alt = `${cv.identity.name} — ${cv.identity.title}. Phathu OS portfolio.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [logo, displayFont, textFont] = await Promise.all([
    readFile(join(process.cwd(), "public/ps-logo.svg"), "base64"),
    readFile(join(process.cwd(), "app/fonts/pixelify-sans-latin-700-normal.woff")),
    readFile(join(process.cwd(), "app/fonts/dotgothic16-latin-400-normal.woff")),
  ]);
  const { identity } = cv;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6c64b4",
          fontFamily: "DotGothic16",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
            padding: "48px 64px",
            background: "#ffffff",
            border: "4px solid #000000",
            boxShadow: "8px 8px 0 #000000",
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={`data:image/svg+xml;base64,${logo}`} width={276} height={260} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, lineHeight: 1.1, fontFamily: "Pixelify Sans" }}>{identity.name}</div>
            <div style={{ fontSize: 48, marginTop: 12 }}>{identity.title}</div>
            <div style={{ fontSize: 32, marginTop: 20, color: "#3c3c8c" }}>{identity.degree}</div>
            <div style={{ fontSize: 32, color: "#3c3c8c" }}>{identity.location}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pixelify Sans", data: displayFont, weight: 700, style: "normal" },
        { name: "DotGothic16", data: textFont, weight: 400, style: "normal" },
      ],
    },
  );
}
