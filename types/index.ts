// Tipus TypeScript del projecte

export type FasePacient = "agut" | "subagut" | "cronic";

export type EstatPacient = "actiu" | "alta temporal" | "fase aguda";

export type Evolucio = "millora" | "estable" | "empitjora";

export interface Pacient {
  id: string;
  centreId: string;
  nom: string;
  cognoms: string;
  dataNaixement: string;
  telefon: string;
  email: string;
  diagnostic: string;
  fase: FasePacient;
  profesionalAssignat: string;
  estat: EstatPacient;
  dataInici: string;
  properaSessio?: string;
  frequencia?: string;
}

export type TipusDeteccioIA =
  | "kinesiofobia"
  | "catastrofitzacio"
  | "milloraDetectada"
  | "alertaClinica"
  | "suggeriment";

export type SeveritatDeteccioIA = "info" | "warning" | "alert";

export interface DeteccioIA {
  tipus: TipusDeteccioIA;
  descripcio: string;
  severitat: SeveritatDeteccioIA;
}

export interface ResumEstructurat {
  motivConsulta: string;
  dolor: string;
  aspecteEmocional: string;
  valoracioFuncional: string;
  pendents: string[];
}

export interface Sessio {
  id: string;
  centreId: string;
  pacientId: string;
  data: string;
  numero: number;
  titol: string;
  previewResum: string;
  evolucio: Evolucio;
  eva: number;
  transcripcio?: string;
  resumEstructurat?: ResumEstructurat;
  deteccionsIA?: DeteccioIA[];
}

export interface Professional {
  id: string;
  centreId: string;
  nom: string;
  cognoms: string;
  especialitat: string;
  email: string;
  fotoUrl?: string;
}
