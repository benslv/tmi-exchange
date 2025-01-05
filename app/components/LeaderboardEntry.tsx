import { Link } from "@remix-run/react";
import { formatReplayTime } from "~/utils/formatReplayTime";

type LeaderboardEntryProps = {
	time: number;
	author_id: string;
	input_id: string;
};

export function LeaderboardEntry({
	time,
	author_id,
	input_id,
}: LeaderboardEntryProps) {
	return (
		<div>
			<span>{formatReplayTime(time)}</span>{" "}
			<Link to={`/inputs/${input_id}`}>{author_id}</Link>
		</div>
	);
}
