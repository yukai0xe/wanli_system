import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const fetchUser = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError)  throw new Error(error.message);
  return user;
};
