import { PropsWithChildren } from "react";
import "./Console.css"
import { motion } from "motion/react";

export const Console = ({ children }: PropsWithChildren) => {
    return <motion.div layoutId="console" className="consoleRoot">
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