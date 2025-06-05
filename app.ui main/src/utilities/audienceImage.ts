import adult from '@asset/audience/adult.png';
import youth from '@asset/audience/youth.png';
import children from '@asset/audience/children.png';

export const getAudienceImage = (audience: string) => {
    switch (audience.toLowerCase()) {
        case 'børn':
            return children;
        case 'ungdom':
            return youth;
        case 'voksen':
            return adult;
    }
}
