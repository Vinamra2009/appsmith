import { ObjectsRegistry } from "../../../../support/Objects/Registry";

const {
  AggregateHelper: agHelper,
  CommonLocators: locator,
  DeployMode: deployMode,
  EntityExplorer: ee,
  PropertyPane: propPane,
} = ObjectsRegistry;

describe("Navigate To feature", () => {
  it("1. Navigates to page name clicked from the page name tab of navigate to", () => {
    // create a new page
    ee.AddNewPage(); // page 2

    ee.SelectEntityByName("Page1");
    cy.fixture("promisesBtnDsl").then((val: any) => {
      agHelper.AddDsl(val, locator._spanButton("Submit"));
    });
    ee.SelectEntityByName("Button1", "Widgets");
    propPane.SelectPropertiesDropDown("onClick", "Navigate to");
    cy.get(".t--open-dropdown-Select-Page").click();
    agHelper.AssertElementLength(".bp3-menu-item", 2);
    cy.get(locator._dropDownValue("Page2")).click();
    deployMode.DeployApp();
    agHelper.ClickButton("Submit");
    cy.get(".bp3-heading").contains("This page seems to be blank");
    deployMode.NavigateBacktoEditor();
  });

  it("2. Gives error message when invalid word is entered in the url tab of navigate to", () => {
    cy.fixture("promisesBtnDsl").then((val: any) => {
      agHelper.AddDsl(val, locator._spanButton("Submit"));
    });
    ee.SelectEntityByName("Button1", "Widgets");
    propPane.SelectPropertiesDropDown("onClick", "Navigate to");
    cy.get("#switcher--url").click();
    cy.get("label")
      .contains("Enter URL")
      .siblings("div")
      .within(() => {
        cy.get(".t--code-editor-wrapper").type("wrongPage");
      });
    deployMode.DeployApp();
    agHelper.ClickButton("Submit");
    agHelper.ValidateToastMessage("Enter a valid URL or page name");
    deployMode.NavigateBacktoEditor();
  });

  it("3. Navigates to url entered from the url tab of navigate to", () => {
    cy.fixture("promisesBtnDsl").then((val: any) => {
      agHelper.AddDsl(val, locator._spanButton("Submit"));
    });
    ee.SelectEntityByName("Button1", "Widgets");
    propPane.SelectPropertiesDropDown("onClick", "Navigate to");
    cy.get("#switcher--url").click();
    cy.get("label")
      .contains("Enter URL")
      .siblings("div")
      .within(() => {
        cy.get(".t--code-editor-wrapper").type("google.com");
      });
    deployMode.DeployApp();
    agHelper.ClickButton("Submit");
    cy.url().should("include", "google.com");
    // go back to appsmith
    cy.go(-1);
    deployMode.NavigateBacktoEditor();
    cy.wait(1000);
  });
});
