'use client'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function NollePSwitch() {
  const [isNollePMode, setIsNollePMode] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isNollePMode}
        onCheckedChange={(checked) => setIsNollePMode(checked)}
        id="nolle-p-mode" />
      <Label htmlFor="nolle-p-mode">{isNollePMode ? "PÅ" : "AV"}</Label>
    </div>
  );
}