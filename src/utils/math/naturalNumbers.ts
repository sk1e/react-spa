export function* naturalNumbers(): Generator<number, number, unknown> {
  for (let i = 0; ; ++i) {
    yield i;
  }
}
