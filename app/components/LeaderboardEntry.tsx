import { Link } from "@remix-run/react";
import { formatReplayTime } from "~/utils/formatReplayTime";

type LeaderboardEntryProps = {
	time: number;
	author: string;
	input_id: string;
};

export function LeaderboardEntry({
	time,
	author,
	input_id,
}: LeaderboardEntryProps) {
	return (
		<div>
			<span className="tabular-nums">{formatReplayTime(time)}</span>{" "}
			<Link to={`/inputs/${input_id}`}>{author}</Link>
		</div>
	);
}
