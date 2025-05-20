import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { Stripe } from "stripe";

// Define the expected props shape
interface ReturnPageProps {
  searchParams: { session_id?: string };
}

export default async function Return({ searchParams }: ReturnPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  // Fetch session from Stripe
  const session: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });

  const { status, customer_details } = session;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const customerEmail = customer_details?.email ?? "your email";

    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </section>
    );
  }

  return (
    <section id="error">
      <p>There was an issue processing your order. Please contact support.</p>
    </section>
  );
}
