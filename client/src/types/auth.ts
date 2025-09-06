export type LoginTypes={
    email: string,
    password: string

}

export type RegisterTypes=LoginTypes&{
    name: string,
   

}

export type InputTypes={
  label:string,
  name:string,
  type :string,
  required:boolean,
  value:string,
  minLength?:number,
  handleChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
}


