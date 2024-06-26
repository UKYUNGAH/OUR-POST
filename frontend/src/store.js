import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';

//글작성하기
export const createPost = createAsyncThunk('posts/createPost', async (newPost) => {
    const res = await fetch('http://localhost:5001/api/post/', {
        method: 'POST',
        // body: formData,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
    });

    const data = await res.json();
    return data;
});

//전체 게시판 불러오기
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const res = await fetch('http://localhost:5001/api/posts/');
    const data = await res.json();

    return data;
});

// 특정 게시물 불러오기
export const fetchDetail = createAsyncThunk('posts/fetchDetail', async (id) => {
    const res = await fetch(`http://localhost:5001/api/post/${id}`);
    const data = await res.json();
    return data;
});

// 특정 비번확인
export const verifyPassword = createAsyncThunk('posts/verifyPassword', async ({ id, password }) => {
    const res = await fetch(`http://localhost:5001/api/post/${id}/verify-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '비밀번호 확인 실패');
    }

    return await res.json();
});

// 카테고리별 게시물 불러오기
export const fetchPostsByCategory = createAsyncThunk('posts/fetchPostsByCategory', async (category) => {
    const res = await fetch(`http://localhost:5001/api/posts/${category}`);
    const data = await res.json();
    return data;
});

// 포스트 삭제하기
export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
    const res = await fetch(`http://localhost:5001/api/post/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '포스트 삭제 실패');
    }

    return id;
});

/** 예시로 찍어본 슬라이스 */
let user = createSlice({
    name: 'user',
    initialState: 'kim',
    reducers: {
        ChageName(state) {
            return 'john' + state;
        },
    },
});

/** side menu 슬라이스 */
let on = createSlice({
    name: 'on',
    initialState: '',
    reducers: {
        SetOn(state, action) {
            return action.payload;
        },
    },
});

let category = createSlice({
    name: 'category',
    initialState: 'BOARD',
    reducers: {
        SetCategory(state, action) {
            return action.payload;
        },
    },
});

const posts = createSlice({
    name: 'posts',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
            })
            .addCase(fetchDetail.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
            })
            .addCase(verifyPassword.fulfilled, (state, action) => {
                state.passwordVerified = true;
                state.error = null;
            })
            .addCase(verifyPassword.rejected, (state, action) => {
                state.passwordVerified = false;
                state.error = action.error.message;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = state.items.filter((post) => post.id !== action.payload);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default configureStore({
    reducer: {
        user: user.reducer,
        on: on.reducer,
        category: category.reducer,
        posts: posts.reducer,
    },
});

export let { ChageName } = user.actions;
export let { SetOn } = on.actions;
export let { SetCategory } = category.actions;
export const { resetPasswordVerification } = posts.actions;

// export { fetchPosts, createPost };
// export let { fetchPosts } = fetchPosts.actions;
