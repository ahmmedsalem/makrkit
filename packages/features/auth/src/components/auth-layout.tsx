export function AuthLayoutShell({
  children,
  Logo,
}: React.PropsWithChildren<{
  Logo?: React.ComponentType;
}>) {
  return (
    <div
      className={
        'flex min-h-screen flex-col items-center justify-center py-8' +
        ' bg-background lg:bg-muted/30 gap-y-8 lg:gap-y-6' +
        ' animate-in fade-in slide-in-from-top-16 zoom-in-95 duration-1000'
      }
    >
      {Logo ? <Logo /> : null}

      <div
        className={`bg-background flex w-full max-w-[28rem] flex-col gap-y-3 rounded-lg px-6 md:w-8/12 md:px-8 md:py-6 lg:w-5/12 lg:px-8 xl:w-4/12 xl:gap-y-4 xl:py-8`}
      >
        {children}
      </div>
    </div>
  );
}
