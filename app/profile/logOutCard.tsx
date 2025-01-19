'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { signOut } from "@/lib/pocketbase";

export default function LogOutCard() {
  return (
    <Card className="sm:w-[700px]">
      <CardHeader>
        <CardTitle>
          Inställningar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <Button variant={'destructive'} onClick={() => signOut()}>Logga ut</Button>
        </CardDescription>
      </CardContent>
    </Card>
  )
}