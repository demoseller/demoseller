interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  fullAddress: string;
  productName: string;
  size: string;
  color: string;
  totalPrice: number;
  status: 'pending' | 'confirmed';
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  productTypeId: string;
  options: {
    sizes: Array<{ name: string; priceModifier: number }>;
    colors: Array<{ name: string; priceModifier: number }>;
  };
}

interface ProductType {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
}

class AppStore {
  private orders: Order[] = [];
  private products: Product[] = [];
  private productTypes: ProductType[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    this.orders = [
      {
        id: '1',
        customerName: 'Ahmed Benali',
        customerPhone: '+213 555 123 456',
        wilaya: 'Algiers',
        commune: 'Bab Ezzouar',
        fullAddress: '123 Rue de la Liberté, Bab Ezzouar, Algiers',
        productName: 'Premium T-Shirt',
        size: 'L',
        color: 'Blue',
        totalPrice: 2500,
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        customerName: 'Fatima Zahra',
        customerPhone: '+213 666 789 012',
        wilaya: 'Oran',
        commune: 'Es Senia',
        fullAddress: '45 Boulevard Mohamed V, Es Senia, Oran',
        productName: 'Designer Hoodie',
        size: 'M',
        color: 'Black',
        totalPrice: 4200,
        status: 'confirmed',
        createdAt: '2024-01-14T14:20:00Z'
      }
    ];

    this.productTypes = [
      { id: '1', name: 'T-Shirts', imageUrl: '/placeholder.svg', productCount: 5 },
      { id: '2', name: 'Hoodies', imageUrl: '/placeholder.svg', productCount: 3 },
      { id: '3', name: 'Jackets', imageUrl: '/placeholder.svg', productCount: 2 },
    ];
  }

  addOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    this.notifyListeners();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: 'pending' | 'confirmed') {
    this.orders = this.orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    this.notifyListeners();
  }

  addProductType(productType: Omit<ProductType, 'id'>) {
    const newType: ProductType = {
      ...productType,
      id: Date.now().toString()
    };
    this.productTypes.push(newType);
    this.notifyListeners();
    return newType;
  }

  updateProductType(id: string, updates: Partial<Omit<ProductType, 'id'>>) {
    this.productTypes = this.productTypes.map(type =>
      type.id === id ? { ...type, ...updates } : type
    );
    this.notifyListeners();
  }

  deleteProductType(id: string) {
    // Delete all products of this type first
    this.products = this.products.filter(product => product.productTypeId !== id);
    // Delete the product type
    this.productTypes = this.productTypes.filter(type => type.id !== id);
    this.notifyListeners();
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    this.products.push(newProduct);
    
    // Update product count for the type
    this.productTypes = this.productTypes.map(type => 
      type.id === product.productTypeId 
        ? { ...type, productCount: type.productCount + 1 }
        : type
    );
    
    this.notifyListeners();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>) {
    this.products = this.products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    );
    this.notifyListeners();
  }

  deleteProduct(id: string) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      // Update product count for the type
      this.productTypes = this.productTypes.map(type => 
        type.id === product.productTypeId 
          ? { ...type, productCount: Math.max(0, type.productCount - 1) }
          : type
      );
    }
    this.products = this.products.filter(product => product.id !== id);
    this.notifyListeners();
  }

  getOrders() {
    return this.orders;
  }

  getProductTypes() {
    return this.productTypes;
  }

  getProducts() {
    return this.products;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const appStore = new AppStore();
export type { Order, Product, ProductType };
