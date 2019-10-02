import TableHeader from './TableHeader';

export default interface TimerSet {
  name: string;
  owner: string;
  password?: string;
  attributes: TableHeader[];
}
