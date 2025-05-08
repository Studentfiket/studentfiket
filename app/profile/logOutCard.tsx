'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { logout } from "../actions/auth/logout";

export default function LogOutCard() {
  return (
    <Card className="md:w-[700px]">
      <CardHeader>
        <CardTitle>
          Inställningar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <Button variant={'destructive'} onClick={() => logout()}>Logga ut</Button>
        </CardDescription>
      </CardContent>
    </Card>
  )
}