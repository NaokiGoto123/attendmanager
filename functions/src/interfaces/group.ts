export interface Group {
  id: string;
  name: string;
  description: string;
  grouppicture: string;
  createddate: Date;
  createrId: string;
  memberlimit: number;
  chatRoomId: string;
  price: number;
  subscription: boolean;
  currency: string;
  private: boolean;
  searchable: boolean;
}
