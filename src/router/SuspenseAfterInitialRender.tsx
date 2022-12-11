import { Suspense, useEffect, useState } from "react";

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

function Lifecycle({ afterRender }: LifecycleProps) {
  useEffect(() => {
    afterRender();
  }, [afterRender]);

  return null;
}
