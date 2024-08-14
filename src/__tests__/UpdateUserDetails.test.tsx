import UsersPage from "@/app/users/page";
import UserModal from "@/components/modals/UserModal";
import AuthContext, { AuthContextType } from "@/contextApi/AuthProvider";
import UserState from "@/contextApi/UserState";
import {
  fireEvent,
  render,
  screen,
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

it("deletes user successfully", async () => {
  renderWithContext(<UsersPage />);

  const row = screen.getAllByRole("row")[1];

  fireEvent.click(
    within(row).getByRole("button", {
      name: /edit/i,
    })
  );

  renderWithContext(<UserModal />);

  fireEvent.change(screen.getByPlaceholderText(/enter name/i), {
    target: { value: "Rohit Sharma" },
  });

  fireEvent.click(screen.getByRole("button",{
    name : /update/i
  }))

  expect(row).not.toBeInTheDocument;
});
