import { authStore, routeStore } from "@/lib/stores";
import { RouteDirection, UserData } from "@/lib/types";
import { userProfile } from "@/lib/user";
import { useEffect, useState } from "react";
import Feeds from "./feeds";
import MyFeeds from "./myFeeds";

export default function HomePage() {
  const { auth } = authStore();
  const [user, setUser] = useState<UserData | undefined | null>(null);
  const setRoute = routeStore((state) => state.setRoute);
  const [page, setPage] = useState(1);
  useEffect(() => {
    userProfile(auth)
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("HOMEPAGE ERROR FETCHING USER_PROFILE:", err);
        setUser(undefined);
      });
  }, [auth]);

  return user == undefined ? (
    <>
      <div className="grid place-items-center m-3 text-center">
        <div>
          {user === undefined ? (
            <>
              <h1>403</h1>
              <div>
                Please{" "}
                <a
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute(RouteDirection.LOGIN_PAGE);
                  }}
                >
                  Login
                </a>
                /
                <a
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute(RouteDirection.REGISTER_PAGE);
                  }}
                >
                  Signup
                </a>{" "}
                To Use The Website
              </div>
            </>
          ) : (
            <div className="mt-20">
              <h1>Loading...</h1>
              <pre>please wait sometime</pre>
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <>
      <div>
        <div className="container">
          <div className="item feeds">
            <div className="sub-parent">
              <sub className="text-lg font-bold bg-zinc-900 text-white p-3 ml-0 rounded-tl-md rounded-tr-md">
                FEEDS
              </sub>
            </div>
            <div className="feeds-items mt-3 bg-zinc-900 p-2 rounded-bl-md rounded-br-md rounded-tr-md">
              <Feeds page={page} />
            </div>
          </div>
          <div className="item my-feeds">
            <div className="sub-parent">
              <sub className="text-lg font-bold bg-zinc-900 text-white p-3 ml-0 rounded-tl-md rounded-tr-md">
                MY POSTS
              </sub>
            </div>
            <div className="feeds-items mt-3 bg-zinc-900 p-2 rounded-bl-md rounded-br-md rounded-tr-md">
              <MyFeeds />
            </div>
          </div>
        </div>
        <div
          title="create new post?"
          className="create-post-sign size-12 rounded-full bg-zinc-800 z-10 m-4"
        ></div>
      </div>
    </>
  );
}
