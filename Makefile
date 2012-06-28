release:
	uglifyjs -o backbone-state.min.js backbone-state.js

test:
	open test/index.html

docs:
	docco backbone-state.js
	open docs/backbone-state.html

.PHONY: release test docs
