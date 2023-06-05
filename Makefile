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
	npx webpack --mode=development
	