module.exports = grammar({
  name: "lambdapi",

  extras: ($) => [$.comment, /\s/],

  conflicts: ($) => [
    [$.term, $.saterm],
    [$.aterm, $.term_id],
    [$.param, $.uid],
  ],

  rules: {
    source_file: ($) => repeat($.command),

    // Comments
    comment: ($) =>
      choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),

    // Commands
    command: ($) =>
      choice(
        $.opaque_command,
        $.require_command,
        $.require_as_command,
        $.open_command,
        $.symbol_command,
        $.inductive_command,
        $.rule_command,
        $.builtin_command,
        $.coerce_rule_command,
        $.unif_rule_command,
        $.notation_command,
        $.query_command,
      ),

    opaque_command: ($) => seq("opaque", $.qid, ";"),

    require_command: ($) =>
      seq("require", optional("open"), repeat1($.path), ";"),

    require_as_command: ($) => seq("require", $.path, "as", $.uid, ";"),

    open_command: ($) => seq("open", repeat1($.path), ";"),

    symbol_command: ($) =>
      seq(
        repeat($.modifier),
        "symbol",
        $.uid,
        repeat($.param_list),
        choice(
          seq(":", $.term, optional($.proof), ";"),
          seq(optional(seq(":", $.term)), "≔", $.term_proof, ";"),
        ),
      ),

    inductive_command: ($) =>
      seq(
        optional($.exposition),
        repeat($.param_list),
        "inductive",
        sep1($.inductive_def, "with"),
        ";",
      ),

    inductive_def: ($) =>
      seq(
        $.uid,
        repeat($.param_list),
        ":",
        $.term,
        "≔",
        optional("|"),
        sep($.constructor, "|"),
      ),

    constructor: ($) => seq($.uid, repeat($.param_list), ":", $.term),

    rule_command: ($) => seq("rule", sep1($.rule, "with"), ";"),

    rule: ($) => seq($.term, "↪", $.term),

    builtin_command: ($) => seq("builtin", $.string, "≔", $.qid, ";"),

    coerce_rule_command: ($) => seq("coerce_rule", $.rule, ";"),

    unif_rule_command: ($) => seq("unif_rule", $.unif_rule, ";"),

    unif_rule: ($) => seq($.equation, "↪", "[", sep1($.equation, ";"), "]"),

    equation: ($) => seq($.term, "≡", $.term),

    notation_command: ($) => seq("notation", $.qid, $.notation, ";"),

    notation: ($) =>
      choice(
        seq("infix", optional($.side), $.priority),
        seq("postfix", $.priority),
        seq("prefix", $.priority),
        "quantifier",
      ),

    side: ($) => choice("left", "right"),
    priority: ($) => choice($.int, $.float),

    query_command: ($) => seq($.query, ";"),

    query: ($) =>
      choice(
        $.assert_query,
        $.compute_query,
        $.print_query,
        $.proofterm_query,
        $.debug_query,
        $.flag_query,
        $.prover_query,
        $.prover_timeout_query,
        $.verbose_query,
        $.type_query,
        $.search_query,
      ),

    assert_query: ($) =>
      seq(
        choice("assert", "assertnot"),
        repeat($.param_list),
        "⊢",
        $.term,
        choice(seq(":", $.term), seq("≡", $.term)),
      ),

    compute_query: ($) => seq("compute", $.term),
    print_query: ($) => seq("print", optional($.qid_or_rule)),
    proofterm_query: ($) => "proofterm",
    debug_query: ($) => seq(choice("+", "-"), /[a-z]+/),
    flag_query: ($) => seq("flag", $.string, choice("on", "off")),
    prover_query: ($) => seq("prover", $.string),
    prover_timeout_query: ($) => seq("prover_timeout", $.int),
    verbose_query: ($) => seq("verbose", $.int),
    type_query: ($) => seq("type", $.term),
    search_query: ($) => seq("search", $.string),

    qid_or_rule: ($) => choice($.qid, "unif_rule", "coerce_rule"),

    // Modifiers
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

    // Parameters
    param_list: ($) =>
      choice(
        $.param,
        seq("(", repeat1($.param), ":", $.term, ")"),
        seq("[", repeat1($.param), optional(seq(":", $.term)), "]"),
      ),

    param: ($) => choice($.uid, "_"),

    // Terms
    term: ($) =>
      choice(
        $.bterm,
        $.saterm,
        prec.left(1, seq($.saterm, $.bterm)),
        prec.right(2, seq($.saterm, "→", $.term)),
      ),

    bterm: ($) =>
      choice(
        seq("`", $.term_id, $.binder),
        seq("Π", $.binder),
        seq("λ", $.binder),
        $.let_term,
      ),

    let_term: ($) =>
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

    saterm: ($) => prec.left(seq($.saterm, $.aterm)),

    aterm: ($) =>
      choice(
        $.term_id,
        "_",
        "TYPE",
        $.meta_var,
        $.pattern_var,
        $.wrapped_term,
        $.explicit_term,
        $.int,
        $.string,
      ),

    meta_var: ($) => seq("?", $.int, optional($.env)),
    pattern_var: ($) => seq("$", choice($.identifier, $.int), optional($.env)),
    wrapped_term: ($) => seq("(", $.term, ")"),
    explicit_term: ($) => seq("[", $.term, "]"),

    env: ($) => seq(".", "[", sep($.term, ";"), "]"),

    term_id: ($) => choice($.qid, $.qid_expl),

    qid: ($) => choice($.identifier, $.qualified_id),

    qid_expl: ($) => choice(seq("@", $.identifier), seq("@", $.qualified_id)),

    qualified_id: ($) => seq(repeat1(seq($.id_part, ".")), $.id_part),

    binder: ($) =>
      choice(
        seq(repeat1($.param_list), ",", $.term),
        seq($.param, ":", $.term, ",", $.term),
      ),

    term_proof: ($) => choice($.term, $.proof, seq($.term, $.proof)),

    // Proofs
    proof: ($) =>
      seq(
        "begin",
        choice(repeat1($.subproof), optional($.proof_steps)),
        $.proof_end,
      ),

    subproof: ($) => seq("{", optional($.proof_steps), "}"),

    proof_steps: ($) => sep1($.proof_step, ";"),

    proof_step: ($) => seq($.tactic, repeat($.subproof)),

    proof_end: ($) => choice("abort", "admitted", "end"),

    // Tactics
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
        $.rewrite_tactic,
        seq("set", $.uid, "≔", $.term),
        $.simplify_tactic,
        "solve",
        "symmetry",
        seq("try", $.tactic),
        seq("why3", optional($.string)),
      ),

    rewrite_tactic: ($) =>
      seq("rewrite", optional($.side), optional($.rw_patt_spec), $.term),

    simplify_tactic: ($) =>
      seq("simplify", optional(choice($.qid, seq("rule", "off")))),

    rw_patt_spec: ($) => seq(".", "[", $.rw_patt, "]"),

    rw_patt: ($) =>
      choice(
        $.term,
        seq("in", $.term),
        seq("in", $.uid, "in", $.term),
        seq($.term, "in", $.term, optional(seq("in", $.term))),
        seq($.term, "as", $.uid, "in", $.term),
      ),

    // Paths and identifiers
    path: ($) => $.qualified_id,

    uid: ($) => $.identifier,

    identifier: ($) => choice($.regular_id, $.escaped_id),

    id_part: ($) => choice($.regular_id, $.escaped_id),

    regular_id: ($) => /[^,;\r\t\n(){}\[\]:.`"@$|\/\s]+/,

    escaped_id: ($) => /\{\|[^|]*\|(\|[^|}]+\|)*\}/,

    // Literals
    int: ($) => /-?[0-9]+/,
    float: ($) => /-?[0-9]+\.[0-9]+/,
    string: ($) => /"[^"]*"/,

    // Unicode symbols (alternatives to ASCII)
    arrow: ($) => choice("→", "->"),
    assign: ($) => choice("≔", ":="),
    equiv: ($) => choice("≡", "=="),
    hook_arrow: ($) => choice("↪", "|->"),
    lambda: ($) => choice("λ", "\\"),
    pi: ($) => choice("Π", "forall"),
    turnstile: ($) => choice("⊢", "|-"),
  },
});

// Helper function for separated lists
function sep(rule, separator) {
  return optional(sep1(rule, separator));
}

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
