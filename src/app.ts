// autobind decorator
// function autobind(
//   _: any,
//   _2: string,
//   descriptor: PropertyDescriptor
// ) {
//   const originalMethod = descriptor.value;
//   const adjDescriptor: PropertyDescriptor = {
//     configurable: true,
//     get() {
//       const boundFn = originalMethod.bind(this);
//       return boundFn;
//     }
//   };
//   return adjDescriptor;
// }

// Drag and Drop Interface 
interface Dragable{ 
  drageStartHandler( event :DragEvent ):void ;
  drageEndHandler(event : DragEvent ) : void  ;
}

interface DragTarget{
  dragOverHandler(event :DragEvent):void ;  
  dropHandler(event :DragEvent):void ;
  dragLeaveHandler(event :DragEvent):void ;
}

enum ProjectStatus{ Active , Finished}
//Project Type
class Project{
  constructor
  (public id : string ,
     public title : string ,
      public description : string ,
       public people : number , 
      public status : ProjectStatus){
  
  }

}
type Listener <T>  = (items: T[])  => void;

class State <T> {
  protected listeners: Listener <T>[] = [];
  
  addListeners(listenersFn: Listener <T>  ) {
    this.listeners.push(listenersFn);
  }
}

class ProjectState  extends State <Project>{
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(titile: string, description: string, numPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      titile, description,
      numPeople ,
      ProjectStatus.Active);

    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  moveProject(projectIdd : string , newStatus  : ProjectStatus ) {
    const project = this.projects.find( prj => prj.id === projectIdd ) ;
    if(project && project.status !== newStatus){
      project.status = newStatus ;
      this.updtateListeners();

    }
  }

  private updtateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }

  }

}

const projectState = ProjectState.getInstance();

interface Validable {
  value: string | number;
  required?: boolean;
  minLenght?: number;
  maxLenght?: number;
  min?: number;
  max?: number;
}

function validate(validableInput: Validable) {
  let isValid = true;
  if (validableInput.required) {
    isValid = isValid && validableInput.value.toString().trim().length !== 0;
  }
  if (
    validableInput.minLenght != null &&
    typeof validableInput.value === "string"
  ) {
    isValid =
      isValid && validableInput.value.length >= validableInput.minLenght;
  }
  if (
    validableInput.maxLenght != null &&
    typeof validableInput.value === "string"
  ) {
    isValid =
      isValid && validableInput.value.length <= validableInput.maxLenght;
  }
  if (validableInput.min != null && typeof validableInput.value === "number") {
    isValid = isValid && validableInput.value >= validableInput.min;
  }
  if (validableInput.max != null && typeof validableInput.value === "number") {
    isValid = isValid && validableInput.value <= validableInput.max;
  }
  return isValid;
}
//component 
abstract class Component< T extends HTMLElement , U extends HTMLElement >{
  templateElement : HTMLTemplateElement ; 
  hostElement  : T ; 
  element  : U ;

  constructor(
    templateId : string , 
    hostElementId : string  , 
    insertAtStart : boolean ,
    newElementId ?: string | undefined  ,
  ){
    this.templateElement  = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content , 
      true
    );
    this.element = importedNode.firstElementChild as  U ;
    if(newElementId){
      this.element.id = newElementId ; 
    }
    this.attach(insertAtStart) ; 
   
  }

  private attach(insertAtBegining: boolean){
    this.hostElement.insertAdjacentElement( insertAtBegining ? 'afterbegin' : 'beforeend', this.element);
  }
  abstract configure() : void ; 
   abstract renderContent(): void ;

}
//Project Item Class
 class ProjectItem extends Component < HTMLUListElement , HTMLLIElement> implements Dragable {
  private project: Project ; 

  get persons(){
    if ( this.project.people === 1){
      return '1 person '
    } else {
      return `${this.project.people} persons ` ;
    }
  }

  constructor(hostId: string , project : Project ){

    super('single-project' ,hostId , false , project.id );
    this.project = project;

    this.configure(); 
    this.renderContent();
  }
  drageStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id) ; 
  event.dataTransfer!.effectAllowed = "move" ; 
  }
  drageEndHandler(_: DragEvent){
    console.log('DragEnd');
  }

  configure(){
    this.element.addEventListener("dragstart", this.drageStartHandler.bind(this)); 
    this.element.addEventListener("dragend", this.drageEndHandler); 
  }
  renderContent(){
    this.element.querySelector('h2')!.textContent =  this.project.title;
    this.element.querySelector('h3')!.textContent =  this.persons + 'assigned' ;
    this.element.querySelector('p ')!.textContent =  this.project.description ;
  }


 }


// ProjectList CLass
class ProjectList extends Component  <HTMLDivElement , HTMLElement > implements DragTarget{
  
  assignedProject: Project[];

  constructor(private type: "active" | "finished") {
    super('project-list' , 'app',false ,`${type}-projects`);
   
    this.assignedProject = [];
    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML ='';
    for (const prjItem of this.assignedProject) {
      new ProjectItem(this.element.querySelector('ul')!.id , prjItem )
    
    }
  }
  dragOverHandler(event: DragEvent) {
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl =  this.element.querySelector('ul')! ; 
      listEl.classList.add('droppable') ; 
    }
  }
  dropHandler(event: DragEvent) { 
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(projectId , 
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished );
    
  }
  dragLeaveHandler(_: DragEvent) {
    
    const listEl =  this.element.querySelector('ul')! ; 
    listEl.classList.remove('droppable') ; 
  }
  


  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler.bind(this));
    this.element.addEventListener('dragleave', this.dragLeaveHandler.bind(this));
    this.element.addEventListener('drop', this.dropHandler.bind(this));

    projectState.addListeners((projects: Project[]) => {
      const relvantProjects = projects.filter(prj => {
        if( this.type === 'active'){ 
          return prj.status ===ProjectStatus.Active ;
        }
        return prj.status === ProjectStatus.Finished ;

      });

      this.assignedProject = relvantProjects ;
      this.renderProjects(); 
    });
      
  }

   renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }
  
}

// ProjectInput Class
class ProjectInput  extends Component <HTMLDivElement , HTMLFormElement >{
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

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
