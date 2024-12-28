export enum RouteDirection {
  HOME_PAGE,
  POST_PAGE,
  REGISTER_PAGE,
  LOGIN_PAGE,
}

export interface routeState {
  route: RouteDirection;
  setRoute: (route: RouteDirection) => void;
}

export interface authState {
  auth: string | undefined | null;
  setAuth: (authToken: string | undefined) => void;
}

export interface postState {
  post: {
    title: string | undefined;
    id: string | undefined;
  };
  setPost: (post: {
    title: string | undefined;
    id: string | undefined;
  }) => void;
}

export interface RegisterUserData {
  username: string;
  password: string;
  email: string;
}

export interface LoginUserData {
  password: string;
  email: string;
}

export interface UserData {
  username: string;
  email?: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  id?: string;
  createdAt?: string;
}

export interface postData {
  poster: UserData;
  title: string;
  content: string;
  id: string;
  createdAt: string;
  shortContent?: string;
  likes: number;
  commentsCount: number;
  isLikedByAuthorizedUser?: boolean;
  isPoster: boolean;
}

export interface commentData {
  id: string;
  content: string;
  likesCount: number;
  commenter: UserData;
  createdAt: Date;
  postId: string;
  isLikedByAuthorizedUser: boolean;
  isCommenter?: boolean;
}

export interface commentsList {
  prev: boolean;
  next: boolean;
  data: Array<commentData>;
}
