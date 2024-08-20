import { faker } from "@faker-js/faker";
import axios from "axios";

export default async function addFakeUsers() {
  for (let i = 0; i < 999; i++) {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(["User"]),
      status: faker.helpers.arrayElement(["Active", "Inactive"]),
      password: faker.internet.password(),
      isAdmin: false,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/create",
        user
      );
      console.log(`Created user: ${response.data.name}`);
    } catch (error: any) {
      console.error(
        "Error creating user:",
        error.response?.data || error.message
      );
    }
  }
}
