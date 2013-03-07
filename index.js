#! /usr/bin/env node

var exec = require('child_process').exec

function main() {
  exec('git log -n1 --format=%s', then(function(stdout) {
    var branch = getBranch(stdout.split('\n').shift())
      , type = getType(branch)

    if (!branch) { bail("Last commit in this repo isn't a GitHub merge") }

    exec('npm version '+type, then(function(stdout) {
      console.log('Bumped '+ type +' version to ' + stdout.split('\n').shift())
    }))
  }))
}

function then(next) {
  return function() {
    var args = Array.prototype.slice.call(arguments)
      , err = args.shift()

    if (err) { bail(err) }
    else { next.apply(null, args) }
  }
}

function bail(err) {
  console.error(err.message ? err.message : err)
  process.exit(1)
}

function getBranch(message) {
  var merge = /Merge pull request #[^\/]+\//
  return (merge.test(message)) ? message.replace(merge, '') : '';
}

function getType(branch) {
  var bits = branch.split('/')
    , type

  switch (bits.shift()) {
    case 'feature':
    case 'major':
      type = 'major'
      break

    case 'task':
    case 'chore':
    case 'minor':
      type = 'minor'
      break

    default:
      type = 'patch'
      break
  }

  return type
}

// Are we a module or a command?
if (module.parent) {
  module.exports = main
  module.exports.getBranch = getBranch
  module.exports.getType = getType
} else {
  main()
}
