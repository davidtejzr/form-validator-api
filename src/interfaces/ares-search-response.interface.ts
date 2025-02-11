export interface AresSearchResponseInterface {
  pocetCelkem: number;
  ekonomickeSubjekty: [
    {
      ico: string;
      obchodniJmeno: string;
      datumVzniku: string;
      datumZaniku: string;
      datumAktualizace: string;
      dic: string;
    },
  ];
}
