import { render } from "@react-email/render";
import { describe, expect, it } from "vitest";
import { WelcomeEmail } from "./welcome-email";

describe("WelcomeEmail", () => {
  it("renders all localized content into the email HTML", async () => {
    const html = await render(
      <WelcomeEmail
        locales={{
          headline: "Welcome headline",
          greeting: "Hello there",
          description: "Thanks for joining us",
          signature: "The Example Team",
        }}
      />,
    );

    expect(html).toContain("Welcome headline");
    expect(html).toContain("Hello there");
    expect(html).toContain("Thanks for joining us");
    expect(html).toContain("The Example Team");
  });
});
