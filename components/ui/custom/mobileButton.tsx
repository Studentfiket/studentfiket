import { SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface Props {
  pageIndex: number;
  index: number;
  onClick: () => void;
}

function MobileButton({ pageIndex, index, onClick, children }: React.PropsWithChildren<Props>) {
  return (
    <SheetClose>
      <Button className="w-full py-2 flex justify-start gap-2 text-xl" variant={pageIndex == index ? 'default' : 'link'} onClick={onClick}>
        {children}
      </Button>
    </SheetClose>
  );
}

export default MobileButton;