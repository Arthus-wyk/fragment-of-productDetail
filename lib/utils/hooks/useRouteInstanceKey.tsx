
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export function useRouteInstanceKey() {
    const router = useRouter();
    const ref = useRef<string>();
  
    useEffect(() => {
      const newKey = `${router.asPath}-${Date.now()}`;
      if (ref.current !== newKey) {
        ref.current = newKey;
      }
    }, [router.asPath]);
  
    return ref.current;
  }