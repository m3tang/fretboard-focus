import "@/app/globals.css";
import { NavigationMenu } from "@/components/nav-menu";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <nav className="w-full px-8 flex justify-center border-b border-b-foreground/10 h-16 items-center justify-between">
        <NavigationMenu />
      </nav>
      <div className="flex justify-center w-full bg-blue">{children}</div>
    </div>
  );
}
