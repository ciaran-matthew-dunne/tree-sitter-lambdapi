; Local variable definitions and references

; Function/symbol definitions
(symbol_command
  (uid) @definition.function)

; Variable definitions in parameters
(param_list
  (param) @definition.variable)

; Let bindings
(let_term
  (uid) @definition.variable)

; Pattern variables in tactics
(assume
  (param) @definition.variable)

(have
  (uid) @definition.variable)

(generalize
  (uid) @definition.variable)

(set
  (uid) @definition.variable)

; Inductive type definitions
(inductive_def
  (uid) @definition.type)

(constructor
  (uid) @definition.constructor)

; Variable references
(uid) @reference.variable
(qid) @reference.variable
(qid_expl) @reference.variable

; Scopes
(symbol_command) @scope
(let_term) @scope
(proof) @scope
(subproof) @scope
(binder) @scope
(param_list) @scope
