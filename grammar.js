// grammar.js - Tree-sitter grammar for LambdaPi

module.exports = grammar({
  name: "lambdapi",
  conflicts: ($) => [
    [$.path, $.qid],
    [$.qid, $.qid_expl],
    [$.tactic, $.query],
  ],

  extras: ($) => [/\s/, $.comment],
  word: ($) => $.uid,

  rules: {
    source_file: ($) => repeat($._command),

    // Comments
    comment: ($) => token(choice(seq("//", /.*/), seq("/*", /[\s\S]*?/, "*/"))),

    // Identifiers
    uid: ($) => /[A-Za-z_][A-Za-z0-9_]*/,
    qid: ($) => seq($.uid, repeat(seq(".", $.uid))),

    // Paths
    path: ($) => choice($.uid, $.qid),

    // Basic tokens
    integer: ($) => /[0-9]+/,
    string: ($) => token(seq('"', /(?:\\.|[^"\\])*?/, '"')),

    // Switches, modifiers, etc.
    switch: ($) => choice("on", "off"),
    side: ($) => choice("left", "right"),
    assert: ($) => choice("assert", "assertnot"),
    exposition: ($) => choice("private", "protected"),

    modifier: ($) =>
      choice(
        seq(optional($.side), "associative"),
        "commutative",
        "constant",
        "injective",
        "opaque",
        "sequential",
        $.exposition,
      ),

    // Parameters
    param: ($) => choice($.uid, "_"),
    param_list: ($) =>
      choice(
        $.param,
        seq("(", repeat1($.param), ":", $.term, ")"),
        seq("[", repeat1($.param), optional(seq(":", $.term)), "]"),
      ),

    // Terms
    term: ($) => $._term,
    _term: ($) =>
      choice(
        $.bterm,
        $.saterm,
        seq($.saterm, $.bterm),
        seq($.saterm, "→", $.term),
      ),

    bterm: ($) =>
      choice(
        seq("`", $.term_id, $.binder),
        seq("Π", $.binder),
        seq("λ", $.binder),
        seq(
          "let",
          $.uid,
          repeat($.param_list),
          optional(seq(":", $.term)),
          "≔",
          $.term,
          "in",
          $.term,
        ),
      ),

    binder: ($) =>
      choice(
        seq(repeat1($.param_list), ",", $.term),
        seq($.param, ":", $.term, ",", $.term),
      ),

    saterm: ($) => repeat1($.aterm),
    aterm: ($) =>
      choice(
        $.term_id,
        "_",
        "TYPE",
        seq("?", $.uid, optional($.env)),
        seq("$", $.uid, optional($.env)),
        seq("(", $.term, ")"),
        seq("[", $.term, "]"),
        $.integer,
        $.string,
      ),
    env: ($) =>
      seq(".", "[", optional(seq($.term, repeat(seq(";", $.term)))), "]"),

    term_id: ($) => choice($.qid, $.qid_expl),
    qid_expl: ($) => seq("@", choice($.uid, $.qid)),

    term_proof: ($) => choice($.term, $.proof, seq($.term, $.proof)),

    // Proofs
    proof: ($) => seq("begin", repeat1($.subproof), $.proof_end),
    subproof: ($) => seq("{", optional($.proof_steps), "}"),
    proof_steps: ($) => seq($.proof_step, optional(seq(";", $.proof_steps))),
    proof_step: ($) => seq($.tactic, repeat($.subproof)),
    proof_end: ($) => choice("abort", "admitted", "end"),

    tactic: ($) =>
      choice(
        $.query,
        "admit",
        seq("apply", $.term),
        seq("assume", repeat1($.param)),
        seq("eval", $.term),
        "fail",
        seq("generalize", $.uid),
        seq("have", $.uid, ":", $.term),
        "induction",
        seq("orelse", $.tactic, $.tactic),
        seq("refine", $.term),
        "reflexivity",
        seq("remove", repeat1($.uid)),
        seq("repeat", $.tactic),
        seq("rewrite", optional($.side), optional($.rw_patt_spec), $.term),
        seq("set", $.uid, "≔", $.term),
        "simplify",
        seq("simplify", $.qid),
        seq("simplify", "rule", "off"),
        "solve",
        "symmetry",
        seq("try", $.tactic),
        seq("why3", optional($.string)),
        // Debug logs: any sequence of characters after + or -
        seq("debug", choice("+", "-"), token(/.+/)),
      ),
    rw_patt_spec: ($) => seq(".", "[", $.rw_patt, "]"),
    rw_patt: ($) =>
      choice(
        $.term,
        seq("in", $.term),
        seq("in", $.uid, "in", $.term),
        seq($.term, "in", $.term, optional(seq("in", $.term))),
        seq($.term, "as", $.uid, "in", $.term),
      ),

    // Inductive, constructors
    inductive: ($) =>
      seq(
        $.uid,
        repeat($.param_list),
        ":",
        $.term,
        "≔",
        optional("|"),
        sepBy1("|", $.constructor),
      ),
    constructor: ($) => seq($.uid, repeat($.param_list), ":", $.term),

    // Rules
    rule: ($) => seq($.term, "↪", $.term),
    unif_rule: ($) => seq($.equation, "↪", "[", sepBy1(";", $.equation), "]"),
    equation: ($) => seq($.term, "≡", $.term),

    notation: ($) =>
      choice(
        seq("infix", optional($.side), $.float_or_int),
        seq("postfix", $.float_or_int),
        seq("prefix", $.float_or_int),
        "quantifier",
      ),
    float_or_int: ($) => choice($.integer, /[0-9]+\.[0-9]+/),

    // Queries
    query: ($) =>
      choice(
        seq($.assert, repeat($.param_list), "⊢", $.term, ":", $.term),
        seq($.assert, repeat($.param_list), "⊢", $.term, "≡", $.term),
        seq("compute", $.term),
        seq("print", optional($.qid_or_rule)),
        "proofterm",
        // Debug: allow any trailing text
        seq("debug", choice("+", "-"), token(/.+/)),
        seq("flag", $.string, $.switch),
        seq("prover", $.string),
        seq("prover_timeout", $.integer),
        seq("verbose", $.integer),
        seq("type", $.term),
        seq("search", $.string),
      ),
    qid_or_rule: ($) => choice($.qid, "unif_rule", "coerce_rule"),

    // Commands
    _command: ($) =>
      choice(
        seq("opaque", $.qid, ";"),
        seq("require", "open", repeat($.path), ";"),
        seq("require", repeat($.path), ";"),
        seq("require", $.path, "as", $.uid, ";"),
        seq("open", repeat($.path), ";"),
        seq(
          repeat($.modifier),
          "symbol",
          $.uid,
          repeat($.param_list),
          ":",
          $.term,
          optional($.proof),
          ";",
        ),
        seq(
          repeat($.modifier),
          "symbol",
          $.uid,
          repeat($.param_list),
          optional(seq(":", $.term)),
          "≔",
          $.term_proof,
          ";",
        ),
        seq(
          optional($.exposition),
          repeat($.param_list),
          "inductive",
          $.inductive,
          repeat(seq("with", $.inductive)),
          ";",
        ),
        seq("rule", $.rule, repeat(seq("with", $.rule)), ";"),
        seq("builtin", $.string, "≔", $.qid, ";"),
        seq("coerce_rule", $.rule, ";"),
        seq("unif_rule", $.unif_rule, ";"),
        seq("notation", $.qid, $.notation, ";"),
        seq($.query, ";"),
      ),
  },
});

// Helper: sequence separated by a delimiter
function sepBy1(delim, rule) {
  return seq(rule, repeat(seq(delim, rule)));
}
