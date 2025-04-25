import { signOutAction } from "@/app/actions";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="space-y-5">
      <DashboardHeader title="Settings" subtitle="Put settings here" />
      <Link href="/dashboard/settings/reset-password">
        <Button>Reset Password</Button>
      </Link>

      <form action={signOutAction}>
        <Button>Sign out</Button>
      </form>
    </div>
  );
}
