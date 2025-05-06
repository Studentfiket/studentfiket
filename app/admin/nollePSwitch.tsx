'use client'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog"
import { startTransition, useState } from "react"
import { toggleFlag } from "../actions/admin/toggleFlag"

export default function NollePSwitch() {
  const [value, setValue] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const handleConfirm = () => {
    if (pendingValue === null) return;

    setValue(pendingValue);

    try {
      startTransition(() => {
        toggleFlag("NOLLE_P", pendingValue);
      });
    } catch (error) {
      console.error("Error toggling Nolle-P flag: ", error);
      setValue(!pendingValue);
    } finally {
      setPendingValue(null);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <AlertDialog open={pendingValue !== null} onOpenChange={(open) => {
        if (!open) setPendingValue(null);
      }}>
        <AlertDialogTrigger asChild>
          <Switch
            checked={value}
            onCheckedChange={(checked) => setPendingValue(checked)}
            id="nolle-p-mode"
            className={value ? "bg-green-500" : "bg-input"} // Because it is child of AlertDialogTrigger it needs styling override
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Du håller på att {pendingValue ? "aktivera" : "inaktivera"} Nolle-P-läget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Bekräfta</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Label htmlFor="nolle-p-mode">{value ? "PÅ" : "AV"}</Label>
    </div>
  );
}
