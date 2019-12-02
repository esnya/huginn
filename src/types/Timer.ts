export default interface Timer {
  name: string;
  timestamp: number;
  icon?: string;
  prevTimestamp?: number;
  attributes: Record<string, string | number | boolean>;
  interval?: number;
}
