import { Synonym } from "./synonym";

export class SynonymGroup {
  id: string;
  synonym: Synonym[] = new Array(0);
  dataSize: string;
}
