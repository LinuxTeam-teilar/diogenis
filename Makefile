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

db-create:
	@./scripts/db.sh production

#################################
# install
################################
install:
	@npm install

.PHONY: start start-production install db-create db-create-development
