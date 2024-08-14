import UsersPage from "@/app/users/page";
import AuthContext, { AuthContextType } from "@/contextApi/AuthProvider";
import UserState from "@/contextApi/UserState";
import { fireEvent, render, screen } from "@testing-library/react";

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

it("searches user by name", async () => {
  renderWithContext(<UsersPage />);

  fireEvent.change(screen.getByPlaceholderText("Search User"), {
    target: { value: "dr." },
  });

  expect(await screen.findAllByText(/^Dr/i)).toBeInTheDocument;
});
