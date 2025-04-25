import { signOutAction } from "@/app/actions";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="space-y-5">
      <DashboardHeader title="Account" subtitle="Put account stuff here" />
      <Link href="/dashboard/account/reset-password">
        <Button>Reset Password</Button>
      </Link>

      <form action={signOutAction}>
        <Button>Sign out</Button>
      </form>
    </div>
  );
}
