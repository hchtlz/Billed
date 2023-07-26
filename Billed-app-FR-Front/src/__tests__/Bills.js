/**
 * @jest-environment jsdom
 */
import userEvent from "@testing-library/user-event";
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockedBills from "../__mocks__/store"
import router from "../app/Router.js";
import store2 from "../__mocks__/store2.js";
import mockedBillsWithoutDate from "../__mocks__/store_without_date.js";

jest.mock("../app/store", () => mockedBills)

describe("Étant donné que je suis connecté en tant qu'employé", () => {
  describe("Quand je suis sur la page des factures", () => {
    test("L'icône des factures dans la mise en page verticale devrait être mise en surbrillance", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

      // ✅  ====> Cela vérifie si l'icône des factures est mise en surbrillance comme attendu.
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    });

    // Unit test 
    // ✅  ====> TRIER LE TABLEAU DANS SON ENTIERTER PLUTOT QUE DE TRIER LES DATES
    // Les factures doivent être triées du plus ancien au plus récent
    test("Then bills should be ordered from earliest to latest", () => {
      const sortedBills = [...bills].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
      document.body.innerHTML = BillsUI({ data: sortedBills });
      const dates = screen
        .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map((a) => a.innerHTML);
      const datesSorted = [...dates].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      expect(dates).toEqual(datesSorted);
    });
  });
});

// Unit test icon eye 
describe('When I am on Bills page and I click on the icon eye', () => {
  test('Then a modal should open', () => {
    // set localstorage to mockstorage & user to employee
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    // initialize the page
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;

    const firestore = null;

    // initialize Bills class
    const billsClass = new Bills({
      document,
      onNavigate,
      firestore,
      localStorage: window.localStorage,
    });

    // Spy on jQuery's modal method
    $.fn.modal = jest.fn();

    // get the icon eye
    const eye = screen.getAllByTestId("icon-eye")[0];

    // add click event on icon eye
    const handleClickIconEye = jest.fn(billsClass.handleClickIconEye(eye));
    eye.addEventListener("click", handleClickIconEye);
    fireEvent.click(eye);

    // expect the modal to be called
    expect($.fn.modal).toHaveBeenCalled();
  });
});

// UNIT TEST New bill button
describe("When I click on New bill button", () => {
  it("should renders NewBill page", () => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    const user = JSON.stringify({
      type: "Employee",
    });
    window.localStorage.setItem("user", user);

    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const store = null;
    const billsClass = new Bills({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    });

    const handleClickNewBill = jest.fn(billsClass.handleClickNewBill);
    const newBillButton = screen.getByTestId("btn-new-bill");
    newBillButton.addEventListener("click", handleClickNewBill);
    userEvent.click(newBillButton);
    expect(handleClickNewBill).toHaveBeenCalled();
    expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
  });
});

describe('When I am on Bills page but it is loading', () => {
  test('Then I should land on a loading page', () => {
    const html = BillsUI({ data: [], loading: true });
    document.body.innerHTML = html;
    expect(screen.getAllByText('Loading...')).toBeTruthy();
  });
});

describe('When I am on Bills page but back-end send an error message', () => {
  test('Then I should land on an error page', () => {
    const html = BillsUI({ data: [], loading: false, error: 'error!' });
    document.body.innerHTML = html;
    expect(screen.getAllByText('Erreur')).toBeTruthy();
  });
});

// TEST GET BILLS en s'inspirant de de celui du dashboard : Billed-app-FR-Front/src/__tests__/Dashboard.js
// Récupérer les factures depuis l'API fictive GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("should fetches the bills from mock API GET", async () => {
      const getSpy = jest.spyOn(store2, "get");
      const bills = await store2.get("bills");
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test("should fetches the bills from API and fails with 404 message error", async () => {
      store2.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("should fetches the bills from API and fails with 500 message error", async () => {
      store2.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});

// A corriger
describe("Test du bloc catch de la méthode getBills", () => {
  test("should return unformatted date and status on error", async () => {
    
    // Créez une instance de la classe Bills avec le mockStore
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    const user = JSON.stringify({
      type: "Employee",
    });
    window.localStorage.setItem("user", user);

    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };
    const store = mockedBillsWithoutDate
    const billsClass = new Bills({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    });
    
    // Mock de la méthode list pour simuler une erreur
    // mockedBills.bills().list = jest.fn(() => Promise.reject(new Error("Erreur lors de la récupération des factures")));

    // Exécutez la méthode getBills
    const bills = await billsClass.getBills();
    expect(bills[0].date).toEqual(undefined);
  });
});