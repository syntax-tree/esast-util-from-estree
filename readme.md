# esast-util-from-estree

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**esast**][esast] utility to transform from [**estree**][estree].

This is often an optional transform: estrees can be used in most places
where esast can be used, and vice versa.
This makes sure nodes are plain JSON, adds unist positions, normalizes
`.bigint`, and removes certain discouraged fields.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install esast-util-from-estree
```

## Use

```js
import {parse} from 'acorn'
import {fromEstree} from 'esast-util-from-estree'

// Make acorn support comments and positional info.
const comments = []
const esast = parse(
  'export function x() { /* Something senseless */ console.log(/(?:)/ + 1n) }',
  {sourceType: 'module', locations: true, onComment: comments}
)
esast.comments = comments

console.log(fromEstree(esast))
```

Yields:

```js
{
  type: 'Program',
  body: [
    {
      type: 'ExportNamedDeclaration',
      declaration: [Object],
      specifiers: [],
      source: null,
      position: [Object]
    }
  ],
  sourceType: 'module',
  comments: [
    {
      type: 'Block',
      value: ' Something senseless ',
      position: [Object]
    }
  ],
  position: {
    start: {line: 1, column: 1, offset: 0},
    end: {line: 1, column: 75, offset: 74}
  }
}
```

## API

This package exports the following identifiers: `fromEstree`.
There is no default export.

### `fromEstree(estree, options?)`

Given an [`estree`][estree] returns an [esast][].

Pass `options.dirty: true` to leave discouraged fields in the tree.

## Related

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://github.com/syntax-tree/esast-util-from-estree/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/esast-util-from-estree/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/esast-util-from-estree.svg

[coverage]: https://codecov.io/github/syntax-tree/esast-util-from-estree

[downloads-badge]: https://img.shields.io/npm/dm/esast-util-from-estree.svg

[downloads]: https://www.npmjs.com/package/esast-util-from-estree

[size-badge]: https://img.shields.io/bundlephobia/minzip/esast-util-from-estree.svg

[size]: https://bundlephobia.com/result?p=esast-util-from-estree

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[esast]: https://github.com/syntax-tree/esast

[estree]: https://github.com/estree/estree
