import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const OUT = "/opt/cursor/artifacts/screenshots";
fs.mkdirSync(OUT, { recursive: true });
const shot = async (page, name) => {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("SHOT", file);
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await page.locator("#match").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await shot(page, "ref-homepage-quiz-card.png");

await page.goto("http://localhost:5173/find-a-financial-professional", {
  waitUntil: "networkidle",
});
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await page.reload({ waitUntil: "networkidle" });
await shot(page, "after-quiz-step1-primary.png");

await page.locator('button:has-text("Taxes & accounting")').click();
await page.waitForTimeout(450);
await shot(page, "after-quiz-accountant-services.png");

await page.locator('button:has-text("Tax prep & filing")').click();
await page.locator('button:has-text("Continue")').click();
await page.waitForTimeout(350);
await page.locator('button:has-text("Just taxes for now")').click();
await page.locator('button:has-text("Continue")').click();
await page.waitForTimeout(350);
await shot(page, "after-quiz-accountant-fork.png");

await page.locator('button:has-text("Personal finances")').click();
await page.waitForTimeout(450);
await shot(page, "after-quiz-accountant-personas.png");

await page.locator('button:has-text("W2 income")').click();
await page.locator('button:has-text("Continue")').click();
await page.waitForTimeout(350);
await page.locator('button:has-text("I don\'t have anyone yet")').click();
await page.waitForTimeout(450);
await shot(page, "after-quiz-accountant-revenue.png");

await page.locator('button:has-text("Continue")').click();
await page.waitForTimeout(350);
await page.locator('button:has-text("Within a month")').click();
await page.locator('button.home-quiz__chip:has-text("California")').click();
await page.locator('button:has-text("Continue")').click();
await page.waitForTimeout(450);
await shot(page, "after-quiz-contact.png");

const contactText = await page.locator(".quiz-page").innerText();
console.log("contactHas675k", /675,?000/.test(contactText));
console.log("contactHas200k", /200,?000|200K/.test(contactText));

await page.goto("http://localhost:5173/find-a-financial-professional", {
  waitUntil: "networkidle",
});
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await page.reload({ waitUntil: "networkidle" });
await page.locator('button:has-text("Wealth & financial planning")').click();
await page.waitForTimeout(400);
await page.locator('button:has-text("Financial planning")').click();
await page.locator('button:has-text("Continue")').click();
await page.waitForTimeout(300);
await page.locator('button:has-text("Just wealth management for now")').click();
await page.locator('button:has-text("Continue")').click();
await page.waitForTimeout(400);
await shot(page, "after-quiz-advisor-personas.png");
await page.locator('button:has-text("Young professional")').click();
await page.locator('button:has-text("Continue")').click();
await page.waitForTimeout(300);
await page.locator('button:has-text("I don\'t have anyone yet")').click();
await page.waitForTimeout(450);
await shot(page, "after-quiz-advisor-financial.png");

const body = await page.locator(".quiz-page").innerText();
console.log("advisorHas675k", /675,?000/.test(body));
console.log("advisorHas200k", /200,?000|200K/.test(body));

await browser.close();
