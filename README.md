# File created using Typespark

---

To fire up your frontend, run:
`npm --prefix frontend run dev`

To fire up your server, run:
`bun --watch server/server.ts`

To fire up your database, run:
`npx --prefix ./server prisma studio --schema ./server/prisma/schema.prisma`

The command for firing up everything is:
`pm2 delete all && pm2 start 'npm --prefix frontend run dev' --name frontend-local && cd server && pm2 start 'bun --watch server.ts' --name server-local && cd .. && pm2 start 'npx --prefix ./server prisma studio --schema ./server/prisma/schema.prisma' --name prismastudio && pm2 logs`
