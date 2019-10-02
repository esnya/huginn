export default interface Timer {
  name: string;
  timestamp: number;
  attributes: Record<string, string | number | boolean>;
}
