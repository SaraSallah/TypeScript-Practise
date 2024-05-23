
import { Project } from "../models/project-model.js";
import { ProjectStatus } from "../models/project-model.js";
type Listener <T>  = (items: T[])  => void;

class State <T> {
  protected listeners: Listener <T>[] = [];
  
  addListeners(listenersFn: Listener <T>  ) {
    this.listeners.push(listenersFn);
  }
}

export class ProjectState  extends State <Project>{
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

export const projectState = ProjectState.getInstance();
