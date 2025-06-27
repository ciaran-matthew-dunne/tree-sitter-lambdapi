; Tree-sitter highlighting queries for LambdaPi

; Comments
(comment) @comment

; Keywords and control structures
"require" @keyword.import
"open" @keyword.import
"as" @keyword.import
"opaque" @keyword
"symbol" @keyword.function
"inductive" @keyword.type
"with" @keyword
"rule" @keyword
"builtin" @keyword
"coerce_rule" @keyword
"unif_rule" @keyword
"notation" @keyword

; Type-related keywords
"TYPE" @type.builtin

; Lambda calculus and type theory constructs
"λ" @keyword.function
"Π" @keyword.operator
"let" @keyword
"in" @keyword

; Proof keywords
"begin" @keyword
"end" @keyword
"abort" @keyword
"admitted" @keyword

; Tactic keywords
"admit" @keyword
"apply" @keyword
"assume" @keyword
"eval" @keyword
"fail" @keyword
"generalize" @keyword
"have" @keyword
"induction" @keyword
"orelse" @keyword
"refine" @keyword
"reflexivity" @keyword
"remove" @keyword
"repeat" @keyword
"rewrite" @keyword
"set" @keyword
"simplify" @keyword
"solve" @keyword
"symmetry" @keyword
"try" @keyword
"why3" @keyword
"debug" @keyword

; Query keywords
"assert" @keyword
"assertnot" @keyword
"compute" @keyword
"print" @keyword
"proofterm" @keyword
"flag" @keyword
"prover" @keyword
"prover_timeout" @keyword
"verbose" @keyword
"type" @keyword
"search" @keyword

; Modifiers
"left" @attribute
"right" @attribute
"associative" @attribute
"commutative" @attribute
"constant" @attribute
"injective" @attribute
"opaque" @attribute
"sequential" @attribute
"private" @attribute
"protected" @attribute

; Notation types
"infix" @keyword
"postfix" @keyword
"prefix" @keyword
"quantifier" @keyword

; Switches
"on" @constant.builtin
"off" @constant.builtin

; Operators and symbols
":" @punctuation.delimiter
"≔" @operator
"→" @operator
"↪" @operator
"≡" @operator
"⊢" @operator
"|" @punctuation.delimiter
";" @punctuation.delimiter
"," @punctuation.delimiter
"." @punctuation.delimiter
"`" @punctuation.special

; Brackets and delimiters
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"{|" @punctuation.bracket
"|}" @punctuation.bracket

; Identifiers
(uid) @variable
(param) @variable.parameter
(esc_uid) @variable

; Qualified identifiers
(qid) @variable
(qid_expl) @variable.special
"@" @punctuation.special

; Term identifiers in specific contexts
(term_id) @variable

; Constructor names
(constructor (uid) @constructor)

; Inductive type names
(inductive (uid) @type)

; Symbol declarations
((symbol (uid) @function.definition))

; Parameters in specific contexts
(param_list (param) @variable.parameter)

; Wildcard
"_" @variable.special

; Meta-variables
(aterm "$" @punctuation.special (uid) @variable.special)
(aterm "?" @punctuation.special (uid) @variable.special)

; Literals
(integer) @number
(string) @string
(float_or_int) @number

; Path components
(path) @namespace

; Module names in require statements
((require (path) @module))
((require (uid) @module))

; Escaped identifiers
(esc_uid "{|" @punctuation.bracket (uid) @variable "|}" @punctuation.bracket)

; Special highlighting for rule patterns
(rw_patt "in" @keyword)
(rw_patt "as" @keyword)

; Environment brackets
(env "." @punctuation.delimiter "[" @punctuation.bracket "]" @punctuation.bracket)

; Proof environment
(proof) @keyword
(subproof "{" @punctuation.bracket "}" @punctuation.bracket)
(proof_end) @keyword

; Error nodes
(ERROR) @error
