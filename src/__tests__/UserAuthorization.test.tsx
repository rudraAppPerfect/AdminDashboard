import Home from "@/app/page";
import Layout from "@/app/users/layout";
import UsersPage from "@/app/users/page";
import AuthContext, { AuthContextType } from "@/contextApi/AuthProvider";
import UserState from "@/contextApi/UserState";
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRouter } from "next/navigation";

type RegisteredUsers = {
  email: string;
  password: string;
  role: string;
  token?: string;
};

const mockRegister = jest.fn();
const mockLogin = jest.fn();
const mockLogOut = jest.fn();
let mockUser: RegisteredUsers | null = null;

const renderWithLogin = (
  ui: React.ReactElement,
  user: RegisteredUsers | null = null
) => {
  const mockAuthContext: AuthContextType = {
    register: mockRegister,
    login: (email: string, password: string) => {
      mockLogin(email, password);
      mockUser = {
        email,
        password,
        role: email === "rahul@gmail.com" ? "Admin" : "User",
        token: "mockToken",
      };
    },
    user: user || mockUser,
    logout: mockLogOut,
  };

  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <UserState>{ui}</UserState>
    </AuthContext.Provider>
  );
};

const renderWithRegister = (
  ui: React.ReactElement,
  user: RegisteredUsers | null = null
) => {
  const mockAuthContext: AuthContextType = {
    register: (email: string, password: string) => {
      mockRegister(email, password);
      mockUser = {
        email,
        password,
        role: email === "rahul@gmail.com" ? "Admin" : "User",
        token: "mockToken",
      };
    },
    login: mockLogin,
    user: user || mockUser,
    logout: mockLogOut,
  };

  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <UserState>{ui}</UserState>
    </AuthContext.Provider>
  );
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

describe("Authorization of User", () => {
  it("ensures the user logged in is Admin", async () => {
    renderWithLogin(<Home />);

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Enter E-mail"), {
        target: { value: "rahul@gmail.com" },
      });

      fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
        target: { value: "12345" },
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: /login/i,
        })
      );
    });

    expect(mockLogin).toHaveBeenCalledWith("rahul@gmail.com", "12345");
    mockRouter.push("/users");
    expect(mockRouter.push).toHaveBeenCalledWith("/users");

    // Render the UsersPage with the updated mockUser
    renderWithLogin(
      <Layout>
        <UsersPage />
      </Layout>,
      mockUser
    );

    expect(
      await screen.findByRole("button", {
        name: /create \+/i,
      })
    ).toBeInTheDocument();
  });

  it("ensures the user logged in is not Admin", async () => {
    renderWithRegister(<Home />);

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

    expect(mockRegister).toHaveBeenCalledWith("rohit@gmail.com", "123456");
    mockRouter.push("/users");
    expect(mockRouter.push).toHaveBeenCalledWith("/users");

    renderWithRegister(
      <Layout>
        <UsersPage />
      </Layout>,
      mockUser
    );

    await waitFor(
      () => {
        expect(
          screen.queryByRole("button", {
            name: /create \+/i,
          })
        ).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });
});
