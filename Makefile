release:
	uglifyjs -o backbone-state.min.js backbone-state.js

tests:
	open spec/index.html

docs:
	docco backbone-state.js
	open docs/backbone-state.html

.PHONY: release tests docs
