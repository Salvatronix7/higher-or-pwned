import { PropsWithChildren } from "react";

export type ConsoleProps = {
    animateRef?: React.RefObject<HTMLDivElement>;
} & PropsWithChildren;