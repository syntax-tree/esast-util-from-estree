/**
 * @typedef {import('unist').Node} UnistNode
 * @typedef {import('estree-jsx').Node} EstreeNode
 * @typedef {import('estree-util-visit').Visitor} Visitor
 *
 * @typedef Options
 * @property {boolean} [dirty=false]
 */

import {positionFromEstree} from 'unist-util-position-from-estree'
import {visit} from 'estree-util-visit'

var own = {}.hasOwnProperty

/**
 * @param {EstreeNode} estree
 * @param {Options} [options]
 * @returns {UnistNode}
 */
export function fromEstree(estree, options = {}) {
  /** @type {UnistNode} */
  var tail

  visit(estree, {leave: onleave})

  return tail

  /**
   * @type {Visitor}
   * @param {EstreeNode} node
   */
  // eslint-disable-next-line complexity
  function onleave(node, field, index, parents) {
    var parent = parents[parents.length - 1]
    /** @type {EstreeNode} */
    var context = index === null ? parent : parent[field]
    /** @type {string|number} */
    var prop = index === null ? field : index
    /** @type {UnistNode} */
    var copy = {}
    /** @type {string} */
    var key
    /** @type {RegExpMatchArray} */
    var match
    /** @type {number} */
    var code
    /** @type {unknown} */
    var value

    for (key in node) {
      if (
        own.call(node, key) &&
        (options.dirty ||
          (key !== 'start' && key !== 'end' && key !== 'loc' && key !== 'raw'))
      ) {
        value = node[key]

        // If this is a bigint or regex literal, reset value.
        if (
          !options.dirty &&
          node.type === 'Literal' &&
          key === 'value' &&
          ('bigint' in node || 'regex' in node)
        ) {
          value = null
        }
        // Normalize `.bigint` to use int notation.
        else if (
          node.type === 'Literal' &&
          key === 'bigint' &&
          typeof value === 'string'
        ) {
          match = /0[box]/.exec(value.slice(0, 2).toLowerCase())

          if (match) {
            code = match[0].charCodeAt(1)
            value = Number.parseInt(
              value.slice(2),
              code === 98 /* `x` */ ? 2 : code === 111 /* `o` */ ? 8 : 16
            ).toString()
          }
        }

        copy[key] = value
      }
    }

    copy.position = positionFromEstree(node)

    if (prop === null) {
      tail = copy
    } else {
      context[prop] = copy
    }
  }
}
