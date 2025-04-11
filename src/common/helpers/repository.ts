import { User } from "../../models/user.models";
import { IUser } from "../types/auth.types";
import { GenericRepository } from "./genericRepository";

export class UserRepository extends GenericRepository<IUser> {
  constructor() {
    super(User); 
  }
  
  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }
}
