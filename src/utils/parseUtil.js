// @flow

export function parseJson(json: any): Object {
  if (json) {
    try {
      if (typeof json === 'string') {
        return JSON.parse(json);
      }
      return JSON.parse(JSON.stringify(json));
    } catch (e) {
      console.error(`Unable to parse jsonData (${json})`, e);
      return {};
    }
  }
  return {};
}
