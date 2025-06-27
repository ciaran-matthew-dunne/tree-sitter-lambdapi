/**
 * @file LambdaPi grammar for tree-sitter
 * @author Ciaran Dunne <cciaranddunne@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lambdapi",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
