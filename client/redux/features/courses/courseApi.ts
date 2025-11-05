import { apiSlice } from "../api/ApiSlice";

export const CourseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserCourse: builder.mutation({
            query: () => ({
                url: "/course/get-purchased",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        createCourse: builder.mutation({
            query: ({data}) => ({
                url: "/course/create",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        getAllCourse: builder.mutation({
            query: () => ({
                url: "/course/get-all",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
         updateCourse: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/course/edit/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
        deleteCourse: builder.mutation({
      query: ({id}) => ({
        url: `/course/delete`,
        method: "DELETE",
        body: {courseId:id},
        credentials: "include" as const,
      }),
    }),
    AllCoursesWithoutPurhase: builder.mutation({
    query: () => ({
        url: `/course/get`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    GetSingleCourse: builder.query({
      query: (id) => ({
        url: `/course/get/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
        GetCourseContent: builder.query({
      query: (id) => ({
        url: `/course/get-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
   
    AddQuestion: builder.mutation({
      query: ({question,
      courseId,
     contentId}) => ({
        url: `/course/add-question`,
        method: "PUT",
        body: {question,courseId,contentId},
        credentials: "include" as const,
      }),
    }),
    AddAnswer: builder.mutation({
      query: ({data}) => ({
        url: `/course/add-answer`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    AddReview: builder.mutation({
      query: ({data,id}) => ({
        url: `/course/add-review/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    addReplytoReview: builder.mutation({
      query: ({data}) => ({
        url: `/course/add-reply`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    
    }),
})
});

export const { useGetUserCourseMutation,useAddAnswerMutation,useAddQuestionMutation,useAddReviewMutation,useAddReplytoReviewMutation,useGetCourseContentQuery,useGetSingleCourseQuery,useDeleteCourseMutation,useCreateCourseMutation,useGetAllCourseMutation,useUpdateCourseMutation,useAllCoursesWithoutPurhaseMutation } = CourseApi;