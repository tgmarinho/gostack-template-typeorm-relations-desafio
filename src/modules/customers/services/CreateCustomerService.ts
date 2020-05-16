import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const checkIfExists = await this.customersRepository.findByEmail(email);

    if (checkIfExists) {
      throw new AppError(
        'Already exists a customer registered with this email',
        400,
      );
    }

    const customer = await this.customersRepository.create({ name, email });

    return customer;
  }
}

export default CreateCustomerService;
