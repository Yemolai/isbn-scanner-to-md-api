# ISBN Scanner to Markdown API

A utility service that fetches book information from ISBN codes and generates markdown files. This tool is designed for internal/intranet use only.

⚠️ **WARNING: INTERNAL USE ONLY** ⚠️

This application is NOT intended for public deployment or distribution. It is a helper tool designed for internal/intranet usage only. The application may not include necessary security features for public internet exposure.

## Description

This service accepts ISBN codes and:
- Fetches book information from multiple providers
- Merges the data into a consolidated format
- Generates standardized markdown files

## Setup

1. Clone the repository
```bash
git clone [repository-url]
cd isbn-scanner-to-md-api
```

2. Install dependencies
```bash
npm install
```

3. Configure providers
- Copy `.env.example` to `.env`
- Add your API keys and configuration values

## Development

1. Start in development mode:
```bash
npm run dev
```

2. Run tests:
```bash
npm test
```

## Usage

The service exposes endpoints to:
- Convert ISBN to book data
- Generate markdown files from book data

Example:
```bash
curl -X POST http://localhost:3000/api/isbn/9780123456789
```

## Project Structure

```
.
├── services/      # Core service logic
├── models/        # Data models
├── providers/     # Book data providers
├── markdown/      # Markdown templates
└── utils/         # Helper utilities
```

## Security Notice

This application is:
- NOT designed for public internet deployment
- NOT hardened against security threats
- Intended ONLY for internal/intranet usage
- Should be used behind appropriate security measures

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).

You are free to:
- Share: copy and redistribute the material in any medium or format
- Adapt: remix, transform, and build upon the material

Under the following terms:
- Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made
- NonCommercial: You may not use the material for commercial purposes

See the full license at: https://creativecommons.org/licenses/by-nc/4.0/
