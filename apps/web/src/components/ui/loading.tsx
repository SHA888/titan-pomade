import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoadingProps = {
  className?: string;
  size?: number;
  text?: string;
};

export function Loading({ className, size = 24, text }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className="animate-spin" size={size} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}
