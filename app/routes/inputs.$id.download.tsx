import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import assert from "node:assert";

import { getInputInfo } from "~/models/getInputInfo";

export async function loader({ params }: LoaderFunctionArgs) {
	assert(params.id, "Track ID is undefined.");

	const data = await getInputInfo(params.id);

	if (!data) throw redirect("/");

	const { inputs } = data;

	const file = new Blob([inputs.data], { type: "text/plain" });

	return new Response(file, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
			"Cache-Control": "max-age=604800",
		},
	});
}
