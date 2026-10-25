export interface Visitor {
  id?: string;

  name: string;

  mobile: string;

  gender: string;

  flatNumber: string;

  purpose: string;

  age?: number;

  emotion?: string;

  faceDescriptor?: number[];

  createdAt?: string;

  imageUrl?: string;
}
