import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Customer informed not exists');
    }

    const productsFound = await this.productsRepository.findAllById(products);

    if (productsFound.length !== products.length) {
      throw new AppError(
        'There is one or more products that is not located in database',
      );
    }

    const prods = productsFound.map(p => ({
      product_id: p.id,
      price: p.price,
      quantity: products.find(p2 => p2.id === p.id)?.quantity || 0,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: prods,
    });

    return order;
  }
}

export default CreateProductService;
