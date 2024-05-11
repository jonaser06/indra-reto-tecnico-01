import { Species } from "../model/species";

export interface ISwapiApi {
  Species(id: string): Promise<Species>;
}
