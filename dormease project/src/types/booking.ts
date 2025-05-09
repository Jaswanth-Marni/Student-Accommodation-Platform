export const bookingStatuses = {
  pending: 'pending',
  confirmed: 'confirmed',
  cancelled: 'cancelled'
} as const;

export type BookingStatus = keyof typeof bookingStatuses;