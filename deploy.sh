rsync . chainbb-api:/var/www/forums --rsh ssh --recursive -avz --no-perms --no-owner --no-group --verbose --exclude=.git* --exclude=services/test --exclude=node_modules/* --checksum -a
