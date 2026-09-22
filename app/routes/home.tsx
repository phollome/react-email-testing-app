import { render } from "@react-email/render";
import type { Route } from "./+types/home";
import { WelcomeEmail } from "../emails/welcome-email";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const html = await render(<WelcomeEmail name="Peter" />);
  return { html };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <iframe
      title="Email preview"
      srcDoc={loaderData.html}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}
