# MS Homestays luxury villa website

A bespoke React and Tailwind website for MS Homestays near Isha Adiyogi.

## Local setup

```bash
npm install
npm run dev
```

## Netlify deployment

The project includes `netlify.toml` with the Vite build command, publish directory, serverless functions directory and SPA redirect handling.

## Images

The site currently references Airbnb CDN image URLs directly in `src/data.js` for apartment detail galleries, and uses local exterior images in `public/images` for the home page hero and home gallery. The component layer uses lazy loading throughout the galleries and cards.

## Availability and Airbnb calendar sync

The website now uses live Airbnb iCal links through `netlify/functions/sync-calendar.js`.

The function syncs these six calendars:

- Room 1: `ground-floor-couples-room`
- Room 2: `room-no-2-cozy-room`
- Room 3: `room-no-3-family-studio`
- Room 4: `room-no-4-family-studio`
- Room 5: `room-no-5-couples-home`
- Room 7: `room-no-7-wfh-room`

The React availability hook calls `/.netlify/functions/sync-calendar` and refreshes the data every 30 minutes while the site is open. The Netlify function also sends a 30 minute CDN cache header, so public traffic reuses the latest synced calendar response rather than calling Airbnb on every page load.

If the Airbnb calendar sync is temporarily unavailable, the site falls back to the local placeholder unavailable dates in `src/data.js` and asks guests to confirm directly with the host.

## WhatsApp enquiry prefill

The floating WhatsApp button uses the current page context. On apartment detail pages, it includes the apartment name plus the guest-provided check-in date, check-out date and guest count from the search form. If any field has not yet been entered, the WhatsApp message shows it as "to be confirmed" so the guest can complete it inside WhatsApp.

## Search and date picker update

The search bar now uses a custom dropdown calendar for both check in and check out fields. Search results update from the central availability hook and the Search button scrolls guests to the apartment discovery section on the home page.

Availability checks are date safe and compare ISO date strings directly, avoiding timezone shifts when guests browse from India or other non UTC timezones.

## Search results behaviour

The home page and apartment page search buttons now route to `/search` with the selected check in date, check out date and guest count in the URL. The search results page fetches the linked Airbnb iCal calendars through `/.netlify/functions/sync-calendar`, applies the selected date range and guest count, and displays only matching available apartments. Each result links back to its individual apartment detail page.

For local testing of the live Airbnb calendar function, run the project through Netlify Dev rather than plain Vite so the serverless function is available at `/.netlify/functions/sync-calendar`.
