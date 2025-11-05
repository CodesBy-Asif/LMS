import { apiSlice } from "../api/ApiSlice";
import { userLogin, userLogout, userRegtration } from "./authSlice";

type registerResponse = {
    message: string;
    activationtoken: string;
}

type IRegister = {}

export  const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register:builder.mutation<registerResponse,IRegister>({
            query: (data) => ({
                url: "/user/register",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
           async onQueryStarted(arg,{queryFulfilled,dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userRegtration({
                        token: result.data.activationtoken,
                    }));
                    
                } catch (error:any) {
                    console.log(error);
                }
            }
        }),
        actiivation:builder.mutation({
            query: ({
                token,
                activationcode,
            }) => ({
                url: `/user/activate`,
                method: "POST",
                body: {
                    activationcode,
                    token,
                },
                credentials: "include" as const,
            }),

        })
        ,
        login: builder.mutation<void, any>({
            query: ({email,password}) => ({
                url: "/user/login",
                method: "POST",
                body: {email,password},
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLogin(result.data));
                } catch (error: any) {
                    console.log(error);
                }
            },
        }),
        SocialLogin: builder.mutation<void, any>({
            query: ({email,avatar,name}) => ({
                url: "/user/social-login",
                method: "POST",
                body: {email,avatar,name},
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLogin(result.data));
                } catch (error: any) {
                    console.log(error);
                }
            },
        }),
        logout: builder.query({
            query: () => ({
                url: "/user/logout",
                method: "GET",
                credentials: "include" as const,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;             
                    dispatch(userLogout());
                }
                catch (error: any) {
                    console.log(error);
                }
            }
        }),
        

    })
})

export const { useRegisterMutation, useActiivationMutation,useLoginMutation,useSocialLoginMutation,useLogoutQuery } = authApi;
