import { commentsList, postData } from "./types";
import { bRequest, TC } from "./utils";

export async function createPost(
  token: string | undefined | null,
  title: string | undefined,
  content: string | undefined
): Promise<postData | null> {
  if (!title || content) return null;
  const [e1, d1] = await TC(() =>
    bRequest(`/posts`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      data: {
        title,
        content,
      },
    })
  );
  if (e1) {
    console.error("ERROR creatingPost:", e1);
    return null;
  }
  return d1?.data;
}

export async function getPost(
  token: string | undefined | null,
  id: string | undefined
): Promise<postData | null> {
  if (!id) return null;
  const [e1, d1] = await TC(() =>
    bRequest(`/posts/${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1) {
    console.error("ERROR gettingPost:", e1);
    return null;
  }
  return d1?.data;
}

export async function delPost(
  token: string | undefined | null,
  id: string | undefined
): Promise<{ success: boolean } | null> {
  if (!id) return null;
  const [e1, d1] = await TC(() =>
    bRequest(`/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1) {
    console.error("ERROR deletingPost:", e1);
    return null;
  }
  return d1?.data;
}

export async function toggleLike(
  token: string | undefined | null,
  id: string | undefined
): Promise<{ status: "ADD" | "REMOVE" } | null> {
  if (!id) return null;
  const [e1, d1] = await TC(() =>
    bRequest(`/posts/${id}/like`, {
      method: "PUT",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1) {
    console.error("ERROR toggleLike:", e1);
    return null;
  }
  return d1?.data;
}

export async function getComments(
  token: string | undefined | null,
  postId: string | undefined,
  page: number = 1
): Promise<commentsList | null> {
  if (!postId) return null;
  const [e1, d1] = await TC(() =>
    bRequest(`/posts/${postId}/comments?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1) {
    console.error("ERROR GettingComments:", e1);
    return null;
  }
  console.log("GC", d1?.data);
  return d1?.data;
}

export async function createComment(
  token: string | undefined | null,
  postId: string | undefined,
  content: string
): Promise<commentsList | null> {
  if (!postId) return null;
  const [e1, d1] = await TC(() =>
    bRequest(`/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      data: {
        content,
      },
    })
  );
  if (e1) {
    console.error("ERROR postComment:", e1);
    return null;
  }
  return d1?.data;
}

export async function LikeComment(
  token: string | undefined | null,
  postId: string | undefined,
  commentId: string
): Promise<{ status: "ADD" | "REMOVE" } | null> {
  if (!postId) return null;
  const [e1, d1] = await TC(() =>
    bRequest(`/posts/${postId}/comments/${commentId}/like`, {
      method: "PUT",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1) {
    console.error("ERROR likeComment:", e1);
    return null;
  }

  return d1?.data;
}

export async function delComment(
  token: string | undefined | null,
  postId: string | undefined,
  commentId: string
): Promise<{ success: boolean } | null> {
  if (!postId) return null;
  const [e1, d1] = await TC(() =>
    bRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1) {
    console.error("ERROR DeleteComment:", e1);
    return null;
  }

  return d1?.data;
}

export async function searchPosts(
  token: string | undefined | null,
  query: string
): Promise<Array<postData> | null> {
  if (!query || !token) return null;

  const [e1, d1] = await TC(() =>
    bRequest(`/posts/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
  );
  if (e1) {
    console.error("ERROR SearchPosts:", e1);
    return null;
  }

  return d1?.data;
}
