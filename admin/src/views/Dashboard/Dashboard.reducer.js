import { GET_DASHBOARD_DATA} from '../../redux/types';
const initialState = {
    dashboardList:null,
    dashboardListAuth: false,
    membersGraph:null,
    membersGraphAuth:false,
    coachesGraph:null,
    coachesGraphAuth:false,
    memberMembershipsGraph:null,
    memberMembershipsGraphAuth:false,
    coachMembershipsGraph:null,
    blogsGraphAuth:false,
}
export default function (state = initialState, action) {
    switch (action.type) {
        case GET_DASHBOARD_DATA:
            return {
                ...state,
                dashboardListAuth: true,
                dashboardList: action.payload.dashboardData,
                membersGraph:action.payload.membersGraph,
                membersGraphAuth:true,
                coachesGraph:action.payload.coachesGraph,
                coachesGraphAuth:true,
                memberMembershipsGraph:action.payload.memberMembershipsGraph,
                memberMembershipsGraphAuth:true,
                blogsGraph:action.payload.blogGraph,
                blogsGraphAuth:true,
            }
        default:
            return {
                ...state
            }
    }
}