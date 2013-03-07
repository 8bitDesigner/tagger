# Tag branches based off of Github merges

## TL;DR?

If the last commit in your repo is "Merge pull request #121 from myUser/major/changes"
running `tagger` will bump the major tag number for your project via
`npm version` using magic to determine what sort of change your PR contained.


## What is this thing?
`tagger` looks in your repo for the last commit. If it's a merge from GitHub,
it looks at the merge's original branch name and makes a rough guess at What
kind of change it was (major, minor, or patch), and then bumps the package.json
for your project via `npm version [major, minor, or patch]`


## What's this with the merges?
We're assuming that your feature branches follow this naming format:

__[type of change]__/[name of feature branch]

So, given that, we look at __[type of change]__ and find the change type from
the following table:

Prefix   | Type of change
-------- | ---------------
feature  | major
major    | major
task     | minor
chore    | minor
minor    | minor

Anything else is considered a patch change

## Why?
We are __really__ lazy developers and want to be able to rev our package
versions through our build process. Each time we run a build against master,
if the head of master is a merge commit from GitHub, we bump the version.

Basically, our post-test step in Jenkins looks like:

``` shell
if [[ $test_passed && $branch == 'master' ]]; then
  tagger && git push --tags
fi
```
