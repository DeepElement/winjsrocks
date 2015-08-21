#! /bin/bash
if [ "${TRAVIS_BRANCH}" = "master" ]; then
  # Fetch repo
  git clone --quiet https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG} travis-build > /dev/null;
  cd travis-build

  # Reverse Integrate
  git checkout master > /dev/null;
  git merge --squash origin/stable --no-commit  > /dev/null;
  git commit -m "Travis CI auto-merge from travis build ${TRAVIS_BUILD_NUMBER} - [ci skip]";
  git push -q origin master > /dev/null;

  # Forward Integrate
  git checkout --track -b stable origin/stable > /dev/null;
  git merge origin/master --no-commit  > /dev/null;
  git commit -m "Travis CI auto-merge from travis build ${TRAVIS_BUILD_NUMBER}  - [ci skip]";
  npm version patch -m "Travis CI auto-build from travis build ${TRAVIS_BUILD_NUMBER}";
  version=`git diff HEAD^..HEAD -- "$(git rev-parse --show-toplevel)"/package.json | grep '^\+.*version' | sed -s 's/[^0-9\.]//g'`
  if [ "$version" != "" ]; then
      git tag -a "v$version" -m "`git log -1 --format=%s`"
      echo "Created a new tag, v$version"
  fi

  git push -q origin stable > /dev/null;
  git push origin --tags > /dev/null;

  cd ..;
fi
