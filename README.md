
# Finni Take Home Project

## Project Setup

This project is a Next.js application with a few dependencies and development tools. Follow the steps below to get the project running on your local machine.
To read about my creative process in building the project, view my [documentation file](documentation.md)

### Prerequisites

- Node.js (version 14.x or later)
- npm (version 6.x or later) or yarn (version 1.22.x or later)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/tkadima/finni-take-home.git
   cd finni-take-home
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

### Running the Application

To start the development server, run:

```sh
npm run dev
```

This will start the development server on [http://localhost:3000](http://localhost:3000).

### Building the Application

To build the application for production, run:

```sh
npm run build
```

### Starting the Application

To start the application in production mode, run:

```sh
npm start
```

### Linting and Formatting

To lint the code, run:

```sh
npm run lint
```

To format the code with Prettier, run:

```sh
npm run format
```

### Seeding and migration 
to run seed script alone, run: 

```sh
ts-node src/database/seed.ts
```

## Dependencies

- `@emotion/react`: ^11.11.4
- `@emotion/styled`: ^11.11.5
- `@mui/material`: ^5.15.20
- `next`: 14.2.4
- `react`: ^18
- `react-dom`: ^18
- `sqlite`: ^5.1.1
- `sqlite3`: ^5.1.7
- `swr`: ^2.2.5

## DevDependencies

- `@types/node`: ^20
- `@types/react`: ^18
- `@types/react-dom`: ^18
- `eslint`: ^8
- `eslint-config-next`: 14.2.4
- `prettier`: ^3.3.2
- `typescript`: ^5

