# create permission for vscode to read-write folder/file
sudo chmod -R 777 {{file/folder_path}} 

# start cli
npx sequelize-cli init

# create migrate files
npx sequelize-cli migration:generate --name create-user

# create seeder
npx sequelize-cli seed:generate --name seed-roles

# migrate
npx sequelize-cli db:migrate