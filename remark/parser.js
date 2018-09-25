'use strict';

const NLDatalog = {};

    // 
    // 
    // classLister = listOf<word, ",">
NLDatalog.grammar = ohm.grammar(`
  NLDatalog {
    Rules
      = ListOf<Rule, "\\n">
    Rule
      = Clause          -- fact
    Clause
      = ( classRow | word )+
    word = wordChar+
    classDecl = "class: "
    classRow = classDecl (className ("," className)*)*
    className = classChar+
    classChar = ~(eol | "," | "\\n") any
    wordChar = any
    eol = "\\r"? "\\n"
  }
`);

NLDatalog.semantics = NLDatalog.grammar.createSemantics()
.addOperation('toAST', {
  Rules(rules) {
    return new Program(rules.toAST());
  },

  Rule_fact(head) {
    return new Rule(head.toAST(), []);
  },

  Clause(parts) {
    let name = '';
    const args = [];
    parts.children.forEach((part, idx) => {
      if (part.isA('word') ) {
        if (idx > 0 && part.sourceString[0] !== "'") {
          name = name + ' ';
        }
        name = name + part.sourceString;
      } else {
        if (idx > 0) {
          name = name + ' ';
        }
        name = name + '@';
        args.push(part.toAST());
      }
    });
    return new Clause(name, args);
  },

  classRow(row, classNames, a, b) {
    return new ClassRow(row.sourceString, classNames.sourceString);
  },

  EmptyListOf() {
    return [];
  },

  NonemptyListOf(x, sep, xs) {
    return [x.toAST()].concat(xs.toAST());
  }

}).addOperation('isA(type)', {
  _nonterminal(children) {
    return this.ctorName === this.args.type;
  }
});

NLDatalog.parse = function(input) {
  const matchResult = this.grammar.match(input);
  if (matchResult.succeeded()) {
    return this.semantics(matchResult).toAST();
  } else {
    throw new Error(matchResult.message);
  }
};