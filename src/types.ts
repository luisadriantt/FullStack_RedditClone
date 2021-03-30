import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

// create type alias for context
export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>
}