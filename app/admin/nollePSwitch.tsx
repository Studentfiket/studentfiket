'use client'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { startTransition, useState } from "react"
import { toggleFlag } from "../actions/admin/toggleFlag"

export default function NollePSwitch() {
  const [value, setValue] = useState(false);

  const handleToggle = (newValue: boolean) => {
    setValue(newValue);

    try {
      // Call the server action to update the flag
      startTransition(() => {
        toggleFlag("NOLLE_P", newValue);
      });
    } catch (error) {
      console.error("Error toggling Nolle-P flag: ", error);
      // Optionally, revert the switch state if the action fails
      setValue(!newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={value}
        onCheckedChange={(checked) => handleToggle(checked)}
        id="nolle-p-mode" />
      <Label htmlFor="nolle-p-mode">{value ? "PÅ" : "AV"}</Label>
    </div>
  );
}