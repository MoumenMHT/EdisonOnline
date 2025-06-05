import { Manuscript } from '@interface/Manuscript.ts';
import router from '@core/router.ts';

type TagInfoType = 'severity' | 'message';
export const getTagInfo = (manuscript: Manuscript, type: TagInfoType = 'message') => {
    switch (manuscript.progress.status) {
        case 'DONE':
            if (type === 'severity') {
                return 'success';
            }
            return 'Færdig';
        case 'PENDING':
            if (type === 'severity') {
                return 'warning';
            }
            return 'I kø';
        case 'PROCESSING':
            if (type === 'severity') {
                return 'info';
            }
            return 'Bearbejder';
        default:
            return undefined;
    }
}

export const navigate = (id, isAdmin) => {
    router.push({ name: isAdmin ? 'adminmanuscript' : 'manuscript', params: { manuscriptId: id } }).then();
}
