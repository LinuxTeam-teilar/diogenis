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
db-create:
	@./scripts/db.sh create

#################################
# install
################################
install:
	@npm install

.PHONY: start start-production install db-create
