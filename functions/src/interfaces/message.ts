export interface Message {
  id: string;
  ownerId: string;
  ownerPhotoURL: string;
  content: string;
  sentAt: Date;
}
export interface MessageWithUser extends Message {
  searchId: string;
  displayName: string;
  photoURL: string;
}
