import { ProjectInput } from "./components/project-inputs.js";
import { ProjectList } from "./components/project-list.js";
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
 

new ProjectInput();
 new ProjectList("active");
 new ProjectList("finished");


