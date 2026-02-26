# WEB APLIKACIJA - PAB KVIZ 

Ova web aplikacija omogućava korisnicima da:

- Pregledaju listu kvizova
- Filtriraju kvizove po žanru i pretrazi
- Vide kalendar budućih kvizova
- Vide tabelu sa ekipama i njihovim rezultatima po sezonama
- Uspešno logovanje korisnika ako su član tima

Tabele se mogu videti na: [Google Sheet](https://docs.google.com/spreadsheets/d/1fcBbPFDlEbIkWof8vQKsO8p8zV-T1CXHDkvXcjKYfKg/edit?gid=0#gid=0)

## Tehnologije koje su korišćene

- **Next.js**  
- **TypeScript**  + **Tailwind**
- **SheetDB + Google Sheet** (za čuvanje podataka o ekipama i rezultatima)
- **Google Calendar API** (za prikaz događaja kvizova)
- **PostgreSQL**
- **Docker i Docker compose** 

### Instalacija i pokretanje

1. Kloniraj repozitorijum git clone <URL_REPO>, cd <IME_PROJEKTA>
2. Instaliraj zavisnosti npm install
3. Pokreni aplikaciju npm start
4. Pokreni development server npm run dev ili komande npm run build pa opet npm start
5. Dokerizovana varijanta aplikacije pokreće se sledećim komandama : 
   docker compose up --build
   Ova komanda podiže dva kontejnera : jedan za aplikaciju a drugi za PostgreSQL bazu. Pored toga se kreira i novi volumen za bazu.
   Za pokretanje ili gašenje kontejnera koriste se :
   docker start
   docker stop




AUTORI :
Aleksandar Perić 2021/0106
Dimitrije Pavlović 2021/0148
Dino Mustajbašić 2021/0020

