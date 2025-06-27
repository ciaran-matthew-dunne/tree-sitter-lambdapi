; Indentation rules for LambdaPi

; Indent inside blocks
[
  (proof)
  (subproof)
  (param_list)
  (wrapped_term)
  (explicit_term)
] @indent

; Indent after certain keywords
(symbol_command
  "symbol" @indent)

(inductive_command
  "inductive" @indent)

(let_term
  "let" @indent)

; Indent continuations
(binder
  "," @indent)

(term
  "→" @indent)

; Dedent on closing brackets and keywords
[
  ")"
  "]"
  "}"
  "end"
  "in"
] @outdent

; Align certain constructs
(rule
  "↪" @align)

(equation
  "≡" @align)

(symbol_command
  "≔" @align)

; Branch points for alignment
[
  ";"
  "|"
] @branch
