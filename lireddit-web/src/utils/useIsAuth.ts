import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      // tell the router to go to create post after login
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};
