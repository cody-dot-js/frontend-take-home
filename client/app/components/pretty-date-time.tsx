const formatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric",
});

type Props = {
	value: string;
};

function PrettyDateTime({ value }: Props) {
	const date = new Date(value);
	return <>{formatter.format(date)}</>;
}

export {
	//,
	PrettyDateTime,
};
