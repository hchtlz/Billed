import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

// Utilise la fonction "jest.mock" pour mocker le fichier "../app/Store" avec le mockStore que nous avons importé précédemment.
jest.mock("../app/Store", () => mockStore);

// Décrit un groupe de tests pour la page "NewBill".
describe("When I am on NewBill Page", () => {
  // Cette fonction est exécutée avant chaque test dans ce groupe. Elle prépare l'environnement pour les tests.
  beforeEach(() => {
    // Définit une propriété "localStorage" sur l'objet "window" pour simuler le localStorage dans les tests.
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Simule la présence d'un utilisateur dans le localStorage sous forme de chaîne JSON.
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );

    // Crée un élément "div" et l'ajoute au document. Cet élément servira de point d'ancrage pour le composant "NewBill".
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);

    // Initialise le router de l'application pour gérer les routes.
    router();
  });

  // Teste si l'icône de courrier électronique sur le verticallayout est mise en surbrillance (active).
  test("Then mail icon on verticallayout should be highlighted", async () => {
    // Appelle la fonction "window.onNavigate" avec la route "ROUTES_PATH.NewBill" pour simuler la navigation vers la page "NewBill".
    window.onNavigate(ROUTES_PATH.NewBill);

    // Attend que l'icône de courrier électronique soit rendue dans le DOM en utilisant le "data-testid" spécifié.
    await waitFor(() => screen.getByTestId("icon-mail"));

    // Récupère l'élément d'icône de courrier électronique dans le DOM.
    const Icon = screen.getByTestId("icon-mail");

    // Vérifie si l'icône a la classe CSS "active-icon", indiquant qu'elle est mise en surbrillance.
    expect(Icon).toHaveClass("active-icon");
  });

  // Décrit un sous-groupe de tests pour le formulaire de la page "NewBill".
  describe("When I am on NewBill form", () => {
    // Teste l'ajout d'un fichier dans le formulaire.
    test("Then I add File", async () => {
      // Crée une instance du composant "NewBill" avec des paramètres spécifiques pour les tests.
      const dashboard = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      // Crée un "jest.fn" pour espionner la fonction "dashboard.handleChangeFile".
      const handleChangeFile = jest.fn(dashboard.handleChangeFile);

      // Récupère l'élément d'entrée de fichier (input type="file") dans le DOM en utilisant "data-testid".
      await waitFor(() => screen.getByTestId("file"));

      const inputFile = screen.getByTestId("file");

      // Ajoute un écouteur d'événement "change" à l'élément d'entrée de fichier, qui appelle la fonction espion "handleChangeFile" lorsqu'un fichier est sélectionné.
      inputFile.addEventListener("change", handleChangeFile);

      // Déclenche l'événement "change" sur l'élément d'entrée de fichier avec une simulation de fichier sélectionné.
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["document.jpg"], "document.jpg", {
              type: "document/jpg",
            }),
          ],
        },
      });

      // Vérifie si la fonction "handleChangeFile" a été appelée.
      expect(handleChangeFile).toHaveBeenCalled();

      // Vérifie une autre fois si la fonction "handleChangeFile" a été appelée.
      expect(handleChangeFile).toBeCalled();

      // Vérifie si le texte "Envoyer une note de frais" est présent dans le DOM.
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
  });
});

// Décrit un autre groupe de tests pour la page "NewBill" lors de la soumission du formulaire.
describe("When I am on NewBill Page and submit the form", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);
    router();
  });

  // Décrit un autre sous-groupe de tests pour la soumission réussie du formulaire.
  describe("user submit form valid", () => {
    // Teste l'appel à l'API pour mettre à jour les notes de frais.
    test("call api update bills", async () => {
      // Crée une instance du composant "NewBill" avec des paramètres spécifiques pour les tests.
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localeStorage: localStorageMock,
      });

      // Crée un "jest.fn" pour espionner la fonction "newBill.handleSubmit".
      const handleSubmit = jest.fn(newBill.handleSubmit);

      // Récupère le formulaire dans le DOM en utilisant "data-testid".
      const form = screen.getByTestId("form-new-bill");

      // Ajoute un écouteur d'événement "submit" au formulaire, qui appelle la fonction espion "handleSubmit" lors de la soumission.
      form.addEventListener("submit", handleSubmit);

      // Déclenche l'événement "submit" sur le formulaire pour simuler une soumission.
      fireEvent.submit(form);

      // Vérifie si la méthode "bills" du mockStore a été appelée.
      expect(mockStore.bills).toHaveBeenCalled();
    });
  });
});