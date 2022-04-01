export function capitalize(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function getRandomId(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}
