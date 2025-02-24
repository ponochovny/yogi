export default (isUpdate: boolean, offeringBanners: any[] = []) => {
	const bannersUpdate = ref<{ id: string; url: string }[]>([])
	const bannersDelete = ref<string[]>([])
	const bannersOrder = ref<(string | null)[]>([])
	const bannersFiles = ref<any[]>([])
	function moduleImagesChange(data: { id: string | null; file: File }[]) {
		if (isUpdate) {
			const findMissingElements = (
				arr1: { id: string | null }[],
				arr2: { id: string }[]
			): string[] => {
				return arr2
					.filter((item2) => typeof item2.id === 'string')
					.filter((item2) => !arr1.some((item1) => item1.id === item2.id))
					.map((item) => item.id) as string[]
			}
			const oldIds = offeringBanners.map((el) => ({
				id: el.id as string,
			}))
			const missingIds = findMissingElements(data, oldIds)
			const croppedImagesIds = data
				.filter((el) => el.file && el.id)
				.map((el) => el.id) as string[]

			bannersDelete.value = missingIds.concat(croppedImagesIds)
		}

		bannersOrder.value = data.map((el) => (el.file && el.id ? null : el.id))
		bannersFiles.value = data.map((el) => el.file)
	}
	return {
		bannersUpdate,
		bannersDelete,
		bannersOrder,
		bannersFiles,
		moduleImagesChange,
	}
}
