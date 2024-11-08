# wakandans-hr

In the root directory:

- Create `.env` and then copy the contents of `.env.sample`
- Run `npm start`

## Modules Assignment

- **Performance Review Module**: Jad Tarabay
- **Talent Pool Module**: Jonathan Isshak
- **Onboarding/Offboarding and Reporting Module**: Ali Elchab
- **Dashboard/Org Chart and Calendar Module**: Hanan Aref
- **Admin Dashboard**: Youssef Issa

## Frontend

NextJS web app: http://localhost:3000/

While editing SCSS files, activate auto compiling inside `web-app` directory:

```
npm run css:watch
```

## Backend

Node and Express API: http://localhost:5000/

Swagger API Docs: http://localhost:5000/api/v1/docs/

## Migrations

We use Prisma for managing the Database.

To create a new migration:

- Navigate to `db-api` directory
- Implement your DB modifications inside `schema.prisma`
- Run:

```
npm run db:migrate
```

### Seeding

In the root directory run:

```
npm run seed
```
