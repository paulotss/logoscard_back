interface IUser {
  firstName: string;
  lastName: string;
  cellPhone: string;
  photo?: string;
  email: string;
  password: string;
  rg: string;
  cpf: string;
  file?: Express.Multer.File;
}

export default IUser;