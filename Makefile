##################################
# start
##################################
start:
	@DEBUG=diogenis ./bin/www

start-production:
	@./bin/www

#################################
# db
#################################
db-create-development:
	@./scripts/db.sh development

db-create-sample:
	@./scripts/db.sh development use-sample

db-create:
	@./scripts/db.sh production

#################################
# install
################################
install:
	@npm install

check:
	@./node_modules/.bin/jshint --verbose --extra-ext .json . ; if [ $$? -eq 0 ] ; then echo "Done. Clean!" ; fi

.PHONY: start start-production install db-create db-create-development
