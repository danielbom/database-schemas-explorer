```powershell
yarn init -y

# Install packages
yarn add tsx -D
yarn add @types/node -D
yarn add axios
yarn add lodash
yarn add @types/lodash -D
yarn add prisma -D
yarn add @prisma/client

# Create a new Prisma project.
npx prisma init --datasource-provider sqlite
# Create the initial migration.
npx prisma migrate dev --name init
# Turn your database schema into a Prisma schema.
npx prisma db pull
# Generate the Prisma Client. You can then start querying your database.
npx prisma generate
```

# References

- [Fastify Ecosystem](https://www.fastify.io/ecosystem/)
