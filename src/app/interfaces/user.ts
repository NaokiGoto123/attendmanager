export interface User {
  uid: string;
  searchId: string;
  displayName?: string;
  email: string;
  photoURL: string;
  description: string;
  notificationCount: number;
  covert: boolean;
  showGroups: boolean;
  showAttendingEvents: boolean;
  showAttendedEvents: boolean;
}
