import { motion } from "motion/react";
import "./Console.css";
import { ConsoleProps } from "./Console.types";
import { useRef } from "react";

type ConsoleConfig = Record<number, { scale: number, rotate: number, duration: number }>

const consoleConfig: ConsoleConfig = {
    [0]: { scale: 1, rotate: 0, duration: 0.5 },
    [15]: { scale: 1.001, rotate: 0.1, duration: 0.4 },
    [20]: { scale: 1.002, rotate: 0.15, duration: 0.3 },
    [25]: { scale: 1.003, rotate: 0.2, duration: 0.2 },
    [30]: { scale: 1.004, rotate: 0.25, duration: 0.2 },
    [35]: { scale: 1.005, rotate: 0.3, duration: 0.1 },
    [40]: { scale: 1.006, rotate: 0.5, duration: 0.1 },
}


export const Console = ({ children, animateRef, score = 0 }: ConsoleProps) => {
    const configRef = useRef<ConsoleConfig[number]>();

    const getTransformForScore = (score: number) => {
        configRef.current = consoleConfig[score] || configRef.current;
        const { scale, rotate, duration } = configRef.current || { scale: 1, rotate: 0, duration: 0.5 };
        return { transform: [`scale(1) rotate(${rotate}deg)`, `scale(${scale}) rotate(-${rotate}deg)`], duration }
    }

    const animateConfig = getTransformForScore(score);

    return <motion.div
        id="console"
        ref={animateRef}
        layoutId="console"
        className="consoleRoot"
        initial={{ transform: "scale(1) rotate(0deg)" }}
        animate={animateConfig}
        transition={{ duration: animateConfig.duration || 0.5, repeat: Infinity, repeatType: "reverse" }}
    >
        <div className="consoleHeader">
            <div className="consoleHeaderName">Higher || pwned</div>
            <div className="consoleHeaderButtons">
                <div className="minimizeButton">-</div>
                <div>□</div>
                <div className="closeButton">+</div>
            </div>
        </div>
        <div className="consoleBody">
            {children}
        </div>
    </motion.div>;
}