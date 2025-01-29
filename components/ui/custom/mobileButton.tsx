import { SheetClose } from "@/components/ui/sheet"

interface Props {
  pageIndex: number;
  index: number;
  onClick: () => void;
}

// variant={pageIndex == index ? 'default' : 'link'}

function MobileButton({ pageIndex, index, onClick, children }: React.PropsWithChildren<Props>) {
  const variant = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    link: "text-primary underline-offset-4 hover:underline",
  }

  return (
    <SheetClose className="w-full flex justify-start gap-2 text-xl" onClick={onClick}>
      <div className={`inline-flex items-center p-2 justify-left whitespace-nowrap rounded-md font-medium w-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variant[pageIndex == index ? 'default' : 'link']}`}>
        {children}
      </div>
    </SheetClose>
  );
}

export default MobileButton;