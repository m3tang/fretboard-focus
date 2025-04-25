import { Card } from "@/components/ui/card";
import { InputForm } from "./StartPracticeForm.client";

export default function StartPracticePage() {
  return (
    <div className="p-5 flex flex-col items-center">
      <div className="mb-5 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Start Practice</h2>
        <p className="text-muted-foreground">Let&apos;s get to work.</p>
      </div>

      <Card className="p-12 w-full max-w-xl">
        <InputForm />
      </Card>
    </div>
  );
}
