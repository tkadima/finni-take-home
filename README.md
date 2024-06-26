# Finni Take Home Project

## Project Setup

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

Before running the application, run the seed script 
```sh 
npm run seed
```
To start the development server, run:

```sh
npm run dev
```

### Running the Application on Docker
Build the application 
```sh
docker build -t nextjs-app .
```

Run the application 
```sh
docker run -p 3000:3000 nextjs-app
```

This will start the development server on [http://localhost:3000](http://localhost:3000).

Log on using 
email: admin@finnihealth.com 
password: test
