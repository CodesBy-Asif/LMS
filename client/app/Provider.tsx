import React, {ReactNode} from "react";
import {Provider} from "react-redux";
import {store} from "../redux/Store";

interface IProviderProps {
    children: ReactNode;
}

export const ProviderWrapper = ({children}:IProviderProps) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

