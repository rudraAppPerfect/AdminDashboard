import UsersPage from "@/app/users/page";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import UserModal from "@/components/modals/UserModal";
import AuthContext, { AuthContextType } from "@/contextApi/AuthProvider";
import UserState from "@/contextApi/UserState";
import { fireEvent, render, screen, within } from "@testing-library/react";

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

describe("Users Page Tests", () => {
  it("renders correctly", () => {
    renderWithContext(<UsersPage />);

    expect(
      screen.getByRole("button", {
        name: /create \+/i,
      })
    ).toBeInTheDocument;
  });
});

describe("Modal Tests", () => {
  it("create modal renders correctly", async () => {
    renderWithContext(<UsersPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /create \+/i,
      })
    );

    renderWithContext(<UserModal />);

    expect(await screen.findByPlaceholderText("Enter name")).toBeInTheDocument;
  });

  it("delete modal renders correctly", async () => {
    renderWithContext(<UsersPage />);

    const row = screen.getAllByRole("row")[1];

    fireEvent.click(
      within(row).getByRole("button", {
        name: /delete/i,
      })
    );

    renderWithContext(<ConfirmationModal />);

    expect(
      await screen.findByRole("button", {
        name: /yes/i,
      })
    ).toBeInTheDocument;
  });


  it("edit modal renders correctly", async () => {
    renderWithContext(<UsersPage />);

    const row = screen.getAllByRole("row")[1];

    fireEvent.click(
      within(row).getByRole("button", {
        name: /edit/i,
      })
    );

    renderWithContext(<UserModal />);

    expect(
      await screen.findByRole("button", {
        name: /update/i,
      })
    ).toBeInTheDocument;
  });


});
