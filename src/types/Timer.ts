export default interface Timer {
  name: string;
  timestamp: number;
  icon?: string;
  attributes: Record<string, string | number | boolean>;
}
