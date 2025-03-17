# ✈️ Ricerca Voli Aeroporto di Salerno-Costa d'Amalfi

Questa web app permette di **cercare voli** in base alla destinazione, mostrando i dettagli dei voli disponibili in un'interfaccia **neo-brutalist**.
L'utente può filtrare i voli per **mese di partenza** e visualizzare le informazioni come **numero di volo, compagnia aerea, orario e periodo di attività**.

## 🚀 Funzionalità
- 🔍 **Autocomplete** per la ricerca della destinazione
- 📅 **Filtri per mese** per visualizzare solo i voli attivi in un determinato periodo
- 🛠 **Scraping automatico** per aggiornare i dati


## Tecnologie utilizzate
### Frontend
HTML, CSS, Javascript. Nessun framework o libreria esterna.

### Backend
- **Node.js + Express** - Server per servire i dati e gestire le API
- **Puppeteer** - Web scraping per raccogliere dati sui voli
- **Cheerio** - Parsing dei dati HTML ottenuti dallo scraping
- **Cron** - Schedulazione dello scraping

## ⚠️ Note Importanti
- I dati sui voli provengono da scraping su fonti pubbliche e potrebbero non essere aggiornati in tempo reale.
- Questa applicazione **non è affiliata** con alcuna compagnia aerea.
- Gli utenti sono invitati a **verificare le informazioni sui siti ufficiali** delle compagnie aeree prima di prenotare un volo.
- Questo progetto è stato realizzato **a scopo educativo e informativo**, senza intenzione di violare copyright o diritti di terzi.