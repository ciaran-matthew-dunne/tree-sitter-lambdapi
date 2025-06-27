import XCTest
import SwiftTreeSitter
import TreeSitterLambdapi

final class TreeSitterLambdapiTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lambdapi())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading tree-sitter-lambdapi grammar")
    }
}
