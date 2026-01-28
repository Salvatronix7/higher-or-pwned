export interface TerminalTextProps {
  readonly text: string;
  readonly duration?: number;
  readonly delay?: number;
  readonly onAnimationEnd?: () => void;
  readonly className?: string;
}

export interface TerminalTextStyleInput {
  readonly duration: number;
  readonly delay: number;
  readonly textLength: number;
}
