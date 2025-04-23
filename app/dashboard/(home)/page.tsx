import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <p>Dashboard</p>
      <form action={signOutAction}>
        <Button>Sign out</Button>
      </form>
    </div>
  );
}
