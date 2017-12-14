// @flow

export function storeState(name: string, state: any) {
  try {
    localStorage.setItem(name, JSON.stringify(state));
  } catch (e) {
    // ignored
  }
}

export function readState(name: string) {
  try {
    const state = localStorage.getItem(name);
    if (state) {
      return JSON.parse(state);
    }
  } catch (e) {
    // ignored
  }
  return null;
}
