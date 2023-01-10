export interface ProductSchema {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  rates: {
    [key: string]: number;
  };
  comments: Array<{
    userId: string;
    comment: string;
  }>;
  ratesCount: number;
}
