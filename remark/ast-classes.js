'use strict';

class AST {
  constructor() {}

  toString() {
    throw new Error('abstract method!');
  }
}

class Program extends AST {
  constructor(lines) {
    super();
    this.lines = lines;
    this.type = 'Program';
  }

  toString() {
    return this.lines;
  }
}

class Rule extends AST {
  constructor(line) {
    super();
    this.line = line;
    this.type = 'Rule';
  }

  toString() {
    return this.line;
  }
}

class Clause extends AST {
  constructor(name, body) {
    super();
    this.body = body;
    this.type = 'Clause';
  }

  toString() {
    return this.body.map(arg => arg.toString());
  }
}

class ClassRow extends AST {
  constructor(name, classNames) {
    super();
    this.name = 'ClassRow';
    this.type = this.name;
    this.classNames = (classNames || '').split(',').map(name => name.trim()).filter(Boolean);
  }
}
