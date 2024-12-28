import { authStore, postStore, routeStore } from "@/lib/stores";
import NotFoundPage from "./notFoundPage";
import { FormEvent, useEffect, useState } from "react";
import { postData, RouteDirection } from "@/lib/types";
import Loading from "./loading";
import { createComment, delPost, getPost, toggleLike } from "@/lib/posts";
import { CiHeart, CiTrash } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

import "./postPage.css";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserShortName } from "@/lib/utils";
import Comments from "./comments";
import { Button } from "./ui/button";

export default function PostPage() {
  const auth = authStore((state) => state.auth);
  const { post: postID } = postStore();
  const setRoute = routeStore((state) => state.setRoute);
  const [post, setPost] = useState<postData | undefined | null>(undefined);
  const [isLiked, setIsLiked] = useState(post?.isLikedByAuthorizedUser);
  const [commentsPage, setCommentsPage] = useState(1);

  useEffect(() => {
    getPost(auth, postID.id)
      .then((post) => {
        setPost(post);
        if (post?.isLikedByAuthorizedUser != isLiked) {
          setIsLiked(post?.isLikedByAuthorizedUser);
        }
      })
      .catch((err) => {
        console.error("ERROR Getting Post:", err);
        setPost(null);
      });
  }, [postID.id, isLiked]);
  const setLike = async () => {
    const S = await toggleLike(auth, postID.id);
    setIsLiked(S?.status === "ADD");
  };

  if (!auth) return setRoute(RouteDirection.HOME_PAGE);
  if (!postID) return <NotFoundPage />;

  const handleCreatingComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const b = document.querySelector("#comment-button") as HTMLButtonElement;
    b.disabled = true;
    b.innerHTML = "Submitting...";
    const content = document.querySelector(
      "#comment-content"
    ) as HTMLTextAreaElement;
    await createComment(auth, postID.id, content.value).then(() =>
      setCommentsPage(commentsPage)
    );
    b.disabled = false;
    b.innerHTML = "Submit";
    setCommentsPage(commentsPage);
  };

  const deletePost = async () => {
    const SUCCESS = await delPost(auth, postID.id);
    if (SUCCESS?.success) {
      alert("Post Deleted Successfully.");
      setRoute(RouteDirection.HOME_PAGE);
    } else {
      alert("Post couldn't be delete.");
    }
  };

  useEffect(() => {}, [commentsPage]);

  return (
    <>
      {post === undefined ? (
        <>
          <Loading />
        </>
      ) : post === null ? (
        <>
          <NotFoundPage />
        </>
      ) : (
        <>
          <div>
            <div className="rating-box z-10 absolute top-20 left-0 bottom-5 bg-zinc-950 ml-5 p-2 px-6 rounded-md">
              <div className="rating-items flex justify-between mt-3 flex-col h-1/3">
                <div
                  onClick={setLike}
                  className="like-item relative cursor-pointer"
                  title="like"
                >
                  {isLiked ? (
                    <FaHeart className="size-6" fill="#ee2828" />
                  ) : (
                    <CiHeart className="size-6" />
                  )}
                  <sub className="absolute -bottom-3 font-bold ml-2 mt-1">
                    {post.likes.toLocaleString("en")}
                  </sub>
                </div>
                {post.isPoster && (
                  <div
                    onClick={deletePost}
                    className="like-item relative cursor-pointer"
                    title="like"
                  >
                    <CiTrash className="size-6" />
                    <sub className="absolute -bottom-3 font-bold ml-2 mt-1">
                      Delete
                    </sub>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center m-5 ">
            <div className="content max-w-xl min-w-96 bg-zinc-950 rounded-lg p-2">
              <div className="header bg-black m-1 p-3 mb-3 rounded-lg pr-20">
                <div className="flex">
                  <div>
                    <Avatar>
                      <AvatarImage src={post.poster.avatar} />
                      <AvatarFallback className="bg-zinc-900 border border-zinc-600">
                        {getUserShortName(post.poster.username)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-2">
                    <b>{post.poster.username}</b>
                    <br />
                    <sup className="font-thin">
                      <b>From: </b>
                      {new Date(post.poster.createdAt!).toLocaleDateString(
                        "en"
                      )}
                      <b>, With: </b>
                      {post.poster.postsCount}{" "}
                      <b>
                        Post<span className="font-thin">(s)</span>
                      </b>
                    </sup>
                  </div>
                </div>
                <div className="my-4"></div>
                <div className="m-3">
                  <div className="font-semibold text-2xl">{post.title}</div>
                </div>
              </div>
              <hr />
              <div
                className="post-content m-2 p-3 bg-black rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
              <hr />
              <div className="post-comments m-2 p-3 bg-black rounded-lg">
                <sup>
                  <b>COMMENTS:</b>
                </sup>
                <div className="comments">
                  <div>
                    <form onSubmit={handleCreatingComment}>
                      <textarea
                        className="resize-none w-full p-2 bg-zinc-950 rounded-md mb-1 h-20"
                        placeholder="write a Comment, (min: 10 letters)."
                        id="comment-content"
                        minLength={10}
                      />
                      <div className="flex justify-center">
                        <Button
                          id="comment-button"
                          type="submit"
                          className="rounded-lg w-full"
                        >
                          Submit
                        </Button>
                      </div>
                    </form>
                  </div>
                  <hr />
                  <div className="comments-section">
                    <Comments
                      setPage={(p) => {
                        setCommentsPage(p);
                      }}
                      page={commentsPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
