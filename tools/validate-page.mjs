import { createRequire } from "node:module";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch (error) {
  if (!process.env.CODEX_NODE_MODULES) throw error;
  const require = createRequire(`${process.env.CODEX_NODE_MODULES}/playwright/package.json`);
  ({ chromium } = require("playwright"));
}

const url = process.argv[2] ?? "http://127.0.0.1:8000/index.html";
const outputDir = process.argv[3] ?? "/private/tmp";
const mode = process.argv[4] ?? "screen";
const viewports = [
  { width: 1440, height: 1200, name: "desktop" },
  { width: 390, height: 1200, name: "mobile" },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of viewports) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
  });
  await page.goto(url, { waitUntil: "networkidle" });
  if (mode === "print") {
    await page.emulateMedia({ media: "print" });
  }

  const screenshot = `${outputDir}/resume-${mode}-${viewport.name}.png`;
  await page.screenshot({ path: screenshot, fullPage: true });
  const pdf =
    mode === "print" && viewport.name === "desktop"
      ? `${outputDir}/resume-print.pdf`
      : null;
  if (pdf) {
    await page.pdf({
      path: pdf,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  }

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflows = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const style = getComputedStyle(el);
        if (style.display === "inline") return false;
        return el.scrollWidth > el.clientWidth + 2;
      })
      .map((el) => ({
        tag: el.tagName,
        className: String(el.className),
        text: el.textContent.trim().slice(0, 100),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }))
      .slice(0, 12);

    return {
      title: document.title,
      bodyTextLength: document.body.innerText.length,
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflows,
      topHeading: document.querySelector("h1")?.textContent,
      sectionCount: document.querySelectorAll("h2").length,
    };
  });

  results.push({ viewport: viewport.name, screenshot, pdf, metrics });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
