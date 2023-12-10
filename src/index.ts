import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT || 8000);

  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        //@ts-ignore
        const token = req.headers["token"];
        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.get("/", (req, res) => {
    res.json({ message: " server is up and running" });
  });

  app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
}

init();
