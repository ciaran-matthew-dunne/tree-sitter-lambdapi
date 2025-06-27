; Keywords
[
  "abort"
  "admit"
  "admitted"
  "apply"
  "as"
  "assert"
  "assertnot"
  "associative"
  "assume"
  "begin"
  "builtin"
  "coerce_rule"
  "commutative"
  "compute"
  "constant"
  "debug"
  "end"
  "eval"
  "fail"
  "flag"
  "generalize"
  "have"
  "in"
  "induction"
  "inductive"
  "infix"
  "injective"
  "let"
  "notation"
  "opaque"
  "open"
  "orelse"
  "postfix"
  "prefix"
  "print"
  "private"
  "proofterm"
  "protected"
  "prover"
  "prover_timeout"
  "quantifier"
  "refine"
  "reflexivity"
  "remove"
  "repeat"
  "require"
  "rewrite"
  "rule"
  "search"
  "sequential"
  "set"
  "simplify"
  "solve"
  "symbol"
  "symmetry"
  "try"
  "type"
  "TYPE"
  "unif_rule"
  "verbose"
  "why3"
  "with"
] @keyword

; Operators
[
  "→"
  "->"
  "≔"
  ":="
  "≡"
  "=="
  "↪"
  "|->"
  "⊢"
  "|-"
  ":"
  ","
  ";"
  "."
  "|"
  "_"
] @operator

; Special symbols
[
  "λ"
  "\\"
  "Π"
  "forall"
] @keyword.function

; Delimiters
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

; Identifiers
(uid) @variable
(param) @variable.parameter
(regular_id) @variable
(escaped_id) @variable

; Qualified identifiers
(qid) @variable
(qid_expl) @variable
(qualified_id) @variable

; Special identifiers
(meta_var) @variable.special
(pattern_var) @variable.special

; Type annotations
(param_list
  ":" @punctuation.delimiter
  (term) @type)

(assert_query
  ":" @punctuation.delimiter
  (term) @type)

(have
  ":" @punctuation.delimiter
  (term) @type)

; Function/symbol definitions
(symbol_command
  "symbol" @keyword
  (uid) @function)

(constructor
  (uid) @constructor)

(inductive_def
  (uid) @type.definition)

; Rules
(rule
  (term) @function.special
  "↪"
  (term) @function.special)

; Literals
(int) @number
(float) @number.float
(string) @string

; Comments
(comment) @comment

; Proof tactics
(tactic) @keyword.function

; Builtin references
(builtin_command
  "builtin" @keyword
  (string) @string.special
  "≔"
  (qid) @function.builtin)

; Error highlighting for incomplete constructs
(ERROR) @error
