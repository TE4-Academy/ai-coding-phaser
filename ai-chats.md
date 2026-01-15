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

### ChatGPT
- https://chatgpt.com/share/696778ae-4b84-800a-976c-6156009ac2fa

**Prompt 1**
---
Jag har infogat lista.md som du ska använda dig av. Du ska agera som erfaren promptare som har arbetat med att prompta claude under längre tid för att få tydliga och användbara svar. Jag har bett en ai att skapa en lista med förbättringsområden samt brister i kod jag har skrivit för ett ritprogram med html, tailwind css och javascript. Jag förväntar mig en tydlig och välstrukuterad prompt som claude kommer förstå och kunna använda till att skriva bra kod som jag sedan kan implementera i min applikation. Du ska inte ändra på några av punkterna i listan och ska endast använda dig av listan för att skapa en meningsfull prompt.

### ChatGPT
- https://chatgpt.com/share/6968aedd-b2ac-800a-8bf5-d9eb8cc8e1e8

**Prompt 1**
---
Du är en erfaren promptare till claude som ska skriva en enkel men tydlig och meningsfull prompt till claude ai.

Du ska skriva en prompt som ska förbättra ett redan befintligt ritprogram som riktar sig åt 5-13 åringar.

Prompten ska angå detta:
Implementation av Textverktyg.
Kunna ändra namn på redan befintliga lager samt skapa nya lager vid behov.
Kunna zooma in på canvasen för att rita detaljer.

Prompten ska inte angå de redan befintliga funktionerna eller försöka ändra utseende på programmet drastiskt.

### Claude
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

### Claude
- https://claude.ai/share/029c050b-0532-44b8-86e2-d49930927ca3
**Prompt 1**
---
Du är en senior frontend-utvecklare med djup erfarenhet av HTML5 Canvas, JavaScript, Tailwind CSS och att bygga barnvänliga webbapplikationer.
Jag har ett befintligt ritprogram byggt med HTML, Tailwind CSS och JavaScript. Programmet använder canvas, flera lager, verktyg som pensel och flood fill, samt laddar Tailwind via CDN.
Nedan följer en lista med identifierade brister och förbättringsområden i min nuvarande kod. Du får inte ifrågasätta, ändra eller ta bort några punkter. Din uppgift är att implementera lösningar för exakt dessa punkter genom att skriva tydlig, robust och pedagogisk kod som kan integreras i en existerande applikation.
Krav på ditt svar:
* Föreslå konkreta kodförändringar (HTML, JavaScript och/eller Tailwind).
* Visa kodexempel där det är relevant.
* Dela upp svaret i tydliga sektioner som exakt motsvarar varje punkt i listan.
* Anpassa lösningarna för en målgrupp 5–13 år där det anges.
* Prioritera robusthet, säkerhet, prestanda och tydlig UX.
* Anta att koden körs i webbläsaren utan ramverk (ingen React/Vue).
Säkerhet och Robusthet
Saknad källverifiering (CDN) Tailwind laddas via en extern CDN utan integrity-attribut (Subresource Integrity). Om CDN-tjänsten komprometteras kan skadlig kod injiceras i applikationen.
Exponering för injektion via Console Variabler som currentBrushSize och currentColor valideras inte. En användare kan via konsolen sätta värden som förstör renderingslogiken (t.ex. negativa penselstorlekar eller ogiltiga färgkoder).
Förbättringsområden: Målgrupp 5–13 år
Saknat touch-stöd Programmet lyssnar endast på mus-events (mousedown, mousemove, etc.). Barn i denna ålder använder i stor utsträckning surfplattor eller pekskärmar där touchstart och touchmove krävs för att kunna rita.
Lagersystemets logik vid rensning Funktionen clearCanvas fyller det aktiva lagret med vit färg. Om ett barn ritar på Lager 1 och sedan rensar det, blir Lager 1 helt vitt och täcker därmed Lager 0 helt (transparensen försvinner). Det vore mer logiskt att rensa till transparent på alla lager utom bakgrundslagret.
Destruktiva knappar utan bekräftelse Knappen "Rensa" (Clear) raderar allt arbete direkt. För barn som råkar klicka fel krävs en dialogruta ("Vill du verkligen rensa?") eller en mycket tydlig Undo-funktion som de förstår.
Visuell feedback för aktivt verktyg Även om knappar ändrar färg är kontrasten i Tailwind-standard (blue-500 mot gray-200) ibland för svag för yngre barn eller barn med synnedsättning. Markeringen av vilket verktyg som är valt behöver vara tydligare.
Flood Fill-prestanda En stack-baserad flood fill i ren JavaScript kan frysa UI-tråden i flera sekunder om ytan är komplex eller stor, vilket leder till att barnet klickar upprepade gånger och riskerar att krascha fliken.
Gränssnittets layout Verktygsfältet tar upp mycket vertikal plats. På mindre skärmar (som Chromebooks i skolan) blir själva ritytan (canvas) väldigt liten eftersom verktygsfälten inte är kollapsbara eller anpassade för små skärmar.
Slutmål
Efter dina ändringar ska koden vara:
* Säkrare mot manipulation
* Stabilare vid extrema användarfall
* Anpassad för barn
* Prestandamässigt trygg
* Enkel att läsa och vidareutveckla
Skriv ditt svar som om det ska användas direkt i ett riktigt projekt.

### Claude
- https://claude.ai/share/25b5da26-f8e6-4796-856d-de4a799003fc
**Prompt 1**
---
I detta ritprogram så är där man målar och själva muspekaren/fingrets position inte korrekt. Där muspekaren/fingret är hamnar inte färgen man ritar med.

Agera som erfaren js, html och tailwind css testare och fullstack utvecklare.

Hitta problemet som gör så att ritningen inte hamnar på korrekt ställe och åtgärda det problemet med de medel du anser vara nödvändiga.

Försökt att endast lösa problemet.

Gå stegvis igenom din lösning och implementera lösningen i filerna jag lagt in.

### Gemini

https://gemini.google.com/share/082ae2771e0e

**Prompt 1**
---
Du är en erfaren testare på ett företag som har erfarenhet av testa ritprogram med målgruppen 5-13 åringar.

Jag har skapat ett ritprogram och vill att du ska finna både brister med säkerheten samt förbättringsområden. Jag har använt mig av html, tailwind css och javascript för att skapa denna applikation.

Du ska ge mig en lista med de brister och förbättringsområden du finner som jag sedan ska vidare befordra till en annan AI som ska formulera om listan till en tydlig prompt.

Du ska inte ändra i koden eller ta fram någon lösning, endast skapa en lista med de brister du finner samt förbättringsområden. Gissa inte och fråga om du blir osäker.

### Gemini
- https://gemini.google.com/share/cc84c31b41af

**Prompt 1**
---
Du är en 11 åring som har fått ett ritprogram att leka med men du ska även dokumentera de förbättringar du skulle vilja se.

Förbättringarna ska angå funktioner du skulle vilja se eller ändringar i UI

Ge mig svaret i ett format som skulle vara lätt för en ai att förstå och gå igenom dina egna.

### Gemini
- https://gemini.google.com/share/c73bf460ee1f
**Prompt 1**
Du är en erfaren frontend utvecklare som arbetat mycket med tailwind css och applikationer skapade för yngre målgrupper (5-13 år)

Du ska göra om UI för denna applikation som är riktad mot barn i åldern 5-13 så att det passar bättre. Det ska vara mer färgglatt och inte så platt.

Du ska inte ändra på någon befintlig kod som inte har med utseende av applikationen att göra. Du ska endast ändra tailwind css så att sidan blir mer anpassad för barn. Lägg inte till animation, låt sidan behålla sin mer statiska look.

Gå igenom de implementerade lösningarna steg för steg och var självgranskade.

Ställ frågor ifall du blir osäker och lägg endast till det du anser vara absolut nödvändigt för att nå resultatet.

Implementera lösningen dirket i filen index.html som är bifogad.