import { postStore, routeStore } from "@/lib/stores";
import { postData, RouteDirection } from "@/lib/types";

export default function SearchResultCard({ post }: { post: postData }) {
  const setRoute = routeStore((state) => state.setRoute);
  const setPost = postStore((state) => state.setPost);

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        setPost({ title: post.title, id: post.id });
        setRoute(RouteDirection.POST_PAGE);
      }}
    >
      <div className="border border-black bg-zinc-900 p-2 rounded-md my-1">
        <div>{post.title}</div>
        <div className="text-sm">{post.poster.username}</div>
      </div>
    </div>
  );
}
