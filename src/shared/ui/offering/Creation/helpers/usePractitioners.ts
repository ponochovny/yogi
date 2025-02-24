export default (practitioners: Ref<string[] | undefined>) => {
	const practitionersOptions = ref<any[]>([])
	const _practitioners = ref<any[]>([])
	onMounted(async () => {
		useFetchApi('/api/studios/practitioners', {
			method: 'POST',
			body: {
				studio_id: '65f9cb054cf3fa686ab8a90a',
			},
		}).then(({ data }: any) => {
			practitionersOptions.value = [...data]
		})
	})
	watch(
		() => _practitioners.value,
		(val) => (practitioners.value = val.map((item) => item.id))
	)
	function clearPractitioners() {
		_practitioners.value = []
	}
	return { practitionersOptions, _practitioners, clearPractitioners }
}
