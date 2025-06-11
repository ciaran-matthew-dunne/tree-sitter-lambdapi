// grammar.js
// Tree-sitter grammar for LambdaPi language
// Generated from EBNF-like specification provided by user

module.exports = grammar({
  name: "lambdapi",

  extras: ($) => [
    /\s/, // whitespace
    $.comment, // comments
  ],

  rules: {
    // Comments
    comment: ($) => token(choice(seq("//", /.*/), seq("/*", /[\s\S]*?/, "*/"))),

    source_file: ($) => repeat($._command),

    // Identifiers
    UID: ($) => /[A-Za-z_][A-Za-z0-9_]*/,
    QID: ($) => seq(optional(seq($.UID, repeat1(seq(".", $.UID)))), $.UID),

    // Keywords and symbols
    switch: ($) => choice("on", "off"),
    side: ($) => choice("left", "right"),
    assert_kw: ($) => choice("assert", "assertnot"),

    // Top-level rules with explicit EOF
    term_alone: ($) => seq($.term, $.EOS),
    qid_alone: ($) => seq($.qid, $.EOS),
    search_query_alone: ($) => seq($.search_query, $.EOS),

    // commands
    _command: ($) =>
      choice(
        seq("opaque", $.qid, ";"),
        seq("require", "open", repeat($.path), ";"),
        seq("require", repeat($.path), ";"),
        seq("require", $.path, "as", $.UID, ";"),
        seq("open", repeat($.path), ";"),
        seq(
          repeat($.modifier),
          "symbol",
          $.UID,
          repeat($.param_list),
          ":",
          $.term,
          optional($.proof),
          ";",
        ),
        seq(
          repeat($.modifier),
          "symbol",
          $.UID,
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
        seq("coerce_rule", $.unif_rule, ";"),
        seq("unif_rule", $.unif_rule, ";"),
        seq("notation", $.qid, $.notation, ";"),
        seq($.query, ";"),
      ),

    query: ($) =>
      choice(
        seq($.assert_kw, repeat($.param_list), "⊢", $.term, ":", $.term),
        seq($.assert_kw, repeat($.param_list), "⊢", $.term, "≡", $.term),
        seq("compute", $.term),
        seq("print", optional($.qid_or_rule)),
        "proofterm",
        seq("debug", choice("+", "-"), token(/.+/)),
        seq("flag", $.string, $.switch),
        seq("prover", $.string),
        seq("prover_timeout", $.integer),
        seq("verbose", $.integer),
        seq("type", $.term),
        seq("search", $.string),
      ),

    qid_or_rule: ($) => choice($.qid, "unif_rule", "coerce_rule"),

    path: ($) => choice($.UID, $.QID),

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

    exposition: ($) => choice("private", "protected"),

    uid: ($) => $.UID,

    param_list: ($) =>
      choice(
        $.param,
        seq("(", repeat1($.param), ":", $.term, ")"),
        seq("[", repeat1($.param), optional(seq(":", $.term)), "]"),
      ),

    param: ($) => choice($.UID, "_"),

    term: ($) =>
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
          $.UID,
          repeat($.param_list),
          optional(seq(":", $.term)),
          "≔",
          $.term,
          "in",
          $.term,
        ),
      ),

    saterm: ($) => repeat1($.aterm),

    aterm: ($) =>
      choice(
        $.term_id,
        "_",
        "TYPE",
        seq("?", $.UID, optional($.env)),
        seq("$", $.UID, optional($.env)),
        seq("(", $.term, ")"),
        seq("[", $.term, "]"),
        $.integer,
        $.string,
      ),

    env: ($) =>
      seq(".", "[", optional(seq($.term, repeat(seq(";", $.term)))), "]"),

    term_id: ($) => choice($.qid, $.qid_expl),

    qid: ($) => choice($.UID, $.QID),
    qid_expl: ($) => seq("@", choice($.UID, $.QID)),

    binder: ($) =>
      choice(
        seq(repeat1($.param_list), ",", $.term),
        seq($.param, ":", $.term, ",", $.term),
      ),

    term_proof: ($) => choice($.term, $.proof, seq($.term, $.proof)),

    proof: ($) => seq("begin", repeat1($.subproof), $.proof_end),

    subproof: ($) => seq("{", optional($.proof_steps), "}"),

    proof_steps: ($) =>
      seq($.proof_step, repeat(seq(";", $.proof_step)), optional(";")),

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
        seq("generalize", $.UID),
        seq("have", $.UID, ":", $.term),
        "induction",
        seq("orelse", $.tactic, $.tactic),
        seq("refine", $.term),
        "reflexivity",
        seq("remove", repeat1($.UID)),
        seq("repeat", $.tactic),
        seq("rewrite", optional($.side), optional($.rw_patt_spec), $.term),
        seq("set", $.UID, "≔", $.term),
        "simplify",
        seq("simplify", $.qid),
        seq("simplify", "rule", "off"),
        "solve",
        "symmetry",
        seq("try", $.tactic),
        seq("why3", optional($.string)),
      ),

    rw_patt: ($) =>
      choice(
        $.term,
        seq("in", $.term),
        seq("in", $.UID, "in", $.term),
        seq($.term, "in", $.term, optional(seq("in", $.term))),
        seq($.term, "as", $.UID, "in", $.term),
      ),

    rw_patt_spec: ($) => seq(".", "[", $.rw_patt, "]"),

    inductive: ($) =>
      seq(
        $.UID,
        repeat($.param_list),
        ":",
        $.term,
        "≔",
        optional("|"),
        $.constructor,
        repeat(seq("|", $.constructor)),
      ),

    constructor: ($) => seq($.UID, repeat($.param_list), ":", $.term),

    rule: ($) => seq($.term, "↪", $.term),

    unif_rule: ($) =>
      seq(
        $.equation,
        "↪",
        "[",
        seq($.equation, repeat(seq(";", $.equation))),
        "]",
      ),

    equation: ($) => seq($.term, "≡", $.term),

    notation: ($) =>
      choice(
        seq("infix", optional($.side), $.float_or_int),
        seq("postfix", $.float_or_int),
        seq("prefix", $.float_or_int),
        "quantifier",
      ),

    float_or_int: ($) => choice($.float, $.integer),

    float: ($) => /[0-9]+\.[0-9]*/,
    integer: ($) => /[0-9]+/,
    string: ($) => /"(?:\\.|[^"\\])*"/,

    maybe_generalize: ($) => optional("generalize"),
    where: ($) => seq($.UID, $.maybe_generalize),

    asearch_query: ($) =>
      choice(
        seq("type", $.where, $.aterm),
        seq("rule", $.where, $.aterm),
        seq($.UID, $.where, $.aterm),
        seq("(", $.search_query, ")"),
      ),

    csearch_query: ($) =>
      seq($.asearch_query, repeat(seq(",", $.asearch_query))),
    ssearch_query: ($) =>
      seq($.csearch_query, repeat(seq(";", $.csearch_query))),

    search_query: ($) =>
      choice($.ssearch_query, seq($.search_query, "|", $.qid)),

    // End-of-file marker
    EOS: ($) => token(choice("\\n", "\\r\\n", "$")),
  },
});
