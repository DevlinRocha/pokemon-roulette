export function capitalize(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatPokemonName(name: string) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function normalizePokemonName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/♀/g, "f")
    .replace(/♂/g, "m")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

export function getRandomId(
  min: number,
  max: number,
  excluded?: number[]
): number {
  const result = Math.floor(Math.random() * (max + 1 - min)) + min;
  return excluded?.includes(result) ? getRandomId(min, max, excluded) : result;
}
