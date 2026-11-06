export interface CreateThreadCommand {
	boardId: string;
	title: string;
	text: string;
	tripcodeString: string | null;
	images: readonly File[];
}
