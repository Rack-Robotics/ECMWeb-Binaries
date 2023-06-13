#!/bin/sh
#
# build.sh
#
# Builds OSX distribution of LaserWeb
#

# Set target branch
export TARGET_UI_BRANCH=$(cat BRANCH)
export CURRENT_DIR=${PWD##*/}
export LW_DIR="Laserweb4"

echo "Targetting UI Branch: $TARGET_UI_BRANCH"

yarn

# Commence
cd ../

# Download LaserWeb UI / install modules
if [ -d $LW_DIR ]; then
  rm -rf $LW_DIR
fi


git clone https://github.com/Rottschaferanders/LaserWeb4.git $LW_DIR
cd $LW_DIR
git checkout $TARGET_UI_BRANCH
nvm install v10.16.3
yarn
npm run installdev

# export UI_VERSION=$(git describe --abbrev=0 --tags)
export UI_VERSION="1.0.0"
export SERVER_VERSION=$(cat ./node_modules/lw.comm-server/version.txt | cut -c 3-6)

# Bundle LaserWeb app using webpack
npm run bundle-dev
cd ../$CURRENT_DIR
git tag -f $UI_VERSION-$SERVER_VERSION
# Overwrite app with latest version

ls -la

rm -rf ./node_modules/lw.comm-server/app/
cp -Rf ../$LW_DIR/dist ./node_modules/lw.comm-server/app/

echo $UI_VERSION-$SERVER_VERSION>./node_modules/lw.comm-server/app/VERSION

echo "BUILDING Laserweb $UI_VERSION-$SERVER_VERSION"

# Copy web front-end + build server component
./node_modules/.bin/electron-rebuild
# ./node_modules/.bin/build --em.version=$UI_VERSION-$SERVER_VERSION -p never
./node_modules/.bin/build --linux --em.version=$UI_VERSION-$SERVER_VERSION -p never
