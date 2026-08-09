// Starts well above every seed dataset's ID range (patients, appointments,
// invoices, records and prescriptions all use 1000-6999) so newly created
// records never collide with mock data.
let counter = 9000

export function generateId(prefix: string): string {
  counter += 1
  return `${prefix}-${counter}`
}
