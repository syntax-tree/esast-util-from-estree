# esast-util-from-estree

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[esast][] utility to transform from [estree][].

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`fromEstree(estree, options?)`](#fromestreeestree-options)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package applies some transforms to a given estree to make it compatible
with unist.
It:

*   makes sure nodes are plain JSON
*   adds unist positions
*   normalizes `.bigint`
*   removes certain discouraged fields

## When should I use this?

The transform applied by this utility is often optional: estrees can be used in
most places where esast can be used, and vice versa.
But, if you come from a unist background and want to deal with JavaScript,
or want to use unist utilities with JavaScript, this helps a lot.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install esast-util-from-estree
```

In Deno with [`esm.sh`][esmsh]:

```js
import {fromEstree} from 'https://esm.sh/esast-util-from-estree@1'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {fromEstree} from 'https://esm.sh/esast-util-from-estree@1?bundle'
</script>
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

This package exports the identifier `fromEstree`.
There is no default export.

### `fromEstree(estree, options?)`

Given an [`estree`][estree] returns an [esast][].

##### `options`

Configuration (optional).

###### `options.dirty`

Leave discouraged fields in the tree (`boolean`, default: `false`).

## Types

This package is fully typed with [TypeScript][].
It exports the additional type `Options`.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
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

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[esast]: https://github.com/syntax-tree/esast

[estree]: https://github.com/estree/estree
