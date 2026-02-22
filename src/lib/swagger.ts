

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
    "/api/ekipa/{ekipaId}/clanovi": {
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
    "/api/quizzes": {
      get: {
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