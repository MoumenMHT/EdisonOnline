import biography from '@asset/genre/biography.png';
import children from '@asset/genre/children.png';
import classic_fiction from '@asset/genre/classic_fiction.png';
import excitement from '@asset/genre/excitement.png';
import fantasy from '@asset/genre/fantasy.png';
import historical_novel from '@asset/genre/historical_novel.png';
import krimi from '@asset/genre/krimi.png';
import romance from '@asset/genre/romance.png';
import subject_book from '@asset/genre/subject_book.png';
import youth from '@asset/genre/youth.png';

export const getGenreImage = (genre: string) => {
    switch (genre.toLowerCase()) {
        case 'biografier':
            return biography;
        case 'børn':
            return children;
        case 'klassisk skønlitteratur':
            return classic_fiction;
        case 'spænding':
            return excitement;
        case 'fantasy/science-fiction':
            return fantasy;
        case 'historiske romaner':
            return historical_novel;
        case 'krimi':
            return krimi;
        case 'romantik':
            return romance;
        case 'fagbog':
            return subject_book;
        case 'ungdom':
            return youth;
    }
}