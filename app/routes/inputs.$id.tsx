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
			{inputs.description ? (
				<div className="bg-white rounded-md border border-gray-100 p-2">
					{inputs.description}
				</div>
			) : null}
			<div className="flex gap-x-2">
				<button
					className="bg-blue-500 hover:bg-blue-600 inline-block px-3 py-1 rounded-md text-sm text-white"
					onClick={() => {
						navigator.clipboard.writeText(
							inputs.data.split("\\n").join("\n")
						);
					}}
				>
					Copy
				</button>
				<Link
					className="bg-blue-100 text-blue-900 hover:bg-blue-200 inline-block px-3 py-1 rounded-md text-sm"
					to="./download"
					reloadDocument
					download={`${formatReplayTime(inputs.time)}-${
						author.username
					}.txt`}
				>
					Download
				</Link>
			</div>
			<pre className="bg-white p-2 rounded-md border border-gray-100 font-sans">
				{inputs.data.split("\\n").join("\n")}
			</pre>
		</div>
	);
}
