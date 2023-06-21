/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the form elements should be rendered", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
    
      const form = document.querySelector('[data-testid="form-new-bill"]');
      const fileInput = document.querySelector('[data-testid="file"]');
      const expenseTypeSelect = document.querySelector('[data-testid="expense-type"]');
      const expenseNameInput = document.querySelector('[data-testid="expense-name"]');
      const amountInput = document.querySelector('[data-testid="amount"]');
      const datepickerInput = document.querySelector('[data-testid="datepicker"]');
      const vatInput = document.querySelector('[data-testid="vat"]');
      const pctInput = document.querySelector('[data-testid="pct"]');
      const commentaryTextarea = document.querySelector('[data-testid="commentary"]');
      const submitButton = document.querySelector('[type="submit"]');
    
      expect(form).toBeTruthy();
      expect(fileInput).toBeTruthy();
      expect(expenseTypeSelect).toBeTruthy();
      expect(expenseNameInput).toBeTruthy();
      expect(amountInput).toBeTruthy();
      expect(datepickerInput).toBeTruthy();
      expect(vatInput).toBeTruthy();
      expect(pctInput).toBeTruthy();
      expect(commentaryTextarea).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });
  });
});
