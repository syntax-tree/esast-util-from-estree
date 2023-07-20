/**
 * @typedef {import('unist').Node} UnistNode
 * @typedef {import('estree-jsx').Node} EstreeNode
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [dirty=false]
 *   Leave discouraged fields in the tree.
 */

import {positionFromEstree} from 'unist-util-position-from-estree'
import {visit} from 'estree-util-visit'

const own = {}.hasOwnProperty

/**
 * Turn an estree into an esast.
 *
 * @param {EstreeNode} estree
 *   estree.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {UnistNode}
 *   esast.
 */
export function fromEstree(estree, options = {}) {
  /** @type {UnistNode | undefined} */
  let tail

  visit(estree, {
    // eslint-disable-next-line complexity
    leave(node, field, index, parents) {
      const parent = parents[parents.length - 1]
      /** @type {EstreeNode} */
      const context =
        field === undefined || index === undefined
          ? parent
          : // @ts-expect-error: indexable.
            parent[field]
      /** @type {string | number | undefined} */
      const prop = index === undefined ? field : index
      /** @type {UnistNode} */
      const copy = {}
      /** @type {string} */
      let key

      for (key in node) {
        if (
          own.call(node, key) &&
          ((options && options.dirty) ||
            (key !== 'start' &&
              key !== 'end' &&
              key !== 'loc' &&
              key !== 'raw'))
        ) {
          if (
            node.type === 'JSXOpeningFragment' &&
            (key === 'attributes' || key === 'selfClosing')
          ) {
            continue
          }

          /** @type {unknown} */
          // @ts-expect-error: indexable.
          let value = node[key]

          // If this is a bigint or regex literal, reset value.
          if (
            (!options || !options.dirty) &&
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
            const match = /0[box]/.exec(value.slice(0, 2).toLowerCase())

            if (match) {
              const code = match[0].charCodeAt(1)
              value = Number.parseInt(
                value.slice(2),
                code === 98 /* `x` */ ? 2 : code === 111 /* `o` */ ? 8 : 16
              ).toString()
            }
          }

          // @ts-expect-error: indexable.
          copy[key] = value
        }
      }

      copy.position = positionFromEstree(node)

      if (prop === undefined) {
        tail = copy
      } else {
        // @ts-expect-error: indexable.
        context[prop] = copy
      }
    }
  })

  // @ts-expect-error: always one node.
  return tail
}
