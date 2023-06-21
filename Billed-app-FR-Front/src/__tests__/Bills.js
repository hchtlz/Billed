/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

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

      // ✅  ====> PROBLEME CORRIGER : Cela vérifie si l'icône des factures est mise en surbrillance comme attendu.
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
    });

    // ✅  ====> PROBLEME CORRIGER : TRIER LE TABLEAU DANS SON ENTIERTER PLUTOT QUE DE TRIER LES DATES
    // Les factures doivent être triées du plus ancien au plus récent
    test("Les factures doivent être triées du plus ancien au plus récent", () => {
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

// TODO : TEST GET BILLS en s'inspirant de de celui du dashboard : Billed-app-FR-Front/src/__tests__/Dashboard.js
// Récupérer les factures depuis l'API fictive GET
describe("Récupérer les factures depuis l'API fictive GET", () => {
  test("Récupère les factures depuis l'API fictive GET", async () => {
    localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Dashboard)
    await waitFor(() => screen.getByText("Validations"))
    const contentPending = await screen.getByText("En attente (1)")
    expect(contentPending).toBeTruthy()
    const contentRefused = await screen.getByText("Refusé (2)")
    expect(contentRefused).toBeTruthy()
    expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
  });

  test("Récupère les factures depuis une API et échoue avec un message d'erreur 404", async () => {
    localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
    window.fetch = jest.fn().mockRejectedValueOnce({ status: 404 });
    const html = BillsUI({ error: "some error message" });
    document.body.innerHTML = html;

    const findTextMatching = (matcher) => {
      const elements = screen.queryAllByText(matcher);
      const combinedText = elements.map((element) => element.textContent).join("");
      return matcher.test(combinedText);
    };

    // Vérifie qu'aucun message d'erreur 404 n'est affiché
    await waitFor(() => {
      const errorMessage = findTextMatching(/Erreur 404/);
      expect(errorMessage).not.toBeTruthy();
    });
  });

  test("Récupère les factures depuis une API et échoue avec un message d'erreur 500", async () => {
    localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
    window.fetch = jest.fn().mockRejectedValueOnce({ status: 500 });
    const html = BillsUI({ error: "some error message" });
    document.body.innerHTML = html;

    const findTextMatching = (matcher) => {
      const elements = screen.queryAllByText(matcher);
      const combinedText = elements.map((element) => element.textContent).join("");
      return matcher.test(combinedText);
    };

    // Vérifie qu'aucun message d'erreur 500 n'est affiché
    await waitFor(() => expect(findTextMatching(/Erreur 500/)).not.toBeTruthy());
  });
});