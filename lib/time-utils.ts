export function shouldBeLocked(scheduledDate: Date): boolean {
  const now = new Date();
  const appointmentTime = new Date(scheduledDate);
  // Bloquea si la cita es en menos de 2 horas
  const diffInHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffInHours < 2;
}