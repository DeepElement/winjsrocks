#! /bin/bash

git clone --quiet https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG} travis-build > /dev/null;
cd travis-build
if [ "${TRAVIS_BRANCH}" = "master" ]; then

  # Forward Integrate
  git checkout --track -b integration origin/integration > /dev/null;
  git merge --squash origin/master --no-commit  > /dev/null;
  git commit -m "Travis CI auto-merge of master from build ${TRAVIS_BUILD_NUMBER} - [ci skip]";
  npm version patch -m "Travis CI auto-version from build ${TRAVIS_BUILD_NUMBER}";
  git push -q origin integration > /dev/null;

  # update local
  git fetch;

  # Reverse Integrate
  git checkout master > /dev/null;
  git merge --squash origin/integration --no-commit  > /dev/null;
  git commit -m "Travis CI auto-merge of integration from build ${TRAVIS_BUILD_NUMBER} - [ci skip]";
  git push -q origin master > /dev/null;

fi

if [ "${TRAVIS_BRANCH}" = "stable" ]; then

  # Create tag on staging branch
  git checkout --track -b stable origin/stable > /dev/null;
  PACKAGE_VERSION=$(cat package.json \
      | grep version \
      | head -1 \
      | awk -F: '{ print $2 }' \
      | sed 's/[",]//g')
  # Trim spaces leading
  PACKAGE_VERSION=`echo $PACKAGE_VERSION`

  if [ "$PACKAGE_VERSION" != "" ]; then
      git tag -a "v$PACKAGE_VERSION" -m "`git log -1 --format=%s`"
      echo "Created a new tag, v$PACKAGE_VERSION"
  fi
  git push origin --tags > /dev/null;

  # Reverse Integrate
  git checkout --track -b integration origin/integration > /dev/null;
  git merge --squash origin/stable --no-commit  > /dev/null;
  git commit -m "Travis CI auto-merge of stable from build ${TRAVIS_BUILD_NUMBER} - [ci skip]";
  git push -q origin integration > /dev/null;

  # Reverse Integrate
  git checkout master > /dev/null;
  git merge --squash origin/stable --no-commit  > /dev/null;
  git commit -m "Travis CI auto-merge of stable from build ${TRAVIS_BUILD_NUMBER} - [ci skip]";
  git push -q origin master > /dev/null;

fi
cd ..;
