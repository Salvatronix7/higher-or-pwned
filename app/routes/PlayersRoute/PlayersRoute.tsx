import { FC } from "react";
import { Button } from "~/components/ui/Button";
import { CommandLine } from "~/components/ui/CommandLine";
import "./PlayersRoute.css";
import { Console } from "~/components/ui/Console/Console";

const TOP_PLAYERS = [
    { name: 'Calicoscos', score: "254" },
    { name: 'Andrea', score: "230" },
    { name: 'Woody', score: "220" },
    { name: 'Rommy', score: "240" },
    { name: 'Salvador', score: "210" },
    { name: 'Julio', score: "200" },
    { name: 'Mario', score: "190" },
    { name: 'D6ni', score: "180" },
    { name: 'Alex', score: "170" },
    { name: 'Lamine Pañal', score: "160" },
];

export const Players: FC = () => {
    const duration = .2
    return (
        <div className='playersRouteRoot'>
            <Console>
                <div>
                    <CommandLine duration={duration}           >-----------------------------------------</CommandLine>
                    <CommandLine duration={duration} delay={duration * 1}>|              - TOP  10 -              |</CommandLine>
                    <CommandLine duration={duration} delay={duration * 2}>-----------------------------------------</CommandLine>
                    {TOP_PLAYERS.map((player, index) => (
                        <CommandLine key={player.name} duration={duration} delay={duration * 3 + (index * duration)}>{`|  ${player.name} ${Array(31 - player.name.length).join(" ")}| ${player.score} |`}</CommandLine>
                    ))}
                    <CommandLine duration={duration} delay={duration * (3 + TOP_PLAYERS.length)}>-----------------------------------------</CommandLine>
                    <CommandLine duration={duration} delay={duration * (3 + TOP_PLAYERS.length)}>{`|  calicoscos ${Array(31 - "calicoscos".length).join(" ")}| 20  |`}</CommandLine>

                    <CommandLine duration={duration} delay={duration * (3 + TOP_PLAYERS.length)}>-----------------------------------------</CommandLine>
                </div>
                <div>
                    <Button duration={duration} delay={duration * (4 + TOP_PLAYERS.length)} onClick={() => { }}>Retry</Button>
                </div>
            </Console>
        </div>
    );
};
