; Language injection rules for embedded content

; WHY3 prover strings may contain Why3 code
(why3
  (string) @injection.content
  (#set! injection.language "why3"))

; Comments can contain markdown for documentation
(comment) @injection.content
(#match? @injection.content "^//[/!]")
(#set! injection.language "markdown")
