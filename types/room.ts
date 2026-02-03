export interface RoomType {
  id: number;
  typeName: string;
  description: string;
  price: number;
}

export interface Room {
  id: number;
  status: string;
  image: string;
  roomType: RoomType;
}