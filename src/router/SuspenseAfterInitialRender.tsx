import { Suspense, memo, useEffect, useState } from "react";

interface Props {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export default function SuspenseAfterInitialRender({
  fallback,
  children,
}: Props) {
  let [isInitialRender, setIsInitialRender] = useState(true);

  return isInitialRender ? (
    <>
      <Lifecycle afterRender={() => setIsInitialRender(false)} />
      {children}
    </>
  ) : (
    <Suspense fallback={fallback}>{children}</Suspense>
  );
}

interface LifecycleProps {
  afterRender: () => void;
}

const Lifecycle = memo<LifecycleProps>(({ afterRender }) => {
  useEffect(() => {
    afterRender();
  }, [afterRender]);

  return null;
});
