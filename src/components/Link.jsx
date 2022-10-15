import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { routes } from "../Router";

const getMatchingRoute = (path) => {
  return routes.find(
    (route) =>
      path.match(new RegExp(route.path.replace(/:\w+|\*/g, ".*")))?.[0] === path
  );
};

export const Link = ({ children, to, as, prefetch = true, ...props }) => {
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

  return as === "NavLink" ? (
    <NavLink ref={ref} to={to} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </NavLink>
  ) : (
    <RouterLink ref={ref} to={to} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </RouterLink>
  );
};
