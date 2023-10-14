import { ReactNode } from "react";
import { Header } from "..";

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            {children}
        </>
    )
}