import type { TTicketCreate } from '~/helpers/types/offering'

export default (tickets: Ref) => {
	function addEmptyTicket() {
		const emptyTicket: TTicketCreate = {
			name: '',
			description: '',
			price: 0,
			currency: 'usd',
			status: 'active',
		}
		tickets.value?.push({ ...emptyTicket })
	}
	function removeTicket(idx: any) {
		tickets.value?.splice(idx, 1)
	}
	return {
		addEmptyTicket,
		removeTicket,
	}
}
