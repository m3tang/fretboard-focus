import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePracticeStore } from "@/utils/zustand/practiceStore";
import { useState } from "react";

export function SkipModuleButton({
  moduleName,
}: {
  moduleName: string | null;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const finishModule = usePracticeStore((s) => s.finishModule);

  const label = moduleName ? `Skip ${moduleName}` : "Skip Current Module";

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          {label} →
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Skip {moduleName}?
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Are you sure you want to finish this module? You’ll move on and won’t
          be able to return.
        </DialogDescription>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              finishModule();
              setShowConfirm(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
