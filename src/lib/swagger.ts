

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Pub Kviz API",
    version: "1.0.0",
    description: "API dokumentacija za kviz aplikaciju",
  },
  paths: {
    "/api/auth": {
      post: {
        summary: "Registracija / logovanje korisnika",
        requestBody: {
          description: "Podaci za registraciju ili logovanje",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: { description: "Korisnik uspešno registrovan / ulogovan" },
          401: { description: "Neuspešno logovanje" },
        },
      },
    },
    "/api/ekipe/{ekipaId}/clanovi": {
      post: {
        summary: "Dodavanje člana u ekipu",
        parameters: [
          {
            name: "ekipaId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID ekipe u koju se dodaje član",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { userId: { type: "integer" } },
                required: ["userId"],
              },
            },
          },
        },
        responses: {
          200: { description: "Član uspešno dodat" },
          400: { description: "Greška pri dodavanju člana" },
        },
      },
    },
    "/api/kalendar": {
      get: {
        summary: "Dohvata buduće događaje iz Google Kalendara",
        responses: {
          200: {
            description: "Lista događaja",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
          500: { description: "Greška pri fetch-u događaja" },
        },
      },
    },
    "/api/ai/generate-questions": {
      post: {
        summary: "Generiše pitanja uz pomoć OpenAI API-ja",
        parameters: [
          {
            name: "oblast",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "oblast za koju se traže pitanja",
          },
          {
            name: "broj",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "koliko pitanja generisati",
          },
          {
            name: "težina",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "nivo težine traženih pitanja",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { broj: { type: "integer" }, oblast: { type: "string" }, težina: { type: "string" }   },
                required: ["broj,oblast,težina"],
              },
            },
          },
        },
        responses: {
          200: { description: "Pitanja uspešno generisana" },
          400: { description: "Greška pri komunikaciji sa OpenAI API" },
        },
      },
    },
    "/api/ai/preporuci-lokaciju": {
      post : {
        summary: "Dohvata buduće događaje iz Google Kalendara",
        responses: {
          200: {
            description: "Lista događaja",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
          500: { description: "Greška pri fetch-u događaja" },
        },
      },
    },
    "/api/ai/recommended": {
      post : {
        summary: "Pravi preporuke za slične kvizove",
        responses: {
          200: {
            description: "Uspešno nađeni slični kvizovi",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
          500: { description: "Greška pri komunikaciji sa OpenAI serverima" },
        },
      },
    },
    "/api/ai/search": {
      post : {
        summary: "Pretražuje i slične i srodne kvizove iz baze, ne samo one koji se zovu identično kao korisnički upit",
        responses: {
          200: {
            description: "Lista kvizova",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
          500: { description: "Greška pri fetch-u kvizova" },
        },
      },
    },
    "/api/quizzes": {
      post : {
        summary: "Dohvata listu kvizova sa opcionalnim filterima",
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Filter po nazivu kviza",
          },
          {
            name: "zanr",
            in: "query",
            schema: { type: "string" },
            description: "Filter po žanru kviza",
          },
        ],
        responses: {
          200: {
            description: "Lista kvizova",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      title: { type: "string" },
                      description: { type: "string" },
                      date: { type: "string" },
                      zanr: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};