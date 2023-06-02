install:
	npm ci
	npm link
	
lint:
	npx eslint .

start:
	npm start

webpack:
    npx webpack serve

build:
	rm -rf dist
	NODE_ENV=production npx webpack