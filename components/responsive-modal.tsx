import { useMedia } from "react-use";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { DrawerContent, Drawer } from "./ui/drawer";
interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg  p-0 border-none overflow-y-auto hide-scrollbar max-h-[84vh]">
        <DialogTitle className=""></DialogTitle>
        <DialogDescription className=""></DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DialogTitle className=""></DialogTitle>
        <DialogDescription className=""></DialogDescription>
        <div className=" overflow-y-auto hide-scrollbar max-h-[84vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
