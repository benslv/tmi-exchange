import { eq } from "drizzle-orm";
import db from "~/db.server";
import { authors, inputs } from "~/db.server/schema";

export async function getInputInfo(id: string) {
	const inputData = await db.query.inputs.findFirst({
		where: eq(inputs.id, id),
	});

	if (!inputData) return;

	const authorData = await db.query.authors.findFirst({
		where: eq(authors.id, inputData.author_id),
	});

	if (!authorData) {
		throw new Error(
			`Couldn't find author for input file with id: ${inputData.id}`
		);
	}

	return { inputs: inputData, author: authorData };
}
