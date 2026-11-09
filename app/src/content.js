export const MODELS = {
  duo: {
    key: "duo",
    amount: 2990,
    cashback: 200,
    per: "1 495 kr per person",
    counts: { handle: 2, head: 3, stand: 1, case: 1, holder: 1 },
    box: [
      ["Håndtak", "2"],
      ["Børstehoder", "3"],
      ["Magnetlader", "1"],
      ["Ladeetui", "1"],
      ["Hodeholder", "1"],
    ],
    note:
      "Duo-pakken gir to håndtak, tre hoder, én lader og ett ladeetui. Den ene lader på standen, den andre i etuiet.",
  },
  two: {
    key: "two",
    amount: 3998,
    cashback: 400,
    per: "1 999 kr per person",
    counts: { handle: 2, head: 4, stand: 2, case: 2, holder: 2 },
    box: [
      ["Håndtak", "2"],
      ["Børstehoder", "4"],
      ["Magnetlader", "2"],
      ["Ladeetui", "2"],
      ["Hodeholder", "2"],
    ],
    note:
      "To enkeltpakker gir alt hver for seg: egen lader, eget etui og to hoder hver. Det er 1 008 kr mer før cashback.",
  },
};

// Hotspots on the pack shot. x/y are percentages of the image box.
export const PARTS = [
  {
    id: "head",
    label: "Tre børstehoder",
    count: "3",
    x: 70,
    y: 17,
    note:
      "Ett på hvert håndtak, ett i reserve. iO-hoder passer alle iO-håndtak, også iO3.",
  },
  {
    id: "handle",
    label: "To håndtak",
    count: "2",
    x: 68,
    y: 50,
    note:
      "Svart og rose. Begge har trykksensor, skjerm og sju moduser, så dere får samme børste.",
  },
  {
    id: "case",
    label: "Ett ladeetui",
    count: "1",
    x: 82,
    y: 60,
    note:
      "Lader børsten mens den ligger inni, men må stå i stikkontakt. Det er ikke noe batteri i etuiet.",
  },
  {
    id: "stand",
    label: "Én magnetlader",
    count: "1",
    x: 58,
    y: 88,
    note:
      "Bare én lader følger med. Den andre børsten lader i etuiet, eller du kjøper en ekstra puck til 179 kr.",
  },
  {
    id: "holder",
    label: "Én hodeholder",
    count: "1",
    x: 77,
    y: 89,
    note: "Liten, men den holder hodene unna hverandre på badet.",
  },
];

export const REVIEWS = [
  { name: "Oral-B iO9 Duo", sub: "669 anmeldelser hos Power, 290 hos Elkjøp", value: "4,5", w: 90 },
  { name: "Oral-B iO9 enkelt", sub: "190 anmeldelser hos Elkjøp", value: "4,8", w: 96 },
  { name: "Oral-B iO10", sub: "34 anmeldelser hos Elkjøp", value: "4,7", w: 94 },
  { name: "Philips Sonicare 9900 Prestige", sub: "104 hos Elkjøp, 999 hos Philips. 81 prosent anbefaler", value: "4,2", w: 84 },
  { name: "Philips DiamondClean 9000", sub: "302 anmeldelser hos Elkjøp", value: "4,7", w: 94 },
];

export const CORPUS = [
  {
    q: ["pris", "koster", "koste", "dyr", "billig", "verdt", "tilbud", "kampanje"],
    a: "Duo-pakken koster 2 990 kr hos Komplett og 2 999 kr hos Power. Enkeltbørsten koster 1 990 kr. Du får 200 kr tilbake fra Oral-B, så du ender på 2 790 kr.",
    src: "Butikkpriser 9. nov 2026 · Oral-B cashback",
  },
  {
    q: ["verdt", "verdt det", "anbefale", "burde", "kjøpe"],
    a: "Er dere to, er den verdt det. Du sparer 1 008 kr mot to enkeltbørster. Trenger du bare én, kjøp enkeltbørsten til 1 990 kr.",
    src: "Prisregnestykke 9. nov 2026",
  },
  {
    q: ["duo", "to enkelt", "forskjell", "sammenligne"],
    a: "Duo gir to håndtak, tre hoder, én lader og ett ladeetui. To enkeltpakker gir to håndtak, fire hoder, to ladere og to etuier. Duo er 1 008 kr billigere før cashback.",
    src: "Eskeinnhold, Elkjøp og Power",
  },
  {
    q: ["esken", "innhold", "følger med", "pakke"],
    a: "I Duo-esken: to håndtak i svart og rose, tre iO-børstehoder, én magnetisk hurtiglader, ett ladeetui og én hodeholder.",
    src: "Eskeinnhold, Elkjøp",
  },
  {
    q: ["cashback", "tilbake", "refusjon", "rabatt"],
    a: "200 kr for iO9 og iO9 Duo. Kampanjen gjelder kjøp fra 1. juli 2026 til 31. august 2027. Registrer innen 29. oktober 2027, og klipp ut strekkoden fra esken før du kaster den.",
    src: "Oral-B cashback-vilkår, Power",
  },
  {
    q: ["batteri", "batteritid", "holder", "oppladning", "lading", "strøm"],
    a: "12 til 14 dager i praksis, selv om Oral-B oppgir to uker. Det er under snittet i klassen. Flere anmeldere rapporterer at batteriet dør helt etter 12 til 18 måneder.",
    src: "Electric Teeth · TechAdvisor · Amazon-anmeldelser",
  },
  {
    q: ["usb", "usb-c", "kabel", "lader", "lade", "støpsel", "kontakt"],
    a: "Ingen USB-C. Børsten har ingen kontakt og lades induktivt. Laderen har fast 2-pin-støpsel og støtter 100 til 240 volt.",
    src: "Electric Teeth · Oral-B manual",
  },
  {
    q: ["reise", "ferie", "tur", "borte", "koffert"],
    a: "Under to uker: lad fullt og la laderen ligge hjemme. Over to uker: ta med pucken. Ladeetuiet følger med, men det har ikke eget batteri og må stå i stikkontakt.",
    src: "Electric Teeth · Oral-B manual",
  },
  {
    q: ["etui", "reiseetui", "case"],
    a: "Ladeetuiet følger med begge pakkene. Det lader børsten mens den ligger inni, men det må være koblet til strøm. Det er ikke noe batteri i etuiet.",
    src: "Electric Teeth",
  },
  {
    q: ["tannkjøtt", "lichen", "planus", "sår", "brenner", "slimhinne"],
    a: "Ved lichen planus i tannkjøttet ga strukturert plakkontroll med elektrisk børste 39,5 prosent mindre plakk, mot 4,1 prosent i kontrollgruppen. Slimhinnelesjonene ble også bedre. Bruk myke hoder, Sensitive-modus og tannkrem uten SLS.",
    src: "Stone et al., J Clin Periodontol 2015",
  },
  {
    q: ["trykk", "trykksensor", "hard", "presser", "press"],
    a: "Trykksensoren lyser rødt og skrur ned farten når du presser for hardt. For deg med lichen planus er det den viktigste funksjonen, ikke de sju modusene.",
    src: "Oral-B manual · AAD, oral lichen planus",
  },
  {
    q: ["hoder", "børstehode", "refill", "bytte", "koster hoder"],
    a: "iO-hoder koster 56 kr per stykke i en åttpakning på det billigste, og 87 kr på fullpris. To personer bruker åtte hoder i året, altså 449 til 699 kr.",
    src: "Prisjakt · Power · Elkjøp",
  },
  {
    q: ["hvor ofte", "bytte hode", "intervall"],
    a: "Hvert tredje måned. Ved mye plakk eller følsomt tannkjøtt kan hvert annen måned være lurt.",
    src: "Oral-B manual · tannlegeanbefaling",
  },
  {
    q: ["app", "bluetooth", "ai", "sporing", "soner", "3d"],
    a: "Appen sporer 16 soner på iO9 og iO10, og 6 soner på de andre iO-seriene. Anmelderne beskriver sporingen som nyttig, men ikke nødvendig for å få rene tenner.",
    src: "Electric Teeth · Test.no",
  },
  {
    q: ["garanti", "reklamasjon", "ødelagt", "defekt", "bytte"],
    a: "Oral-B gir to års garanti. Norsk forbrukerkjøpslov gir fem års reklamasjonsrett på varer som er ment å vare vesentlig lenger enn to år. Ta vare på kvitteringen.",
    src: "Forbrukerkjøpsloven · Elkjøp",
  },
  {
    q: ["farge", "svart", "rosa", "hvit", "blå"],
    a: "Duo-pakken kommer bare i svart og rose quartz. Enkeltbørsten finnes i svart, blå, hvit og rosa.",
    src: "Power og Elkjøp, produktsider",
  },
  {
    q: ["vekt", "tung", "størrelse", "håndtere"],
    a: "Håndtaket veier 117 gram uten børstehode. Det er normalt for klassen.",
    src: "Oral-B produktspesifikasjon",
  },
  {
    q: ["io3", "billig", "billigere", "budsjett"],
    a: "iO3 har trykksensor, timer og tre moduser, men ingen skjerm. To børster koster rundt 999 kr. Du mister 16-soners sporing og skjermen, ikke rengjøringen.",
    src: "Oral-B · Prisjakt",
  },
  {
    q: ["io10", "nyeste", "toppmodell"],
    a: "iO10 koster 2 399 kr hos Elkjøp og scorer 86 av test.no, mot 85 for iO9. Den har samme 16-soners sporing. Men du får bare ett håndtak.",
    src: "Elkjøp · Test.no",
  },
  {
    q: ["philips", "sonicare", "konkurrent", "alternativ"],
    a: "Philips 9900 Prestige scorer 4,2 av 5 hos Philips selv, med 999 anmeldelser. test.no gir den 82 poeng, mot 85 for iO9. Reiseetuiet hennes lades med USB-C. Den er dyrere per ytelse.",
    src: "Philips.no · Test.no",
  },
  {
    q: ["diamondclean", "9000"],
    a: "DiamondClean 9000 koster 1 999 kr og har 4,7 av 5 fra 302 anmeldelser. Den er et godt sonisk alternativ, men vasker dårligere i Testfaktas måling.",
    src: "Elkjøp · Testfakta",
  },
  {
    q: ["manuell", "vanlig", "håndbørste"],
    a: "Elektrisk fjerner 11 prosent mer plakk etter en til tre måneder, og 21 prosent mer etter tre måneder. Gevinsten er reell, men moderat.",
    src: "Cochrane 2014",
  },
  {
    q: ["hvor mange soner", "soner", "dekning"],
    a: "16 soner på iO9 og iO10. 6 soner på iO4, iO6, iO7 og iO8. Det er derfor iO9 er den interessante hvis du vil ha detaljert sporing.",
    src: "Electric Teeth",
  },
  {
    q: ["volt", "spenning", "usa", "storbritannia", "adapter"],
    a: "Laderen støtter 100 til 240 volt. I Europa trenger du ingenting. I Storbritannia og USA trenger du pluggadapter, men ikke transformator.",
    src: "Electric Teeth · Oral-B manual",
  },
  {
    q: ["hvor kjøpe", "butikk", "komplett", "power", "elkjøp"],
    a: "Komplett: 2 990 kr, 50+ på lager, tilbud til 27. desember. Power: 2 999 kr, tilbud til 30. november. Elkjøp: 4 319 kr.",
    src: "Butikkpriser 9. nov 2026",
  },
  {
    q: ["lager", "levering", "utsolgt"],
    a: "Komplett har 50+ på lager. Power har 100+ på nettlager og 103 varehus. Elkjøp har den i butikk.",
    src: "Butikkpriser 9. nov 2026",
  },
  {
    q: ["vente", "black friday", "black week", "prisfall"],
    a: "Tilbudet er allerede Black Weeks. Hos Komplett varer det til 27. desember. Det er lite sannsynlig at det faller mer før jul.",
    src: "Komplett · Power, kampanjesider",
  },
  {
    q: ["anmeldelser", "til å stole", "ekte", "vurderinger"],
    a: "iO9 har 4,5 av 5 fra 669 anmeldelser hos Power. Enkeltbørsten har 4,8 fra 190 hos Elkjøp. Høyere tall er mer til å stole på, men begge er store nok til å vise et mønster.",
    src: "Power · Elkjøp",
  },
  {
    q: ["best i test", "test", "score"],
    a: "test.no har samlet 155 tester fra 53 redaksjoner. iO10 får 86, iO9 får 85, Philips 9900 får 82.",
    src: "Test.no, 9. nov 2026",
  },
  {
    q: ["støy", "bråk", "lyd", "høy"],
    a: "Anmeldere beskriver Philips 9900 som hørbar. For iO9 fant jeg ingen gjentatte klager på lyd.",
    src: "Best Buy-anmeldelser · Electric Teeth",
  },
];
