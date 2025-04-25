import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <>
      <p>Account</p>
      <form action={signOutAction}>
        <Button>Sign out</Button>
      </form>
    </>
  );
}
