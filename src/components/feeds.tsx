import { authStore } from "@/lib/stores";
import { postData } from "@/lib/types";
import { userFeeds } from "@/lib/user";
import { useEffect, useState } from "react";
import FeedCard from "./feedCard";

export default function Feeds({ page }: { page: number } = { page: 1 }) {
  const auth = authStore((state) => state.auth);
  const [feeds, setFeeds] = useState<Array<postData> | undefined | null>(
    undefined
  );

  useEffect(() => {
    userFeeds(auth, page)
      .then((feeds) => setFeeds(feeds))
      .catch((err) => {
        console.error(err);
        setFeeds(null);
      });
  }, [JSON.stringify(feeds)]);

  return (
    <>
      <div>
        {feeds === undefined ? (
          // Loading
          <center>LOADING...</center>
        ) : feeds === null ? (
          // no feeds
          <center>No Feeds, please follow some users.</center>
        ) : (
          <div className="flex flex-col p-3">
            {feeds.map((feed) => {
              return <FeedCard post={feed} key={feed.id} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}
