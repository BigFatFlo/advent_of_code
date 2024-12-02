mkdir typescript
cd typescript
npm init -y
npm install typescript -D
npm install @types/node -D
npx tsc --init
cp ../../../tsconfig.json .
cp ../../../package.json .
mkdir src
touch src/index.ts
