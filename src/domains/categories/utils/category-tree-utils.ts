import { I_CategoryTreeNode } from '../types';

/**
 * Recursively searches for a category node by its ID within a tree of categories.
 *
 * @param nodes The array of category nodes to search (usually the root list).
 * @param id The ID of the category to find.
 * @returns The found category node or undefined.
 */
export const findCategoryById = (
  nodes: I_CategoryTreeNode[],
  id: string
): I_CategoryTreeNode | undefined => {
  if (!id) return undefined;

  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findCategoryById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
};
