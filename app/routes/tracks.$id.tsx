import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import assert from "node:assert";
import { LeaderboardEntry } from "~/components/LeaderboardEntry";
import db from "~/db.server";
import { inputs } from "~/db.server/schema";
import { getTrackInfo } from "~/models/getTrackInfo";
import { formatReplayTime } from "~/utils/formatReplayTime";

export async function loader({ params }: LoaderFunctionArgs) {
	assert(params.id, "Track ID is undefined.");

	const results = await getTrackInfo(params.id);

	if (results.length < 1) {
		throw new Response("Track not found", { status: 404 });
	}

	const entries = await db
		.select()
		.from(inputs)
		.where(eq(inputs.track_id, params.id));

	return { trackInfo: results[0], entries };
}

export default function Page() {
	const {
		trackInfo: {
			TrackName,
			Uploader: { Name },
			AuthorTime,
		},
		entries,
	} = useLoaderData<typeof loader>();

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="font-bold text-2xl">{TrackName}</h1>
			<p>
				<span className="font-semibold">Author:</span> {Name}
			</p>
			<p>
				<span className="font-semibold">Author Time:</span>{" "}
				{formatReplayTime(AuthorTime)}
			</p>
			<h2 className="font-semibold text-lg">Records</h2>
			<div className="p-2 bg-white border border-gray-100 rounded-md">
				{entries.length < 1 ? (
					<p className="text-center">
						No records have been uploaded yet. Perhaps you can make
						one?
					</p>
				) : (
					entries.map(({ author_id, time, id }) => (
						<LeaderboardEntry
							key={id}
							author_id={author_id}
							time={time}
							input_id={id}
						/>
					))
				)}
			</div>
		</div>
	);
}
