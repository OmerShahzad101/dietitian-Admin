import { BEFORE_BLOG ,CREATE_BLOG, BLOG_LIST, GET_BLOG, UPDATE_BLOG, DELETE_BLOG } from "redux/types";

const initialState = {
    blogListAuth: false,
    blogList: [],
    blog: null,
    getBlog: null,
    getAuth: false,
    updateBlogAuth: false,
    delBlog: null,
    delBlogAuth: false,
    pagination: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case BEFORE_BLOG:
            return {
                ...state,
                blog: null,
                getAuth: false,
                getBlog: null,
                delBlog: null,
                delBlogAuth: false,
            }
        case CREATE_BLOG:
            return {
                ...state,
                blogList: [action.payload, ...state.blogList],
                blogListAuth: true,
            }
        case UPDATE_BLOG:
            return {
                ...state,
                blog: action.payload.updateBlog,
                updateBlogAuth: true,
            }
        case DELETE_BLOG:
            return {
                ...state,
                // delBlog: action.payload,
                blogList: state.blogList.filter((blog) => blog._id !== action.payload.blogId),
                delBlogAuth:true
            }
        case BLOG_LIST:
            return {
                ...state,
                blogList: action.payload.blog,
                blogListAuth: true,
                pagination: action.payload.pagination
            }
        case GET_BLOG:
            return {
                ...state,
                getAuth: true,
                getBlog: action.payload,
            }
        default:
            return {
                ...state
            }
    }
}