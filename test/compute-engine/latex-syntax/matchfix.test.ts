import { latex, expressionError, check } from '../../utils';

describe('MATCHFIX', () => {
  test('\\lbrack\\rbrack', () =>
    expect(check('\\lbrack\\rbrack')).toMatchInlineSnapshot(`
      'box      = ["Error", ["Error", "Nothing", "'unknown-command'", ["LatexForm", "'\\lbrack'"]], "'syntax-error'", ["LatexForm", "'\\rbrack'"]]
      evaluate  = "Nothing"'
    `));

  test('\\lbrack a\\rbrack', () =>
    expect(check('\\lbrack a\\rbrack')).toMatchInlineSnapshot(`
      'box      = ["Error", ["Error", "Nothing", "'unknown-command'", ["LatexForm", "'\\lbrack'"]], "'syntax-error'", ["LatexForm", "'a\\rbrack'"]]
      evaluate  = "Nothing"'
    `));

  test('\\lbrack a, b\\rbrack', () =>
    expect(check('\\lbrack a, b\\rbrack')).toMatchInlineSnapshot(`
      'box      = ["Error", ["Error", "Nothing", "'unknown-command'", ["LatexForm", "'\\lbrack'"]], "'syntax-error'", ["LatexForm", "'a, b\\rbrack'"]]
      evaluate  = "Nothing"'
    `));

  test('\\lbrack a, \\lbrack b, c\\rbrack\\rbrack', () =>
    expect(check('\\lbrack a, \\lbrack b, c\\rbrack\\rbrack'))
      .toMatchInlineSnapshot(`
      'box      = ["Error", ["Error", "Nothing", "'unknown-command'", ["LatexForm", "'\\lbrack'"]], "'syntax-error'", ["LatexForm", "'a, \\lbrack b, c\\rbrack\\rbrack'"]]
      evaluate  = "Nothing"'
    `));

  test('\\sin\\lbrack a, \\lbrack b, c\\rbrack\\rbrack', () =>
    expect(
      check('\\sin\\lbrack a, \\lbrack b, c\\rbrack\\rbrack')
    ).toMatchInlineSnapshot(
      `'TypeError: Cannot read properties of undefined (reading 'head')'`
    )); // @todo
});

describe('MATCHFIX serialize', () => {
  test('[List]', () =>
    expect(latex(['List'])).toMatchInlineSnapshot(`'\\mathrm{List}()'`));

  test('[List, "a"]', () =>
    expect(latex(['List', 'a'])).toMatchInlineSnapshot(`'\\mathrm{List}(a)'`));

  test(`['List', 'a', 'b']`, () =>
    expect(latex(['List', 'a', 'b'])).toMatchInlineSnapshot(
      `'\\mathrm{List}(a, b)'`
    ));

  test(`['List', 'a', ['List', 'b', 'c']`, () =>
    expect(latex(['List', 'a', ['List', 'b', 'c']])).toMatchInlineSnapshot(
      `'\\mathrm{List}(a, \\mathrm{List}(b, c))'`
    ));
});

describe('MATCHFIX synonyms', () => {
  // A given matchfix operators has automatic synonyms:
  // () -> \left(\right)
  //    -> \bigl(\bigr)
  //    -> \lparen\rparen
  //    -> etc...

  test('(a, b, c)', () =>
    expect(check(`(a, b, c)`)).toMatchInlineSnapshot(`
      'box      = ["Delimiter", "a", "b", "c"]
      canonical = "a"'
    `));

  test('\\left(a, b, c\\right)', () =>
    expect(check(`\\left(a, b, c\\right)`)).toMatchInlineSnapshot(`
      'box      = ["Delimiter", "a", "b", "c"]
      canonical = "a"'
    `));
  test('\\bigl(a, b, c\\bigr)', () =>
    expect(check(`\\bigl(a, b, c\\bigr)`)).toMatchInlineSnapshot(`
      'box      = ["Delimiter", "a", "b", "c"]
      canonical = "a"'
    `));
  test('\\big(a, b, c\\big)', () =>
    expect(check(`\\big(a, b, c\\big)`)).toMatchInlineSnapshot(`
      'box      = ["Delimiter", "a", "b", "c"]
      canonical = "a"'
    `));
  test('\\lparen a, b, c\\rparen', () =>
    expect(check(`\\lparen a, b, c\\rparen`)).toMatchInlineSnapshot(`
      'box      = ["Delimiter", "a", "b", "c"]
      canonical = "a"'
    `));
  test('\\left\\lparen a, b, c\\right\\rparen', () =>
    expect(check(`\\left\\lparen a, b, c\\right\\rparen`))
      .toMatchInlineSnapshot(`
      'box      = ["Delimiter", "a", "b", "c"]
      canonical = "a"'
    `));
});

describe('MATCHFIX abs and norm', () => {
  test('1+|a|+2', () =>
    expect(check('1+|a|+2')).toMatchInlineSnapshot(`
      'box      = ["Error", 1, "'syntax-error'", ["LatexForm", "'+|a|+2'"]]
      evaluate  = 1'
    `));

  test('1+|a|+2', () =>
    expect(check('|(1+|a|+2)|')).toMatchInlineSnapshot(`
      'box      = ["Error", "Nothing", "'syntax-error'", ["LatexForm", "'|(1+|a|+2)|'"]]
      evaluate  = "Nothing"'
    `)); // @todo

  test('|1+|a|+2|', () =>
    expect(check('|1+|a|+2|')).toMatchInlineSnapshot(`
      'box      = ["Error", "Nothing", "'syntax-error'", ["LatexForm", "'|1+|a|+2|'"]]
      evaluate  = "Nothing"'
    `));

  test('||a||', () =>
    expect(check('||a||')).toMatchInlineSnapshot(`
      'box      = ["Error", "Nothing", "'syntax-error'", ["LatexForm", "'||a||'"]]
      evaluate  = "Nothing"'
    `));
  test('||a||+|b|', () =>
    expect(check('||a||+|b|')).toMatchInlineSnapshot(`
      'box      = ["Error", "Nothing", "'syntax-error'", ["LatexForm", "'||a||+|b|'"]]
      evaluate  = "Nothing"'
    `));
});

describe('MATCHFIX invalid', () => {
  test('( // missing closing fence', () => {
    expect(check('(')).toMatchInlineSnapshot(`
      'box      = ["Error", "Nothing", "'syntax-error'", ["LatexForm", "'('"]]
      evaluate  = "Nothing"'
    `);
  });
  test(') // missing opening fence', () => {
    expect(check(')')).toMatchInlineSnapshot(`
      'box      = ["Error", "Nothing", "'syntax-error'", ["LatexForm", "')'"]]
      evaluate  = "Nothing"'
    `);
  });

  test('-( // missing closing fence', () => {
    expect(expressionError('-(')).toMatchInlineSnapshot(`[]`);
  });

  test('(3+x // missing closing fence', () => {
    expect(expressionError('(3+x')).toMatchInlineSnapshot(`[]`);
  });
});
