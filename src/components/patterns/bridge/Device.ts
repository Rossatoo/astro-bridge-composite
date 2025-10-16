export interface Device {
  getName(): string;
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(v: number): void;
  getChannel(): number;
  setChannel(c: number): void;
}
