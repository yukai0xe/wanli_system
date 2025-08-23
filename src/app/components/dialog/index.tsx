import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const DialogComponent = ({ title, open, button, handleClose, handleConfirm, children }: {
  title: string,
  open: boolean,
  handleClose: () => void,
  handleConfirm: () => void,
  children: React.ReactNode,
  button: {
    cancel: string,
    confirm: string
    }
}) => {
  return (
    <Dialog open={open} onClose={handleClose} className="relative z-30">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all
             data-closed:translate-y-4 data-closed:opacity-0
             data-enter:duration-300 data-enter:ease-out
             data-leave:duration-200 data-leave:ease-in
             sm:my-8 w-auto max-w-full"
            style={{ background: "var(--background)" }}
          >
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="w-full">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold">
                    {title}
                  </DialogTitle>
                  <div className="mt-2">{children}</div>
                </div>
              </div>
            </div>
            <div
              className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
              style={{ background: "var(--foreground)" }}
            >
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold hover:bg-red-400 sm:ml-3 sm:w-auto"
              >
                {button.confirm}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
              >
                {button.cancel}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogComponent;