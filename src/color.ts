export default function getColor(dur: number): string {
  const minutes = dur / 60000;
  if (minutes <= -1) return 'grey';
  if (minutes <= 0) return 'red';
  if (minutes <= 1) return 'orange';
  if (minutes <= 3) return 'amber';
  return 'green';
}
