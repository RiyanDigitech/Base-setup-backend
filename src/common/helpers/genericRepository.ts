import { Model } from "mongoose";

export class GenericRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>){
    return new this.model(data).save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async findAll(filter: Partial<T> = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async findByIdAndUpdate(
    id: string,
    updates: Partial<T>
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updates, { new: true });
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}
