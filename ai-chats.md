# Här är de chatter gruppen har använt för att skapa detta program

## ChatGPT
- https://chatgpt.com/share/696634be-dd2c-800a-8c7b-ed1a8e86a53d

### Prompts

**Prompt 1**
---
Jag ska skriva en prompt till en ai för att den ska hjälpa mig utveckla ett ritprogram som liknar microsoft paint. Kan du hjälpa mig skriva en bra prompt som jag ska ge till claude senare. Här är beskrivningen: Du är en fullstack utvecklare. Jag jobbar med ett projekt där jag ska skapa ett enkelt ritprogram (likt en microsoft paint) med med html, javascript och tailwind. Ingen css. Jag vill att du tar fram ett ritprogram som liknar ms paint skapad med html, javascript och tailwind utan css. Gissa inte. Om du behöver använda externa paket, välj de mest stabila. Förklara koden rad för rad. Leverera svaret som html med tailwind och javascript filer. Läs igenom din plan och sammanfatta stegen du tänker ta innan du genererar koden.

**Prompt 2**
---
fungerade bra. Nu vill jag bygga vidare på detta. Skapa en till prompt jag kan ge till claude för att förbättra programmet. Jag vill att detta också ska finnas med: Lägga till former, (kvadrat, triangel och cirkel) Kunna sudda Ett verktyg för att fylla i såsom en hink. Olika lager man kan rita på. Kunna spara sin målning på datan. Just nu går det inte att bara klicka för att rita, man måste alltså hålla i och dra minst 1 pixel.

## Claude
- https://claude.ai/share/9c63e8b9-4eb1-4028-8d7c-94d1f82a73b4

### Prompts

**Prompt 1**
---
Roll & ansvar Du är en senior fullstack-utvecklare med stark erfarenhet av frontend-utveckling, HTML5 Canvas, JavaScript och Tailwind CSS.

Projektbeskrivning: Jag arbetar med ett projekt där jag ska bygga ett enkelt ritprogram som liknar Microsoft Paint. Applikationen ska byggas med:
* HTML
* JavaScript (vanilla, inga ramverk om det inte är absolut nödvändigt)
* Tailwind CSS
Ingen egen CSS får användas – endast Tailwind-klasser.
Krav på funktionalitet (minimum) Ritprogrammet ska innehålla:
* Canvas där användaren kan rita fritt med musen
* Val av färg
* Val av penselstorlek
* Rensa canvas
* Enkel och tydlig UI som påminner om klassiska MS Paint
* undo/redo

Tekniska krav
* Använd HTML5 Canvas API
* Använd endast externa paket/bibliotek om det verkligen behövs
* Om externa paket används:
   * välj de mest stabila och välunderhållna
   * motivera varför de används
* Gissa inte kring funktionalitet – om något är oklart, fatta rimliga tekniska beslut och förklara dem eller fråga mig

Arbetsprocess (mycket viktigt)
1. Läs igenom hela uppgiften noggrant
2. Presentera först en kort plan i punktform som beskriver:
   * hur applikationen ska byggas
   * vilka filer som behövs
   * hur funktionaliteten delas upp
3. Sammanfatta planen kort innan kodgenerering
4. Generera därefter koden
Leveransformat
* Leverera lösningen uppdelad i:
   * index.html
   * script.js
* All Tailwind ska ligga direkt i HTML
* JavaScript ska ligga i en separat fil
Kodförklaring
* Förklara JavaScript-koden rad för rad
* Förklara vad varje viktig funktion gör och varför den behövs
* Håll förklaringarna pedagogiska och tydliga
Kvalitetskrav
* Koden ska vara:
   * lättläst
   * välstrukturerad
   * kommenterad där det behövs
* Lösningen ska vara enkel men stabil och möjlig att bygga vidare på

**Prompt 2**
---
skriv ett meningsfullt commit message för implementationen av all denna kod

**Prompt 3**
---
ok nu ska programmet vidareutvecklas.
Prompt – Vidareutveckling av ritprogram (Version 2)
Roll & kontext Du är en senior fullstack-utvecklare med djup kunskap inom HTML5 Canvas, JavaScript och Tailwind CSS.
Jag har redan ett fungerande enkelt ritprogram (likt Microsoft Paint) byggt med:
* HTML
* JavaScript (vanilla)
* Tailwind CSS
* HTML5 Canvas
 Ingen egen CSS används – endast Tailwind.
Viktigt: Detta är en vidareutveckling av befintlig kod, inte ett helt nytt projekt. Utgå från att:
* Det redan finns frihandsritning
* Det finns färgval, penselstorlek och rensa canvas
* Koden är uppdelad i index.html och script.js
Nya funktioner som ska implementeras
1. Former
Lägg till verktyg för att rita:
* Kvadrat / rektangel
* Cirkel
* Triangel
Krav:
* Användaren klickar och drar för att bestämma storlek
* Visa förhandsvisning medan användaren drar (”preview”)
* Formerna ska använda vald färg och linjetjocklek
2. Suddgummi
* Lägg till ett sudd-verktyg
* Sudd ska fungera som i MS Paint:
   * suddar det användaren ritar över
* Använd canvas-tekniker (t.ex. globalCompositeOperation) på ett korrekt och stabilt sätt
3. Fyll-verktyg (”hink”)
* Implementera ett fyllverktyg som:
   * fyller ett sammanhängande område med vald färg
* Använd flood-fill eller motsvarande algoritm
* Förklara tydligt hur algoritmen fungerar
4. Lager (Layers)
* Implementera enkla lager, exempelvis:
   * Bakgrundslager
   * Ett eller flera ritlager
* Användaren ska kunna:
   * välja aktivt lager
   * rita på olika lager utan att påverka andra
* Förklara hur lager hanteras tekniskt (t.ex. flera canvas-element eller offscreen canvas)
5. Spara målning
* Lägg till möjlighet att:
   * spara målningen lokalt på användarens dator
* Format:
   * PNG
* Använd standardmetoder (toDataURL eller motsvarande)
* Lägg till en tydlig knapp i UI
6. Klick-för-punkt-ritning (buggfix / förbättring)
Just nu går det inte att bara klicka för att rita en punkt – användaren måste dra minst 1 pixel.
Åtgärd:
* Se till att:
   * ett klick utan drag ritar en punkt
* Lösningen ska fungera för:
   * frihandsritning
   * suddverktyg
UI-krav
* UI ska fortsatt vara:
   * enkel
   * tydlig
   * MS Paint-inspirerad
* Alla styles ska göras med Tailwind CSS
* Nya verktyg ska ha tydliga knappar eller ikoner
Arbetsprocess (obligatorisk)
1. Läs igenom hela uppgiften noggrant
2. Presentera en förbättringsplan i punktform som:
   * listar varje ny funktion
   * beskriver hur den ska implementeras tekniskt
3. Sammanfatta planen kort
4. Därefter:
   * visa ändringar och tillägg i koden
   * undvik onödig omskrivning av befintlig kod
Kod & förklaringar
* Leverera:
   * uppdaterad index.html
   * uppdaterad script.js
* Förklara:
   * nya funktioner noggrant
   * viktiga kodrader rad för rad
* Var pedagogisk och tydlig
Kvalitetskrav
* Stabil och begriplig kod
* Lätt att bygga vidare på (undo/redo, fler verktyg etc.)
* Inga antaganden utan förklaring
* Inga onödiga bibliotek