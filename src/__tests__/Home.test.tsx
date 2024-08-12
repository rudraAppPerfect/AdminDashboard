import "@testing-library/jest-dom";
import Home from "@/app/page";
import { fireEvent, render, screen } from "@testing-library/react";

import AuthContext, { AuthContextType } from "@/contextApi/AuthProvider";

// Mock the AuthContext
const mockRegister = jest.fn();
const mockLogin = jest.fn();

const mockAuthContext: AuthContextType = {
  register: mockRegister,
  login: mockLogin,
  user: null,
  logout: function (): void {
    throw new Error("Function not implemented.");
  },
};

describe("Home Page", () => {
  it("renders correctly", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Home />
      </AuthContext.Provider>
    );

    expect(
      screen.getByRole("heading", {
        name: /login/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: /register/i,
      })
    ).not.toBeInTheDocument();
  });

  it("switches to Register form when Sign Up is clicked", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Home />
      </AuthContext.Provider>
    );

    // Click the Sign Up button
    fireEvent.click(
      screen.getByRole("button", {
        name: /sign up/i,
      })
    );

    // Check if Register text is present
    expect(
      screen.getByRole("heading", {
        name: /register/i,
      })
    ).toBeInTheDocument();
  });
});
