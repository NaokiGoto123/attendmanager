export interface User {
  uid: string;
  searchId: string;
  displayName?: string;
  email: string;
  photoURL: string;
  description: string;
  notificationCount: number;
  covert: boolean;
  openedGroups: boolean;
  openedAttendingEvents: boolean;
  openedAttendedEvents: boolean;
  openedInvitedEvents: boolean;
  openedInvitedGroups: boolean;
  openedWaitingEvents: boolean;
  openedWaitingGroups: boolean;
  openedPayingEvents: boolean;
  openedPayingGroups: boolean;
}
