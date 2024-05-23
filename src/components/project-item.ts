/// <reference path="base-components.ts"/>
/// <reference path = "../models/drag-drop.ts"/>
/// <reference path = "../models/project-model.ts"/>
namespace App {
    export class ProjectItem extends Component < HTMLUListElement , HTMLLIElement> implements Dragable {
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
}