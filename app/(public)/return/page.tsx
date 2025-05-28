// app/return/page.tsx
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { Stripe } from "stripe";

export default async function ReturnPage(props: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await props.searchParams;

  if (!session_id) {
    redirect("/");
  }

  const session: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

  const { status, customer_details } = session;

  if (status === "open") redirect("/");

  if (status === "complete") {
    return (
      <section className="p-6">
        <h1 className="text-2xl font-semibold">Payment Successful</h1>
        <p>
          Thank you! A receipt was sent to{" "}
          <strong>{customer_details?.email ?? "your email"}</strong>.
        </p>
      </section>
    );
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold">Payment Error</h1>
      <p>Something went wrong. Please contact support.</p>
    </section>
  );
}
