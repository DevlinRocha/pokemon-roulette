export function capitalize(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getRandomId(
  min: number,
  max: number,
  excluded?: number[]
): number {
  const result = Math.floor(Math.random() * (max + 1 - min)) + min;
  return excluded?.includes(result) ? getRandomId(min, max, excluded) : result;
}
