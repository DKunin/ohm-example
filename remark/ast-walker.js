class ASTWalker {
  traverse(ast, callbacks) {
    if (typeof callbacks !== 'object') {
      throw new TypeError('Invalid callbacks');
    }
    if (
      typeof callbacks.enterNode !== 'function'
    ) {
      throw new TypeError(
        'Invalid callbacks - missing `enterNode`.'
      );
    }

    if (Array.isArray(ast)) {
      this._visitNodes(ast, undefined, callbacks);
    } else if (typeof ast === 'object') {
      this._visitNode(ast, undefined, callbacks);
    } else {
      throw new TypeError('Invalid syntax tree');
    }
  }
  _visitNode(node, parent, callbacks) {
    if (
      node !== null &&
      typeof node === 'object'
    ) {
      const ignoreNodeKeys =
        typeof callbacks.enterNode === 'function'
          ? callbacks.enterNode(node, parent)
          : [];

      if (ignoreNodeKeys !== null) {
        this._visitChildren(node, ignoreNodeKeys, callbacks);
      }

      if (typeof callbacks.exitNode === 'function') {
        callbacks.exitNode(node, parent);
      }
    }
  }
  _visitNodes(nodes, parent, callbacks) {
    nodes.forEach(node => {
      this._visitNode(node, parent, callbacks);
    }, this);
  }

  _visitChildren(node, ignoreNodeKeys, callbacks) {
    ignoreNodeKeys = Array.isArray(ignoreNodeKeys) ? ignoreNodeKeys : [];

    // Visit all node keys which are an array or an object.
    Object.keys(node).forEach(key => {
      // Potentially ignore the given key if it is in the `ignoreNodeKeys` array.
      if (ignoreNodeKeys.indexOf(key) >= 0) {
        return;
      }

      if (Array.isArray(node[key]) || typeof node[key] === 'object') {
        this._visitChild(node[key], node, callbacks);
      }
    });
  }
  _visitChild(child, parent, callbacks) {
    const visitor = Array.isArray(child) ? this._visitNodes : this._visitNode;
    visitor.call(this, child, parent, callbacks);
  }
}
