REPORTER = spec

##################################
# start
##################################
start:
	@DEBUG=diogenis ./bin/www

start-production:
	@DEBUG=diogenis ./bin/www

#################################
# db
#################################
db-create-development:
	@./scripts/db.sh development
	@make defaultdata

db-create:
	@./scripts/db.sh production
	@make defaultdata-production

#################################
# install
################################
install:
	@npm install

defaultdata:
	@./scripts/db.sh defaultdata

defaultdata-production:
	@./scripts/db.sh defaultdata-production

check:
	@./node_modules/.bin/jshint --verbose --extra-ext .json . ; if [ $$? -eq 0 ] ; then echo "Done. Clean!" ; fi

test:
	@./scripts/mocha.sh $(REPORTER)
	@./scripts/db.sh  use-sample
tools:
	@./scripts/tools.sh

help:
	@./scripts/help.sh

.PHONY: start start-production install defaultdata db-create db-create-development check test help tools defaultdata-production
