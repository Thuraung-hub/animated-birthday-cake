# Animated Birthday Cake

An interactive birthday card built with HTML, CSS, and vanilla JavaScript. It includes a candle celebration, cake cutting, an optional birthday countdown, looping birthday music, personalized messages, themes, photos, device parallax, and PNG export.

## Files

- `index.html` — card structure, welcome screen, controls, and personalization form
- `style.css` — responsive design, themes, and animations
- `script.js` — personalization, candle, countdown, cake cutting, looping music, parallax, gift, photo, and confetti interactions

## Run Locally

From the project folder, start a local server:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

You can also use the VS Code Live Server extension. A local server is recommended because browser audio, sharing, and file features work more consistently than opening the file directly.

## How It Works

1. Click **Start celebration** to open the card and start the looping birthday melody.
2. Click the cake or press Enter/Space while the cake is focused to extinguish the candle.
3. Watch the candle, confetti, typed message, and gift reveal.
4. Press the cake again to split it and reveal its hidden note.
5. Click the gift to open the extra note.
6. Use **Replay** in the toolbar to reset the celebration and play it again.

## Personalize

Click **Edit** to customize:

- Recipient name
- Birthday message
- Birthday date and countdown
- Optional photo
- Night, sunset, or candy theme

Settings are saved in the browser’s local storage.

Place the default birthday photo at `birthday-photo.jpg` in the project folder. It stays hidden until the first cake click, then appears with the birthday reveal. The Edit panel can still replace it with another photo for the current card.

If a birthday date is set, the card displays an optional countdown to that date. The celebration controls remain available at all times.

## Controls

- **Save** — download the card as a PNG
- **Replay** — reset the surprise and restart the looping birthday melody
- **Edit** — open the personalization panel
- Click the cake or use its keyboard controls to extinguish the candle.

After the candle is blown out, press the cake again to cut it. On supported mobile devices, tilting the phone creates a subtle parallax effect across the stars, balloons, and cake.

## Saving

After the candle reveal, use **Save** to download the card as a PNG. If the optional `html2canvas` library cannot load, Save opens the browser print dialog instead.

## Browser Notes

- Device parallax requires a supported mobile browser and may require motion permission on iOS.
- The birthday melody starts after **Start celebration** and loops continuously until the page is closed or replayed.
- Google Fonts and `html2canvas` are loaded from CDNs. The core card still works without them, with fallback fonts and print export available.
- No backend, database, or paid service is required.
# animated-birthday-cake
