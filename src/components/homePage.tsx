import { authStore, routeStore } from "@/lib/stores";
import { RouteDirection, UserData } from "@/lib/types";
import { userProfile } from "@/lib/user";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import Feeds from "./feeds";
import MyFeeds from "./myFeeds";
import "./homePage.css";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createPost } from "@/lib/posts";

export default function HomePage() {
  const { auth } = authStore();
  const [user, setUser] = useState<UserData | undefined | null>(null);
  const setRoute = routeStore((state) => state.setRoute);
  const [page, setPage] = useState(1);
  const [needRefresh, setNeedRefresh] = useState(false);
  useEffect(() => {
    userProfile(auth)
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("HOMEPAGE ERROR FETCHING USER_PROFILE:", err);
        setUser(undefined);
      });
  }, [auth]);

  const createNewPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [title, content] = [
      (document.querySelector("form #title") as HTMLInputElement).value?.trim(),
      (
        document.querySelector("form textarea") as HTMLTextAreaElement
      ).value?.trim(),
    ];
    if (!title || !content) return alert("title + content are required");
    const post = await createPost(auth, title, content);
    if (!post) return alert("something went wrong when creating a post.");
    setNeedRefresh(!needRefresh);
  };

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
              <span className=" text-lg font-bold bg-zinc-900 text-white p-3 ml-0  rounded-tl-md rounded-tr-md">
                FEEDS
              </span>
            </div>
            <div className="feeds-items mt-2 bg-zinc-900 p-2 rounded-bl-md rounded-br-md rounded-tr-md">
              <Feeds page={page} />
              <div className="feeds-pagination m-2">{"PAGINATION SOON."}</div>
            </div>
          </div>
          <div className="item my-feeds">
            <div className="sub-parent">
              <span className="text-lg font-bold bg-zinc-900 text-white p-3 ml-0 rounded-tl-md rounded-tr-md">
                MY POSTS
              </span>
            </div>
            <div className="feeds-items mt-1 bg-zinc-900 p-2 rounded-bl-md rounded-br-md rounded-tr-md">
              <MyFeeds />
            </div>
          </div>
        </div>
        <div
          title="create new post?"
          onClick={(e) => {
            e.preventDefault();
            e.currentTarget.querySelector("dialog")?.showModal();
          }}
          className="create-post-sign size-12 rounded-full bg-zinc-800 z-10 m-4"
        >
          <dialog
            id="create-post"
            onCancel={(e) => {
              e.preventDefault();
              e.currentTarget.close();
            }}
            className="relative"
          >
            <form
              onSubmit={createNewPost}
              className="w-full h-full overflow-x-hidden"
            >
              <p className="text-xl">Create New Post</p>
              <br />
              <div>
                <Label>Title</Label>
                <Input id="title" type="text" placeholder="your post title." />
              </div>
              <br />
              <div>
                <Label>Content</Label>
                <br />
                <textarea
                  id="content"
                  className="resize-none p-2 m-3 ml-0 w-full h-80 rounded-lg"
                  placeholder="your post (because this is a test, use html freely)."
                />
              </div>
              <Button
                type="submit"
                className="absolute right-3 bottom-3 bg-zinc-950"
              >
                Submit
              </Button>
            </form>
          </dialog>
        </div>
      </div>
    </>
  );
}
