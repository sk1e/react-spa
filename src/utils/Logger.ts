export function makeLogger(name?: string) {
  return name
    ? (message: string, ...rest: any[]) =>
        console.log(`[${name}] ${message}`, ...rest)
    : () => void 0;
}
