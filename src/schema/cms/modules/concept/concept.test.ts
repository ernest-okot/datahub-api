import 'jest';
import {getConcepts, IConcept, getConceptAsync, getConcept} from '.';
import * as prettyFormat from 'pretty-format';

describe('Github concept data tests', () => {
    it('should get data from concept.csv of a module on github', async () => {
        const conceptsData: IConcept[] = await getConcepts('global-picture');
        const concept: IConcept = getConcept('avg_income_of_extreme_poor', conceptsData);
        expect(conceptsData.length).toBeGreaterThan(2);
        expect(prettyFormat(concept)).toMatchSnapshot();
    });
    it('should get data from concept.csv of an Id in a module', async () => {
        const concept: IConcept = await getConceptAsync('global-picture', 'avg_income_of_extreme_poor');
        expect(concept.id).toBe('avg_income_of_extreme_poor');
    });
});
