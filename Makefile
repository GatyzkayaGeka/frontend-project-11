install:
	npm ci
	
lint:
	npx eslint .

start:
	npm start

webpack:
    npx webpack serve

build:
	npx webpack --mode=development
	