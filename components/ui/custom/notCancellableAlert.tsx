import { CircleAlert } from "lucide-react"
import { Alert } from "../alert"

interface Props {
  variant: "default" | "filled" | "destructive" | null | undefined;
}

export const NotCancellableAlert = (props: Props) => {
  return (
    <Alert variant={props.variant} className="mb-4 items-center p-4 w-full rounded-md">
      <div className="text-md text-muted-foreground flex items-center">
        <CircleAlert size={42} className="mr-4" />
        <p>Du kan avboka passet <span className="underline">senast 3 dagar</span> innan passet börjar.</p>
      </div>
    </Alert>
  )
}