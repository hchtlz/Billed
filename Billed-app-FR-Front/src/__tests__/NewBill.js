/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import NewBillUI from '../views/NewBillUI.js';

import firestore from "../__mocks__/store.js";
import { Store } from "../__mocks__/store2.js";
import Router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      const user = JSON.stringify({
        type: "Employee",
        email: "a@a",
      });
      window.localStorage.setItem("user", user);

      const pathname = ROUTES_PATH["NewBill"];
      Object.defineProperty(window, "location", {
        value: {
          hash: pathname,
        },
      });

      document.body.innerHTML = `<div id="root"></div>`;
      Router();
    });

    test("Require the input type data", () => {
      const inputData = screen.getByTestId("datepicker");
      expect(inputData).toBeTruthy();
    });
    test("Require the input type vat", () => {
      const inputVat = screen.getByTestId("vat");
      expect(inputVat).toBeTruthy();
    });
    test("Require the input type pct", () => {
      const inputPct = screen.getByTestId("pct");
      expect(inputPct).toBeTruthy();
    });
    test("Require the input type file", () => {
      const inputFile = screen.getByTestId("file");
      expect(inputFile).toBeTruthy();
    });
  });
});

describe("When I do not fill fields && I click on submit button", () => {
  test("should renders NewBill original page", () => {
    const inputName = screen.getByTestId("expense-name");
    expect(inputName.getAttribute("placeholder")).toBe("Vol Paris Londres");
    expect(inputName.value).toBe("");
    
    const inputDate = screen.getByTestId("datepicker");
    expect(inputDate.value).toBe("");

    const inputAmount = screen.getByTestId("amount");
    expect(inputAmount.value).toBe("");

    const inputVat = screen.getByTestId("vat");
    expect(inputVat.value).toBe("");

    const inputPct = screen.getByTestId("pct");
    expect(inputPct.value).toBe("");

    const inputCommentary = screen.getByTestId("commentary");
    expect(inputCommentary.value).toBe("");

    const inputFile = screen.getByTestId("file");
    expect(inputFile.value).toBe("");
  });
});

// -------------------------------------- TODO -------------------------------------- //

// Test Unitaires
describe("When I fill fields", () => {
  test("should upload file wrong format", () => {
    // DOM construction
    document.body.innerHTML = NewBillUI();

    // get DOM element
    const newBillContainer = new NewBill({
      document,
      onNavigate,
      firestore: null,
      localStorage: window.localStorage,
    });

    const handleChangeFile = jest.fn(newBillContainer.handleChangeFile);

    const attachedFile = screen.getByTestId('file');
    attachedFile.addEventListener('change', handleChangeFile);
    fireEvent.change(attachedFile, {
      target: {
        files: [
          new File(['document.pdf'], 'document.pdf', {
            type: 'application/pdf',
          }),
        ],
      },
    });

    // expected results
    expect(handleChangeFile).toHaveBeenCalled();
    expect(attachedFile.files[0].name).toBe('document.pdf');

    // get DOM element
    const errorMessage = screen.getByTestId('file-error-message');

    // expected results
    expect(errorMessage.textContent).toEqual(
      expect.stringContaining(
        'Invalid file format. Please select a JPG, JPEG, or PNG file.'
      )
    );
  });
});

// Test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I complete the requested fields and I submit", () => {
  test("post bill to mock API", async () => {});
  test("post bill to mock API and failed", async () => {});
  test("post bill to mock API and failed with 404 error", async () => {});
  test("post bill to mock API and failed with 500 error", async () => {});
  });
});