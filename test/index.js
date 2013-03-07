var sinon = require("sinon")
  , assert = require("assert")
  , proxy = require("proxyquire").noCallThru()
  , mockOutput = {}
  , mockExec = function(command, cb) { cb.apply(null, mockOutput[command]) }

var tagger = proxy('../index', {child_process: {exec: mockExec}})

function each(obj, cb) {
  Object.keys(obj).forEach(function(key) {
    cb(key, obj[key])
  })
}

describe("Tagger", function() {
  afterEach(function() {
    mockOutput = {}
  })

  it("Parse out the correct branch name from a commit message", function() {
    var messages = {
      "Merge pull request #153 from beachmint/things":         "things",
      "Merge pull request #153 from beachmint/feature/things": "feature/things",
      "Merge pull request #153 from user-with-dashes/things":  "things",
      "Merge pull request #153 from a7ph4-num3r1c/things":     "things",
      "Not a merge commit": "",
      "": ""
    }

    each(messages, function(message, expected) {
      assert.equal(tagger.getBranch(message), expected)
    })
  })

  it("Parse out the correct verision type from a branch name", function() {
    var branches = {
      "feature/things": "major",
      "major/things":   "major",
      "task/things":    "minor",
      "chore/things":   "minor",
      "minor/things":   "minor",
      "patch/things":   "patch",
      "things":         "patch",
      "":               "patch"
    }

    each(branches, function(branch, expected) {
      assert.equal(tagger.getType(branch), expected)
    })
  })
})
