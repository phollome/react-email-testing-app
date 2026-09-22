import { render } from "@react-email/render";
import type { Route } from "./+types/home";
import { WelcomeEmail } from "../emails/welcome-email";
import { useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const locales = {
    headline: "Welcome to React Email Testing App",
    greeting: "Hi Peter",
    description:
      "Thanks for checking out this simple email template built with react-email.",
    signature: "— The Team",
  };

  const html = await render(<WelcomeEmail locales={locales} />);
  return { html };
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <iframe
      title="Email preview"
      srcDoc={loaderData.html}
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}
