export type Table = {
  id: number
  number: number
  is_occupied: boolean
  active_session_id: number | null
  customer_name: string | null
  customer_arrival: string | null
}
