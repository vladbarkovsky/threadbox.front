export interface CreatePostCommand {
	threadId: string;
	text: string;
	tripcodeString: string | null;
	postImages: readonly File[];
}
