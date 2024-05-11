export interface ISwapi {
  listSpecies(id: string): Promise<any>;
  addSpecies(id: string, payload: string): Promise<any>;
}
