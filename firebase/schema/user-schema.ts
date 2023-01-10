import { uuidv4 } from "@firebase/util";

interface UserSchema {
  role: string;
  orgId: string;
  ratedProductsList: Array<String>;
  ratedProducts: Array<{
    productId: string;
    rate: number;
    comment: string;
  }>;
  ratedProductsCount: number;
}
