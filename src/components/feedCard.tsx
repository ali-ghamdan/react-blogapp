import { postStore, routeStore } from "@/lib/stores";
import { postData, RouteDirection } from "@/lib/types";
import { getUserShortName } from "@/lib/utils";
import { MouseEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function FeedCard({ post }: { post: postData }) {
  const { setRoute } = routeStore();
  const { setPost } = postStore();

  const pe = document.createElement("div");
  pe.innerHTML = post.shortContent!;
  const shortContent = pe.textContent?.trim();

  const handleOnClickPost = (e: MouseEvent) => {
    e.preventDefault();
    setPost({ id: post.id, title: post.title });
    setRoute(RouteDirection.POST_PAGE);
  };

  return (
    <a
      href="#"
      className="text-white hover:text-zinc-200"
      onClick={handleOnClickPost}
    >
      <div className="bg-zinc-700 rounded-md pt-4 pl-3 pb-0.5 pr-0.5 shadow-black shadow-sm">
        <div className="feed-header flex">
          <div>
            <Avatar className="shadow shadow-black border-zinc-500 border">
              <AvatarImage src={post.poster.avatar} />
              <AvatarFallback className="bg-zinc-800">
                {getUserShortName(post.poster.username)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="ml-3">
              <p className="font-semibold">{post.poster.username}</p>
              <p className="font-light text-xs">
                {post.poster.postsCount} Post / Joined At:{" "}
                {new Date(post.poster.createdAt!).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="feed-content mt-3 ml-12">
          <div className="font-bold text-lg">{post.title}</div>
          <div className="text-sm mt-1">{shortContent}</div>
        </div>
        <div className="feed-footer flex justify-end m-1.5 text-sm font-light opacity-50">
          {post.likes} Like / {post.commentsCount} Comment / At:{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
    </a>
  );
}
