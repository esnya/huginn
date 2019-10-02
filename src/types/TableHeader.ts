export default interface TableHeader {
  text: string;
  value: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  divider?: boolean;
  class?: string | string[];
  width?: string | number;
  filter?: (value: any, search: string | null, item: any) => boolean;
}
