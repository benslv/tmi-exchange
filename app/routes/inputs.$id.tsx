import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import assert from "node:assert";
import { getInputInfo } from "~/models/getInputInfo";
import { getTrackInfo } from "~/models/getTrackInfo";
import { formatReplayTime } from "~/utils/formatReplayTime";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
	dateStyle: "short",
	timeStyle: "short",
});

export async function loader({ params }: LoaderFunctionArgs) {
	assert(params.id, "Track ID is undefined.");

	const data = await getInputInfo(params.id);

	if (!data) throw new Error("Couldn't find inputs.");

	const track = await getTrackInfo(data.inputs.track_id);
	return { ...data, track: track[0] };
}

export default function Page() {
	const { author, inputs, track } = useLoaderData<typeof loader>();

	return (
		<div className="max-w-2xl mx-auto space-y-4">
			<div>
				<h1 className="font-bold text-2xl">Inputs</h1>
				<p className="text-sm text-gray-700">
					for {track.TrackName} by {track.Uploader.Name}
				</p>
			</div>
			<div className="bg-white rounded-md border border-gray-100 p-2">
				<div className="grid grid-cols-3 font-bold">
					<p className="rounded-md">Time</p>
					<p>Author</p>
					<p>Submitted</p>
				</div>
				<div className="grid grid-cols-3">
					<p>{formatReplayTime(inputs.time)}</p>
					<p>{author.username}</p>
					<p>{dateFormatter.format(inputs.uploaded_at)}</p>
				</div>
			</div>
			<button
				onClick={() => {
					navigator.clipboard.writeText(inputs.data);
				}}
			>
				Copy
			</button>
			<Link
				to="./download"
				reloadDocument
				download={`${formatReplayTime(inputs.time)}-${
					author.username
				}.txt`}
			>
				Download
			</Link>
			<div className="bg-white">
				{inputs.data.split("\\n").map((line, i) => (
					<p key={i}>{line}</p>
				))}
			</div>
		</div>
	);
}
