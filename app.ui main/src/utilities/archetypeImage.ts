import cinderella from '@asset/archetype/cinderella.png';
import icarus from '@asset/archetype/icarus.png';
import man_in_a_hole from '@asset/archetype/man_in_a_hole.png';
import oedipus from '@asset/archetype/oedipus.png';
import rag_to_riches from '@asset/archetype/rag_to_riches.png';
import tragedie from '@asset/archetype/tragedie.png';

export const getArchetypeImage = (audience: string) => {
    switch (audience.toLowerCase()) {
        case 'cinderella':
            return cinderella;
        case 'icarus':
            return icarus;
        case 'man in a hole':
        case 'man_in_a_hole':
            return man_in_a_hole;
        case 'oedipus':
            return oedipus;
        case 'rags to riches':
            return rag_to_riches;
        case 'tragedy':
            return tragedie;
    }
}


