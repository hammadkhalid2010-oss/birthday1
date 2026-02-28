# Birthday QR Website

A hostable static website that creates a personalized **Happy Birthday** page and generates a QR code pointing to it.

## Features

- Personalized greeting via `?name=` query parameter.
- Shareable QR code generator for the personalized link.
- Interactive birthday cake with candles that can be blown out by loud sound/microphone input.

## How it works

1. Host these files on any static host (GitHub Pages, Netlify, Vercel static, S3, etc.).
2. Enter the birthday person's name.
3. Click **Generate**.
4. Share the generated link or QR code.
5. The recipient scans the QR and sees a personalized birthday greeting.
6. They can enable microphone and blow/make a loud sound to extinguish cake candles.

## Local preview

```bash
python3 -m http.server 8000
```

Then visit: <http://localhost:8000>
