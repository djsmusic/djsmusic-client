import * as parseUtil from 'utils/parseUtil';

describe('parseUtil', () => {
  const testObject = {
    test: true,
  };
  const testString = JSON.stringify(testObject);
  it('parses strings into objects', () => {
    const parsed = parseUtil.parseJson(testString);
    expect(parsed).toEqual(testObject);
  });

  it('returns empty object on error', () => {
    const parsed = parseUtil.parseJson('{[invalid');
    expect(parsed).toEqual({});
  });
});
