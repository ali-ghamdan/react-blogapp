import { authStore, routeStore } from "@/lib/stores";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RouteDirection, UserData } from "@/lib/types";
import { useEffect, useState, FormEvent } from "react";
import { userProfile } from "@/lib/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserShortName } from "@/lib/utils";
import { searchPosts } from "@/lib/posts";
import { createRoot } from "react-dom/client";
import NotFoundPage from "./notFoundPage";
import SearchResultCard from "./searchResultCard";

export default function NavBar() {
  const { auth, setAuth } = authStore();
  const { route, setRoute } = routeStore();
  const [user, setUser] = useState<UserData | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const handleLogout = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAuth(undefined);
    setUser(undefined);
    setRoute(RouteDirection.HOME_PAGE);
  };

  const handleRoute = (
    e: FormEvent<HTMLButtonElement>,
    route: RouteDirection
  ) => {
    e.preventDefault();
    setRoute(route);
  };

  let delay = Date.now();
  const handleSearch = async (e: FormEvent<HTMLInputElement>) => {
    const resultsElements = document.querySelector("#search-results");
    const root = createRoot(resultsElements!);
    console.log({ searchQuery, value: e.currentTarget.value });
    if (true /* Date.now() - delay > 500 */) {
      delay = Date.now();
      // search
      const results = await searchPosts(auth, e.currentTarget.value);
      if (!results) {
        root.render(
          <div className="bg-zinc-700 p-2 rounded-lg shadow-2xl shadow-zinc-950">
            <div className="">NOT FOUND</div>
          </div>
        );
      } else {
        root.render(
          <div className="bg-zinc-700 p-2 rounded-lg shadow-lg shadow-zinc-950">
            {results.map((result) => (
              <div>
                <SearchResultCard post={result} key={result.id} />
              </div>
            ))}
          </div>
        );
      }
    }
  };

  useEffect(() => {
    userProfile(auth || undefined).then((profile) => {
      setUser(profile);
    });
  }, [auth]);

  return (
    <>
      <div id="nav" className="bg-zinc-800 text-white sticky p-3 h-1/4 w-svw">
        <div className="flex justify-between">
          <Button
            className="mr-2"
            onClick={(e) => handleRoute(e, RouteDirection.HOME_PAGE)}
            disabled={route === RouteDirection.HOME_PAGE}
          >
            Home
          </Button>
          {route === RouteDirection.HOME_PAGE ? (
            <>
              <Input
                placeholder="Search"
                className="border-zinc-700 border-2 w-1/2 max-w-prose"
                onInput={(e) => {
                  e.preventDefault();
                  setSearchQuery(e.currentTarget.value);
                  handleSearch(e);
                }}
              />
              <div
                id="search-results"
                style={{ display: searchQuery === "" ? "none" : undefined }}
                className="absolute w-full max-w-prose max-h-96 top-14 left-1/4 "
              ></div>
            </>
          ) : (
            <></>
          )}
          <div className="flex">
            {user?.email ? (
              <>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-zinc-900">
                    {getUserShortName(user.username)}
                  </AvatarFallback>
                </Avatar>
                <Button className="ml-2" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="mr-2"
                  onClick={(e) => handleRoute(e, RouteDirection.LOGIN_PAGE)}
                  disabled={route === RouteDirection.LOGIN_PAGE}
                >
                  Login
                </Button>
                <Button
                  onClick={(e) => handleRoute(e, RouteDirection.REGISTER_PAGE)}
                  disabled={route === RouteDirection.REGISTER_PAGE}
                >
                  SignUp
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
