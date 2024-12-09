mkdir typescript
cd typescript
npm init -y
npm install typescript -D
npm install @types/node -D
npx tsc --init
cp ../../../tsconfig.json ./tsconfig.json
cp ../../../day_package.json ./package.json
mkdir src
touch src/index.ts
