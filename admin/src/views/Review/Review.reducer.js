import { BEFORE_REVIEW, REVIEW_LIST, UPDATE_REVIEW, DELETE_REVIEW } from '../../redux/types';

const initialState = {
    reviewList : null,
    reviewListAuth: false,
    pagination: null,
    review: null,
    updateReviewAuth: false,
    delReview: null,
    delReviewAuth: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case BEFORE_REVIEW:
            return {
                ...state,
                // review: null,
                // loginAdminAuth: false,
                updateReviewAuth: false,
                delReview: null,
                delReviewAuth: false
            }
        case REVIEW_LIST:
            return {
                ...state,
                reviewListAuth: true,
                reviewList: action.payload.reviews,
                pagination: action.payload.pagination
            }
            case UPDATE_REVIEW:
            return {
                ...state,
                review: action.payload.review,
                updateReviewAuth: true,
            }
            case DELETE_REVIEW:
            return {
                ...state,
                delReview: action.payload,
                // reviewList: state.reviewList.filter((review) => review._id !== action.payload.reviewId),
                delReviewAuth: true
            }
        default:
            return {
                ...state
            }
    }
}