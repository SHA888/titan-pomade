import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, id, title, subtitle, children, ...props }, ref) => (
    <section
      id={id}
      ref={ref}
      className={cn('py-16 md:py-24', className)}
      {...props}
    >
      <div className="container px-4 md:px-6">
        {title && (
          <div className="text-center mb-12">
            <h2 className="display-2">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lead max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
);
Section.displayName = 'Section';

export { Section };