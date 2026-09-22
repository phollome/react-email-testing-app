import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export interface WelcomeEmailProps {
  name?: string;
}

export function WelcomeEmail(props: {
  locales: {
    headline: string;
    greeting: string;
    description: string;
    signature: string;
  };
}) {
  return (
    <Html>
      <Head />
      <Preview>{props.locales.headline}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{props.locales.greeting},</Heading>
          <Text style={paragraph}>{props.locales.description}</Text>
          <Text style={paragraph}>{props.locales.signature}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  padding: "0 40px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};
