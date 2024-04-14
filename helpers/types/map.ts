export type TMarker = {
	name: string
	coords: number[]
}

export interface IFeature {
	id: string
	type?: string
	place_type?: string[]
	relevance?: number
	properties?: IProperties
	text?: string
	place_name: string
	//** lng-lat */
	center: number[]
	geometry?: IGeometry
	address?: string
	context?: IContext[]
}

interface IProperties {
	accuracy: string
	mapbox_id: string
}

interface IGeometry {
	type: string
	coordinates: number[]
}

interface IContext {
	id: string
	mapbox_id: string
	text: string
	wikidata?: string
	short_code?: string
}
