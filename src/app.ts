/// <reference path = "components/project-inputs.ts"/>
/// <reference path = "components/project-list.ts"/>

namespace App{
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
}

