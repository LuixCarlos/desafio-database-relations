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
class CreateOrderService {
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
      throw new AppError("Customer doesn't exist");
    }

    const findProducts = await this.productsRepository.findAllById(products);

    if (findProducts.length === 0) {
      throw new AppError("Products doesn't exists");
    }

    const createProducts: any[] = [];

    const newProducts = findProducts.map(value => {
      const product = value;

      const newOrder = {
        ...value,
        product_id: product.id,
      };

      const productFromParams = products.find(find => find.id === product.id);

      if (productFromParams) {
        if (productFromParams.quantity > product.quantity) {
          throw new AppError('Invalid quantity');
        }

        newOrder.quantity = productFromParams.quantity;
        product.quantity -= productFromParams.quantity;
      }

      createProducts.push(newOrder);

      return product;
    });

    await this.productsRepository.updateQuantity(newProducts);

    const order = await this.ordersRepository.create({
      customer,
      products: createProducts,
    });

    return order;
  }
}

export default CreateOrderService;
