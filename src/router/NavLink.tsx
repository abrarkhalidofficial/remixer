import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { NavLink as RouterLink } from "react-router-dom";
import { getMatchingRoute } from "./LazyRoutes";

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  replace?: boolean;
  state?: any;
  to: string;
  reloadDocument?: boolean;
  preventScrollReset?: boolean;
  relative?: "route" | "path";
  children: React.ReactNode;
  prefetch?: boolean;
}

const NavLink = memo(
  ({ children, to, prefetch = true, ...props }: LinkProps) => {
    const ref = useRef(null);
    const [prefetched, setPrefetched] = useState(false);

    const route = useMemo(() => getMatchingRoute(to), [to]);
    const preload = useCallback(
      () => route?.preload() && setPrefetched(true),
      [route]
    );
    const prefetchable = Boolean(route && !prefetched);

    useEffect(() => {
      if (prefetchable && prefetch && ref?.current) {
        const observer = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => entry.isIntersecting && preload()),
          { rootMargin: "200px" }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
      }
    }, [prefetch, prefetchable, preload]);

    const handleMouseEnter = () => prefetchable && preload();

    return (
      <RouterLink ref={ref} to={to} onMouseEnter={handleMouseEnter} {...props}>
        {children}
      </RouterLink>
    );
  }
);

export default NavLink;
