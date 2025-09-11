import { cn } from '../../lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = function ({
  className,
  logo,
  navigation,
  actions,
  ...props
}) {
  return (
    <div
      className={cn(
        'site-header bg-background/80 dark:bg-background/50 sticky top-0 z-10 w-full py-1 backdrop-blur-md',
        className,
      )}
      {...props}
    >
      <div className="container">
        <div className="grid h-14 grid-cols-3 items-center">
          <div className="flex justify-center md:justify-start col-start-2 md:col-start-1">{logo}</div>
          <div className="order-first md:order-none col-start-1 md:col-start-2">{navigation}</div>
          <div className="flex items-center justify-end gap-x-2 col-start-3">{actions}</div>
        </div>
      </div>
    </div>
  );
};
