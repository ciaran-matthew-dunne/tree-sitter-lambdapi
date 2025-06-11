; highlights.scm — Tree-sitter highlight queries for LambdaPi

;; Capture comments, strings, and numbers
[(comment)     @comment]
[(string)      @string]
[(integer)     @constant.numeric]

;; Identifiers and qualified identifiers
[(uid)         @variable]
[(qid)         @variable]
[(term_id)     @function]

;; Keywords and language constructs
[
  ; Core keywords
  \"let\"       @keyword
  \"in\"        @keyword
  \"λ\"         @keyword
  \"Π\"         @keyword

  ; Proof delimiters
  \"begin\"     @keyword
  \"abort\"     @keyword
  \"admitted\"  @keyword
  \"end\"       @keyword

  ; Commands
  \"opaque\"    @keyword
  \"require\"   @keyword
  \"open\"      @keyword
  \"symbol\"    @keyword
  \"inductive\" @keyword
  \"rule\"      @keyword
  \"builtin\"   @keyword
  \"coerce_rule\" @keyword
  \"unif_rule\" @keyword
  \"notation\"  @keyword

  ; Modifiers and switches
  (switch)     @keyword
  (side)       @keyword
  (assert)     @keyword
  (exposition) @keyword
  (modifier)   @keyword

  ; Tactics and queries
  (tactic)     @keyword
  (query)      @keyword
]

;; Operators
[
  \"→\" @operator
  \"↪\" @operator
  \"≔\" @operator
  \"≡\" @operator
  \"⊢\" @operator
]

;; Punctuation
[
  \"(\"  @punctuation.bracket
  \")\"  @punctuation.bracket
  \"[\"  @punctuation.bracket
  \"]\"  @punctuation.bracket
  \"{\"  @punctuation.bracket
  \"}\"  @punctuation.bracket
  \",\"  @punctuation.delimiter
  \";\"  @punctuation.delimiter
]
