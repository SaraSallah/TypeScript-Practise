/// <reference path="base-components.ts"/>
/// <reference path = "../util/validation.ts"/>
/// <reference path = "../state/project-state.ts"/>

namespace App {
    export class ProjectInput  extends Component <HTMLDivElement , HTMLFormElement >{
        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLInputElement;
        peopleInputElement: HTMLInputElement;
      
        constructor() {
          super('project-input' , 'app'  , true , 'user-input');
      
          this.titleInputElement = this.element.querySelector(
            "#title"
          ) as HTMLInputElement;
          this.descriptionInputElement = this.element.querySelector(
            "#description"
          ) as HTMLInputElement;
          this.peopleInputElement = this.element.querySelector(
            "#people"
          ) as HTMLInputElement;
          
          this.configure();
        }
         configure() {
          this.element.addEventListener("submit", this.submitHandler.bind(this));
        }
        renderContent(): void {
            
        }
      
        private getUserInput(): [string, string, number] | undefined {
          const enteredTitle = this.titleInputElement.value;
          const enteredDescription = this.descriptionInputElement.value;
          const enteredPeople = this.peopleInputElement.value;
      
          const titleValidable: Validable = {
            value: enteredTitle,
            required: true,
          };
      
          const descriptionValidable: Validable = {
            value: enteredDescription,
            required: true,
            minLenght: 5,
          };
          const peopleValidable: Validable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5,
          };
      
          if (
            !validate(titleValidable) ||
            !validate(descriptionValidable) ||
            !validate(peopleValidable)
          ) {
            alert("Invalid Input , please try again ");
            return;
          } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
          }
        }
      
        private clearInputs() {
          this.titleInputElement.value = "";
          this.descriptionInputElement.value = "";
          this.peopleInputElement.value = "";
        }
      
        // @autobind
        private submitHandler(event: Event) {
          event.preventDefault();
          console.log(this.titleInputElement.value);
          const userInput = this.getUserInput();
          if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
          }
        }
      
      }
}