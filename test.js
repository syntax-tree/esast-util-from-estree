/**
 * @typedef {import('estree-jsx').Program} EstreeProgram
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {Parser} from 'acorn'
import jsx from 'acorn-jsx'
import {fromEstree} from 'esast-util-from-estree'

const parser = Parser.extend(jsx())

test('fromEstree', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'fromEstree'
    ])
  })

  await t.test('should transform', async function () {
    /** @type {EstreeProgram} */
    // @ts-expect-error: acorn looks like estree.
    let tree = parser.parse('console.log(1)', {
      locations: true,
      ecmaVersion: 2021
    })

    tree = fromEstree(tree)

    assert.deepEqual(tree, {
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
    })
  })

  await t.test('should transform regexes', async function () {
    /** @type {EstreeProgram} */
    // @ts-expect-error: acorn looks like estree.
    let tree = parser.parse('/(?:)/', {locations: true, ecmaVersion: 2021})

    tree = fromEstree(tree)

    const statement = tree.body[0]
    assert(statement.type === 'ExpressionStatement')

    assert.deepEqual(statement.expression, {
      type: 'Literal',
      regex: {pattern: '(?:)', flags: ''},
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 7, offset: 6}
      }
    })
  })

  await t.test('should transform jsx fragments', async function () {
    /** @type {EstreeProgram} */
    // @ts-expect-error: acorn looks like estree.
    let tree = parser.parse('<>b</>', {locations: true, ecmaVersion: 2021})

    tree = fromEstree(tree)

    const statement = tree.body[0]
    assert(statement.type === 'ExpressionStatement')

    assert.deepEqual(statement.expression, {
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
    })
  })

  await t.test('should transform and normalize bigints', async function () {
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
      /** @type {EstreeProgram} */
      // @ts-expect-error: acorn looks like estree.
      let tree = parser.parse(bigInts[index][0], {
        locations: true,
        ecmaVersion: 2021
      })

      tree = fromEstree(tree)

      const statement = tree.body[0]
      assert(statement.type === 'ExpressionStatement')
      const expression = statement.expression
      assert(expression.type === 'Literal')
      assert('bigint' in expression)

      assert.deepEqual(expression.bigint, '1')
    }
  })
})
