import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getDateDay, getWeekday } from "@/functions/shiftFunctions"
import { Shift } from "@/lib/types";

type Props = {
  shift: Shift | null;
}

export default function bookShiftPopup(props: Props) {
  console.log(props.shift);
  if (!props.shift) {
    console.error("Shift not found");
    return
  }
  const shiftDate = new Date(props.shift.start);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-20 grid grid-cols-1 content-center justify-center">
      <Card className="w-4/5 sm:w-[400px] mx-auto">
        <CardHeader>
          <CardTitle>Boka pass {getWeekday(shiftDate)} den {getDateDay(shiftDate)}</CardTitle>
          <CardDescription>Boka</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
