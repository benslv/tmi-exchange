import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import assert from "node:assert";
import { getTrackInfo } from "~/models/getTrackInfo";
import { formatReplayTime } from "~/utils/formatReplayTime";

export async function loader({ params }: LoaderFunctionArgs) {
	assert(params.id, "Track ID is undefined.");

	const results = await getTrackInfo(params.id);

	if (results.length < 1) {
		throw new Response("Track not found", { status: 404 });
	}

	return results[0];
}

export default function Page() {
	const {
		TrackName,
		Uploader: { Name },
		AuthorTime,
	} = useLoaderData<typeof loader>();

	return (
		<div className="max-w-2xl mx-auto flex flex-col gap-y-4">
			<div className="p-2 bg-gray-50 border border-gray-100 rounded-md">
				<h1 className="font-bold text-2xl">{TrackName}</h1>
				<p>
					<span className="font-semibold">Author:</span> {Name}
				</p>
				<p>
					<span className="font-semibold">Author Time:</span>{" "}
					{formatReplayTime(AuthorTime)}
				</p>
			</div>
			<h2>Records</h2>
			<div className="p-2 bg-gray-50 border border-gray-100 rounded-md"></div>
		</div>
	);
}
