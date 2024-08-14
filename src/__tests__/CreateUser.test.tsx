import UsersPage from "@/app/users/page";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import UserModal from "@/components/modals/UserModal";
import AuthContext, { AuthContextType } from "@/contextApi/AuthProvider";
import UserState from "@/contextApi/UserState";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

const mockRegister = jest.fn();
const mockLogin = jest.fn();
const mockLogOut = jest.fn();
const mockUser = {
  email: "rahul@gmail.com",
  password: "12345",
  role: "Admin",
};

const mockAuthContext: AuthContextType = {
  register: mockRegister,
  login: mockLogin,
  user: mockUser,
  logout: mockLogOut,
};

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <UserState>{ui}</UserState>
    </AuthContext.Provider>
  );
};

it("creates new user successfully", async () => {
  renderWithContext(<UsersPage />);

  fireEvent.click(
    screen.getByRole("button", {
      name: /create \+/i,
    })
  );

  renderWithContext(<UserModal />);

  fireEvent.change(screen.getByPlaceholderText(/enter name/i), {
    target: { value: "Rohit Sharma" },
  });

  fireEvent.change(screen.getByPlaceholderText(/enter e-mail/i), {
    target: { value: "rohitsharma123@gmail.com" },
  });

  fireEvent.change(screen.getByPlaceholderText(/enter user's role/i), {
    target: { value: "User" },
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "Create",
    })
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: />>/i,
    })
  );

  await waitFor(
    () => {
      const row = screen.queryByRole("row", {
        name: /user rohit sharma rohitsharma123@gmail\.com user active edit delete/i,
      });
      expect(row).toBeInTheDocument;
    },
    {
      timeout: 2000,
    }
  );
});
