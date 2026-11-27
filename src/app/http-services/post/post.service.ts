import { Service, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { DeletePostCommand, FileResponse, PostDto } from '../api-client';
import { PostClient } from '../api-client';
import { convertToNSwagClientFileParameter } from '../convert-to-nswag-client-file-parameter.function';
import type { CreatePostCommand } from './create-post-command';

@Service()
export class PostService {
	private readonly postClient: PostClient = inject(PostClient);

	getList(threadId: string, all: boolean): Observable<PostDto[]> {
		return this.postClient.getList(threadId, all);
	}

	get(id: string): Observable<PostDto> {
		return this.postClient.get(id);
	}

	create(command: CreatePostCommand): Observable<PostDto> {
		return this.postClient.create(
			command.text,
			command.threadId,
			command.tripcodeString,
			command.postImages?.map(convertToNSwagClientFileParameter)
		);
	}

	delete(command: DeletePostCommand): Observable<void> {
		return this.postClient.delete(command);
	}

	getImagesZip(postId: string): Observable<FileResponse> {
		return this.postClient.getImagesZip(postId);
	}
}
