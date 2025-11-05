import {apiSlice} from "../api/ApiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        UpdateAvatar: builder.mutation({
            query: (avatar) => ({
                url: "/user/update-user-avatar",
                method: "PUT",
                body: { avatar },
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    // dispatch(userLogin(result.data));
                } catch (error: any) {
                    console.log(error);
                }
            }
          
        }),
        EditProfile: builder.mutation({
            query: ({email, name}) => ({
                url: "/user/update-user-info",
                method: "PUT",
                body: { email, name },
                credentials: "include" as const,
                
            })
        }),
        updateUserPassword: builder.mutation({
            query: ({oldPassword, newPassword}) => ({
                url: "/user/update-user-password",
                method: "PUT",
                body: { oldPassword, newPassword },
                credentials: "include" as const,
                
            })
        }),
        getallUser: builder.mutation({
            query: () => ({
                url: "/user/get-all",
                method: "GET",
                credentials: "include" as const,
            })
        }),
        updateRole: builder.mutation({
            query: ({userId, role}) => ({
                url: "/user/update-role",
                method: "PUT",
                body: { userId, role },
                credentials: "include" as const,
                
            })
        }),
        deleteUser: builder.mutation({
            query: ({userId}) => ({
                url: "/user/delete-user",
                method: "DELETE",
                body: { userId },
                credentials: "include" as const,
                
            })
        })
    }),

})

export const { useUpdateAvatarMutation,useUpdateRoleMutation,useGetallUserMutation ,useEditProfileMutation,useUpdateUserPasswordMutation,useDeleteUserMutation} = userApi;