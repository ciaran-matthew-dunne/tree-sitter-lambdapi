module.exports = grammar({
  name: "lambdapi",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) => repeat($._command),

    comment: ($) =>
      token(choice(seq("//", /[^\n]*/), seq("/*", /[\s\S]*?/, "*/"))),

    uid: ($) => /[A-Za-z_][A-Za-z0-9_]*/,
    integer: ($) => /\d+/,
    float: ($) => /\d+\.\d+/,
    string: ($) => token(seq('"', /([^"\\]|\\.)*/, '"')),

    qid: ($) => seq(repeat1(seq($.uid, ".")), $.uid),
    qid_expl: ($) => seq("@", choice($.uid, $.qid)),
    qid_or_rule: ($) => choice($.qid, "unif_rule", "coerce_rule"),

    switch: ($) => choice("on", "off"),
    side: ($) => choice("left", "right"),
    assert_kw: ($) => choice("assert", "assertnot"),

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
        seq("coerce_rule", $.unif_rule, ";"),
        seq("unif_rule", $.unif_rule, ";"),
        seq("notation", $.qid, $.notation, ";"),
        seq($.query, ";"),
      ),

    path: ($) => choice($.uid, $.qid),
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

    param_list: ($) =>
      choice(
        $.param,
        seq("(", repeat1($.param), ":", $.term, ")"),
        seq("[", repeat1($.param), optional(seq(":", $.term)), "]"),
      ),
    param: ($) => choice($.uid, "_"),

    term: ($) =>
      choice($.bterm, prec.right(seq($.saterm, "→", $.term)), $.saterm),

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

    term_id: ($) => choice($.qid, $.qid_expl),

    saterm: ($) => prec.left(seq($.aterm, repeat($.aterm))),
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

    term_proof: ($) => choice($.term, $.proof, seq($.term, $.proof)),
    proof: ($) => seq("begin", optional($.proof_steps), $.proof_end),
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
      ),

    rw_patt: ($) =>
      choice(
        $.term,
        seq("in", $.term),
        seq("in", $.uid, "in", $.term),
        seq($.term, "in", $.term, optional(seq("in", $.term))),
        seq($.term, "as", $.uid, "in", $.term),
      ),
    rw_patt_spec: ($) => seq(".", "[", $.rw_patt, "]"),

    inductive: ($) =>
      seq(
        $.uid,
        repeat($.param_list),
        ":",
        $.term,
        "≔",
        optional("|"),
        optional(seq($.constructor, repeat(seq("|", $.constructor)))),
      ),
    constructor: ($) => seq($.uid, repeat($.param_list), ":", $.term),

    rule: ($) => seq($.term, "↪", $.term),
    unif_rule: ($) =>
      seq($.equation, "↪", "[", $.equation, repeat(seq(";", $.equation)), "]"),
    equation: ($) => seq($.term, "≡", $.term),

    notation: ($) =>
      choice(
        seq("infix", optional($.side), $.float_or_int),
        seq("postfix", $.float_or_int),
        seq("prefix", $.float_or_int),
        "quantifier",
      ),
    float_or_int: ($) => choice($.float, $.integer),

    query: ($) =>
      choice(
        seq($.assert_kw, repeat($.param_list), "⊢", $.term, ":", $.term),
        seq($.assert_kw, repeat($.param_list), "⊢", $.term, "≡", $.term),
        seq("compute", $.term),
        seq("print", optional($.qid_or_rule)),
        "proofterm",
        seq("debug", token(/[+-].+/)),
        seq("flag", $.string, $.switch),
        seq("prover", $.string),
        seq("prover_timeout", $.integer),
        seq("verbose", $.integer),
        seq("type", $.term),
        seq("search", $.string),
      ),

    asearch_query: ($) =>
      choice(
        seq(choice("type", "rule", $.uid), $.where, $.aterm),
        seq("(", $.search_query, ")"),
      ),
    csearch_query: ($) =>
      seq($.asearch_query, repeat(seq(",", $.asearch_query))),
    ssearch_query: ($) =>
      seq($.csearch_query, repeat(seq(";", $.csearch_query))),
    search_query: ($) =>
      choice($.ssearch_query, prec.left(seq($.search_query, "|", $.qid))),

    where: ($) => seq($.uid, optional("generalize")),
  },
});
