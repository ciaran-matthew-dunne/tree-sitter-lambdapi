; Tags for navigation and symbol indexing

; Symbol definitions
(symbol_command
  (uid) @name) @definition.function

; Inductive type definitions
(inductive_def
  (uid) @name) @definition.class

; Constructor definitions
(constructor
  (uid) @name) @definition.method

; Rule definitions
(rule_command
  (rule) @name) @definition.constant

; Notation definitions
(notation_command
  (qid) @name) @definition.operator
