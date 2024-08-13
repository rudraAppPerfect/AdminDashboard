import Home from "@/app/page";
import AuthContext, { AuthContextType } from "@/contextApi/AuthProvider";
import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

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

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>{ui}</AuthContext.Provider>
  );
};

describe("Authorization", () => {
  it("registers the New User correctly", async () => {
    renderWithContext(<Home />);

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: /sign up/i,
        })
      );

      fireEvent.change(screen.getByPlaceholderText("Enter E-mail"), {
        target: { value: "rohit@gmail.com" },
      });

      fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
        target: { value: "123456" },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /sign up/i,
        })
      );
    });

    const storedUser = localStorage.getItem("token");
    expect(storedUser).toBeDefined;

    expect(mockRegister).toHaveBeenCalledWith("rohit@gmail.com", "123456");
  });

  it("logins the registered user correctly", async () => {
    renderWithContext(<Home />);

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => {
      fireEvent.change(screen.getByPlaceholderText("Enter E-mail"), {
        target: { value: "rohit@gmail.com" },
      });

      fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
        target: { value: "123456" },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /login/i,
        })
      );
    });

    expect(mockLogin).toHaveBeenCalledWith("rohit@gmail.com", "123456");
  });
});
