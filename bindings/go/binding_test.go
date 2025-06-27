package tree_sitter_lambdapi_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lambdapi "github.com/ciaran-matthew-dunne/tree-sitter-lambdapi/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lambdapi.Language())
	if language == nil {
		t.Errorf("Error loading tree-sitter-lambdapi grammar")
	}
}
