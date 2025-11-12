1. Go to config > config.js, and in the development section, enter your database password.

2. Open the .env file and add the keys that were shared in the GC.

3. Open 4 Git Bash terminals.

4. In the 4th Git Bash terminal, run the following commands:
    npm install
    npm i -g nodemon
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate

5. Run the following commands in each terminal:

    *1st Git Bash Terminal
    npm run dev

    *2nd Git Bash Terminal
    nodemon index.js

    *3rd Git Bash Terminal
    nodemon index2.js