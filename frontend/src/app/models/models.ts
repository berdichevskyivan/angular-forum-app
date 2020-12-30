export interface AuthData {
    username: string;
    password: string;
}

export interface AuthResponse {
    type: string;
    message: string;
    username: string;
}

export interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
    creationDate: Date;
    comments: Array<PostComment>;
    currentComment: string;
}

export interface PostComment {
    postId: string;
    content: string;
    author: string;
}

export interface SavePostResponse {
    type: string;
    message: string;
}

export interface SavePostCommentResponse {
    type: string;
    message: string;
}

export interface SessionValidationResponse {
    type: string;
    message: string;
    username: string;
}

export interface UserData {
    username: string;
}
