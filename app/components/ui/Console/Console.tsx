import { motion } from "motion/react";
import "./Console.css";
import { ConsoleProps } from "./Console.types";

export const Console = ({ children, animateRef }: ConsoleProps) => {
    return <motion.div id="console" ref={animateRef} layoutId="console" className="consoleRoot">
        <div className="consoleHeader">
            <div className="consoleHeaderName">Higher || pwned</div>
            <div className="consoleHeaderButtons">
                <div>▬</div>
                <div>□</div>
                <div>+</div>
            </div>
        </div>
        <div className="consoleBody">
            {children}
        </div>
    </motion.div>;
}