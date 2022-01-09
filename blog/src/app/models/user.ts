//todos DEFINO UNA CLASE Y PERMITO QUE SE PUEDA EXPORTAR
export class User{

  //*DEFINO EL CONSTRUCTOR Y CADA UNA DE LAS PROPIEDADES
  constructor(
      public id: number,
      public name: string,
      public surname: string,
      public role: string,
      public email: string,
      public password: string,
      public description: string,
      public image: string
  ){}

}
