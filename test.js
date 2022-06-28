import test from 'tape'
import {Parser} from 'acorn'
import jsx from 'acorn-jsx'
import {fromEstree} from './index.js'

const parser = Parser.extend(jsx())

test('esast-util-from-estree', (t) => {
  t.deepEqual(
    fromEstree(
      // @ts-expect-error Similar enough.
      parser.parse('console.log(1)', {locations: true, ecmaVersion: 2021})
    ),
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'console',
                position: {
                  start: {line: 1, column: 1, offset: 0},
                  end: {line: 1, column: 8, offset: 7}
                }
              },
              property: {
                type: 'Identifier',
                name: 'log',
                position: {
                  start: {line: 1, column: 9, offset: 8},
                  end: {line: 1, column: 12, offset: 11}
                }
              },
              computed: false,
              optional: false,
              position: {
                start: {line: 1, column: 1, offset: 0},
                end: {line: 1, column: 12, offset: 11}
              }
            },
            arguments: [
              {
                type: 'Literal',
                value: 1,
                position: {
                  start: {line: 1, column: 13, offset: 12},
                  end: {line: 1, column: 14, offset: 13}
                }
              }
            ],
            optional: false,
            position: {
              start: {line: 1, column: 1, offset: 0},
              end: {line: 1, column: 15, offset: 14}
            }
          },
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 15, offset: 14}
          }
        }
      ],
      sourceType: 'script',
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 15, offset: 14}
      }
    },
    'should transform'
  )

  t.deepEqual(
    fromEstree(
      // @ts-expect-error Hush, it’s fine.
      parser.parse('/(?:)/', {locations: true, ecmaVersion: 2021}).body[0]
        .expression
    ),
    {
      type: 'Literal',
      value: null,
      regex: {pattern: '(?:)', flags: ''},
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 7, offset: 6}
      }
    },
    'should transform regexes'
  )

  t.deepEqual(
    fromEstree(
      // @ts-expect-error Hush, it’s fine.
      parser.parse('<>b</>', {locations: true, ecmaVersion: 2021}).body[0]
        .expression
    ),
    {
      type: 'JSXFragment',
      openingFragment: {
        type: 'JSXOpeningFragment',
        position: {
          start: {line: 1, column: 1, offset: 0},
          end: {line: 1, column: 3, offset: 2}
        }
      },
      closingFragment: {
        type: 'JSXClosingFragment',
        position: {
          start: {line: 1, column: 4, offset: 3},
          end: {line: 1, column: 7, offset: 6}
        }
      },
      children: [
        {
          type: 'JSXText',
          value: 'b',
          position: {
            start: {line: 1, column: 3, offset: 2},
            end: {line: 1, column: 4, offset: 3}
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 7, offset: 6}
      }
    },
    'should transform jsx fragments'
  )

  const bigInts = [
    ['1n', 'dec'],
    ['0X1n', 'hex, cap'],
    ['0x1n', 'hex, low'],
    ['0O1n', 'oct, cap'],
    ['0o1n', 'oct, low'],
    ['0B1n', 'bin, cap'],
    ['0b1n', 'bin, low']
  ]
  let index = -1

  while (++index < bigInts.length) {
    const tree = fromEstree(
      // @ts-expect-error Hush, it’s fine.
      parser.parse(bigInts[index][0], {locations: true, ecmaVersion: 2021})
    )

    t.deepEqual(
      // @ts-expect-error Hush, it’s fine.
      tree.body[0].expression.bigint,
      '1',
      'should transform and normalize bigints (`' + bigInts[index][1] + '`)'
    )
  }

  t.end()
})
