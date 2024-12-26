import { delComment, getComments, LikeComment } from "@/lib/posts";
import { authStore, postStore } from "@/lib/stores";
import { commentData } from "@/lib/types";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserShortName } from "@/lib/utils";
import { Button } from "./ui/button";
import { FaHeart } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";

export default function Comments({
  page,
  setPage,
}: {
  page: number;
  setPage: (p: number) => void;
}) {
  const auth = authStore((state) => state.auth);
  const { post } = postStore();
  const [comments, setComments] = useState<
    Array<commentData> | null | undefined
  >(undefined);
  const [havePrev, setHavePrev] = useState(page == 1);
  const [haveNext, setHaveNext] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    getComments(auth, post.id, page)
      .then((c) => {
        if (!c) return setComments(null);
        setHavePrev(c.prev);
        setHaveNext(c.next);
        setComments(c.data);
      })
      .catch((err) => {
        console.error(err);
        setComments(null);
      });
  }, [JSON.stringify(comments), needRefresh]);

  const setLike = async (commentID: string) => {
    console.log("LIKE FOR COMMENT");
    await LikeComment(auth, post.id, commentID)
      .then(() => {
        setNeedRefresh(!needRefresh);
      })
      .catch(console.error);
  };

  const deleteComment = async (commentID: string) => {
    await delComment(auth, post.id, commentID)
      .then((e) => {
        if (e?.success) {
          setNeedRefresh(!needRefresh);
        } else {
          alert("couldn't delete the comment");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("couldn't delete the comment");
      });
  };

  return (
    <>
      <div className="comments-data">
        {comments === undefined ? (
          <Loading />
        ) : comments === null ? (
          <sup className="ml-3">No Comments here for now</sup>
        ) : (
          <>
            <div className="comments-list">
              {comments.map((c) => (
                <>
                  <div
                    key={c.id}
                    className="comment bg-zinc-950 p-3 rounded-lg mt-2"
                  >
                    <div className="comment-header flex relative">
                      <div>
                        <Avatar>
                          <AvatarImage src={c.commenter.avatar} />
                          <AvatarFallback className="bg-zinc-900 border border-zinc-600">
                            {getUserShortName(c.commenter.username)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-2">
                        <b>{c.commenter.username}</b>
                        <br />
                        <sup className="font-thin">
                          <b>From: </b>
                          {new Date(c.commenter.createdAt!).toLocaleDateString(
                            "en"
                          )}
                          <b>, With: </b>
                          {c.commenter.postsCount}{" "}
                          <b>
                            Post<span className="font-thin">(s)</span>
                          </b>
                        </sup>
                      </div>
                      <div className="absolute right-1 ">
                        {c.isCommenter ? (
                          <>
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                deleteComment(c.id);
                              }}
                              className="trash-item relative cursor-pointer -top-1 p-1 bg-zinc-800 rounded-lg"
                              title="delete?"
                            >
                              <CiTrash className="size-6" fill="white" />
                              <sub className="absolute -left-0.5 -bottom-3 font-bold mt-1">
                                Delete
                              </sub>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                setLike(c.id);
                              }}
                              className="like-item relative cursor-pointer"
                              title="like"
                            >
                              <FaHeart className="size-6" fill="#ee2828" />
                              <sub className="absolute -bottom-2 font-bold ml-2 mt-1">
                                {c.likesCount.toLocaleString("en")}
                              </sub>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="comment-content bg-zinc-900 rounded-lg m-2 p-3">
                      {c.content}
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="comments-p">
              {(haveNext || havePrev) && (
                <>
                  <hr />
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setPage(page - 1)}
                      disabled={havePrev}
                    >
                      {"<"}
                    </Button>
                    <div className="p-1 rounded-md bg-zinc-900">{page}</div>
                    <Button
                      onClick={() => setPage(page + 1)}
                      disabled={haveNext}
                    >
                      {">"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
