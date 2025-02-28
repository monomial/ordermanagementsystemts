export enum OrderStatus {
  Received = 'received',
  Preparing = 'preparing',
  Completed = 'completed',
}

export interface Order {
  id: number;
  item: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDto {
  item: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
} 