export type TCoords = [number, number]
export type TMarker = {
	name: string
	coords: TCoords
}

export interface IFeature {
	id: string
	type: string
	place_type: string[]
	relevance: number
	properties: IProperties
	text: string
	place_name: string
	center: TCoords
	geometry: IGeometry
	address: string
	context: IContext[]
}

interface IProperties {
	accuracy: string
	mapbox_id: string
}

interface IGeometry {
	type: string
	coordinates: TCoords
}

interface IContext {
	id: string
	mapbox_id: string
	text: string
	wikidata?: string
	short_code?: string
}
