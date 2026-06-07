import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

function getVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
    return pkg.version || "1.0.0";
  } catch (e) {
    return "1.5.0-real-public-signals"; // Default fallback
  }
}

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Prevent aggressive caching so it's a true health check
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  return res.status(200).json({
    status: "ok",
    app: "planetary-ops-ai",
    version: getVersion(),
    timestamp: new Date().toISOString()
  });
}
