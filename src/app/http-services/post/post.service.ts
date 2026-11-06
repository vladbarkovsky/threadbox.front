import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import type { FileResponse, PostDto } from '../../../../api-client';
import { PostClient } from '../../../../api-client';
import { convertToNSwagClientFileParameter } from '../../common/nswag-operations';
import type { CreatePostCommand } from './create-post-command';
import type { DeletePostCommand } from './delete-post-command';

@Injectable({ providedIn: 'root' })
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
			command.postImages.map(convertToNSwagClientFileParameter)
		);
	}

	delete(command: DeletePostCommand): Observable<void> {
		return this.postClient.delete(command.id, command.rowVersion);
	}

	getImagesZip(postId: string): Observable<{ data: Blob; fileName: string }> {
		return this.postClient.getImagesZip(postId).pipe(
			map((fileResponse: FileResponse): { data: Blob; fileName: string } => ({
				data: fileResponse.data,
				fileName: fileResponse.fileName ?? '',
			}))
		);
	}
}
