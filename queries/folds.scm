; Code folding rules for LambdaPi

; Fold proof blocks
(proof
  "begin" @fold
  (#set! fold.endAt parent.endPosition))

; Fold subproofs
(subproof
  "{" @fold
  (#set! fold.endAt parent.endPosition))

; Fold multi-line commands
(symbol_command) @fold
(inductive_command) @fold
(rule_command) @fold

; Fold let expressions
(let_term
  "let" @fold
  (#set! fold.endAt parent.endPosition))

; Fold parameter lists
(param_list
  "(" @fold
  (#set! fold.endAt parent.endPosition))

(param_list
  "[" @fold
  (#set! fold.endAt parent.endPosition))

; Fold comments
(comment) @fold
