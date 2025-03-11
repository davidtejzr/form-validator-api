export class AresResponseDto {
  ico: string;
  obchodniJmeno: string;
  sidlo: Address;
  pravniForma: string;
  financniUrad: string;
  datumVzniku: string;
  datumZaniku: string;
  datumAktualizace: string;
  dic: string;
  icoId: string;
  adresaDorucovaci: DeliveryAddress;
  seznamRegistraci: RegistrationStatus;
  primarniZdroj: string;
  dalsiUdaje: AdditionalData[];
  czNace: string[];
  subRegistrSzr: string;
  dicSkDph: string;
}

class Address {
  kodStatu: string;
  nazevStatu: string;
  kodKraje: number;
  nazevKraje: string;
  kodOkresu: number;
  nazevOkresu: string;
  kodObce: number;
  nazevObce: string;
  kodSpravnihoObvodu: number;
  nazevSpravnihoObvodu: string;
  kodMestskehoObvodu: number;
  nazevMestskehoObvodu: string;
  kodMestskeCastiObvodu: number;
  kodUlice: number;
  nazevMestskeCastiObvodu: string;
  nazevUlice: string;
  cisloDomovni: number;
  doplnekAdresy: string;
  kodCastiObce: number;
  cisloOrientacni: number;
  cisloOrientacniPismeno: string;
  nazevCastiObce: string;
  kodAdresnihoMista: number;
  psc: number;
  textovaAdresa: string;
  cisloDoAdresy: string;
  standardizaceAdresy: boolean;
  pscTxt: string;
  typCisloDomovni: number;
}

class DeliveryAddress {
  radekAdresy1: string;
  radekAdresy2: string;
  radekAdresy3: string;
}

class RegistrationStatus {
  stavZdrojeVr: string;
  stavZdrojeRes: string;
  stavZdrojeRzp: string;
  stavZdrojeNrpzs: string;
  stavZdrojeRpsh: string;
  stavZdrojeRcns: string;
  stavZdrojeSzr: string;
  stavZdrojeDph: string;
  stavZdrojeSd: string;
  stavZdrojeIr: string;
  stavZdrojeCeu: string;
  stavZdrojeRs: string;
  stavZdrojeRed: string;
  stavZdrojeMonitor: string;
}

class AdditionalData {
  obchodniJmeno: BusinessName[];
  sidlo: AdditionalAddress[];
  pravniForma: string;
  spisovaZnacka: string;
  datovyZdroj: string;
}

class BusinessName {
  platnostOd: string;
  platnostDo: string;
  obchodniJmeno: string;
  primarniZaznam: boolean;
}

class AdditionalAddress {
  sidlo: Address;
  primarniZaznam: boolean;
  platnostOd: string;
  platnostDo: string;
}
