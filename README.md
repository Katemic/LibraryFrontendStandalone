# Library Frontend

Standalone React + Vite frontend for the Library API. This project is separate from the Visual Studio backend solution and can be opened directly in VS Code.

## API modes

The frontend has two modes:

| Mode | Command | API URL |
|---|---|---|
| Development | `npm run dev` | `http://localhost:5143` |
| Test | `npm run dev:test` | `http://localhost:5153` |

The URLs are configured in `.env.development` and `.env.test`.

## Run in development mode

Start the backend first:

```bash
dotnet run --project LibraryAPI --launch-profile http
```

Then start the frontend:

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Run in test mode

Start the backend test profile first:

```bash
dotnet run --project LibraryAPI --launch-profile Testing
```

Then start the frontend in test mode:

```bash
npm run dev:test
```

## Playwright

The Playwright config starts the frontend in test mode automatically. The backend test profile still needs to be running first.

```bash
npm run test:e2e
```

## Test database reset

The Playwright tests call:

```txt
POST /api/test/reset-database
```

against the test API before each test. This only works when the API is running in `Testing` mode.

## Seed login users

The test seed contains users such as:

```txt
mads.jensen@example.com
sofie.hansen@example.com
```

If the password hash in the seed is unknown or changed, use the registration page during tests instead of logging in as a seeded user.
