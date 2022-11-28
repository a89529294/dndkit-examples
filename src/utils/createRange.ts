export default function createRange(count: number, fn: (num: number) => string) {
  return new Array(count).fill("").map((_, i) => fn(i));
}
