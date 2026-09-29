import { expect, test } from "@playwright/test";

test("renders the email preview in Chromium", async ({ page }) => {
  const appUrl = process.env.APP_URL ?? "http://127.0.0.1:3000";

  await expect(async () => {
    const response = await page.goto(appUrl);
    expect(response?.status()).toBe(200);
  }).toPass({ timeout: 30_000 });

  await expect(page.getByTitle("Email preview")).toBeVisible();

  const emailPreview = page.frameLocator('iframe[title="Email preview"]');
  await expect(
    emailPreview.getByRole("heading", { name: "Hi Peter," }),
  ).toBeVisible();
  await expect(
    emailPreview.getByText(
      "Thanks for checking out this simple email template built with react-email.",
    ),
  ).toBeVisible();
});
