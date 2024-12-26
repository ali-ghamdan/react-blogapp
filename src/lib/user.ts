import { LoginUserData, postData, RegisterUserData, UserData } from "./types";
import { bRequest, TC } from "./utils";

export async function userRegister(data: RegisterUserData) {
  const [e1, d1] = await TC(() =>
    bRequest("/auth/register", { method: "POST", data })
  );
  if (e1) {
    console.error("ERROR userRegister:", e1);
    return;
  }

  console.log({ d1 });
  return true;
}

export async function userLogin(
  data: LoginUserData
): Promise<string | undefined> {
  const [e1, d1] = await TC(() =>
    bRequest("/auth/login", { method: "POST", data })
  );
  if (e1) {
    console.error("ERROR userLogin:", e1);
    return;
  }

  if (!d1?.data?.access_token) {
    console.error("ERROR, failed to login.");
  }

  console.log({ d1 });
  return d1?.data?.access_token;
}

export async function userFeeds(
  token: string | undefined | null,
  page: number = 1
): Promise<Array<postData> | null> {
  const [e1, d1] = await TC(() =>
    bRequest(`/posts/feeds?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1) {
    console.error("ERROR userFeeds:", e1);
    return null;
  }
  return d1?.data;
}

export async function userProfile(
  token: string | undefined | null
): Promise<UserData | undefined> {
  if (!token) return undefined;

  const [e1, d1] = await TC(() =>
    bRequest("/auth/profile", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1 || !d1) {
    console.error("ERROR userProfile:", e1);
    return;
  }
  console.log({ d1 });
  return {
    username: d1?.data?.username,
    email: d1?.data?.email,
    postsCount: d1?.data?.postsCount,
    followersCount: d1?.data?.followersCount,
    followingCount: d1?.data?.followingCount,
    avatar: d1?.data?.avatar,
  };
}
