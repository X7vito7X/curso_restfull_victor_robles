//todos DEFINO UNA CLASE Y PERMITO QUE SE PUEDA EXPORTAR
export class Post{

  //*DEFINO EL CONSTRUCTOR Y CADA UNA DE LAS PROPIEDADES
  constructor(
      public id: number,
      public user_id: number,
      public category_id: number,
      public title: string,
      public content: string,
      public image: string,
      public createdAt: any
  ){}

}
