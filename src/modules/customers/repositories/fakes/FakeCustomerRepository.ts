import { uuid } from 'uuidv4';
import ICustomerRepository from '../ICustomersRepository';
import ICreateCustomerDTO from '../../dtos/ICreateCustomerDTO';
import Customer from '../../infra/typeorm/entities/Customer';

class FakeCustomerRepository implements ICustomerRepository {
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomerDTO): Promise<Customer> {
    const custumer = new Customer();

    Object.assign(custumer, { id: uuid(), name, email });

    this.customers.push(custumer);

    return custumer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.email === email);
  }

  public async findById(id: string): Promise<Customer | undefined> {
    return this.customers.find(customer => customer.id === id);
  }
}

export default FakeCustomerRepository;
