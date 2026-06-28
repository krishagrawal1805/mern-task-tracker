import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          id="successToast"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-[100] pointer-events-auto"
        >
          <div className="bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-outline/20">
            <CheckCircle className="w-5 h-5 text-secondary-fixed stroke-[3]" />
            <p className="text-sm font-semibold">{message}</p>
            <button
              id="btn-close-toast"
              onClick={onClose}
              className="p-1 text-surface-variant hover:text-white transition-colors cursor-pointer"
              aria-label="Close message"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
