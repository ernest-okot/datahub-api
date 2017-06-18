import {get} from '../../connector';
import * as R from 'ramda';

export interface IConcept {
    id: string;
    theme: string;
    name: string;
    description: string;
    uom: string;
    uomDisplay: string;
    startYear: number;
    color: string;
    endYear: number;
}

export const getConcepts = (moduleName: string): Promise <IConcept[]> => {
    const endPoint: string = `${moduleName}/concept.csv`;
    return get<IConcept>(endPoint);
};

export const getConceptAsync = async (moduleName: string, id: string): Promise <IConcept> => {
    const allConcepts: IConcept[]  = await getConcepts(moduleName);
    return R.find(R.propEq('id', id), allConcepts) as IConcept;
};

export const getConcept = (id: string, concepts: IConcept[]): IConcept =>
    R.find(R.propEq('id', id), concepts) as IConcept;
