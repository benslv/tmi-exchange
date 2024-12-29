type TrackInfo = {
	TrackName: string;
	Uploader: {
		Name: string;
	};
	AuthorTime: number;
};

export async function getTrackInfo(id: string): Promise<Array<TrackInfo>> {
	const searchParams = new URLSearchParams([
		["id", id],
		["fields", "TrackName,Uploader.Name,AuthorTime"],
	]);

	const headers = new Headers({
		"Content-Type": "application/json",
		"User-Agent": "TMI Exchange Server",
	});

	const res = await fetch(
		"https://tmnf.exchange/api/tracks?" + searchParams,
		{
			method: "GET",
			headers,
		}
	);

	if (!res.ok) {
		console.error(res.status, res.statusText);
		return [];
	}

	const { Results } = await res.json();

	return Results as Array<TrackInfo>;
}
