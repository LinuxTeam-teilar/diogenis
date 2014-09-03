REPORTER = spec

##################################
# start
##################################
start:
	@DEBUG=* ./bin/www

start-production:
	@./bin/www

#################################
# db
#################################
db-create-development:
	@./scripts/db.sh development
	@make defaultdata

db-create:
	@./scripts/db.sh production

#################################
# install
################################
install:
	@npm install

defaultdata:
	@node defaultdata.js

check:
	@./node_modules/.bin/jshint --verbose --extra-ext .json . ; if [ $$? -eq 0 ] ; then echo "Done. Clean!" ; fi

test:
	@./scripts/mocha.sh $(REPORTER)
	@./scripts/db.sh  use-sample
tools:
	@./scripts/tools.sh

help:
	@./scripts/help.sh

.PHONY: start start-production install defaultdata db-create db-create-development check test help tools
