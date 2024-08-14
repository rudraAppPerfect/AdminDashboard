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

describe("Auth Form Validation", () => {
    it("validates form values are filled",async ()=> {
        renderWithContext(<Home />)

        fireEvent.click(screen.getByRole("button",{
            name :/login/i
        }))
    
        expect(await screen.findByText(/invalid email/i)).toBeInTheDocument;
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument;
    })

    it("validates entered email is of the required type ",async ()=> {
        renderWithContext(<Home />)

    // eslint-disable-next-line testing-library/no-unnecessary-act
        act(() => {
            fireEvent.change(screen.getByPlaceholderText("Enter E-mail"), {
                target: { value: "rohit" },
              });
        })

        fireEvent.click(screen.getByRole("button",{
            name :/login/i
        }))
    
        expect(await screen.findByText(/invalid email/i)).toBeInTheDocument;
    })
})