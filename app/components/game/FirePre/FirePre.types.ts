export interface FirePreHeatSource {
  readonly x: number;
  readonly y: number;
  readonly size: number;
}

export interface FirePreProps {
  readonly width: number;
  readonly height: number;
  readonly fps: number;
  readonly heatSource: FirePreHeatSource;
  readonly useBottomSeed?: boolean;
}
