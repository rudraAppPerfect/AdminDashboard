import { http, HttpResponse } from "msw";

export const handlers = [
  // Example of handling a GET request
  http.get("/api/users", () => {
    return HttpResponse.json({
      data: [
        {
          id: 998,
          name: "Mukul",
          email: "mukul@gmail.com",
          role: "Admin",
          status: "Active",
          password:
            "$2a$10$U31udAkQcUmyccumtzH4Aeiq.cAWzMLIZJ1lGtJRynVKvKoAT14k.",
          createdAt: "2024-08-21T06:22:02.078Z",
        },
        {
          id: 997,
          name: "Rohit",
          email: "rohit@gmail.com",
          role: "Admin",
          status: "Active",
          password:
            "$2a$10$YkJSxBsAWBEASKb6IdBLkOh3s2z1JXKUdR4XXMWL6AlYu61rHIIWG",
          createdAt: "2024-08-21T06:21:43.615Z",
        },
      ],
      meta: {
        totalUsers: 2,
      },
    });
  }),
];

// Example of handling a POST request
//   rest.post('/api/login', (req, res, ctx) => {
//     return res(
//       ctx.status(200),
//       ctx.json({
//         token: 'mock-token',
//       })
//     );
//   }),
// ];
