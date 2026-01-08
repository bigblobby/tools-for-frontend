export interface EyeDropper {
  open(): Promise<{ sRGBHex: string }>;
}

export interface WindowWithEyeDropper extends Window {
  EyeDropper: new () => EyeDropper;
}

